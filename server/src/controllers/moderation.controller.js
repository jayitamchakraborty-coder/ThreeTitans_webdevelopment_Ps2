const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all items in the moderation queue
// @route   GET /api/moderation/queue
// @access  Private (Moderator / Admin)
const getModerationQueue = asyncHandler(async (req, res) => {
  const { locality, status } = req.query;

  const query = {};

  if (status && status !== 'all') {
    query.status = status;
  } else {
    // Default queue: items needing attention
    query.$or = [
      { status: 'needs-verification' },
      { status: 'under-review' },
      { 'reports.0': { $exists: true } },
      { 'suggestedUpdates.status': 'pending' }
    ];
  }

  if (locality && locality !== 'All Locations' && locality !== 'all') {
    query.locality = locality;
  }

  const posts = await Post.find(query)
    .populate('author', 'name email avatarUrl role locality isVerified')
    .sort({ createdAt: -1 });

  // Summary counts for moderator dashboard badges
  const pendingCount = await Post.countDocuments({ status: 'needs-verification' });
  const reviewCount = await Post.countDocuments({ status: 'under-review' });
  const reportedCount = await Post.countDocuments({ 'reports.0': { $exists: true } });

  res.status(200).json({
    success: true,
    count: posts.length,
    stats: {
      pendingVerification: pendingCount,
      underReview: reviewCount,
      reported: reportedCount
    },
    posts
  });
});

// @desc    Verify a post (grant verified badge)
// @route   PATCH /api/moderation/verify/:id
// @access  Private (Moderator / Admin)
const verifyPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  post.status = 'verified';
  await post.save();

  // Send notification to author
  await Notification.create({
    userId: post.author,
    postId: post._id,
    type: 'verification',
    message: `Your post "${post.title.substring(0, 40)}..." has been verified by the community moderators.`
  });

  res.status(200).json({
    success: true,
    message: 'Post successfully verified',
    post
  });
});

// @desc    Mark a post as resolved (e.g. lost item found, road repaired)
// @route   PATCH /api/moderation/resolve/:id
// @access  Private (Moderator / Admin / Author)
const resolvePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  post.status = 'resolved';
  await post.save();

  res.status(200).json({
    success: true,
    message: 'Post status updated to resolved',
    post
  });
});

// @desc    Remove/delete a post permanently
// @route   DELETE /api/moderation/remove/:id
// @access  Private (Moderator / Admin)
const removePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  const { reason = 'Content violates community guidelines' } = req.body;

  // Notify author before deletion
  await Notification.create({
    userId: post.author,
    type: 'moderation',
    message: `Your post "${post.title.substring(0, 40)}..." was removed by moderators. Reason: ${reason}`
  });

  await Post.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Post successfully removed from LocalLoop'
  });
});

// @desc    Review and accept or reject a suggested update
// @route   PATCH /api/moderation/suggested-update/:postId/:updateId
// @access  Private (Moderator / Admin)
const reviewSuggestedUpdate = asyncHandler(async (req, res) => {
  const { action } = req.body; // 'accept' or 'reject'
  const { postId, updateId } = req.params;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  const update = post.suggestedUpdates.id(updateId);
  if (!update) {
    return res.status(404).json({ success: false, message: 'Suggested update not found' });
  }

  if (action === 'accept') {
    update.status = 'accepted';
    // Dynamically apply valid field update
    const allowedFields = ['title', 'description', 'location', 'date', 'time', 'validUntil', 'link'];
    if (allowedFields.includes(update.field)) {
      post[update.field] = update.suggestedValue;
    }

    if (update.suggesterId) {
      await User.findByIdAndUpdate(update.suggesterId, {
        $inc: { 'stats.updatesAccepted': 1 }
      });
      await Notification.create({
        userId: update.suggesterId,
        postId: post._id,
        type: 'update_accepted',
        message: `Your suggested edit on "${post.title.substring(0, 30)}..." was accepted! Thank you for keeping info accurate.`
      });
    }
  } else {
    update.status = 'rejected';
  }

  await post.save();

  res.status(200).json({
    success: true,
    message: `Suggested update ${action}ed successfully`,
    post
  });
});

module.exports = {
  getModerationQueue,
  verifyPost,
  resolvePost,
  removePost,
  reviewSuggestedUpdate
};
