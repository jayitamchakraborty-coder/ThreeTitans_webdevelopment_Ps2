const express = require('express');
const router = express.Router();
const {
  getMyPosts,
  getMySavedPosts,
  toggleSavePost,
  getMyHelpfulPosts,
  getMyStats
} = require('../controllers/users.controller');
const { optionalAuth } = require('../middleware/auth');

router.get('/me/posts', optionalAuth, getMyPosts);
router.get('/me/saved', optionalAuth, getMySavedPosts);
router.patch('/me/saved/:postId', optionalAuth, toggleSavePost);
router.get('/me/helpful', optionalAuth, getMyHelpfulPosts);
router.get('/me/stats', optionalAuth, getMyStats);

module.exports = router;
