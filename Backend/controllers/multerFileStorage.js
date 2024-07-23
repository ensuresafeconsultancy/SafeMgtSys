const multer  = require('multer')
const fs = require('fs')
const path = require('path')

const validateFileSize= (file)=>{
    const fileSizeLimit = 30 * 1024 * 1024; // 30MB in bytes
    return file.size <= fileSizeLimit;
  }

  const deleteAllFiles = async(folderPath)=>{
    try {
      const files = await fs.promises.readdir(folderPath);
      for (const file of files) {
        const filePath = path.join(folderPath, file);
        await fs.promises.unlink(filePath);
      }
      console.log('All files deleted from', folderPath);
    } catch (err) {
      console.error('Error deleting files:', err);
    }
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



module.exports = { upload, validateFileSize , deleteAllFiles };