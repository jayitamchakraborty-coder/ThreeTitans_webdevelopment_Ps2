const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const SuggestedUpdateSchema = new mongoose.Schema({
  suggesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  suggesterName: {
    type: String,
    default: 'Anonymous Resident'
  },
  field: {
    type: String,
    required: true
  },
  suggestedValue: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      maxlength: 150
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'internship',
        'events',
        'announcements',
        'emergencies',
        'infrastructure',
        'lost_found',
        'scholarships',
        'local-issues'
      ]
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    locality: {
      type: String,
      required: [true, 'Locality is required'],
      enum: ['DBIT/Kurla', 'Bandra West', 'Andheri East', 'Powai Central'],
      default: 'DBIT/Kurla'
    },
    date: {
      type: String,
      default: ''
    },
    time: {
      type: String,
      default: ''
    },
    validUntil: {
      type: Date,
      default: null
    },
    link: {
      type: String,
      trim: true,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['needs-verification', 'verified', 'under-review', 'resolved', 'expired'],
      default: 'needs-verification'
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    helpfulCount: {
      type: Number,
      default: 0
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    authorName: {
      type: String,
      default: 'Community Member'
    },
    authorRole: {
      type: String,
      default: 'resident'
    },
    rawInput: {
      type: String,
      default: ''
    },
    reports: [ReportSchema],
    suggestedUpdates: [SuggestedUpdateSchema]
  },
  {
    timestamps: true
  }
);

// Indexes for high performance search & filtering
PostSchema.index({ locality: 1, category: 1, status: 1 });
PostSchema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Post', PostSchema);
