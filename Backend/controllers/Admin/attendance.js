require('dotenv').config();
const express = require('express')
const router = express.Router();

const { EmployeeAttendance } = require('../../schema/employeeSchema')


// router.get('/fetchEmployeeAttendanceRecords/:empId/:date' , async(req, res)=>{
router.post('/fetchEmployeeAttendanceRecords' , async(req, res)=>{
    try{

        const { empId , date} = req.body;

        const attendanceRecord = await EmployeeAttendance.findOne({
            date: date 
          });


    
        console.log(empId , date)

        if (!attendanceRecord) {
            return res.status(404).json({status : 0 , message: 'No attendance record found' });
        }

   
        // res.send({status : 1 , attendanceRecord: attendanceRecord.records })
      
        res.status(200).json(attendanceRecord.records);

    }catch(err){
        res.status(500).json({ message: 'Error fetching attendance record' });
    }
})

module.exports = router;