require('dotenv').config();
const express = require('express')
const router = express.Router();

const { EmployeeAttendance } = require('../../schema/employeeSchema')

router.get('/fetchEmployeeAttendance' , async(req , res)=>{
    try{

        const todayDate = new Date();
        const attendanceList = await EmployeeAttendance.find({
            date: todayDate.toLocaleDateString()
        });       
        console.log("attendanceList = " , attendanceList) 
        if (!attendanceList) {
            return res.status(404).json({status : 0 , message: 'No attendance record found' });
        }
        res.status(200).json(attendanceList);

    }catch(err){
        res.status(500).json({ message: 'Error fetching attendance' });
    }
})


// router.get('/fetchEmployeeAttendanceRecords/:empId/:date' , async(req, res)=>{
router.post('/fetchEmployeeAttendanceRecords' , async(req, res)=>{
    try{

        const todayDate = new Date();
        const { employeeId } = req.user;

        const attendanceRecord = await EmployeeAttendance.findOne({
            empId:employeeId,
            date: todayDate.toLocaleDateString()
          });

        console.log(employeeId , todayDate.toLocaleDateString())

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