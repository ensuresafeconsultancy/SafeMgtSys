
require('dotenv').config();
const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');



const jwt = require('jsonwebtoken');

const { Admin } = require('../schema/adminSchema')


router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      console.log("got login req")
      console.log(email, password)
  
      // Validate email and password presence
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }
  
      // Find the employee by email (case-insensitive)
      const admin = await Admin.findOne({ adminEmail: { $regex: new RegExp(email, 'i') } });
  
      // Check if employee exists and passwords match
      if (!admin || !(await bcrypt.compare(password, admin.password))) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
  
      // Generate JWT token with employee ID and role (if applicable)
      const token = jwt.sign({ adminId: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' }); // Adjust expiration time as needed
  
      console.log("sucesss")
      res.json({ message: 'Login successful!', token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error occurred.' });
    }
  });



  router.post('/register' , async(req, res)=>{
    try {
      const { adminName, adminEmail, password } = req.body;

      const adminId = generateAdminId(adminName , adminEmail);
  
      console.log(adminName, adminEmail, password , adminId )
      // Validation
  
      // Check for missing fields
      if (!adminId || !adminName || !adminEmail || !password) {
        return res.status(400).json({ message: 'Please fill in all required fields.' });
      }
  
      // Email format validation (optional)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(adminEmail)) {
        return res.status(400).json({ message: 'Invalid email format.' });
      }
  
      // Check for existing admin with the same ID (optional)
      const existingAdmin = await Admin.findOne({ adminId });
      if (existingAdmin) {
        return res.status(409).json({ message: 'Admin ID already exists.' });
      }
  
      // Password validation (optional)
      if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
      }
  
      // Hash password using bcrypt
      const saltRounds = 10; // Adjust salt rounds as needed
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Create new admin object with hashed password
      const newAdmin = new Admin({
        adminId,
        adminName,
        adminEmail,
        password: hashedPassword,
      });
  
      // Save admin data to database
      await newAdmin.save();

      console.log("admin registered")
  
      res.status(201).json({ message: 'Admin registered successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error occurred.' });
    }
  });
  

  function generateAdminId(adminName, adminEmail) {
    // Extract first three characters of adminName and last three characters of adminEmail
    const namePart = adminName.substring(0, 3).toUpperCase();
    const emailPart = adminEmail.substring(adminEmail.length - 3).toLowerCase();
  
    // Generate a random four-digit number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
  
    // Combine parts to form adminId
    const adminId = `${namePart}${emailPart}${randomNum}`;
  
    return adminId;
  }
  
module.exports = router;