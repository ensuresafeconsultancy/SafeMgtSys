require('dotenv').config();
const express = require('express')
const router = express.Router();


router.post('/employeeLogin' , async(req, res)=>{
    try{
        res.send("Crt")
    }catch(err){
        res.send("Sry wrong")
    }
})




module.exports = router;