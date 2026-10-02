const express = require('express');
const router = express.Router();
const { parseText } = require('../controllers/ai.controller');

router.post('/parse', parseText);

module.exports = router;
