require('dotenv').config();
const express = require('express')
const router = express.Router();


const ejs = require('ejs');
const pdf = require('html-pdf')
const fs = require('fs')
const path = require('path')

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
            employeeId:employeeId,
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




//exportPdf
router.get('/downloadMonthlyAttendance/:employeeId/:month', async(req,res)=>{
    try{
  
      const { employeeId , month } = req.params;
  
        console.log("Export pdf ID = " , employeeId)
        // const currentDate = new Date();
        // const month = currentDate.getMonth() + 1; // getMonth() returns 0-11, so we add 1

        // Create a regex to match dates with the specific month
        // const monthRegex = new RegExp(`^\\d{1,2}/${month}/\\d{4}$`);
  
        // console.log("monthRegex = " , monthRegex)

        const monthFormatted = month.padStart(2, '0');
        const monthRegex = new RegExp(`^\\d{1,2}/${monthFormatted}/\\d{4}$`);
        console.log("monthRegex =", monthRegex);

        const formDoc = await EmployeeAttendance.find({ 
            employeeId: employeeId,
            date: { $regex: monthRegex }
        });

        console.log("formDoc = " , formDoc);

        if (!formDoc || formDoc.length === 0) {
            return res.status(404).send({ status: 0, message: 'No records found for the specified month.' });
        }
        
          const data = {
              formDoc : formDoc,
          };
  
          const filePathName = path.resolve(__dirname , '../ejs_files/empMonthlyAttendance.ejs');
          console.log("filePathName = " ,filePathName)
          const htmlString = fs.readFileSync(filePathName).toString();
          const options = {
            format: 'A3',
            orientation: 'landscape',
            margin: '10mm', // Set all margins to 0
            childProcessOptions: {
              env: { OPENSSL_CONF: '/dev/null' },
            },
          }  
          const ejsData = ejs.render(htmlString , data);
  
          // console.log("EJS Data:", ejsData);
        // console.log("Options used for PDF generation:", options);
        console.log("generating .. ")
  
  
          pdf.create(ejsData, options).toFile('./exportedPdfs/userForms.pdf', (err, response) => {
              if (err) {
                  console.log("Error->>>>>>>>>", err);
                  res.status(500).send(err);
              } else {
                  console.log('File generated');
                  res.send({ status : 1,  filePath: 'userForms.pdf' }); // Send the file path
              }
          });
  
       
        
       
    }catch(err){
        console.log(err.message)
        res.send({status : 0 , message : err.message})
    }
  })

module.exports = router;