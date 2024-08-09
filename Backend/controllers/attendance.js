require('dotenv').config();
const express = require('express')
const router = express.Router();

const authMiddleware = require('../Authentication/authMiddleware')

const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt');

const { Employee , EmployeeAttendance , Shift } = require('../schema/employeeSchema')
// const shiftSchema = require('../schema/shiftSchema')

const { getCurrentDateTime } = require('./CurrentDateTime')



// router.get("/checkInList/:employeeId" ,async(req, res)=>{
  router.get("/checkInList", authMiddleware ,async(req, res)=>{
    try{

      // const { employeeId } = req.params;
      console.log(req.user);
      const { employeeId } = req.user;
      const { employeeName } = req.user;

      console.log("employeeId = " , employeeId)
      console.log("employeeName = " , employeeName)


      const { currentDate } = getCurrentDateTime();
 

      console.log('---------------')


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



router.post("/empCheckOut/:index", async (req, res) => {
  try {
    console.log("empCheckOut");

    const { address, distance } = req.body;
    console.log("address, distance =", address, distance);

    const { currentDate, currentTime } = getCurrentDateTime();  // Assuming this is correctly defined
    const { employeeId } = req.user;
    const recordIndex = parseInt(req.params.index);

    const employee = await EmployeeAttendance.findOne({ employeeId, date: currentDate, currentCheckIn: true });

    if (!employee) {
      console.error("Employee or record not found");
      return res.status(404).send({ status: 0, message: "Employee or record not found" });
    }

    const record = employee.records[recordIndex];

    if (!record) {
      console.error("Record index out of bounds");
      return res.status(400).send({ status: 0, message: "Record index out of bounds" });
    }

    record.checkOutAddress = address;
    record.checkOutDistance = distance;
    record.endTime = currentTime;

    const timeZone = process.env.TIMEZONE || 'UTC';

    const currentDateAndTime = moment().tz(timeZone);
    const createdAtInTimeZone = moment(record.createdAt).tz(timeZone);

    const timeDiffMs = currentDateAndTime.diff(createdAtInTimeZone);
    record.totalTime = Math.floor(timeDiffMs / (1000 * 60)); // Total time in minutes

    record.status = "Check out";
    employee.currentCheckIn = false;
    employee.totalTimeWorked += record.totalTime;

    console.log("Check-out successful for employee:", employeeId);
    console.log("endTimeUTC =", currentDateAndTime.toString());
    console.log("record.createdAt =", createdAtInTimeZone.toString());
    console.log("timeDiffMs =", timeDiffMs);

    const updatedEmployee = await employee.save();

    res.send({ status: 1, message: "Check-out successful", updatedEmployee });

  } catch (err) {
    console.error("Error during check-out:", err.message);
    res.status(500).send({ status: 0, message: "Internal server error" });
  }
});

  

// router.post("/empCheckOut/:index" , async(req , res)=>{

//   try{
//     console.log("empCheckOut");

//     const { address , distance } = req.body;
//     console.log("address , distance = " , address , distance)


//     // const currentDateAndTime = new Date();
//     const { currentDate, currentTime } = getCurrentDateTime();

//     const {employeeId} = req.user;
//     const recordIndex = parseInt(req.params.index); // Convert index to a number

//     const employee = await EmployeeAttendance.findOne({ employeeId : employeeId, date : currentDate , currentCheckIn: true });
//     // const employee = await EmployeeAttendance.findOne({ empId : employeeId, date : '30/6/2024' , currentCheckIn: true });

//     if (!employee) {
//       console.error("Employee or record not found");
//       return res.status(404).send({status : 0,  message: "Employee or record not found" });
//     }

//     // Get the specific record object using index
//     const record = employee.records[recordIndex];

//     if (!record) {
//       console.error("Record index out of bounds");
//       return res.status(400).send({status : 0,  message: "Record index out of bounds" });
//     }

//     // Update endTime and calculate totalTime (in minutes)
//     record.checkOutAddress = address;
//     record.checkOutDistance = distance;
//     console.log("record.checkOutAddress = " , record.checkOutAddress)
//     record.endTime = currentTime

//     const timeZone = process.env.TIMEZONE || 'UTC';

//       // Get the current date and time in the specified time zone
//       const currentDateAndTime = moment().tz(timeZone);

//       // Convert `createdAt` to the desired time zone
//       const createdAtInTimeZone = moment(record.createdAt).tz(timeZone);

//       // Calculate the difference in milliseconds
//       const timeDiffMs = currentDateAndTime.diff(createdAtInTimeZone);

//       // Convert the difference to minutes
//       record.totalTime = Math.floor(timeDiffMs / (1000 * 60)); // Total time in minutes

//       // Update status and employee records
//       record.status = "Check out";
//       employee.currentCheckIn = false;
//       employee.totalTimeWorked += record.totalTime;

//       console.log("endTimeUTC =", currentDateAndTime.toString());
//       console.log("record.createdAt =", createdAtInTimeZone.toString());
//       console.log("timeDiffMs =", timeDiffMs);

//     // let endTimeUTC = currentDateAndTime;
//     // console.log("endTimeUTC = , ", endTimeUTC)
//     // console.log("record.createdAt.getTime() = , ", record.createdAt.getTime())
//     // console.log("endTimeUTC.getTime() = , ", endTimeUTC.getTime())
//     // let endTimeUTC = currentDateAndTime;
//     // console.log("endTimeUTC = , ", endTimeUTC)
//     // console.log("record.createdAt.getTime() = , ", record.createdAt.getTime())
//     // console.log("endTimeUTC.getTime() = , ", endTimeUTC.getTime())

//     // const timeDiffMs = endTimeUTC.getTime() - record.createdAt.getTime();
//     // record.totalTime = Math.floor(timeDiffMs / (1000 * 60)); // Total time in minutes
//     // record.totalTime = Math.floor((timeDiffMs % (1000 * 60)) / 1000);

//     // record.status = "Check out";
//     // employee.currentCheckIn = false;

//     // employee.totalTimeWorked += record.totalTime;
    

//     // console.log("timeDiffMs = " , timeDiffMs)

//     // Update the employee record with the modified record
//     const updatedEmployee = await employee.save();

//     console.log("Check-out successful for employee:", employeeId);
//     res.send({status : 1, message: "Check-out successful" , updatedEmployee : updatedEmployee});
        


//     }catch(err){
//       res.send({status : 0, message : "error"})
//     }
// })



router.post("/submitCheckInTime", async (req, res) => {
  try {
    const { location, address, distance } = req.body;
    console.log("location, address, distance =", location, address, distance);
    const { employeeId, employeeName } = req.user;

    const employeeData = await Employee.findOne({ employeeId });
    if (!employeeData) {
      return res.status(404).send("Employee not found");
    }

    const shiftData = await Shift.findById(employeeData.shift);
    if (!shiftData) {
      return res.status(404).send("Shift not found");
    }

    const { currentDate, currentTime } = getCurrentDateTime();
    const currentDateTime = moment();  // Use moment() to get the current moment in time

    console.log("Current Date:", currentDate);
    console.log("Current Time:", currentTime);

    let user = await EmployeeAttendance.findOne({ employeeId, date: currentDate });

    if (!user) {
      const userData = {
        employeeId,
        employeeName,
        date: currentDate,
        currentCheckIn: true,
        shift: shiftData.shiftName,
        shiftStartTime: shiftData.startTime,
        shiftEndTime: shiftData.endTime,
        records: [
          {
            location,
            startTime: currentTime,
            endTime: '',
            totalTime: '',
            checkInAddress: address,
            checkInDistance: distance,
            checkOutAddress: '',
            checkOutDistance: '',
            status: "Check In"
          }
        ]
      };
      const newUser = new EmployeeAttendance(userData);
      const response = await newUser.save();
      console.log(response);
      res.send({ status: 1, message: "success", updatedEmployee: response });
      return;
    }

    if (user.records.length === 0) {
      const shiftStartTime = user.shiftStartTime;
      const findLate = calculateLateOrNot(shiftStartTime, currentDateTime);

      if (findLate.isLate) {
        user.lateTime = findLate.timeDifference;
        if (req.body.lateReason) {
          user.lateReason = req.body.lateReason;
        }
      }
    }

    if (user.currentCheckIn === true) {
      return res.status(500).send("Internal server error");
    }

    user.currentCheckIn = true;
    user.records.push({
      location,
      startTime: currentTime,
      endTime: '',
      totalTime: '',
      checkInAddress: address,
      checkInDistance: distance,
      checkOutAddress: '',
      checkOutDistance: '',
      status: "Check In"
    });

    const updatedEmployee = await user.save();
    console.log(user);
    res.send({ status: 1, message: "Record appended successfully", updatedEmployee });

  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});


const calculateLateOrNot = (shiftStartTime, currentDateTime) => {
  const timeZone = process.env.TIMEZONE || 'UTC'; // Use the specified time zone or default to UTC

  // Parse the shift start time and convert to the desired time zone
  const [shiftHour, shiftMinute] = shiftStartTime.split(':');
  const shiftTime = moment.tz({ hour: shiftHour, minute: shiftMinute }, timeZone);

  // Convert current date and time to the same time zone
  const currentTime = moment.tz(currentDateTime, timeZone);

  console.log("Shift Time =", shiftTime.format('HH:mm:ss'));
  console.log("Current Time =", currentTime.format('HH:mm:ss'));

  const timeDifferenceInMilliseconds = currentTime.diff(shiftTime);

  // Convert to total seconds
  const totalSeconds = Math.floor(timeDifferenceInMilliseconds / 1000);

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Format the time difference
  const formattedTimeDifference = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  console.log("Formatted Time Difference =", formattedTimeDifference);

  return {
    isLate: currentTime.isAfter(shiftTime),
    timeDifference: formattedTimeDifference,
  };
};








// router.post("/submitCheckInTime", async (req, res) => {
//   try {
//     const { location, address, distance } = req.body;
//     console.log("location, address, distance = " , location, address, distance)
//     const { employeeId, employeeName } = req.user;

//     const employeeData = await Employee.findOne({ employeeId });
//     if (!employeeData) {
//       return res.status(404).send("Employee not found");
//     }

//     // Fetch shift data
//     const shiftData = await Shift.findById(employeeData.shift);
//     if (!shiftData) {
//       return res.status(404).send("Shift not found");
//     }

//     // Get current date and time (consider using moment.js for better formatting)
//     const dateAndTime = new Date();
//     console.log("dateAndTime check time = " , dateAndTime.toLocaleTimeString())
//     const currentDate = dateAndTime.toLocaleDateString();
//     const startTime = dateAndTime.toLocaleTimeString();
//     // const startTime = dateAndTime;

//     console.log("Current Date:", currentDate);
//     console.log("Current Time:", startTime);


//       const user = await EmployeeAttendance.findOne({ employeeId: employeeId , date : currentDate });

//       if (!user) {
//         // User not found, create a new user with the first record
//         const userData = {
//           employeeId: employeeId,
//           employeeName,
//           date: currentDate,
//           currentCheckIn: true,
//           shift: shiftData.shiftName,
//           shiftStartTime : shiftData.startTime,
//           shiftEndTime : shiftData.endTime,
//           records: [
//             {
//               location,
//               startTime,
//               endTime: '',
//               totalTime: '',
//               checkInAddress : address,
//               checkInDistance : distance,
//               checkOutAddress : '',
//               checkOutDistance : '',
//               status: "Check In"
//             }
//           ]
//         };
//         const newUser = new EmployeeAttendance(userData);
//         const response = await newUser.save();
//         console.log(response);
//         res.send({  status : 1 , message: "success" , updatedEmployee : response });
//         return; // Exit if user is created
//       }

//       if(user.records.length == 0){
//         const shiftStartTime = user.shiftStartTime;
//         const findLate = calculateLateOrNot(shiftStartTime , dateAndTime)

//         if(findLate.isLate){
//           user.lateTime = findLate.timeDifference;
//           if(req.body.lateReason){
//             user.lateReason = req.body.lateReason;
//           }
//         }
//       }

//       if(user.currentCheckIn === true){
//         return res.status(500).send("Internal server error");
//       }


//       // User found, append the new record
//       user.currentCheckIn = true;
//       user.records.push({
//         location,
//         startTime,
//         endTime: '',
//         totalTime: '',
//         checkInAddress : address,
//         checkInDistance : distance,
//         checkOutAddress : '',
//         checkOutDistance : '',
//         status: "Check In"
//       });

//       const updatedEmployee = await user.save();
//       console.log(user); // Updated user with appended record
//       res.send({ status : 1 , message: "Record appended successfully" , updatedEmployee : updatedEmployee });


//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal server error");
//   }
// });


// const calculateLateOrNot = (shiftStartTime , dateAndTime)=>{

//   const [shiftHour, shiftMinute] = shiftStartTime.split(':');
//   const shiftHour24 = parseInt(shiftHour, 10);

//   // Create Date objects for comparison
//   const shiftTime = new Date();
//   shiftTime.setHours(shiftHour24, parseInt(shiftMinute, 10));
//   shiftTime.setMinutes(0);
//   shiftTime.setSeconds(0);

//   console.log("shiftTime = " , shiftTime)
//   console.log("currentTime check = " , dateAndTime)

//   const timeDifferenceInMilliseconds = dateAndTime - shiftTime;

//   // Convert to seconds
//   const totalSeconds = Math.floor(timeDifferenceInMilliseconds / 1000);

//   // Calculate hours, minutes, and seconds
//   const hours = Math.floor(totalSeconds / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;

//   // Format the time difference
//   const formattedTimeDifference = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

//   console.log("formattedTimeDifference = " , formattedTimeDifference)

//   return {
//     isLate: dateAndTime > shiftTime,
//     timeDifference: formattedTimeDifference
//   };

// }

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
