const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all posts with filtering, search, sorting & pagination
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  const {
    locality,
    category,
    status,
    search,
    sort = 'newest',
    page = 1,
    limit = 12
  } = req.query;

  const query = {};

  // Locality filter (ignore if 'All Locations' or empty)
  if (locality && locality !== 'All Locations' && locality !== 'all') {
    query.locality = locality;
  }

  // Category filter
  if (category && category !== 'all') {
    query.category = category;
  }

  // Status filter (e.g. 'verified', 'needs-verification')
  if (status && status !== 'all') {
    query.status = status;
  }

  // Text search
  if (search && search.trim() !== '') {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { location: searchRegex }
    ];
  }

  // Sorting
  let sortOption = { createdAt: -1 };
  if (sort === 'helpful') {
    sortOption = { helpfulCount: -1, createdAt: -1 };
  } else if (sort === 'urgent') {
    sortOption = { urgency: -1, createdAt: -1 };
  } else if (sort === 'oldest') {
    sortOption = { createdAt: 1 };
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 12;
  const skip = (pageNum - 1) * limitNum;

  const total = await Post.countDocuments(query);
  const posts = await Post.find(query)
    .populate('author', 'name avatarUrl role locality isVerified')
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({
    success: true,
    count: posts.length,
    total,
    totalPages: Math.ceil(total / limitNum),
    currentPage: pageNum,
    posts
  });
});

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'name avatarUrl role locality isVerified')
    .populate('reports.reporterId', 'name')
    .populate('suggestedUpdates.suggesterId', 'name');

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  res.status(200).json({
    success: true,
    post
  });
});

// @desc    Create a new community post
// @route   POST /api/posts
// @access  Private / Public with default fallback author
const createPost = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    location,
    locality,
    date,
    time,
    validUntil,
    link,
    imageUrl,
    rawInput,
    urgency
  } = req.body;

  if (!title || !description || !category || !location) {
    return res.status(400).json({
      success: false,
      message: 'Please provide title, description, category, and location'
    });
  }

  // Resolve author (either from JWT or fallback demo user)
  let authorId = req.user ? req.user._id : null;
  let authorName = req.user ? req.user.name : 'Resident Contributor';
  let authorRole = req.user ? req.user.role : 'resident';

  if (!authorId) {
    // Find or create a default demo resident
    let defaultUser = await User.findOne({ email: 'resident@localloop.org' });
    if (!defaultUser) {
      defaultUser = await User.create({
        name: 'Aarav Sharma',
        email: 'resident@localloop.org',
        passwordHash: 'dummy_hash',
        locality: locality || 'DBIT/Kurla',
        role: 'resident'
      });
    }
    authorId = defaultUser._id;
    authorName = defaultUser.name;
    authorRole = defaultUser.role;
  }

  // Auto-verify if created by moderator or admin
  const initialStatus =
    authorRole === 'moderator' || authorRole === 'admin'
      ? 'verified'
      : 'needs-verification';

  const post = await Post.create({
    title,
    description,
    category,
    location,
    locality: locality || 'DBIT/Kurla',
    date: date || '',
    time: time || '',
    validUntil: validUntil || null,
    link: link || '',
    imageUrl: imageUrl || '',
    status: initialStatus,
    urgency: urgency || (category === 'emergencies' ? 'high' : 'medium'),
    author: authorId,
    authorName,
    authorRole,
    rawInput: rawInput || ''
  });

  // Increment author's post count
  await User.findByIdAndUpdate(authorId, {
    $inc: { 'stats.postsShared': 1 }
  });

  res.status(201).json({
    success: true,
    message: 'Post published successfully',
    post
  });
});

// @desc    Toggle helpful vote for a post
// @route   PATCH /api/posts/:id/helpful
// @access  Private / Public
const toggleHelpful = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  // If user is authenticated, track toggle in their profile
  if (req.user) {
    const user = await User.findById(req.user._id);
    const hasVoted = user.helpfulPosts.some(
      (id) => id.toString() === post._id.toString()
    );

    if (hasVoted) {
      // Remove vote
      user.helpfulPosts = user.helpfulPosts.filter(
        (id) => id.toString() !== post._id.toString()
      );
      post.helpfulCount = Math.max(0, post.helpfulCount - 1);
      await user.save();
      await post.save();

      // Decrement author's helpful votes
      await User.findByIdAndUpdate(post.author, {
        $inc: { 'stats.helpfulVotes': -1 }
      });

      return res.status(200).json({
        success: true,
        voted: false,
        helpfulCount: post.helpfulCount
      });
    } else {
      // Add vote
      user.helpfulPosts.push(post._id);
      post.helpfulCount += 1;
      await user.save();
      await post.save();

      // Increment author's helpful votes
      await User.findByIdAndUpdate(post.author, {
        $inc: { 'stats.helpfulVotes': 1 }
      });

      // Send notification to author
      if (post.author.toString() !== user._id.toString()) {
        await Notification.create({
          userId: post.author,
          postId: post._id,
          type: 'helpful',
          message: `${user.name} found your post "${post.title.substring(0, 35)}..." helpful!`
        });
      }

      return res.status(200).json({
        success: true,
        voted: true,
        helpfulCount: post.helpfulCount
      });
    }
  }

  // Guest increment fallback
  post.helpfulCount += 1;
  await post.save();

  res.status(200).json({
    success: true,
    voted: true,
    helpfulCount: post.helpfulCount
  });
});

// @desc    Report/flag a post
// @route   POST /api/posts/:id/report
// @access  Public / Private
const reportPost = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  if (!reason) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a reason for reporting'
    });
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  post.reports.push({
    reporterId: req.user ? req.user._id : null,
    reason,
    timestamp: new Date()
  });

  // Flag for review if multiple reports
  if (post.reports.length >= 3 && post.status !== 'resolved') {
    post.status = 'under-review';
  }

  await post.save();

  res.status(200).json({
    success: true,
    message: 'Report submitted for moderation review',
    reportsCount: post.reports.length,
    status: post.status
  });
});

// @desc    Suggest an update or correction to post info
// @route   POST /api/posts/:id/suggest-update
// @access  Public / Private
const suggestUpdate = asyncHandler(async (req, res) => {
  const { field, suggestedValue, reason } = req.body;

  if (!field || !suggestedValue) {
    return res.status(400).json({
      success: false,
      message: 'Please specify the field and the suggested value'
    });
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  const suggesterName = req.user ? req.user.name : 'Community Resident';
  post.suggestedUpdates.push({
    suggesterId: req.user ? req.user._id : null,
    suggesterName,
    field,
    suggestedValue,
    reason: reason || '',
    status: 'pending',
    timestamp: new Date()
  });

  await post.save();

  // Notify author of suggested update
  await Notification.create({
    userId: post.author,
    postId: post._id,
    type: 'moderation',
    message: `A community member suggested updating "${field}" on your post "${post.title.substring(0, 30)}..."`
  });

  res.status(200).json({
    success: true,
    message: 'Update suggestion submitted successfully',
    suggestedUpdates: post.suggestedUpdates
  });
});

module.exports = {
  getPosts,
  getPostById,
  createPost,
  toggleHelpful,
  reportPost,
  suggestUpdate
};
