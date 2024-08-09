import { useEffect, useState, useRef, useCallback } from 'react';
// import { useEffect, useState, useRef, useCallback , useContext } from 'react';
import Swal from 'sweetalert2';
import Webcam from 'react-webcam';
import PropTypes from 'prop-types';
import FaceDetectIcon from '../../assets/images/faceDetect.png';
import { fetchEmpFaceDescriptor } from './apiCall';

// import { ModelsContext } from '../../contexts/ModelsContext';

const FaceRecognition = ({ employeeId, setFaceRecognized , modelsLoaded , faceapi  }) => {

  // const { modelsLoaded , faceapi } = useContext(ModelsContext);

  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [userDescriptor, setUserDescriptor] = useState([]);

  const fetchEmpDescriptor = async () => {
    if (employeeId) {
      const response = await fetchEmpFaceDescriptor(employeeId);
      if (response) {
        console.log("response = ", response.data.userDescriptor);
        setUserDescriptor(response.data.userDescriptor);
      }
    } else {
      setUserDescriptor([]);
    }
  }

  console.log("employeeId =", employeeId);

  useEffect(() => {
    fetchEmpDescriptor();
  }, [employeeId]);

  const handleVideoPlay = useCallback(() => {
    if (!videoRef.current || !videoRef.current.video) return;

    const onLoadedData = async () => {
      console.log("Detecting ...");

      const intervalId = setInterval(async () => {
        if (!videoRef.current) return clearInterval(intervalId);
        console.log("Detecting face...");

        try {
          // const startTime = performance.now();

          const detections = await faceapi.detectAllFaces(videoRef.current.video, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptors();

          // const endTime = performance.now();
          // console.log(`Face detection took ${endTime - startTime} milliseconds`);
  
          if (!detections || detections.length === 0) {
            return;
          }

          const validDetections = detections.filter(detection => {
            const { x, y, width, height } = detection.detection.box;
            return x !== null && y !== null && width !== null && height !== null;
          });

          if (validDetections.length === 0) {
            return;
          }

          const faceDescriptor = Array.from(validDetections[0].descriptor);
          const distance = faceapi.euclideanDistance(faceDescriptor, userDescriptor);
          console.log("distance =", distance);
          if (distance <= 0.5) {
            clearInterval(intervalId);
            console.log("videoRef.current when face detected =", videoRef.current);
            if (videoRef.current.video && videoRef.current.video.srcObject) {
              videoRef.current.video.srcObject.getTracks().forEach(track => track.stop());
            }
            setIsCameraOn(false); // Turn off the camera
            setFaceRecognized(true);
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: "Face recognized",
              showConfirmButton: true, // Show confirm button
              confirmButtonText: 'OK'
            });
            console.log("Face recognized!");
            return;
          }
        } catch (error) {
          console.error("Error during face detection:", error);
          clearInterval(intervalId);
          setIsCameraOn(false);
          if (videoRef.current.video && videoRef.current.video.srcObject) {
            videoRef.current.video.srcObject.getTracks().forEach(track => track.stop());
          }
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: "An error occurred during face detection.",
            showConfirmButton: true,
            confirmButtonText: 'OK'
          });
        }
      }, 100);

      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        if (videoRef.current.video && videoRef.current.video.srcObject) {
          videoRef.current.video.srcObject.getTracks().forEach(track => track.stop());
        }
        setIsCameraOn(false); // Turn off the camera

        // Swal.fire({
        //   icon: 'error',
        //   title: 'Error!',
        //   text: "Face not recognized within the time limit, go to proper lighting place",
        //   showConfirmButton: true,
        //   confirmButtonText: 'OK'
        // });
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: "Face not recognized within the time limit, go to proper lighting place",
          showCancelButton: true,
          confirmButtonText: 'OK',
          cancelButtonText: 'Try Again',
          cancelButtonColor: '#28a745'
        }).then((result) => {
          if (result.isDismissed) {
            // Code to execute when "Try Again" is clicked
            console.log('Try Again clicked');
            handleOpenCamera();
            // Add your code here
          } else if (result.isConfirmed) {
            // Code to execute when "OK" is clicked
            console.log('OK clicked');
            // Add your code here if needed
          }
        });
        
      }, 8000); // 8 seconds timer

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    };

    videoRef.current.video.addEventListener('loadeddata', onLoadedData);

    return () => {
      if (videoRef.current && videoRef.current.video) {
        videoRef.current.video.removeEventListener('loadeddata', onLoadedData);
      }
    };
  }, [userDescriptor, faceapi]);

  useEffect(() => {
    if (isCameraOn && modelsLoaded) {
      const cleanup = handleVideoPlay();
      return () => {
        cleanup();
        if (videoRef.current && videoRef.current.video && videoRef.current.video.srcObject) {
          videoRef.current.video.srcObject.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [isCameraOn, modelsLoaded, userDescriptor, handleVideoPlay]);

  const handleOpenCamera = () => {
    setIsCameraOn(true);
  };

  return (
    <div className="px-2">
      <div>
        {!isCameraOn && !modelsLoaded && (
          <p>Loading models, please wait...</p>
        )}
        {!isCameraOn && userDescriptor.length !== 0 && modelsLoaded && (
          <img src={FaceDetectIcon} onClick={handleOpenCamera} style={{width:'100px'}} className='faceScanImg p-2 rounded-3 cursor_pointer' alt="" />
        )}
        {isCameraOn && (
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Webcam
              audio={false}
              ref={videoRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 720,
                height: 560,
                facingMode: "user"
              }}
              className="videoCanva"
             
            />
          </div>
        )}
      </div>
    </div>
  );
}

FaceRecognition.propTypes = {
  modelsLoaded: PropTypes.bool.isRequired,
  setFaceRecognized: PropTypes.func.isRequired,
  faceapi: PropTypes.object.isRequired,
  employeeId: PropTypes.string.isRequired,
};

export default FaceRecognition;
