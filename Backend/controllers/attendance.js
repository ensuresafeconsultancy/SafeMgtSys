require('dotenv').config();
const express = require('express')
const router = express.Router();

const authMiddleware = require('../Authentication/authMiddleware')

const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt');

const { Employee , EmployeeAttendance , Shift } = require('../schema/employeeSchema')
// const shiftSchema = require('../schema/shiftSchema')

const {authorize , uploadFile} = require('./gDrive')
const { upload , validateFileSize , deleteAllFiles } = require('./multerFileStorage')


router.get('/openFile/:fileId', async (req, res) => {
  try {
    const fileId = req.params.fileId; // Get file ID from request parameter

    console.log("fileId = " , fileId)
    const authClient = await authorize();
    const drive = google.drive({ version: 'v3', auth: authClient });

    const response = await drive.files.get({ fileId });
    const urlExtract = response.request.responseURL.split('/');
    console.log(urlExtract[urlExtract.length-1])

    if(urlExtract[urlExtract.length-1]){
      res.send({downloadUrl : urlExtract[urlExtract.length-1]})
    } else {
      res.status(404).send('File not found or unsupported format');
    }

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error'); // Handle errors
  }
});


// router.get("/checkInList/:employeeId" ,async(req, res)=>{
router.get("/checkInList", authMiddleware ,async(req, res)=>{
    try{

      // const { employeeId } = req.params;
      console.log(req.user);
      const { employeeId } = req.user;
      const { employeeName } = req.user;

      console.log("employeeId = " , employeeId)
      console.log("employeeName = " , employeeName)

      const dateAndTime = new Date();
      console.log("dateAndTime check time = " , dateAndTime.toLocaleTimeString())
      const currentDate = dateAndTime.toLocaleDateString();
      // const currentDate = '30/6/2024'

      const empCheckInList = await EmployeeAttendance.findOne({ employeeId: employeeId , date : currentDate });

      console.log("helllo")
      if(empCheckInList){
        console.log("empCheckInList = " , empCheckInList);
      }
      if (!empCheckInList) {

        const employeeData = await Employee.findOne({employeeId : employeeId });
        console.log("employeeData=" , employeeData)
        console.log("employeeData.shift=" , employeeData.shift)
        const shiftData = await Shift.findById(employeeData.shift);
        console.log("shiftData = " , shiftData)   
        
        
        // User not found, create a new user with the first record
        const userData = {
          employeeId: employeeId,
          employeeName : employeeName,
          date: currentDate,
          currentCheckIn: false,
          shift: shiftData.shiftName,
          shiftStartTime : shiftData.startTime,
          shiftEndTime : shiftData.endTime,
          records : [],
        };

        console.log("userData = " , userData)

        const newuser = new EmployeeAttendance(userData);
        console.log("trying to save..")
        console.log("newUser = " , newuser)
        try {
          const response = await newuser.save();
          console.log("saved successfuly");
          console.log("Userdata ", response);
          res.send({ status: 1, message: "success", empCheckInList: response });
        } catch (saveErr) {
          console.error("Error saving new user: ", saveErr);
          res.status(500).send({ status: 0, message: "Error saving new user", error: saveErr });
        }
        return; // Exit if user is created

      }
      res.send({status : 1 , empCheckInList : empCheckInList})

    }catch(err){
        res.send("some problem")
    }
})


