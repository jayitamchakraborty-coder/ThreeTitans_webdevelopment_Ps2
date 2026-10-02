const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  toggleHelpful,
  reportPost,
  suggestUpdate
} = require('../controllers/posts.controller');
const { optionalAuth, protect } = require('../middleware/auth');

router.route('/')
  .get(getPosts)
  .post(optionalAuth, createPost);

router.route('/:id')
  .get(getPostById);

router.route('/:id/helpful')
  .patch(optionalAuth, toggleHelpful);

router.route('/:id/report')
  .post(optionalAuth, reportPost);

router.route('/:id/suggest-update')
  .post(optionalAuth, suggestUpdate);

module.exports = router;
