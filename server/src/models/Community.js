const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Community name is required'],
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    location: {
      type: String,
      required: true
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    pendingRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Community', CommunitySchema);
