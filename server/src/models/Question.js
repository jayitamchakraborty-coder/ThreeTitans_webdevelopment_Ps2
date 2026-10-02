const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, default: 'Community Member' },
  answer: { type: String, required: true },
  helpfulUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

const QuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true
    },
    communityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Community',
      default: null
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    authorName: { type: String, default: 'Community Member' },
    status: {
      type: String,
      enum: ['OPEN', 'RESOLVED'],
      default: 'OPEN'
    },
    answers: [AnswerSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', QuestionSchema);
