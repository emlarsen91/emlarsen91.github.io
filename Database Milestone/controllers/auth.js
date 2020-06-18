const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc        Register user
// @route       POST /auth/register
// @access      Public
exports.register = asyncHandler(async (req, res, next) => {
    // Get name, email, password and role from the request body
    const {
        name,
        email,
        password,
        role
    } = req.body;

    //Create user
    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    sendTokenResponse(user, 200, res);
});

// @desc        Login user
// @route       POST /auth/Login
// @access      Public
exports.login = asyncHandler(async (req, res, next) => {
    // Get email and password from request body to login
    const {
        email,
        password
    } = req.body;

    // Validate user email and password
    if (!email || !password) {
        return next(
            new ErrorResponse('Please provide an email and password', 400)
        );
    }

    // Check for user
    const user = await User.findOne({
        email,
    }).select('+password');

    if (!user) {
        return next(
            new ErrorResponse('Invalid Credentials.  Please Try Again', 401)
        );
    }

    // Chack matched password between input and database
    const isMatched = await user.matchPassword(password);

    if (!isMatched) {
        return next(
            new ErrorResponse('Invalid Credentials.  Please Try Again', 401)
        );
    }

    sendTokenResponse(user, 200, res);
});

// @desc        Get current logged in user
// @route       GET /auth/me
// @access      Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc        Forgot password
// @route       POST /auth/forgotpassword
// @access      Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({
        email: req.body.email,
    });

    if (!user) {
        return next(new ErrorResponse('There is no user with that email', 404));
    }

    //Get Reset Token
    const resetToken = user.getResetPasswordToken();

    await user.save({
        validateBeforeSave: false,
    });

    // After Token has been created, send the token in an email to the user
    // URL that will be used to reset password
    const resetUrl = `${req.protocol}://${req.get(
        'host'
    )}/auth/resetPassword/${resetToken}`;

    // Message that will be sent
    const message = `This message is sent because a password reset request has been sent.  Please make PUT request to: \n\n ${resetUrl}`;

    // Attempt to send email to email associated with user
    // If email fails undo creation of token
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message,
        });

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.log(error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({
            validateBeforeSave: false,
        });
        return next(new ErrorResponse('Email could not be sent', 500));
    }

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc        Change password
// @route       PUT /auth/resetpassword/:resetToken
// @access      Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // Get token using same creation method
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');

    // Check db for user, ensure that token matches and has not expired
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {
            $gt: Date.now(),
        },
    });

    // Error if no matching user
    if (!user) {
        return next(new ErrorResponse('Invalid token', 400));
    }

    // Set new password and remove token info
    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    // Save the user with the new info
    await user.save();

    // Send info as if user logged in from the password reset
    sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
    });
};