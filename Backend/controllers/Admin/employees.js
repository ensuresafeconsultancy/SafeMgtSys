require('dotenv').config();
const express = require('express')
const router = express.Router();
const multer  = require('multer')
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')

const canvas = require('canvas');
const faceapi = require('face-api.js');
const { Canvas, Image, ImageData } = canvas;

const SingleFaceData = require('../../schema/SingleFaceData');

faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const { Employee , Shift } = require('../../schema/employeeSchema')

const { deleteAllFiles } = require('../multerFileStorage')

const loadModels = async () => {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(__dirname, '../../models'));
    await faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(__dirname, '../../models'));
    await faceapi.nets.faceRecognitionNet.loadFromDisk(path.join(__dirname, '../../models'));
  };
  
  // Ensure models are loaded before starting the server
  loadModels().then(() => {
    console.log('Models loaded');
  }).catch(err => {
    console.error('Failed to load models:', err);
  });
  
  function validateFileSize(file) {
      const fileSizeLimit = 30 * 1024 * 1024; // 30MB in bytes
      return file.size <= fileSizeLimit;
    }
    
    // Configure Multer storage with file size validation
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'files'); // Adjust 'files' as needed for your file storage location
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
      },
      limits: { fileSize: validateFileSize },
    });
  
  const upload = multer({ storage: storage })
  


router.get('/fetchEmployeeAccounts', async(req,res)=>{
    try{
        console.log("hello")

        const response = await Employee.find();

        console.log(response)
        console.log(response.length)

        if(!response){
            return res.status(404).send({ status: 0, message: 'No records found.' });
        }

        res.send({status : 1 , EmployeeAccounts : response})


    }catch(err){
        res.status(500).json({ message: 'Error fetching attendance record' });
    }
})


router.get('/fetchShiftDetails' , async(re , res)=>{
    try{

        const response = await Shift.find();
        console.log("response shift = " , response)
        if(response) {
            res.send(response)
        }

    }catch(err){
        res.send("something wrong")
    }
})
  

router.post("/registerEmployee", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        console.log('No file uploaded.');
        return res.status(400).send('No file uploaded.');
      }
  
      const { employeeName, employeeEmail, employeePassword, shift } = req.body;
  
      // Validate required fields
      if (!employeeName || !employeeEmail || !employeePassword || !shift) {
        return res.status(400).send('All fields are required.');
      }
  
      // Generate a unique employee ID (you can customize this as needed)
      const employeeId = generateEmployeeId();

      const saltRounds = 10; 
      const hashedPassword = await bcrypt.hash(employeePassword , saltRounds);
  
      const filePath = path.join(__dirname, '../../files', req.file.filename);
      console.log("filePath = ", filePath);
  
      console.log("Detecting face in image...");
      const img = await canvas.loadImage(filePath);
      const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
  
      if (!detections) {
        console.log('No faces detected in the image.');
        return res.status(400).send('No faces detected in the image.');
      }
  
      console.log("Extracting face information from image...");
      const descriptorArray = Array.from(detections.descriptor);
  
      const newEmployee = new Employee({
        employeeId,
        employeeName,
        employeeEmail,
        password: hashedPassword,
        shift,
        faceDescriptor: descriptorArray
      });
  
      console.log("Storing face info in database...");
      await newEmployee.save();
      console.log("Saved successfully");
      deleteAllFiles('files');
  
      res.status(200).send({ message: 'Face trained successfully', employee: newEmployee });
    } catch (err) {
      console.error(err);
      res.status(500).send("Something went wrong, sorry!");
    }
  });

  const generateEmployeeId = () => {
    const timestamp = Date.now();
    const shortTimestamp = timestamp.toString().slice(-5);
    return `EMP-${shortTimestamp}`;
  };
  
  router.get('/employeeDescriptor/:employeeId' , async(req, res)=>{
    try{
  
      const { employeeId } = req.params;
  
      const response = await Employee.findOne({employeeId : employeeId});
      if(response){
        console.log("response userDescriptor = " , response.faceDescriptor)
        res.send({userDescriptor : response.faceDescriptor})
      }
  
    }catch(err){
      res.send("sry wronggg")
    }
  })
  
  
  
// Route to handle image upload and face recognition
// router.post("/registerEmployee", upload.single('image'), async (req, res) => {
// try {
//     if (!req.file) {
//     console.log('No file uploaded.')
//     return res.status(400).send('No file uploaded.');
//     }

//     // console.log("File received:", req.file);

//     const filePath = path.join(__dirname, '../files', req.file.filename);
//     console.log("filePath = ", filePath);

//     console.log("detecting face in image...")
//     // Load the image
//     const img = await canvas.loadImage(filePath);
//     const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

//     if (!detections) {
//     console.log('No faces detected in the image.')
//     return res.status(400).send('No faces detected in the image.');
//     }

//     console.log("Extracting face informations in image....")
//     // Convert Float32Array to plain array
//     const descriptorArray = Array.from(detections.descriptor);

//     // Save the face descriptor to MongoDB
//     const faceData = new SingleFaceData({
//     name: req.body.name, // Use employee name or ID from the request
//     descriptor: descriptorArray
//     });

//     console.log("Storing face info in database....")
//     await faceData.save();
//     console.log("saved successfully")

//     res.status(200).send({ message: 'Face trained successfully', faceData });

// } catch (err) {
//     console.error(err);
//     res.status(500).send("Something went wrong, sorry!");
// }
// });


module.exports = router;