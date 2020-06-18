const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const errorResponse = require('../utils/errorResponse');
const User = require('../models/User');


// Protect routes
// When added to the requests, blocks all non logged in requests by sending the unauthorized response if the token does not match
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    // If request has an authorization header and the header has a Bearer which indicates token is present
    // Assign the token to token variable
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Ensure token is existing and bearer isn't blank
    if (!token) {
        return next(new errorResponse('Not authorized to access this route', 401));
    }

    try {
        // Verify correct token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded);

        // User is assigned to find function of the decoded id
        req.user = await User.findById(decoded.id);

        next();

    } catch (error) {
        return next(new errorResponse('Not authorized to access this route', 401));
    }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new errorResponse(`User role ${req.user.role} is unauthorized to access this route`, 403));
        }
        next();
    }
}