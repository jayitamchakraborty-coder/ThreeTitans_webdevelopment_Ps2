const express = require('express');
const router = express.Router();
const { structureText, moderateContent } = require('../controllers/ai.controller');
const { protect } = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

router.post('/structure', structureText);
router.post('/moderate', protect, requireRole('MODERATOR', 'ADMIN'), moderateContent);

module.exports = router;
