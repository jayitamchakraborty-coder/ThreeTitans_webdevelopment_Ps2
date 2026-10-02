const Information = require('../models/Information');
const User = require('../models/User');
const History = require('../models/History');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all information with filtering, search, sorting & pagination
// @route   GET /api/information
// @access  Public
const getInformation = asyncHandler(async (req, res) => {
  const {
    location,
    category,
    status,
    search,
    sort = 'newest',
    page = 1,
    limit = 12
  } = req.query;

  const query = {};

  if (location && location !== 'all') {
    query.location = { $regex: new RegExp(location, 'i') };
  }

  if (category && category !== 'all') {
    query.category = category;
  }

  if (status && status !== 'all') {
    query.status = status;
  }

  if (search && search.trim() !== '') {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { location: searchRegex }
    ];
  }

  let sortOption = { createdAt: -1 };
  if (sort === 'helpful') {
    sortOption = { helpfulCount: -1, createdAt: -1 };
  } else if (sort === 'relevance') {
     sortOption = { helpfulCount: -1, createdAt: -1 }; // simplified relevance
  } else if (sort === 'oldest') {
    sortOption = { createdAt: 1 };
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 12;
  const skip = (pageNum - 1) * limitNum;

  const total = await Information.countDocuments(query);
  const info = await Information.find(query)
    .populate('authorId', 'name avatarUrl role')
    .populate('communityId', 'name')
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({
    success: true,
    count: info.length,
    total,
    totalPages: Math.ceil(total / limitNum),
    currentPage: pageNum,
    information: info
  });
});

// @desc    Get single information by ID
// @route   GET /api/information/:id
// @access  Public
const getInformationById = asyncHandler(async (req, res) => {
  const info = await Information.findById(req.params.id)
    .populate('authorId', 'name avatarUrl role')
    .populate('communityId', 'name')
    .populate('reports.userId', 'name')
    .populate('updateSuggestions.userId', 'name');

  if (!info) {
    return res.status(404).json({
      success: false,
      message: 'Information not found'
    });
  }

  res.status(200).json({
    success: true,
    information: info
  });
});

// @desc    Create a new information post
// @route   POST /api/information
// @access  Private
const createInformation = asyncHandler(async (req, res) => {
  const {
    title, description, category, type, location, communityId,
    eventDate, validUntil, contact, link, imageUrl, rawInput
  } = req.body;

  if (!title || !description || !category || !location) {
    return res.status(400).json({
      success: false,
      message: 'Please provide title, description, category, and location'
    });
  }

  // Force normal user posts to NEEDS_VERIFICATION.
  // We can let admins bypass if needed, but per requirements, normal users default to NEEDS_VERIFICATION.
  const initialStatus = (req.user && (req.user.role === 'MODERATOR' || req.user.role === 'ADMIN')) 
    ? 'VERIFIED' 
    : 'NEEDS_VERIFICATION';

  const info = await Information.create({
    title, description, category, type: type || 'NOTICE', location,
    communityId: communityId || null,
    eventDate: eventDate || '',
    validUntil: validUntil || '',
    contact: contact || '',
    link: link || '',
    imageUrl: imageUrl || '',
    status: initialStatus,
    authorId: req.user._id,
    authorName: req.user.name,
    authorRole: req.user.role,
    rawInput: rawInput || ''
  });

  // Create History
  await History.create({
    informationId: info._id,
    action: 'POSTED',
    actorId: req.user._id,
    details: 'Created new information'
  });

  // Increment author's post count
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { 'stats.postsShared': 1 }
  });

  res.status(201).json({
    success: true,
    message: 'Information published successfully',
    information: info
  });
});

