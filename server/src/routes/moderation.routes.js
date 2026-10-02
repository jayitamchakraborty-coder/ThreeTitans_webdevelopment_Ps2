const express = require('express');
const router = express.Router();
const {
  getModerationQueue,
  verifyPost,
  resolvePost,
  removePost,
  editPost
} = require('../controllers/moderation.controller');
const { protect } = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// All endpoints require MODERATOR or ADMIN role
const moderationAccess = [protect, requireRole('MODERATOR', 'ADMIN')];

router.get('/queue', moderationAccess, getModerationQueue);
router.post('/:id/verify', moderationAccess, verifyPost);
router.post('/:id/resolve', moderationAccess, resolvePost);
router.delete('/:id', moderationAccess, removePost);
router.put('/:id', moderationAccess, editPost);

module.exports = router;
