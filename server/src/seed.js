const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('./models/User');
const Information = require('./models/Information');
const Notification = require('./models/Notification');
const Community = require('./models/Community');
const History = require('./models/History');
const Question = require('./models/Question');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/localloop';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB at:', mongoUri);

    // Clean existing data
    await User.deleteMany({});
    await Information.deleteMany({});
    await Notification.deleteMany({});
    await Community.deleteMany({});
    await History.deleteMany({});
    await Question.deleteMany({});
    
    console.log('[Seed] Cleared existing records.');

    // Seed Communities
    const kurlaCommunity = await Community.create({
        name: 'DBIT / Kurla',
        description: 'Local updates for DBIT campus and Kurla residents',
        location: 'Kurla West'
    });
    
    const bandraCommunity = await Community.create({
        name: 'Bandra West',
        description: 'Bandra community noticeboard',
        location: 'Bandra West'
    });

    // Seed Demo Users for Vicinus
    const salt = await bcrypt.genSalt(10);
    const demoPasswordHash = await bcrypt.hash('Demo@123', salt);
    const modPasswordHash = await bcrypt.hash('Moderator@123', salt);

    const resident = await User.create({
      name: 'Aarav Sharma',
      email: 'demo@vicinus.local',
      passwordHash: demoPasswordHash,
      role: 'USER',
      communities: [kurlaCommunity._id]
    });

    const moderator = await User.create({
      name: 'Priya Deshmukh',
      email: 'moderator@vicinus.local',
      passwordHash: modPasswordHash,
      role: 'MODERATOR',
      communities: [kurlaCommunity._id]
    });

    console.log('[Seed] Created demo user and moderator');
    
    kurlaCommunity.members.push(resident._id, moderator._id);
    await kurlaCommunity.save();

    // Seed Information
    const info1 = await Information.create({
      title: 'DBIT Hackathon 2026',
      description: 'Register for the premier 24-hour hackathon. Cash prizes up to 1L.',
      category: 'events',
      type: 'EVENT',
      location: 'DBIT Campus',
      communityId: kurlaCommunity._id,
      authorId: moderator._id,
      authorName: moderator.name,
      authorRole: moderator.role,
      status: 'VERIFIED',
      eventDate: '2026-10-15',
      helpfulCount: 15,
      helpfulUsers: [resident._id]
    });

    const info2 = await Information.create({
      title: 'Lost Keys near Canteen',
      description: 'Found a bunch of keys with a blue Honda keychain near the central canteen. Submitted to security.',
      category: 'lost_found',
      type: 'LOST_FOUND',
      location: 'Central Canteen',
      communityId: kurlaCommunity._id,
      authorId: resident._id,
      authorName: resident.name,
      authorRole: resident.role,
      status: 'NEEDS_VERIFICATION'
    });

    // Item hitting report threshold
    const info3 = await Information.create({
      title: 'Free Laptop Distribution Scheme',
      description: 'Click this unknown link to register for free laptops from government.',
      category: 'announcements',
      type: 'NOTICE',
      location: 'All Mumbai',
      communityId: kurlaCommunity._id,
      authorId: resident._id,
      authorName: resident.name,
      authorRole: resident.role,
      status: 'UNDER_REVIEW',
      reportCount: 3,
      reportThreshold: 3,
      reviewRequired: true,
      reports: [
          { userId: moderator._id, reason: 'SPAM', description: 'Suspicious link' },
          { userId: resident._id, reason: 'MISLEADING', description: 'Fake news' },
          { userId: resident._id, reason: 'SPAM', description: 'Scam' }
      ]
    });

    const info4 = await Information.create({
      title: 'Web Dev Internship',
      description: 'Startup in Bandra looking for React developers. 15k stipend.',
      category: 'internships',
      type: 'NOTICE',
      location: 'Bandra',
      communityId: bandraCommunity._id,
      authorId: moderator._id,
      authorName: moderator.name,
      authorRole: moderator.role,
      status: 'VERIFIED'
    });

    // History logs
    await History.create([
      { informationId: info1._id, action: 'POSTED', actorId: moderator._id },
      { informationId: info1._id, action: 'VERIFIED', actorId: moderator._id },
      { informationId: info2._id, action: 'POSTED', actorId: resident._id },
      { informationId: info3._id, action: 'POSTED', actorId: resident._id },
      { informationId: info3._id, action: 'REPORTED', actorId: moderator._id },
      { informationId: info3._id, action: 'UNDER_REVIEW', details: 'Reached report threshold (3)' },
      { informationId: info4._id, action: 'POSTED', actorId: moderator._id }
    ]);

    // Seed Q&A
    const q1 = await Question.create({
        question: 'Any good places to get cheap printouts near DBIT?',
        communityId: kurlaCommunity._id,
        authorId: resident._id,
        authorName: resident.name,
        answers: [
            { authorId: moderator._id, authorName: moderator.name, answer: 'Try the shop next to the main gate, they do bulk for 1 Rs.' }
        ]
    });

    console.log('[Seed] Database seeding completed successfully! ✨');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err);
    process.exit(1);
  }
};

seedData();
