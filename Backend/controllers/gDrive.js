require('dotenv').config();
const { google } = require('googleapis');

const fs = require('fs')
const path = require('path')
// const apiKeys = require('./googleApiKey.json')
const folderId = process.env.FOLDER_ID;


const SCOPE = [process.env.SCOPE];

const credentials = {
    private_key: process.env.PRIVATE_KEY.split(String.raw`\n`).join('\n'),
  };
  
  const authorize = async()=>{
    const jwtClient = new google.auth.JWT(
        process.env.CLIENT_EMAIL,
          null,
          credentials.private_key,
          SCOPE
      );
      await jwtClient.authorize();
      return jwtClient;    
  }

  const uploadFile = (authClient, fileLocation , mimeTypeParams , fileName)=>{
    console.log("outside fileLocation = " ,fileLocation)
    console.log("outside mimeTypeParams = " ,mimeTypeParams)
  
    return new Promise((resolve,rejected)=>{
  
      console.log("fileLocation = " ,fileLocation)
      console.log("mimeTypeParams = " ,mimeTypeParams)
        const drive = google.drive({version:'v3',auth:authClient}); 
        var fileMetaData = {
            name: fileName,    
            parents:[folderId] // A folder ID to which file will get uploaded
        }
        drive.files.create({
            resource:fileMetaData,
            media:{
                body: fs.createReadStream(fileLocation), // files that will get uploaded
                mimeType: mimeTypeParams
            },
            fields:'id'
        },function(error,file){
            if(error){
                return rejected(error)
            }
            resolve(file);
        })
    });

  }


module.exports = { authorize , uploadFile };



// const uploadFile = async (authClient, fileLocation, mimeTypeParams, fileName) => {
//     try {
//       console.log("outside fileLocation =", fileLocation);
//       console.log("outside mimeTypeParams =", mimeTypeParams);
  
//       const drive = google.drive({ version: 'v3', auth: authClient });
//       const fileMetaData = {
//         name: fileName,
//         parents: [folderId], // A folder ID to which file will get uploaded
//       };
  
//       const response = await drive.files.create({
//         resource: fileMetaData,
//         media: {
//           body: fs.createReadStream(fileLocation), // files that will get uploaded
//           mimeType: mimeTypeParams,
//         },
//         fields: 'id',
//       });
  
//       console.log('File uploaded successfully!');
//       return response.data.id;
//     } catch (error) {
//       console.error(error);
//       throw error; // Re-throw the error for proper handling
//     }
//   };