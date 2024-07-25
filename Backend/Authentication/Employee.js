
require('dotenv').config();
const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');


const jwt = require('jsonwebtoken');

const { Employee } = require('../schema/employeeSchema')


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
      const employee = await Employee.findOne({ employeeEmail: { $regex: new RegExp(email, 'i') } });
  
      // Check if employee exists and passwords match
      if (!employee || !(await bcrypt.compare(password, employee.password))) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
  
      // Generate JWT token with employee ID and role (if applicable)
      const token = jwt.sign({ employeeId: employee._id, employeeName : employee.employeeName,  role: employee.role }, process.env.JWT_SECRET, { expiresIn: '1d' }); // Adjust expiration time as needed
  
      console.log("sucesss")
      res.json({ message: 'Login successful!', token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error occurred.' });
    }
  });
  
module.exports = router;