const User = require('../models/User');
const Information = require('../models/Information');
const asyncHandler = require('../utils/asyncHandler');

// Helper to resolve user
const getEffectiveUser = async (req) => {
  if (req.user) return req.user;
  let demoUser = await User.findOne({ email: 'resident@vicinus.local' });
  return demoUser;
};

// @desc    Get posts authored by current user
// @route   GET /api/me/posts
// @access  Private
const getMyPosts = asyncHandler(async (req, res) => {
  const user = await getEffectiveUser(req);
  if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const posts = await Information.find({ authorId: user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: posts.length,
    posts
  });
});

// @desc    Get saved/bookmarked posts for current user
// @route   GET /api/me/saved
// @access  Private
const getMySavedPosts = asyncHandler(async (req, res) => {
  const user = await getEffectiveUser(req);
  if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const userWithSaved = await User.findById(user._id).populate({
    path: 'savedPosts',
    populate: { path: 'authorId', select: 'name role avatarUrl' }
  });

  res.status(200).json({
    success: true,
    count: userWithSaved.savedPosts ? userWithSaved.savedPosts.length : 0,
    posts: userWithSaved.savedPosts || []
  });
});

// @desc    Toggle save/bookmark a post
// @route   POST /api/me/saved/:id
// @access  Private
const toggleSavePost = asyncHandler(async (req, res) => {
  const user = await getEffectiveUser(req);
  if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });
  const { id } = req.params;

  const info = await Information.findById(id);
  if (!info) {
    return res.status(404).json({ success: false, message: 'Information not found' });
  }

  const dbUser = await User.findById(user._id);
  const isSaved = dbUser.savedPosts.some(
    (postId) => postId.toString() === id.toString()
  );

  if (isSaved) {
    dbUser.savedPosts = dbUser.savedPosts.filter(
      (postId) => postId.toString() !== id.toString()
    );
    await dbUser.save();
    return res.status(200).json({
      success: true,
      saved: false,
      message: 'Removed from saved'
    });
  } else {
    dbUser.savedPosts.push(id);
    await dbUser.save();
    return res.status(200).json({
      success: true,
      saved: true,
      message: 'Saved successfully'
    });
  }
});

// @desc    Get posts marked helpful by user
// @route   GET /api/me/helpful
// @access  Private
const getMyHelpfulPosts = asyncHandler(async (req, res) => {
  const user = await getEffectiveUser(req);
  if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const userWithHelpful = await User.findById(user._id).populate({
    path: 'helpfulPosts',
    populate: { path: 'authorId', select: 'name role avatarUrl' }
  });

  res.status(200).json({
    success: true,
    count: userWithHelpful.helpfulPosts ? userWithHelpful.helpfulPosts.length : 0,
    posts: userWithHelpful.helpfulPosts || []
  });
});

// @desc    Get updates suggested by user
// @route   GET /api/me/updates
// @access  Private
const getMyUpdates = asyncHandler(async (req, res) => {
    const user = await getEffectiveUser(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });
  
    // Find Information where updateSuggestions contains userId
    const posts = await Information.find({ "updateSuggestions.userId": user._id })
      .populate('authorId', 'name avatarUrl role');
  
    // Map to just show the user's specific updates (optional, for now just return the whole info object)
    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
});

// @desc    Get reports made by user
// @route   GET /api/me/reports
// @access  Private
const getMyReports = asyncHandler(async (req, res) => {
    const user = await getEffectiveUser(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });
  
    const posts = await Information.find({ "reports.userId": user._id })
      .populate('authorId', 'name avatarUrl role');
  
    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
});


module.exports = {
  getMyPosts,
  getMySavedPosts,
  toggleSavePost,
  getMyHelpfulPosts,
  getMyUpdates,
  getMyReports
};
