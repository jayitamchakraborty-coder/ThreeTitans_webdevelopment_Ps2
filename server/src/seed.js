const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('./models/User');
const Post = require('./models/Post');
const Notification = require('./models/Notification');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/localloop';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB at:', mongoUri);

    // Clean existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Notification.deleteMany({});
    console.log('[Seed] Cleared existing records.');

    // Seed Demo Users
    const salt = await bcrypt.genSalt(10);
    const demoPasswordHash = await bcrypt.hash('localloop2026', salt);

    const resident = await User.create({
      name: 'Aarav Sharma',
      email: 'resident@localloop.org',
      passwordHash: demoPasswordHash,
      locality: 'DBIT/Kurla',
      role: 'resident',
      isVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
      stats: { postsShared: 4, helpfulVotes: 28, updatesAccepted: 3 }
    });

    const moderator = await User.create({
      name: 'Priya Deshmukh',
      email: 'moderator@localloop.org',
      passwordHash: demoPasswordHash,
      locality: 'DBIT/Kurla',
      role: 'moderator',
      isVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
      stats: { postsShared: 6, helpfulVotes: 74, updatesAccepted: 12 }
    });

    const admin = await User.create({
      name: 'Rahul Varma',
      email: 'admin@localloop.org',
      passwordHash: demoPasswordHash,
      locality: 'Bandra West',
      role: 'admin',
      isVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&q=80',
      stats: { postsShared: 10, helpfulVotes: 142, updatesAccepted: 25 }
    });

    console.log('[Seed] Created 3 demo users (resident, moderator, admin)');

    // Seed Realistic Posts matching the Stitch frontend UI mocks
    const posts = [
      {
        title: 'Emergency Water Pipeline Repair Notice on CST Road',
        description: 'BMC will be undertaking urgent repairs on the main 600mm distribution pipeline opposite Kurla Station West. Water supply will be curtailed by 50% between 10 AM and 6 PM. Residents are advised to store sufficient water in advance.',
        category: 'emergencies',
        location: 'CST Road near Kurla Station West',
        locality: 'DBIT/Kurla',
        date: '2026-10-03',
        time: '10:00 AM - 6:00 PM',
        link: 'https://portal.mcgm.gov.in',
        status: 'verified',
        urgency: 'high',
        helpfulCount: 47,
        author: moderator._id,
        authorName: moderator.name,
        authorRole: moderator.role,
        rawInput: 'Urgent BMC notice: 50% water cut tomorrow due to pipeline repair work at Kurla CST road from 10am to 6pm. Please store water.'
      },
      {
        title: 'DBIT Annual Hackathon & AI Project Showcase 2026',
        description: 'Don Bosco Institute of Technology is hosting its premier 24-hour inter-collegiate hackathon. Open to all engineering students with tracks in Civic Tech, Generative AI, and Sustainable Cities. Free registration, mentorship from industry leads, and cash pool of ₹1,00,000.',
        category: 'events',
        location: 'Mendonca Auditorium, DBIT Campus, Premier Lines',
        locality: 'DBIT/Kurla',
        date: '2026-10-15',
        time: '09:00 AM onwards',
        link: 'https://dbit.in/hackathon-2026',
        status: 'verified',
        urgency: 'medium',
        helpfulCount: 89,
        author: resident._id,
        authorName: resident.name,
        authorRole: resident.role,
        rawInput: 'Hey everyone, registrations for DBIT Hackathon 2026 are live! Cash prizes of 1L. Venue is Mendonca hall on Oct 15.'
      },
      {
        title: 'Junior Frontend Developer Internship (React / Node.js)',
        description: 'Bandra-based civic tech startup is hiring a motivated frontend intern. Flexible hybrid schedule, hands-on experience with modern web stacks, and a competitive monthly stipend of ₹18,000. Suitable for pre-final and final year undergrads.',
        category: 'internship',
        location: 'Pali Hill Incubator, Bandra West',
        locality: 'Bandra West',
        date: 'Apply by 2026-10-10',
        time: 'Flexible Hours',
        link: 'https://angel.co/company/civicpulse/jobs',
        status: 'verified',
        urgency: 'medium',
        helpfulCount: 34,
        author: admin._id,
        authorName: admin.name,
        authorRole: admin.role,
        rawInput: 'We are hiring a frontend dev intern at Bandra West incubator. React/Node, 18k stipend. Apply before 10th Oct.'
      },
      {
        title: 'Lost Black Leather Wallet with Student ID near Central Canteen',
        description: 'Misplaced a black Bellroy leather wallet containing DBIT student identification card (Roll No. 221045), metro pass, and some cash. If found, please return to DBIT main security desk or contact via message.',
        category: 'lost_found',
        location: 'Central Canteen lawn, DBIT Campus',
        locality: 'DBIT/Kurla',
        date: '2026-10-02',
        time: '01:30 PM',
        status: 'needs-verification',
        urgency: 'medium',
        helpfulCount: 12,
        author: resident._id,
        authorName: resident.name,
        authorRole: resident.role,
        rawInput: 'Lost my wallet around 1:30pm today near central canteen. Has my DBIT id card. Please ping if found.'
      },
      {
        title: 'Dangerous Open Pothole at Hill Road Junction',
        description: 'Large unmarked pothole right after the traffic signal turning into Hill Road. Two two-wheelers skidded last night during the drizzle. Needs immediate municipal barricading and asphalt patching.',
        category: 'infrastructure',
        location: 'Hill Road Junction near St. Joseph School',
        locality: 'Bandra West',
        date: '2026-10-01',
        time: 'Reported 08:00 AM',
        status: 'under-review',
        urgency: 'high',
        helpfulCount: 23,
        author: resident._id,
        authorName: resident.name,
        authorRole: resident.role,
        reports: [
          {
            reporterId: admin._id,
            reason: 'Accurate and needs urgent municipal escalation.',
            timestamp: new Date()
          }
        ]
      },
      {
        title: 'Mumbai Merit Merit-cum-Means Higher Education Scholarship',
        description: 'Government of Maharashtra social welfare department scholarship portal is now accepting applications for STEM college students. Covers up to 80% tuition fees for eligible students from Mumbai suburban district.',
        category: 'scholarships',
        location: 'Online Portal / District Collector Office',
        locality: 'Andheri East',
        date: 'Deadline: 2026-10-31',
        time: 'Online Submission',
        link: 'https://mahadbt.maharashtra.gov.in',
        status: 'verified',
        urgency: 'low',
        helpfulCount: 65,
        author: admin._id,
        authorName: admin.name,
        authorRole: admin.role
      },
      {
        title: 'Garbage Collection Delayed in Sector 4 Powai',
        description: 'Waste collection van hasn’t visited Sector 4 residential complexes for two consecutive mornings. Green bins are overflowing near the park entrance.',
        category: 'local-issues',
        location: 'Sector 4 Central Park Avenue',
        locality: 'Powai Central',
        date: '2026-10-02',
        time: 'Morning',
        status: 'needs-verification',
        urgency: 'medium',
        helpfulCount: 8,
        author: resident._id,
        authorName: resident.name,
        authorRole: resident.role
      }
    ];

    const createdPosts = await Post.insertMany(posts);
    console.log(`[Seed] Seeded ${createdPosts.length} posts successfully.`);

    // Bookmark some posts for demo user
    resident.savedPosts = [createdPosts[0]._id, createdPosts[1]._id];
    resident.helpfulPosts = [createdPosts[0]._id, createdPosts[2]._id];
    await resident.save();

    // Seed Sample Notifications
    await Notification.create([
      {
        userId: resident._id,
        postId: createdPosts[0]._id,
        type: 'verification',
        message: 'Your emergency alert was reviewed and verified by Priya Deshmukh.'
      },
      {
        userId: resident._id,
        postId: createdPosts[1]._id,
        type: 'helpful',
        message: '14 people found your DBIT Hackathon announcement helpful today.'
      }
    ]);

    console.log('[Seed] Seeded sample notifications and user relationships.');
    console.log('[Seed] Database seeding completed successfully! ✨');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err);
    process.exit(1);
  }
};

seedData();
