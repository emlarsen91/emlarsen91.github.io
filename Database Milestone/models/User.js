const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a username']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'editor'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt Password using bcrypt
UserSchema.pre('save', async function (next) {

    // Don't encrypt if password has not been modified for password reset
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

// Sign JWT and return
// Sign with the ID as the payload, secret is in the process.env, expires in 30 days as 
// also mentioned in process.env
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({
        id: this._id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

// Match password to the hashed password in Database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}


// Generate and hash password reset token and add it to the user in model
// Generate a password reset time
UserSchema.methods.getResetPasswordToken = function () {
    // Generate the token
    // Pseudo random generate a buffer for the hashing
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash the token we randomly generated, assign to resetpasswordtoken 
    // Uses the hash creation algorithm sha256 and updates it with our random token
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set the expiration of the token for half an hour after request
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    return resetToken
};


module.exports = mongoose.model('User', UserSchema);