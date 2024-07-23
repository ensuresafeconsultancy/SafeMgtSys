const mongoose = require('mongoose');
const moment = require('moment');

const employeeSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true }, // Ensure unique employee IDs
  shift: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shift', // Reference the Shift model
    required: true
  },

});

const recordSchema = new mongoose.Schema({
    location: String,
    startTime: String, // Consider using Date type for better querying and calculations
    endTime: String, // Consider using Date type for better querying and calculations
    totalTime: { type: Number, default: 0 }, // Consider using Number type for calculations
    images: [String],
    imagesIds : [String],
    notes: String,
    status: String,
    createdAt: { type: Date, default: Date.now }
});
  
const employeeAttendanceSchema = new mongoose.Schema({
    empId :  {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee', // Reference the Employee model
      required: true
    },
    date: String, // Consider using Date type for better querying
    currentCheckIn : Boolean,
    shift : String,
    shiftStartTime : String,
    shiftEndTime : String,
    totalTimeWorked : { type: Number, default: 0 },
    lateTime : String,
    overTime : { type: Number, default: 0 },
    records: [recordSchema],
    lateReason : String,
});

const shiftSchema = new mongoose.Schema({
  shiftName: { type: String, required: true},
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});


module.exports = {
    Employee: mongoose.model('Employee', employeeSchema),
    EmployeeAttendance: mongoose.model('EmployeeAttendance', employeeAttendanceSchema),
    Shift :  mongoose.model('Shift', shiftSchema),
};






// Custom validation for time format
// shiftSchema.path('startTime').validate(function(value) {
//   return /^\d{2}:\d{2} [AP]M$/.test(value);
// }, 'Invalid time format');

// shiftSchema.path('endTime').validate(function(value) {
//   return /^\d{2}:\d{2} [AP]M$/.test(value);
// }, 'Invalid time format');

// // Example of time calculation using moment.js
// shiftSchema.methods.getDuration = function() {
//   const startTimeMoment = moment(this.startTime, 'hh:mm A');
//   const endTimeMoment = moment(this.endTime, 'hh:mm A');
//   const duration = moment.duration(endTimeMoment.diff(startTimeMoment));
//   return duration.asHours(); // Or any other desired unit
// };






// empId : String,
// date: { type: Date, required: true },
// currentCheckIn: Boolean,
// totalTimeWorked: { type: Number, default: 0 },
// lateTime: { type: Number, default: 0 },
// overTime: { type: Number, default: 0 },
// records: [recordSchema]
// employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true }, // Reference the Employee model
// shift: { type: mongoose.Schema.Types.ObjectId, ref: 'Shift', required: true }, // Reference the Shift model
  

// const shiftSchema = new mongoose.Schema({
//     name: { type: String, required: true, unique: true }, // Ensure unique shift names
//     startTime: { type: Date, required: true },
//     endTime: { type: Date, required: true },
// });
  