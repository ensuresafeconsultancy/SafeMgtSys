require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// require('dotenv').config(); // Load environment variables

const ATTENDANCE = require('./controllers/attendance');
const ADMIN_ATTENDANCE = require('./controllers/Admin/attendance');
const ADMIN_EMPLOYEES = require('./controllers/Admin/employees');
// const REGISTER_EMPLOYEE = require('./controllers/Admin/registerEmployee');

const EMPLOYEE_AUTH = require('./Authentication/Employee');
const ADMIN_AUTH = require('./Authentication/Admin');

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration (adjust as needed)
app.use(cors());
app.use(express.static('exportedPdfs')) // or this
const fs = require('fs').promises; // Using promises for asynchronous operations
const path = require('path');
const uploadFolder = path.join(__dirname, 'files'); // Adjust based on your project structure


app.use(async (req, res, next) => {
  try {
    await fs.access(uploadFolder); // Check if folder exists
  } catch (err) {
    if (err.code === 'ENOENT') { // Folder doesn't exist, create it
      await fs.mkdir(uploadFolder, { recursive: true }); // Create folder recursively
      console.log(`Upload folder created: ${uploadFolder}`);
    } else {
      console.error('Error checking/creating upload folder:', err);
    }
  }

  next(); // Continue request processing
});

// Parse JSON and URL-encoded bodies

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()); // Parse incoming JSON data

// MongoDB connection with error handling
// mongoose.connect('mongodb://127.0.0.1:27017/DailyAttendance')
//   .then(() => console.log('Connected to MongoDB')) 
//   .catch(err => console.error('MongoDB connection error:'));


try{
  mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected!'))
  .catch((err)=>{
    console.log("Database not connected")
  })

}catch(err){
  console.log("Db not connected")
}
  

// Mount attendance routes
const authMiddleware = require('./Authentication/authMiddleware'); // Assuming authMiddleware is in a separate file

// app.use('/attendance', ATTENDANCE);
app.use('/attendance', authMiddleware, ATTENDANCE);
app.use('/admin/attendance', authMiddleware , ADMIN_ATTENDANCE);
app.use('/admin/employees', authMiddleware , ADMIN_EMPLOYEES);
// app.use('/admin/registerEmployees', authMiddleware , REGISTER_EMPLOYEE);

app.use('/auth/employeeAuth', EMPLOYEE_AUTH);
app.use('/auth/adminAuth', ADMIN_AUTH);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
