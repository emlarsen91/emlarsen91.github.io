const mongoose = require('mongoose');
//const slugify = require('slugify');

// Assign the information for a stock, Only ticker is required
// The symbol must be unique and a max of 5 letters per standard stock ticker criteria
const StockSchema = new mongoose.Schema({
    Ticker: {
        type: String,
        required: [true, 'Please add a ticker symbol'],
        unique: true,
        maxlength: [5, 'Maximum ticker length is 5 characters']
    },
    slug: String,
    "Profit Margin": Number,
    "Institutional Ownership": Number,
    "EPS growth past 5 years": Number,
    "Total Debt/Equity": Number,
    "Current Ratio": Number,
    "Return on Assets": Number,
    "Sector": String,
    "P/S": Number,
    "Change from Open": Number,
    "Performance (YTD)": Number,
    "Performance (Week)": Number,
    "Quick Ratio": Number,
    "Insider Transactions": Number,
    "P/B": Number,
    "EPS growth quarter over quarter": Number,
    "Payout Ratio": Number,
    "Performance (Quarter)": Number,
    "Forward P/E": Number,
    "P/E": Number,
    "200-Day Simple Moving Average": Number,
    "Shares Outstanding": Number,
    "52-Week High": Number,
    "P/Cash": Number,
    "Change": Number,
    "Analyst Recom": Number,
    "Volatility (Week)": Number,
    "Country": String,
    "Return on Equity": Number,
    "50-Day Low": Number,
    "Price": Number,
    "50-Day High": Number,
    "Return on Investment": Number,
    "Shares Float": Number,
    "Dividend Yield": Number,
    "EPS growth next 5 years": Number,
    "Industry": String,
    "Beta": Number,
    "Sales growth quarter over quarter": Number,
    "Operating Margin": Number,
    "EPS (ttm)": Number,
    "PEG": Number,
    "Float Short": Number,
    "52-Week Low": Number,
    "Average True Range": Number,
    "EPS growth next year": Number,
    "Sales growth past 5 years": Number,
    "Company": String,
    "Gap": Number,
    "Relative Volume": Number,
    "Volatility (Month)": Number,
    "Market Cap": Number,
    "Volume": Number,
    "Gross Margin": Number,
    "Short Ratio": Number,
    "Performance (Half Year)": Number,
    "Relative Strength Index (14)": Number,
    "Insider Ownership": Number,
    "20-Day Simple Moving Average": Number,
    "Performance (Month)": Number,
    "P/Free Cash Flow": Number,
    "Institutional Transactions": Number,
    "Performance (Year)": Number,
    "LT Debt/Equity": Number,
    "Average Volume": Number,
    "EPS growth this year": Number,
    "50-Day Simple Moving Average": Number
});

// // Create slug from name
// StockSchema.pre('save', function () {
//     this.slug = slugify(this.Ticker);
// });

module.exports = mongoose.model('Stock', StockSchema);