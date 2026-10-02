const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead
} = require('../controllers/notifications.controller');
const { optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, getNotifications);
router.patch('/read-all', optionalAuth, markAllAsRead);
router.patch('/:id/read', optionalAuth, markAsRead);

module.exports = router;
