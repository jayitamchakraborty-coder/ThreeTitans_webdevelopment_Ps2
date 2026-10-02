const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema(
  {
    informationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Information',
      required: true,
      index: true
    },
    action: {
      type: String,
      required: true,
      enum: ['POSTED', 'REPORTED', 'UPDATE_SUGGESTED', 'UNDER_REVIEW', 'EDITED', 'VERIFIED', 'REMOVED', 'RESOLVED', 'EXPIRED']
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null // System actions might not have an actor
    },
    details: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('History', HistorySchema);