router.post("/empCheckOut/:index" , async(req , res)=>{

  try{
    console.log("empCheckOut");

    const currentDateAndTime = new Date();
    // const empId = req.params.empId;
    const {employeeId} = req.user;
    const recordIndex = parseInt(req.params.index); // Convert index to a number

    // Find the employee record with matching empId and record index
    // const employee = await EmployeeAttendance.findOne({ empId : employeeId , currentCheckIn: true });
    const employee = await EmployeeAttendance.findOne({ employeeId : employeeId, date : currentDateAndTime.toLocaleDateString() , currentCheckIn: true });
    // const employee = await EmployeeAttendance.findOne({ empId : employeeId, date : '30/6/2024' , currentCheckIn: true });

    if (!employee) {
      console.error("Employee or record not found");
      return res.status(404).send({status : 0,  message: "Employee or record not found" });
    }

    // Get the specific record object using index
    const record = employee.records[recordIndex];

    if (!record) {
      console.error("Record index out of bounds");
      return res.status(400).send({status : 0,  message: "Record index out of bounds" });
    }

    // Update endTime and calculate totalTime (in minutes)
    record.endTime = currentDateAndTime.toLocaleTimeString();
    let endTimeUTC = currentDateAndTime;
    console.log("endTimeUTC = , ", endTimeUTC)
    console.log("record.createdAt.getTime() = , ", record.createdAt.getTime())
    console.log("endTimeUTC.getTime() = , ", endTimeUTC.getTime())

    const timeDiffMs = endTimeUTC.getTime() - record.createdAt.getTime();
    record.totalTime = Math.floor(timeDiffMs / (1000 * 60)); // Total time in minutes
    // record.totalTime = Math.floor((timeDiffMs % (1000 * 60)) / 1000);

    record.status = "Check out";
    employee.currentCheckIn = false;

    employee.totalTimeWorked += record.totalTime;
    

    console.log("timeDiffMs = " , timeDiffMs)

    // Update the employee record with the modified record
    const updatedEmployee = await employee.save();

    console.log("Check-out successful for employee:", employeeId);
    res.send({status : 1, message: "Check-out successful" , updatedEmployee : updatedEmployee});
        


    }catch(err){
      res.send({status : 0, message : "error"})
    }
})


