const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  adminId: { type: String, required: true, unique: true }, // Ensure unique employee IDs
  adminName: { type: String, required: true },
  adminEmail : { type: String , required: true },
  password : { type : String , required : true },
});

module.exports = {
    Admin: mongoose.model('Admin', adminSchema),
};


