const express = require('express');
const {
    getIndustryReport
} = require('../controllers/industryReport');

const router = express.Router();

router.route('/').get(getIndustryReport);

module.exports = router;