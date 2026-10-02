const Information = require('../models/Information');
const User = require('../models/User');
const Notification = require('../models/Notification');
const History = require('../models/History');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all items in the moderation queue
// @route   GET /api/moderation/queue
// @access  Private (Moderator / Admin)
const getModerationQueue = asyncHandler(async (req, res) => {
  const { location, status } = req.query;

  const query = {};

  if (status && status !== 'all') {
    query.status = status;
  } else {
    // Default queue: items needing attention
    query.$or = [
      { status: 'NEEDS_VERIFICATION' },
      { status: 'UNDER_REVIEW' },
      { 'reports.0': { $exists: true } },
      { 'updateSuggestions.status': 'PENDING' }
    ];
  }

  if (location && location !== 'All Locations' && location !== 'all') {
    query.location = { $regex: new RegExp(location, 'i') };
  }

  const information = await Information.find(query)
    .populate('authorId', 'name email avatarUrl role locality isVerified')
    .sort({ createdAt: -1 });

  // Summary counts for moderator dashboard badges
  const pendingCount = await Information.countDocuments({ status: 'NEEDS_VERIFICATION' });
  const reviewCount = await Information.countDocuments({ status: 'UNDER_REVIEW' });
  const reportedCount = await Information.countDocuments({ 'reports.0': { $exists: true } });

  res.status(200).json({
    success: true,
    count: information.length,
    stats: {
      pendingVerification: pendingCount,
      underReview: reviewCount,
      reported: reportedCount
    },
    information
  });
});

// @desc    Verify a post
// @route   POST /api/moderation/:id/verify
// @access  Private (Moderator / Admin)
const verifyPost = asyncHandler(async (req, res) => {
  const info = await Information.findById(req.params.id);
  if (!info) {
    return res.status(404).json({ success: false, message: 'Information not found' });
  }

  info.status = 'VERIFIED';
  info.reviewRequired = false;
  await info.save();

  await History.create({
      informationId: info._id,
      action: 'VERIFIED',
      actorId: req.user._id,
      details: 'Verified by moderator'
  });

  // Send notification to author
  await Notification.create({
    userId: info.authorId,
    informationId: info._id,
    type: 'verification',
    message: `Your post "${info.title.substring(0, 40)}..." has been verified by the community moderators.`
  });

  res.status(200).json({
    success: true,
    message: 'Information successfully verified',
    information: info
  });
});

// @desc    Mark a post as resolved
// @route   POST /api/moderation/:id/resolve
// @access  Private (Moderator / Admin / Author)
const resolvePost = asyncHandler(async (req, res) => {
  const info = await Information.findById(req.params.id);
  if (!info) {
    return res.status(404).json({ success: false, message: 'Information not found' });
  }

  info.status = 'RESOLVED';
  info.resolvedAt = new Date();
  await info.save();

  await History.create({
    informationId: info._id,
    action: 'RESOLVED',
    actorId: req.user._id,
    details: 'Marked as resolved'
  });

  res.status(200).json({
    success: true,
    message: 'Information status updated to resolved',
    information: info
  });
});

// @desc    Remove/delete a post (Soft Remove)
// @route   DELETE /api/moderation/:id
// @access  Private (Moderator / Admin)
const removePost = asyncHandler(async (req, res) => {
  const info = await Information.findById(req.params.id);
  if (!info) {
    return res.status(404).json({ success: false, message: 'Information not found' });
  }

  const { reason = 'Content violates community guidelines' } = req.body;

  info.status = 'REMOVED';
  info.removedReason = reason;
  info.removedBy = req.user._id;
  await info.save();

  await History.create({
    informationId: info._id,
    action: 'REMOVED',
    actorId: req.user._id,
    details: `Removed by Moderator. Reason: ${reason}`
  });

  // Notify author before deletion
  await Notification.create({
    userId: info.authorId,
    informationId: info._id,
    type: 'moderation',
    message: `Your post "${info.title.substring(0, 40)}..." was removed by moderators. Reason: ${reason}`
  });

  res.status(200).json({
    success: true,
    message: 'Information successfully removed from Vicinus'
  });
});

// @desc    Edit post
// @route   PUT /api/moderation/:id
// @access  Private (Moderator / Admin)
const editPost = asyncHandler(async (req, res) => {
    const info = await Information.findById(req.params.id);
    if (!info) {
      return res.status(404).json({ success: false, message: 'Information not found' });
    }
  
    const { title, description, category, type, location } = req.body;
    
    if (title) info.title = title;
    if (description) info.description = description;
    if (category) info.category = category;
    if (type) info.type = type;
    if (location) info.location = location;
  
    await info.save();
  
    await History.create({
      informationId: info._id,
      action: 'EDITED',
      actorId: req.user._id,
      details: `Edited by Moderator`
    });
  
    res.status(200).json({
      success: true,
      message: 'Information updated successfully',
      information: info
    });
});

module.exports = {
  getModerationQueue,
  verifyPost,
  resolvePost,
  removePost,
  editPost
};
