const { parseUnstructuredContent, moderateContentAI } = require('../utils/gemini');
const asyncHandler = require('../utils/asyncHandler');
const Information = require('../models/Information');

// @desc    Parse unstructured text into structured post fields
// @route   POST /api/ai/structure
// @access  Public
const structureText = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide raw text to structure'
    });
  }

  const structuredData = await parseUnstructuredContent(text.trim());

  res.status(200).json({
    success: true,
    message: 'Announcement structured successfully',
    data: structuredData
  });
});

// @desc    Moderate content using AI
// @route   POST /api/ai/moderate
// @access  Private (Moderator / Admin)
const moderateContent = asyncHandler(async (req, res) => {
    const { informationId } = req.body;
    
    if (!informationId) {
        return res.status(400).json({ success: false, message: 'Please provide informationId' });
    }

    const info = await Information.findById(informationId).populate('reports.userId');
    if (!info) {
        return res.status(404).json({ success: false, message: 'Information not found' });
    }

    const aiReview = await moderateContentAI(info);

    res.status(200).json({
        success: true,
        aiReview
    });
});

module.exports = {
  structureText,
  moderateContent
};
