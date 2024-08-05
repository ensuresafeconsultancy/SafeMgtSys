const express = require('express')
const router = express.Router();
const multer  = require('multer')
const fs = require('fs')
const path = require('path')

const canvas = require('canvas');
const faceapi = require('face-api.js');
const { Canvas, Image, ImageData } = canvas;

const SingleFaceData = require('../schema/SingleFaceData');

faceapi.env.monkeyPatch({ Canvas, Image, ImageData });




router.get('/userDescriptor', async(req, res)=>{
  try{

    const response = await SingleFaceData.findOne({name : 'Balaji'})
    if(response){
      console.log(response)
    } else {
      console.log("not found")
    }

    res.send({descriptor : response.descriptor })

  }catch(err){
    res.send("sryyy wrongg")
  }
})

router.get('/fetchEmployeeNames' , async(req,res)=>{
  try{

    const response =  await SingleFaceData.find({} , 'name');
    console.log("response = " , response)
    if(response){
      res.send({EmployeeNames : response})
    }

  }catch(err){
    res.send("sryy wrong")
  }
})

router.get('/employeeDescriptor/:employeeId' , async(req, res)=>{
  try{

    const { employeeId } = req.params;

    const response = await SingleFaceData.findById({_id : employeeId});
    if(response){
      console.log("response userDescriptor = " , response.descriptor)
      res.send({userDescriptor : response.descriptor})
    }

  }catch(err){
    res.send("sry wronggg")
  }
})


module.exports = router;
