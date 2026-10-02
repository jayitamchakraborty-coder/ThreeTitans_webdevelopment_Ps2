const Community = require('../models/Community');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all communities
// @route   GET /api/communities
// @access  Public
const getCommunities = asyncHandler(async (req, res) => {
  const communities = await Community.find();
  res.status(200).json({
    success: true,
    count: communities.length,
    communities
  });
});

// @desc    Get community by ID
// @route   GET /api/communities/:id
// @access  Public
const getCommunityById = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id)
    .populate('members', 'name avatarUrl role')
    .populate('pendingRequests', 'name avatarUrl role');

  if (!community) {
    return res.status(404).json({
      success: false,
      message: 'Community not found'
    });
  }

  res.status(200).json({
    success: true,
    community
  });
});

// @desc    Request to join community
// @route   POST /api/communities/:id/join-request
// @access  Private
const requestToJoin = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id);
  
  if (!community) {
    return res.status(404).json({ success: false, message: 'Community not found' });
  }

  if (community.members.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You are already a member' });
  }

  if (community.pendingRequests.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You have already requested to join' });
  }

  community.pendingRequests.push(req.user._id);
  await community.save();

  res.status(200).json({
    success: true,
    message: 'Join request sent successfully'
  });
});

// @desc    Join community (direct join for now, mock logic)
// @route   POST /api/communities/:id/join
// @access  Private
const joinCommunity = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id);
  
  if (!community) {
    return res.status(404).json({ success: false, message: 'Community not found' });
  }

  if (!community.members.includes(req.user._id)) {
      community.members.push(req.user._id);
      
      // Remove from pending if there
      community.pendingRequests = community.pendingRequests.filter(id => id.toString() !== req.user._id.toString());
      await community.save();

      // Add to user communities
      req.user.communities.push(community._id);
      await req.user.save();
  }

  res.status(200).json({
    success: true,
    message: 'Joined community successfully'
  });
});

// @desc    Leave community
// @route   POST /api/communities/:id/leave
// @access  Private
const leaveCommunity = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id);
  
  if (!community) {
    return res.status(404).json({ success: false, message: 'Community not found' });
  }

  community.members = community.members.filter(id => id.toString() !== req.user._id.toString());
  await community.save();

  req.user.communities = req.user.communities.filter(id => id.toString() !== community._id.toString());
  await req.user.save();

  res.status(200).json({
    success: true,
    message: 'Left community successfully'
  });
});

// @desc    Get members of a community
// @route   GET /api/communities/:id/members
// @access  Public
const getCommunityMembers = asyncHandler(async (req, res) => {
    const community = await Community.findById(req.params.id).populate('members', 'name avatarUrl role locality');
    
    if (!community) {
        return res.status(404).json({ success: false, message: 'Community not found' });
    }

    res.status(200).json({
        success: true,
        count: community.members.length,
        members: community.members
    });
});

module.exports = {
  getCommunities,
  getCommunityById,
  requestToJoin,
  joinCommunity,
  leaveCommunity,
  getCommunityMembers
};
