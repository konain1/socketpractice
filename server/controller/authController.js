// controllers/authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // Assume User is your User model in your database

const register = async (req, res) => {

  console.log('Incoming data:', req.body);

try {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  // Save the user to the database
  await newUser.save();

  // Send response
  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    },
  });
} catch (err) {
  console.error('Error during registration:', err.message, err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
}

  
};

module.exports = register