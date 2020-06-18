//Route to assign the URI to a request
//Takes all of our controllers and assigns a route
//No information is only for a post to create a stock
//An associated Ticker is for getting a stock, updating or deleting a stock

const express = require('express');
const {
    getStock,
    createStock,
    deleteStock,
    updateStock
} = require('../controllers/stocks');
const router = express.Router();

const {
    protect,
    authorize
} = require('../middleware/auth');

router.route('/').post(protect, authorize('editor'), createStock);

router.route('/:Ticker').get(getStock).put(protect, authorize('editor'), updateStock).delete(protect, authorize('editor'), deleteStock);

module.exports = router;