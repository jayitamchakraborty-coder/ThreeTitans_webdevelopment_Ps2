const { parseUnstructuredContent } = require('../utils/gemini');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Parse unstructured text into structured post fields
// @route   POST /api/ai/parse
// @access  Public
const parseText = asyncHandler(async (req, res) => {
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

module.exports = {
  parseText
};
