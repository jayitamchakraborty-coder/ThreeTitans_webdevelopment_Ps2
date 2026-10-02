const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getQuestionById,
  createQuestion,
  answerQuestion,
  answerHelpful
} = require('../controllers/questions.controller');
const { protect } = require('../middleware/auth');

router.get('/', getQuestions);
router.post('/', protect, createQuestion);
router.get('/:id', getQuestionById);
router.post('/:id/answers', protect, answerQuestion);
router.post('/answers/:id/helpful', protect, answerHelpful);

module.exports = router;
