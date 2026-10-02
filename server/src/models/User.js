const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 60
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required']
    },
    avatarUrl: {
      type: String,
      default: ''
    },
    locality: {
      type: String,
      default: 'DBIT/Kurla',
      enum: ['DBIT/Kurla', 'Bandra West', 'Andheri East', 'Powai Central', 'All Locations']
    },
    role: {
      type: String,
      enum: ['resident', 'moderator', 'admin'],
      default: 'resident'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    stats: {
      postsShared: { type: Number, default: 0 },
      helpfulVotes: { type: Number, default: 0 },
      updatesAccepted: { type: Number, default: 0 }
    },
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
      }
    ],
    helpfulPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
      }
    ],
    joinedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', UserSchema);
