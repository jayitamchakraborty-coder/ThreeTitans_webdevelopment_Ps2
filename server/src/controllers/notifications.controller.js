const Notification = require('../models/Notification');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const getEffectiveUserId = async (req) => {
  if (req.user) return req.user._id;
  const demoUser = await User.findOne({ email: 'resident@localloop.org' });
  return demoUser ? demoUser._id : null;
};

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private / Demo
const getNotifications = asyncHandler(async (req, res) => {
  const userId = await getEffectiveUserId(req);
  if (!userId) {
    return res.status(200).json({ success: true, count: 0, notifications: [] });
  }

  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(20);

  const unreadCount = await Notification.countDocuments({ userId, read: false });

  res.status(200).json({
    success: true,
    unreadCount,
    notifications
  });
});

// @desc    Mark single notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private / Demo
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }

  res.status(200).json({
    success: true,
    notification
  });
});

// @desc    Mark all user notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private / Demo
const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = await getEffectiveUserId(req);
  if (userId) {
    await Notification.updateMany({ userId, read: false }, { read: true });
  }

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};