// @desc    Toggle helpful vote for information
// @route   POST /api/information/:id/helpful
// @access  Private
const toggleHelpful = asyncHandler(async (req, res) => {
  const info = await Information.findById(req.params.id);
  if (!info) {
    return res.status(404).json({ success: false, message: 'Information not found' });
  }

  const user = await User.findById(req.user._id);
  
  // check if user has already voted
  const hasVoted = info.helpfulUsers.some(
    (id) => id.toString() === req.user._id.toString()
  );

  if (hasVoted) {
    return res.status(400).json({
       success: false,
       message: 'You have already marked this as helpful'
    });
  }

  // Add vote to information
  info.helpfulUsers.push(req.user._id);
  info.helpfulCount += 1;
  await info.save();

  // Add to user's helpful items
  user.helpfulPosts.push(info._id);
  await user.save();

  // Increment author's helpful votes
  await User.findByIdAndUpdate(info.authorId, {
    $inc: { 'stats.helpfulVotes': 1 }
  });

  // Send notification to author
  if (info.authorId.toString() !== req.user._id.toString()) {
    await Notification.create({
      userId: info.authorId,
      informationId: info._id,
      type: 'helpful',
      message: `${req.user.name} found your post "${info.title.substring(0, 35)}..." helpful!`
    });
  }

  res.status(200).json({
    success: true,
    voted: true,
    helpfulCount: info.helpfulCount
  });
});

// @desc    Report/flag information
// @route   POST /api/information/:id/report
// @access  Private
const reportInformation = asyncHandler(async (req, res) => {
  const { reason, description } = req.body;
  if (!reason) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a reason for reporting'
    });
  }

  const info = await Information.findById(req.params.id);
  if (!info) {
    return res.status(404).json({ success: false, message: 'Information not found' });
  }

  // Prevent duplicate reports from same user
  const alreadyReported = info.reports.some(
      r => r.userId.toString() === req.user._id.toString()
  );

  if (alreadyReported) {
      return res.status(400).json({ success: false, message: 'You have already reported this information' });
  }

  info.reports.push({
    userId: req.user._id,
    reason,
    description: description || ''
  });
  info.reportCount += 1;

  // Threshold logic
  if (info.reportCount >= info.reportThreshold && info.status !== 'RESOLVED' && info.status !== 'REMOVED' && info.status !== 'UNDER_REVIEW') {
    info.status = 'UNDER_REVIEW';
    info.reviewRequired = true;
    
    await History.create({
        informationId: info._id,
        action: 'UNDER_REVIEW',
        actorId: null, // System
        details: `Reached report threshold (${info.reportThreshold})`
    });
  }

  await info.save();
  
  await History.create({
    informationId: info._id,
    action: 'REPORTED',
    actorId: req.user._id,
    details: `Reported for ${reason}`
  });

  res.status(200).json({
    success: true,
    message: 'Report submitted successfully',
    reportsCount: info.reportCount,
    status: info.status
  });
});

// @desc    Suggest an update or correction to info
// @route   POST /api/information/:id/update
// @access  Private
const suggestUpdate = asyncHandler(async (req, res) => {
  const { suggestedChanges } = req.body;

  if (!suggestedChanges) {
    return res.status(400).json({
      success: false,
      message: 'Please provide suggested changes'
    });
  }

  const info = await Information.findById(req.params.id);
  if (!info) {
    return res.status(404).json({ success: false, message: 'Information not found' });
  }

  info.updateSuggestions.push({
    userId: req.user._id,
    suggestedChanges,
    status: 'PENDING'
  });

  await info.save();

  await History.create({
      informationId: info._id,
      action: 'UPDATE_SUGGESTED',
      actorId: req.user._id,
      details: 'Suggested an update'
  });

  // Notify author of suggested update
  if (info.authorId.toString() !== req.user._id.toString()) {
      await Notification.create({
        userId: info.authorId,
        informationId: info._id,
        type: 'moderation',
        message: `A community member suggested an update on "${info.title.substring(0, 30)}..."`
      });
  }

  res.status(200).json({
    success: true,
    message: 'Update suggestion submitted successfully',
    updateSuggestions: info.updateSuggestions
  });
});


// @desc    Get information history
// @route   GET /api/information/:id/history
// @access  Public
const getInformationHistory = asyncHandler(async (req, res) => {
    const history = await History.find({ informationId: req.params.id })
      .sort({ createdAt: 1 }) // Chronological
      .populate('actorId', 'name role');
      
    res.status(200).json({
        success: true,
        history
    });
});

module.exports = {
  getInformation,
  getInformationById,
  createInformation,
  toggleHelpful,
  reportInformation,
  suggestUpdate,
  getInformationHistory
};
