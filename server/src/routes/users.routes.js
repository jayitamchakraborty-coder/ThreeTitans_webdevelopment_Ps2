const express = require('express');
const router = express.Router();
const {
  getMyPosts,
  getMySavedPosts,
  toggleSavePost,
  getMyHelpfulPosts,
  getMyUpdates,
  getMyReports
} = require('../controllers/users.controller');
const { protect } = require('../middleware/auth');

router.get('/me/posts', protect, getMyPosts);
router.get('/me/saved', protect, getMySavedPosts);
router.post('/me/saved/:id', protect, toggleSavePost);
router.get('/me/helpful', protect, getMyHelpfulPosts);
router.get('/me/updates', protect, getMyUpdates);
router.get('/me/reports', protect, getMyReports);

module.exports = router;
