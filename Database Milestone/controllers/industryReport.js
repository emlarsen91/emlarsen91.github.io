const Stock = require('../models/stock');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc        Get the report for top 5 stocks by industry
// @route       GET /stocks/IndustryReport
// @access      Public
exports.getIndustryReport = asyncHandler(async (req, res, next) => {
    console.log(req.query);
    // Pipeline operations for the creation of the report
    // The query string is our match parameter, We only want to return the name and Return on investment
    // Sort organizes by best return and limit keeps us to 5 items
    const report = await Stock.aggregate([{
        $match: req.query
    }, {
        $project: {
            "_id": 0,
            "Ticker": 1,
            "Return on Investment": 1
        }
    }]).sort({
        "Return on Investment": -1
    }).limit(5);
    res.status(200).json({
        success: true,
        data: report
    });
});