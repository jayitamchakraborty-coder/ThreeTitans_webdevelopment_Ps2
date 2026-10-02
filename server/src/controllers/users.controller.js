const User = require('../models/User');
const Post = require('../models/Post');
const asyncHandler = require('../utils/asyncHandler');

// Helper to resolve user: either authenticated user or demo user
const getEffectiveUser = async (req) => {
  if (req.user) return req.user;
  // Fallback to first resident or create demo
  let demoUser = await User.findOne({ email: 'resident@localloop.org' });
  if (!demoUser) {
    demoUser = await User.create({
      name: 'Aarav Sharma',
      email: 'resident@localloop.org',
      passwordHash: 'demo_hash',
      locality: 'DBIT/Kurla',
      role: 'resident'
    });
  }
  return demoUser;
};

// @desc    Get posts authored by current user
// @route   GET /api/users/me/posts
// @access  Private / Demo
const getMyPosts = asyncHandler(async (req, res) => {
  const user = await getEffectiveUser(req);
  const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: posts.length,
    posts
  });
});

// @desc    Get saved/bookmarked posts for current user
// @route   GET /api/users/me/saved
// @access  Private / Demo
const getMySavedPosts = asyncHandler(async (req, res) => {
  const user = await getEffectiveUser(req);
  const userWithSaved = await User.findById(user._id).populate({
    path: 'savedPosts',
    populate: { path: 'author', select: 'name role avatarUrl locality' }
  });

  res.status(200).json({
    success: true,
    count: userWithSaved.savedPosts ? userWithSaved.savedPosts.length : 0,
    posts: userWithSaved.savedPosts || []
  });
});

// @desc    Toggle save/bookmark a post
// @route   PATCH /api/users/me/saved/:postId
// @access  Private / Demo
const toggleSavePost = asyncHandler(async (req, res) => {
  const user = await getEffectiveUser(req);
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  const dbUser = await User.findById(user._id);
  const isSaved = dbUser.savedPosts.some(
    (id) => id.toString() === postId.toString()
  );

  if (isSaved) {
    dbUser.savedPosts = dbUser.savedPosts.filter(
      (id) => id.toString() !== postId.toString()
    );
    await dbUser.save();
    return res.status(200).json({
      success: true,
      saved: false,
      message: 'Post removed from saved bookmarks'
    });
  } else {
    dbUser.savedPosts.push(postId);
    await dbUser.save();
    return res.status(200).json({
      success: true,
      saved: true,
      message: 'Post saved to bookmarks'
    });
  }
});

// @desc    Get posts marked helpful by user
// @route   GET /api/users/me/helpful
// @access  Private / Demo
const getMyHelpfulPosts = asyncHandler(async (req, res) => {
  const user = await getEffectiveUser(req);
  const userWithHelpful = await User.findById(user._id).populate({
    path: 'helpfulPosts',
    populate: { path: 'author', select: 'name role avatarUrl locality' }
  });

  res.status(200).json({
    success: true,
    count: userWithHelpful.helpfulPosts ? userWithHelpful.helpfulPosts.length : 0,
    posts: userWithHelpful.helpfulPosts || []
  });
});

// @desc    Get user activity and impact statistics
// @route   GET /api/users/me/stats
// @access  Private / Demo
const getMyStats = asyncHandler(async (req, res) => {
  const user = await getEffectiveUser(req);

  const postsShared = await Post.countDocuments({ author: user._id });
  const verifiedPosts = await Post.countDocuments({ author: user._id, status: 'verified' });

  // Calculate total helpful votes received across all author's posts
  const authorPosts = await Post.find({ author: user._id }, 'helpfulCount');
  const helpfulVotes = authorPosts.reduce((acc, p) => acc + (p.helpfulCount || 0), 0);

  // Community credibility score calculation
  const credibilityScore = (postsShared * 5) + (verifiedPosts * 15) + (helpfulVotes * 2) + ((user.stats?.updatesAccepted || 0) * 10);

  const stats = {
    postsShared,
    verifiedPosts,
    helpfulVotes,
    updatesAccepted: user.stats?.updatesAccepted || 0,
    credibilityScore
  };

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      locality: user.locality,
      avatarUrl: user.avatarUrl
    },
    stats
  });
});

module.exports = {
  getMyPosts,
  getMySavedPosts,
  toggleSavePost,
  getMyHelpfulPosts,
  getMyStats
};
