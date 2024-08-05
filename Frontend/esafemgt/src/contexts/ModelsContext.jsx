import { createContext, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import FaceDetectIcon from '../assets/images/faceDetect.png';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

// Create context
export const ModelsContext = createContext();

// Create provider component
export const ModelsProvider = ({ children }) => {
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const loadDummImage = async () => {
   
    const dummyImg = new Image();
    dummyImg.src = FaceDetectIcon;
    dummyImg.onload = async () => {
      Swal.fire({
        title: 'Models loading...',
        text: 'Please wait, it takes few seconds...',
        showConfirmButton: false,
        allowOutsideClick: false,
        willOpen: () => {
        Swal.showLoading();
        }
    });

      console.log("Warming up models with dummy image...");
      await faceapi.detectAllFaces(dummyImg, new faceapi.SsdMobilenetv1Options());

      Swal.close();
      setModelsLoaded(true);
      console.log("Models loaded and warmed up.");
    };

    dummyImg.onerror = () => {
      Swal.close();
      console.error("Failed to load dummy image for model warm-up.");
      setModelsLoaded(true); // Consider setting to true even if the warm-up fails
    };
  };

  const loadModels = async () => {
    
    if (!modelsLoaded) {
      try {
        const modelPromises = [
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        ];

        Swal.fire({
          title: 'loading...',
          text: 'Please wait, it takes few seconds...',
          showConfirmButton: false,
          allowOutsideClick: false,
          willOpen: () => {
            Swal.showLoading();
          }
      });

        await Promise.all(modelPromises);

        console.log("Models loaded");
        Swal.close();
        loadDummImage();
      } catch (error) {
        Swal.close();
        console.error("Error loading models:", error);
      }
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  return (
    <ModelsContext.Provider value={{ modelsLoaded, setModelsLoaded , faceapi }}>
      {children}
    </ModelsContext.Provider>
  );
};
ModelsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};