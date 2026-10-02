const express = require('express');
const router = express.Router();
const {
  getModerationQueue,
  verifyPost,
  resolvePost,
  removePost,
  reviewSuggestedUpdate
} = require('../controllers/moderation.controller');
const { protect, optionalAuth } = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// Demo-friendly moderation middleware: allows moderator/admin token OR demo bypass flag for seamless hackathon judging
const moderationAccess = async (req, res, next) => {
  // If demo query/header is present during presentation, let through as moderator
  if (req.query.demo === 'mod' || req.headers['x-demo-role'] === 'moderator') {
    return next();
  }

  // Otherwise enforce standard JWT authentication
  return protect(req, res, () => {
    return requireRole('moderator', 'admin')(req, res, next);
  });
};

router.get('/queue', moderationAccess, getModerationQueue);
router.patch('/verify/:id', moderationAccess, verifyPost);
router.patch('/resolve/:id', moderationAccess, resolvePost);
router.delete('/remove/:id', moderationAccess, removePost);
router.patch('/suggested-update/:postId/:updateId', moderationAccess, reviewSuggestedUpdate);

module.exports = router;
