const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: {
    type: String,
    enum: ['INCORRECT', 'OUTDATED', 'SPAM', 'MISLEADING', 'OTHER'],
    required: true
  },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const UpdateSuggestionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  suggestedChanges: { type: String, required: true },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
    default: 'PENDING'
  },
  createdAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date, default: null }
});

const InformationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
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
      enum: ['internships', 'scholarships', 'events', 'lost_found', 'emergencies', 'local_issues', 'announcements']
    },
    type: {
      type: String,
      enum: ['NOTICE', 'EVENT', 'UPDATE', 'LOST_FOUND', 'EMERGENCY', 'QUESTION'],
      default: 'NOTICE'
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
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
    authorRole: { type: String, default: 'user' },
    eventDate: { type: String, default: '' },
    validUntil: { type: String, default: '' },
    contact: { type: String, default: '' },
    link: { type: String, trim: true, default: '' },
    imageUrl: { type: String, default: '' },
    rawInput: { type: String, default: '' },

    // Status lifecycle
    status: {
      type: String,
      enum: ['NEEDS_VERIFICATION', 'UNDER_REVIEW', 'VERIFIED', 'REPORTED', 'RESOLVED', 'EXPIRED', 'REMOVED'],
      default: 'NEEDS_VERIFICATION'
    },

    // Helpful system
    helpfulUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    helpfulCount: { type: Number, default: 0 },

    // Report system with threshold
    reports: [ReportSchema],
    reportCount: { type: Number, default: 0 },
    reportThreshold: { type: Number, default: 3 },
    reviewRequired: { type: Boolean, default: false },

    // Update suggestions
    updateSuggestions: [UpdateSuggestionSchema],

    // Removal info
    removedReason: { type: String, default: '' },
    removedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    // Lifecycle timestamps
    resolvedAt: { type: Date, default: null },
    expiredAt: { type: Date, default: null }
  },
  { timestamps: true }
);

// Indexes for search and filtering
InformationSchema.index({ title: 'text', description: 'text', location: 'text' });
InformationSchema.index({ category: 1, status: 1, communityId: 1 });
InformationSchema.index({ authorId: 1 });
InformationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Information', InformationSchema);
