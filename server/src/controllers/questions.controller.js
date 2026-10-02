const Question = require('../models/Question');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all questions
// @route   GET /api/questions
// @access  Public
const getQuestions = asyncHandler(async (req, res) => {
  const { communityId } = req.query;
  const query = {};
  
  if (communityId) query.communityId = communityId;

  const questions = await Question.find(query)
    .sort({ createdAt: -1 })
    .populate('authorId', 'name avatarUrl')
    .populate('answers.authorId', 'name avatarUrl');

  res.status(200).json({
    success: true,
    count: questions.length,
    questions
  });
});

// @desc    Get question by ID
// @route   GET /api/questions/:id
// @access  Public
const getQuestionById = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id)
    .populate('authorId', 'name avatarUrl')
    .populate('answers.authorId', 'name avatarUrl');

  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Question not found'
    });
  }

  res.status(200).json({
    success: true,
    question
  });
});

// @desc    Ask a community question
// @route   POST /api/questions
// @access  Private
const createQuestion = asyncHandler(async (req, res) => {
  const { question, communityId } = req.body;

  if (!question) {
    return res.status(400).json({ success: false, message: 'Please provide a question' });
  }

  const newQuestion = await Question.create({
    question,
    communityId: communityId || null,
    authorId: req.user._id,
    authorName: req.user.name
  });

  res.status(201).json({
    success: true,
    question: newQuestion
  });
});

// @desc    Answer a question
// @route   POST /api/questions/:id/answers
// @access  Private
const answerQuestion = asyncHandler(async (req, res) => {
  const { answer } = req.body;
  if (!answer) {
      return res.status(400).json({ success: false, message: 'Please provide an answer' });
  }

  const question = await Question.findById(req.params.id);
  if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
  }

  question.answers.push({
      authorId: req.user._id,
      authorName: req.user.name,
      answer
  });

  await question.save();

  res.status(201).json({
      success: true,
      message: 'Answer submitted successfully',
      question
  });
});

// @desc    Mark answer as helpful
// @route   POST /api/answers/:id/helpful
// @access  Private
const answerHelpful = asyncHandler(async (req, res) => {
    // Requires nested lookup in mongo
    const question = await Question.findOne({ "answers._id": req.params.id });
    if (!question) {
        return res.status(404).json({ success: false, message: 'Answer not found' });
    }

    const answer = question.answers.id(req.params.id);
    
    if (answer.helpfulUsers.includes(req.user._id)) {
        return res.status(400).json({ success: false, message: 'Already marked helpful' });
    }

    answer.helpfulUsers.push(req.user._id);
    await question.save();

    res.status(200).json({
        success: true,
        message: 'Marked answer as helpful'
    });
});

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  answerQuestion,
  answerHelpful
};
