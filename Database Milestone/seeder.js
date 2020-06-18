const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//Load env vars
dotenv.config({
    path: './config/config.env'
});

// Load mode
const Stock = require('./models/stock');

// Connect to db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

// Read JSON files
const stocks = JSON.parse(fs.readFileSync(`${__dirname}/stocks.json`, 'utf-8'));

// Import data into DB
const importData = async () => {
    try {
        await Stock.create(stocks);
        console.log('Data Imported...'.green.inverse);
        process.exit
    } catch (error) {
        console.error(error);
    }
}

const deleteData = async () => {
    try {
        await Stock.deleteMany();
        console.log('Data Deleted...'.red.inverse);
        process.exit
    } catch (error) {
        console.error(error);
    }
}

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}