router.post("/submitCheckInTime", upload.array('geoPhotos'), async (req, res) => {
  try {
    const { location } = req.body;

    const lateReason = req.body.lateReason;
    // const employeeId = req.body.empId;
    const { employeeId } = req.user;
    const { employeeName } = req.user;

    const employeeData = await Employee.findOne({employeeId : employeeId });;
    console.log("employeeData=" , employeeData)
    const shiftData = await Shift.findById(employeeData.shift);
    console.log("shiftData = " , shiftData)


    // Get current date and time (consider using moment.js for better formatting)
    const dateAndTime = new Date();
    console.log("dateAndTime check time = " , dateAndTime.toLocaleTimeString())
    const currentDate = dateAndTime.toLocaleDateString();
    const startTime = dateAndTime.toLocaleTimeString();
    // const startTime = dateAndTime;

    console.log("Current Date:", currentDate);
    console.log("Current Time:", startTime);

    const photoFiles = req.files; // Assume uploaded files are in req.files

    const photoFileIds = [];
    const photoFileNames = [];
    const authClient = await authorize(); // Assuming authorization logic

    for (const photo of photoFiles) {
      const fileLocation = photo.path;
      const mimeTypeParams = photo.mimetype;
      const fileId = await uploadFile(authClient, fileLocation, mimeTypeParams, photo.originalname);
      photoFileIds.push(fileId.data.id);
      photoFileNames.push(photo.originalname); // Optional: Store original filename
    }

    console.log("photoFileIds:", photoFileIds);
    console.log("photoFileNames:", photoFileNames);

    


    // if (employeeId === '2345') {
      // Find the user with empId 2345 (replace with your finding logic)
      // const user = await EmployeeAttendance.findOne({ empId: employeeId , date : '30/6/2024' });
      const user = await EmployeeAttendance.findOne({ employeeId: employeeId , date : currentDate });

      if (!user) {
        // User not found, create a new user with the first record
        const userData = {
          employeeId: employeeId,
          employeeName,
          date: currentDate,
          currentCheckIn: true,
          shift: shiftData.shiftName,
          shiftStartTime : shiftData.startTime,
          shiftEndTime : shiftData.endTime,
          records: [
            {
              location,
              startTime,
              endTime: '',
              totalTime: '',
              images: photoFileNames,
              imagesIds: photoFileIds,
              status: "Check In"
            }
          ]
        };
        const newUser = new EmployeeAttendance(userData);
        const response = await newUser.save();
        console.log(response);
        res.send({  status : 1 , message: "success" , updatedEmployee : response });
        return; // Exit if user is created
      }

      let shiftStartTime = shiftData.startTime;

      if(user.records.length == 0){
        const shiftStartTime = user.shiftStartTime;
        const findLate = calculateLateOrNot(shiftStartTime , dateAndTime)

        if(findLate.isLate){
          user.lateTime = findLate.timeDifference;
          if(req.body.lateReason){
            user.lateReason = req.body.lateReason;
          }
        }
      
      }

      if(user.currentCheckIn === true){
        res.status(500).send("Internal server error");
      }


      // User found, append the new record
      user.currentCheckIn = true;
      user.records.push({
        location,
        startTime,
        endTime: '',
        totalTime: '',
        images: photoFileNames,
        imagesIds: photoFileIds,
        status: "Check In"
      });

      const updatedEmployee = await user.save();
      console.log(user); // Updated user with appended record
      res.send({ status : 1 , message: "Record appended successfully" , updatedEmployee : updatedEmployee });
    // } 
    // else {
    //   // Handle case where empId is not 2345 (optional)
    //   console.log("Invalid empId");
    //   res.status(400).send("Invalid employee ID"); // Or handle differently
    // }

    deleteAllFiles('files'); // Assuming deletion of uploaded files

  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});


router.post("/addEmployee" , async(req,res)=>{

  try{

    let { shift } = req.body;

    console.log("shift = " , shift)

    let employeeId = 'efwe4t54tg5r';
    let employeeName = "Rajmohan";
    let employeeEmail = "rajmohan@gmail.com";
    let password = "rajmohan123";

    // let shiftId = "669b5b21059605890edb6865";

    console.log("helllo")
    

    const existingShift = await Shift.findById(shift); // Replace with actual shift ID

    if (existingShift) {
      console.log(existingShift.shiftName); // Access shift name
    } else {
      console.log('Shift not found');
    }
    console.log("helllo")

    // consoel.log(existingShift)

    console.log("helllo")


    if (!existingShift) {
      return res.status(400).json({ error: 'Invalid shift ID' });
    }
    console.log("helllo")

    const saltRounds = 10; // Adjust saltRounds based on security requirements
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    const newEmployee = new Employee({ employeeId: employeeId, employeeName: employeeName, employeeEmail : employeeEmail, password : hashedPassword,  shift : shift });
    const response = await newEmployee.save();
    if(response){
      console.log(response)
    }

    const fetchEmpdata= await Employee.findById(response._id);
    if(fetchEmpdata){
      console.log("fetchEmpdata = " , fetchEmpdata)
    }
   
    res.send({response})

  }catch(err){
    res.send("something went wrong sorrryyy")
  }

})

router.post("/addShift" , async(req,res)=>{

  try{

    let { shiftName , startTime , endTime } = req.body;

    console.log(shiftName , startTime , endTime)

    const newShift = new Shift({
      shiftName:shiftName  , startTime:startTime , endTime:endTime
    })


    const response = await newShift.save();
    if(response){
      console.log(response)
    }

    console.log(shiftName , startTime , endTime)
    res.send({response})

  }catch(err){
    res.send("something went wrong sorrryyy")
  }

})

const calculateLateOrNot = (shiftStartTime , dateAndTime)=>{

  const [shiftHour, shiftMinute] = shiftStartTime.split(':');
  const shiftHour24 = parseInt(shiftHour, 10);

  // Create Date objects for comparison
  const shiftTime = new Date();
  shiftTime.setHours(shiftHour24, parseInt(shiftMinute, 10));
  shiftTime.setMinutes(0);
  shiftTime.setSeconds(0);

  console.log("shiftTime = " , shiftTime)
  console.log("currentTime check = " , dateAndTime)

  const timeDifferenceInMilliseconds = dateAndTime - shiftTime;

  // Convert to seconds
  const totalSeconds = Math.floor(timeDifferenceInMilliseconds / 1000);

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Format the time difference
  const formattedTimeDifference = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  console.log("formattedTimeDifference = " , formattedTimeDifference)

  return {
    isLate: dateAndTime > shiftTime,
    timeDifference: formattedTimeDifference
  };

}



module.exports = router;

  // const data = {
    //     name : "balaji",
    //     date : "2024-07-18",
    //     records : [{
    //         location : "Neyveli",
    //         startTime : "01:45:47 pm",
    //         endTime : "01:50:47 pm",
    //         totalTime : "00:05:47",
    //         images : [ "efwefcde.jpg" , "efedfcerd.jpg" , "edwefdewdfc.png"],
    //         notes : "wrdwedcwedcfdc",
    //         status : "completed"
    //     }, {
    //         location : "Neyveli",
    //         startTime : "01:45:47 pm",
    //         endTime : "01:50:47 pm",
    //         totalTime : "00:05:47",
    //         images : [ "efwefcde.jpg" , "efedfcerd.jpg" , "edwefdewdfc.png"],
    //         notes : "wrdwedcwedcfdc",
    //         status : "completed"
    //     }
    //     ]
    // }
