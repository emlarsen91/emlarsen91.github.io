const Stock = require('../models/stock');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc        Get a stock from the ticker
// @route       GET /stocks/:Ticker
// @access      Public
exports.getStock = asyncHandler(async (req, res, next) => {
    const stock = await Stock.find({
        'Ticker': req.params.Ticker
    });

    //If stock is not found return not found error response
    if (!stock) {
        return next(
            new ErrorResponse(`Stock not found with ticker of ${req.params.Ticker}`, 404)
        );
    }

    // Return success code and data associated with searched for stock
    res.status(200).json({
        success: true,
        data: stock
    });
});

// @desc        Create a stock
// @route       POST /stocks
// @access      Private
exports.createStock = asyncHandler(async (req, res, next) => {
    // Create the stock with the body of the request
    const stock = await Stock.create(req.body);

    // Return the success code with the data that was entered into the db
    res.status(201).json({
        success: true,
        data: stock
    });
});

// @desc        Delete a stock
// @route       DELETE /stocks/:Ticker
// @access      Private
exports.deleteStock = asyncHandler(async (req, res, next) => {
    const stock = await Stock.findOneAndDelete({
        "Ticker": req.params.Ticker
    });

    // If document not present return 404 error
    if (!stock) {
        return next(
            new ErrorResponse(`Stock not found with ticker of ${req.params.Ticker}`, 404)
        );
    }

    // Return success status with the empty dataset
    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc        Update a stock
// @route       PUT /stocks/:Ticker
// @access      Private
exports.updateStock = asyncHandler(async (req, res, next) => {
    //Update stock from Ticker, use info from body to update
    const stock = await Stock.findOneAndUpdate({
        'Ticker': req.params.Ticker
    }, req.body, {
        new: true,
        runValidators: true
    });

    // Error for if stock does not exist
    if (!stock) {
        return next(
            new ErrorResponse(`Stock not found with ticker of ${req.params.Ticker}`, 404)
        );
    }

    // Return success status and updated information
    res.status(200).json({
        success: true,
        data: stock
    });
});