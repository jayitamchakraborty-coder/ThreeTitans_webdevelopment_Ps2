const express = require('express');
const router = express.Router();
const {
  getCommunities,
  getCommunityById,
  requestToJoin,
  joinCommunity,
  leaveCommunity,
  getCommunityMembers
} = require('../controllers/communities.controller');
const { protect } = require('../middleware/auth');

router.get('/', getCommunities);
router.get('/:id', getCommunityById);
router.post('/:id/join-request', protect, requestToJoin);
router.post('/:id/join', protect, joinCommunity);
router.post('/:id/leave', protect, leaveCommunity);
router.get('/:id/members', getCommunityMembers);

module.exports = router;
