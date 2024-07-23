// const mongoose = require('mongoose');

// const recordSchema = new mongoose.Schema({
//   location: String,
//   startTime: String, // Consider using Date type for better querying and calculations
//   endTime: String, // Consider using Date type for better querying and calculations
//   totalTime: { type: Number, default: 0 }, // Consider using Number type for calculations
//   images: [String],
//   imagesIds : [String],
//   notes: String,
//   status: String,
//   createdAt: { type: Date, default: Date.now }
// });

// const EmployeeAttendanceSchema = new mongoose.Schema({
//   employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true }, // Reference the Employee model
//   date: { type: Date, required: true },
//   currentCheckIn: Boolean,
//   shift: { type: mongoose.Schema.Types.ObjectId, ref: 'Shift', required: true }, // Reference the Shift model
//   totalTimeWorked: { type: Number, default: 0 },
//   lateTime: { type: Number, default: 0 },
//   overTime: { type: Number, default: 0 },
//   records: [recordSchema]
// });

// module.exports = mongoose.model('EmpAttendance' , EmployeeAttendanceSchema);