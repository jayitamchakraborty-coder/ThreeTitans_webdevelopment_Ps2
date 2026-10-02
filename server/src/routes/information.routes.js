const express = require('express');
const router = express.Router();
const {
  getInformation,
  getInformationById,
  createInformation,
  toggleHelpful,
  reportInformation,
  suggestUpdate,
  getInformationHistory
} = require('../controllers/information.controller');
const { protect, optionalAuth } = require('../middleware/auth');

router.route('/')
  .get(getInformation)
  .post(protect, createInformation);

router.route('/:id')
  .get(getInformationById);

router.route('/:id/helpful')
  .post(protect, toggleHelpful);

router.route('/:id/report')
  .post(protect, reportInformation);

router.route('/:id/update')
  .post(protect, suggestUpdate);

router.route('/:id/history')
  .get(getInformationHistory);

module.exports = router;
