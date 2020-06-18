const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

// Route Files
const stocks = require('./routes/stocks');
const industryReport = require('./routes/industryReport');
const auth = require('./routes/auth');

// Load env vars
dotenv.config({
    path: './config/config.env',
});

// Connect to Database
connectDB();

const app = express();

// Body parser to read body of request
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Mongo Sanitize  Helps prevent issues with regards to noSQL injections
// Prevents someone from being able to log in by just guessing a random user password
app.use(mongoSanitize());

// Rate limiting.  Keeps an IP from being able to flood the system with requests
// Every 10 minute window, only 50 requests can be made from an ip
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 50
});
app.use(limiter);

//Dev Logging Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Mount routers
app.use('/stocks', stocks);
app.use('/industryReport', industryReport);
app.use('/auth', auth);

app.use(errorHandler);
const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
        .bold
    )
);

// Handle unhandled promise rejections, close server if not authenticated
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    server.close(() => process.exit(1));
});