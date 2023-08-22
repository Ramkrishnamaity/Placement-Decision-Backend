//   **    Database connection through mongoose ODM    **     //

const mongoose = require('mongoose');

// load env data into process obj
require('dotenv').config();

const connectDB = async () => {
    mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(()=>{console.log('DB connected')})
    .catch((error)=>{
        console.log('Error connecting to MongoDB:', error.message)
        process.exit(1)
    })
};

module.exports = connectDB;