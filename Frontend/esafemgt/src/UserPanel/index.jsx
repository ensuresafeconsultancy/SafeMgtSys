// import React from 'react'

import Sidebar from "../layouts/userLayouts/Sidebar"
import Header from "../layouts/userLayouts/Header"
import Dashboard from "./Dashboard"
import { Routes , Route } from "react-router-dom"
import Attendance from './Daily_Attendance/Attendance'
// import { useEffect , useState } from "react"

// import FaceDetectIcon from '../assets/images/faceDetect.png'

// import * as faceapi from 'face-api.js';
// import { ModelsProvider } from '../contexts/ModelsContext';

const UserPanel = () => {
  
  // const [modelsLoaded, setModelsLoaded] = useState(false);

  // const loadDummImage = async()=>{

  //   const dummyImg = new Image();
  //   dummyImg.src = FaceDetectIcon;
  //   dummyImg.onload = async () => {
  //     console.log("Warming up models with dummy image...");
  //     await faceapi.detectAllFaces(dummyImg, new faceapi.SsdMobilenetv1Options());
  //     setModelsLoaded(true);
  //     console.log("Models loaded and warmed up.");
  //   };

  //   dummyImg.onerror = () => {
  //     console.error("Failed to load dummy image for model warm-up.");
  //     setModelsLoaded(true); // Consider setting to true even if the warm-up fails
  //   };

  // }

  // const loadModels = async () => {
  //   if (!modelsLoaded) {
  //     try {
  //       const modelPromises = [
  //         faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
  //         faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  //         faceapi.nets.faceRecognitionNet.loadFromUri('/models')
  //       ];
  
  //       await Promise.all(modelPromises);
  
  //       setModelsLoaded(true);
  //       console.log("models loaded")
  //       loadDummImage();
        
        
  //     } catch (error) {
  //       console.error("Error loading models:", error);
  //     }
  //   }
  // };

  // useEffect(()=>{
  //   loadModels();
  // },[])
  

  return (
      <div className="d-flex" id="wrapper">
          <Sidebar />
          <div id="page-content-wrapper">
            <Header />

            {/* <ModelsProvider> */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/attendance" element={<Attendance />} />

              {/* <Route path="/awshpForm" element={<AdminFormLists formName={'AWSHP'} addFormUrl={REG_FORM_URL_CLIENT_PATH.awshpForm} />} />
              <Route path="/vmbscForm" element={<AdminFormLists formName={'VMBSC'} addFormUrl={REG_FORM_URL_CLIENT_PATH.vmbscForm} />} />
              <Route path="/wshcmForm" element={<AdminFormLists formName={'WSHCM'} addFormUrl={REG_FORM_URL_CLIENT_PATH.wshcmForm} />} /> */}

              {/* <Route path="*" element={<Navigate to="/admin" replace />} /> */}
            </Routes>
            {/* </ModelsProvider> */}
          </div>
        </div>
  )
}

export default UserPanel