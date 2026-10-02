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

router.get('/posts', protect, getMyPosts);
router.get('/saved', protect, getMySavedPosts);
router.post('/saved/:id', protect, toggleSavePost);
router.get('/helpful', protect, getMyHelpfulPosts);
router.get('/updates', protect, getMyUpdates);
router.get('/reports', protect, getMyReports);

module.exports = router;
