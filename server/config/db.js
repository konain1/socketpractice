// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {


    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection;

    console.log('connected db')


    db.on('connected', () => console.log('MongoDB is connected'));
    db.on('error', (err) => console.log('MongoDB error:', err));
    db.on('disconnected', () => console.log('MongoDB is disconnected'));
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;