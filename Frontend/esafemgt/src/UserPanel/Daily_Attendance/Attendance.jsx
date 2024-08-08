import { useState, useEffect , useRef } from 'react';
// import { FaPlus } from "react-icons/fa6";
import { AiOutlineCarryOut } from "react-icons/ai";
// import { MdOutlineLunchDining } from "react-icons/md";
import { submitCheckInTime, checkInList, empCheckOut } from './apiCall';
import axios from 'axios';
import Timer from './timer';
import '../../assets/css/dailyAttendance.css'
// import Swal from 'sweetalert2';
import FaceDetectIcon from '../../assets/images/faceDetect.png'
import FaceRecognition from './FaceRecognition';
import * as faceapi from 'face-api.js';
import GetLocationDistance from './GetLocationAndDistance';
import Dummy_man_image from '../../assets/images/man_image_compressed.png'
// import { ModelsContext } from '../../contexts/ModelsContext';

const Attendance = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState('');
  // const [geoPhotos, setGeoPhotos] = useState([]);
  const [lateReason, setLateReason] = useState('');
  // const [currentViewNotes, setCurrentViewNotes] = useState('');
  const [empCheckInList, setEmpCheckIn] = useState({});
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceRecognized , setFaceRecognized] = useState(false);
  const [locationLoaded , setLocationLoaded] = useState(false);

  const [address, setAddress] = useState('');
  
    const [distance , setDistance] = useState('');
    const [distanceError , setDistanceError] = useState('');
  // const { modelsLoaded } = useContext(ModelsContext);

    const fetchCheckInList = async () => {
      // const response = await checkInList("669b70de7f081744a4a62128");
      const response = await checkInList();
      if (response && response.data.status === 1) {
        if(response.data.empCheckInList && response.data.empCheckInList.currentCheckIn){
          console.log("response.data.currentCheckIn = ", response.data.empCheckInList.currentCheckIn);
        }
        setEmpCheckIn(()=>response.data.empCheckInList);
    console.log("EmpCheckInList = ", empCheckInList);
        
      }
    };

    useEffect(() => {
      fetchCheckInList();
    }, []);

    // useEffect(() => {

      const loadDummImage = async()=>{

        const dummyImg = new Image();
        dummyImg.src = Dummy_man_image;
        dummyImg.onload = async () => {
          console.log("Warming up models with dummy image...");
          await faceapi.detectAllFaces(dummyImg, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks();
          setModelsLoaded(true);
          console.log("Models loaded and warmed up.");
        };

        dummyImg.onerror = () => {
          console.error("Failed to load dummy image for model warm-up.");
          setModelsLoaded(true); // Consider setting to true even if the warm-up fails
        };

      }
    
      const loadModels = async () => {
        if (!modelsLoaded) {
          try {
            const modelPromises = [
              faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
              faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
              faceapi.nets.faceRecognitionNet.loadFromUri('/models')
            ];
      
            await Promise.all(modelPromises);
      
            console.log("models loaded")
            
            loadDummImage();
            // setModelsLoaded(true);
            
            
          } catch (error) {
            console.error("Error loading models:", error);
          }
        }
      };
  

    const fileInputRef = useRef(null);

    const submitCheckin = async (event) => {
      event.preventDefault();
      console.log("location = ", location);
      if(distance > 100){
        // setDistanceError("Please move closer to the location");
        return;
        // alert("Please move closer to the location");
      } else{
        setDistanceError('');
      }
      // console.log("geoPhotos = ", geoPhotos);
      const response = await submitCheckInTime(location, lateReason, empCheckInList._id);
      // const response = await submitCheckInTime(location, lateReason, geoPhotos , empCheckInList._id);

      if(response){
        document.getElementById("closeModalButton").click();
        setEmpCheckIn(()=>response.data.updatedEmployee);
        setLocation(()=>'')
        // setGeoPhotos(()=>[])
        setFaceRecognized(false);
        if(lateReason){
          setLateReason(()=>'')
        }
        fileInputRef.current.value = null; // Reset the file input field
      }
    };

    
    // const updateViewNotes = (value) => {
    //   setCurrentViewNotes(value);
    // };


    const handleInput = (event) => {
      const value = event.target.value;
      if (event.target.id === "location") {
        setLocation(()=>value);
      } else if (event.target.id === "lateReason") {
        setLateReason(()=>value);
      }
    };

    const handleFileChange = (event) => {
      const selectedFiles = event.target.files;
      setGeoPhotos(selectedFiles);
    };

    

    // console.log("EmpCheckInList = ", empCheckInList);

    const fetchCurrentWorkLocation = () => {
      console.log("Fetching current working location...");
      if (empCheckInList && empCheckInList.currentCheckIn && empCheckInList.records.length > 0) {
        console.log("work started ..");
        return empCheckInList.records[empCheckInList.records.length - 1].location;
      }
      return '';
    };

    const updateCurrentTime = () => {
      setCurrentTime(new Date());
    };

    const checkOut = async () => {
      // const empId = empCheckInList._id;
      const response = await empCheckOut(empCheckInList.records.length - 1);
      if (response) {
        setEmpCheckIn(()=>response.data.updatedEmployee);
        console.log("super");
      }
    };

    const convertMinutesToHMS = (totalMinutes) => {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${String(hours).padStart(2, '0')}h:${String(minutes).padStart(2, '0')}m`;
    };

    const findTimerStartTime = () => {
      if (empCheckInList && empCheckInList.currentCheckIn && empCheckInList.records.length > 0) {
        return empCheckInList.records[empCheckInList.records.length - 1].createdAt;
      }
      return null;
    };

    const findTotalHoursWorked = () => {
      if (empCheckInList && empCheckInList.totalTimeWorked) {
        const hours = Math.floor(empCheckInList.totalTimeWorked / 60);
        const minutes = empCheckInList.totalTimeWorked % 60;
        return `${String(hours).padStart(2, '0')}hrs :${String(minutes).padStart(2, '0')}min`;
      }
      return '00hrs : 00min';
    };


    const [shift , setShift] = useState('');
    const [startTime , setStartTime]= useState('');
    const [endTime , setEndTime]= useState('');

    const [saveShift , setsaveShift] = useState({});

    const submitShift = async(event)=>{
      event.preventDefault();

      const obj = {
        shiftName: shift,
        startTime: startTime,
        endTime:endTime
      }

      console.log("obj = " , obj)

      const response = await axios.post("http://localhost:3000/attendance/addShift" , obj)

      if(response){
        console.log("response = " , response);
        setsaveShift(response.data.response)
      }

      console.log(shift , startTime , endTime)
    }
    const submitEmp = async()=>{
    

      console.log(" saveShift = " , saveShift)

      let {_id} = saveShift;
      console.log("id = " ,_id)

   
      // let shift = _id;
      let shift = "669b70d77f081744a4a62125";
      const response = await axios.post("http://localhost:3000/attendance/addEmployee" , {shift : shift})

      if(response){
        console.log(response)
      }


    }


    const checkForLate = ()=>{

      console.log("currentTime = " , currentTime.toLocaleTimeString())

      if(empCheckInList && empCheckInList.shiftStartTime && empCheckInList.records.length == 0){
        const shiftStartTime = empCheckInList.shiftStartTime;

        console.log("shiftStartTime = " , shiftStartTime)
        // console.log("checkForLate2(shiftStartTime) = " , checkForLate2(shiftStartTime))

        // Convert shiftStartTime to 24-hour format
        const [shiftHour, shiftMinute] = shiftStartTime.split(':');
        const shiftHour24 = parseInt(shiftHour, 10);
      
        // Create Date objects for comparison
        const shiftTime = new Date();
        shiftTime.setHours(shiftHour24, parseInt(shiftMinute, 10));
        shiftTime.setMinutes(0);
        shiftTime.setSeconds(0);

        console.log("shiftTime = " , shiftTime)
        console.log("currentTime check = " , currentTime)
      
        return currentTime > shiftTime;
    
      }

    }

    const getLateDuration = ()=>{
      if(empCheckInList && empCheckInList.lateTime){
        console.log("empCheckInList.lateTime = " , empCheckInList.lateTime);
        let [hours , minutes , seconds] = empCheckInList.lateTime.split(':');
        return `${hours}hrs : ${minutes}mins : ${seconds}sec`
      }
      return `00hrs : 00mins : 00sec`;
    }

    
  

  return (
    <div className="container" id="Attendance">
      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Check In
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id='closeModalButton'
              ></button>
            </div>
            <form action="" onSubmit={(event)=>submitCheckin(event)} >
            <div className="modal-body">
              
                {/* <h5>Start Time : {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</h5> */}
                {/* <h5>Start Time : {currentTime.toLocaleTimeString()}</h5> */}
                <div className="form-group py-2">
                  <label htmlFor="" className="form-label">
                    Start Time :
                  </label>
                  <input type="text" className="form-control" value={currentTime.toLocaleTimeString()} disabled/>
                </div>

                {modelsLoaded? <>

                  <div className="form-group py-2">
                  <label htmlFor="" className="form-label">
                    Work Location :
                  </label>
                  <input type="text" value={location} onChange={(e)=>handleInput(e)} id="location" className="form-control" required />
                </div>
                <div className="form-group d-flex justify-content-center align-items-center flex-column gap-2 py-3">
                  {/* <img src={FaceDetectIcon} style={{width:'100px'}} className='faceScanImg p-2 rounded-3 cursor_pointer' alt="" /> */}
                  {/* <span>Face scan</span> */}
                  {/* {modelsLoaded? <FaceRecognition setFaceRecognized={setFaceRecognized} employeeId = {empCheckInList.employeeId} /> : "Loading Face scan ..."} */}
                  <FaceRecognition modelsLoaded={modelsLoaded} setModelsLoaded={setModelsLoaded} setFaceRecognized={setFaceRecognized} faceapi={faceapi} employeeId = {empCheckInList.employeeId} />
                  {/* {empCheckInList.employeeId && <FaceRecognition employeeId = {empCheckInList.employeeId} />} */}
                </div>

                <div className="d-flex justify-content-center align-items-center">
                  <GetLocationDistance locationLoaded={locationLoaded} setLocationLoaded={setLocationLoaded} distance={distance} setDistance={setDistance} setAddress={setAddress} address={address} distanceError={distanceError} setDistanceError={setDistanceError} />

                </div>
                
                
                </>

                :

                <div className="d-flex justify-content-center align-items-center py-4">
                  Loading Face scan ...
                </div>
              }


                

                {/* <div className="form-group py-2">
                  <label htmlFor="" className="form-label">
                    Upload Geo tag photo:
                  </label>
                  <input type="file" className="form-control"  ref={fileInputRef} onChange={(e)=>handleFileChange(e)}  multiple required />
                </div> */}

                {checkForLate()?
                
                <div className="form-group py-2">
                <label htmlFor="" className="form-label">
                  Late Reason<span className='text-danger fw-bold'>*</span> :
                </label>
                <div className="">
                    
                  <textarea name="" cols="" className='w-100' value={lateReason} id="lateReason" onChange={(e)=>handleInput(e)} rows="4" required></textarea>
                </div>
              </div>

              : ''
                
                }
               
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={!faceRecognized && distanceError? true : false}>
                Check In
              </button>
            </div>
            </form>
          </div>
        </div>
      </div>

   
      {/* view notes  */}
      {/* <div className="modal fade" id="exampleModal2" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {currentViewNotes}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            
            </div>
          </div>
        </div>
      </div> */}



 


      <div className="row pt-5">
        <div className="col"></div>
        <div className="col-lg-8 col-10">
            <div className="row">
                <div className="col">
                <div className="text-center p-3 border rounded-4 bg-light">


                  {empCheckInList && empCheckInList.currentCheckIn? 

                  <>
                      <h3 className="text-center fw-bold">Current Work</h3>
                      <h4>{fetchCurrentWorkLocation()}</h4>
                      <h4><Timer startTime={findTimerStartTime()} /></h4>
                      <div className="d-flex justify-content-center align-items-center gap-2">
                      <button type="button" className="btn btn-primary">
                        Edit
                        </button>
                      <button type="button" className="btn btn-danger" onClick={()=>checkOut()}>
                          Check out
                        </button>

                      </div>
                     
                  </>

                  :

                  <div className='d-flex justify-content-center align-items-center gap-2'>
                    <div  data-bs-toggle="modal" onClick={()=>{loadModels(); updateCurrentTime(); setLocationLoaded(false);  }} data-bs-target="#exampleModal" className="cursor_pointer border gap-2 p-3 rounded-3 d-flex justify-content-center align-items-center flex-column workAssignBtn ">
                    <AiOutlineCarryOut className='fs-3' />
                      Check In
                    </div>
                    {/* <div className="cursor_pointer border gap-2 p-3 rounded-3 d-flex justify-content-center align-items-center flex-column lunchAssign ">
                    <MdOutlineLunchDining  className='fs-3' />
                      Lunch
                    </div> */}
                
                  </div>

                  
                }

                  
                </div>
                <div className="text-center p-3 border rounded-4 bg-light mt-2">
                    <h6>Total Hours Worked </h6>
                    {/* <h5 className='fw-bold'>06hrs : 45min : 30sec</h5> */}
                    <h5 className='fw-bold'>{findTotalHoursWorked()}</h5>
                </div>

                </div>
                <div className="col">
                    <div  className="text-center p-3 border rounded-4 bg-light">
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>{currentTime.toLocaleDateString()}</th>
                                </tr>
                                <tr>
                                    <th>Shift</th>
                                    <th>Day</th>
                                </tr>
                                <tr>
                                    <th>Shift Timing</th>
                                    <th>09:00 AM - 06:00 PM</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div  className="text-center p-3 border rounded-4 bg-light mt-2">
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Late</th>
                                    <th>{getLateDuration()}</th>
                                    {/* <th>00hrs: 05mins : 12sec</th> */}
                                </tr>
                                <tr>
                                    <th>over Time</th>
                                    <th>00hrs: 45mins : 45sec</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>

        </div>
        <div className="col"></div>
      </div>


{empCheckInList && empCheckInList.records && empCheckInList.records.length>0? 
      <div className="row pt-5">
        <div className="col"></div>
        <div className="col-lg-10 col-12">
          <div className="" style={{overflowX: 'auto'}}>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Work Location</th>
                  <th scope="col">Start time</th>
                  <th scope="col">End time</th>
                  <th scope="col">Total time</th>
                  <th scope="col">Image</th>
                  <th scope="col">Status</th>
                  {/* <th scope="col">Action</th> */}
                </tr>
              </thead>
              <tbody>
              {empCheckInList.records && empCheckInList.records.map((record, index) => (
                    <tr key={index}>
                      <th scope='row'>{index + 1}</th>
                      <td>{record.location}</td>
                      <td>{record.startTime}</td>
                      <td className='text-center'>{record.endTime? record.endTime : '-'}</td>
                      <td className='text-center'>{record.totalTime? convertMinutesToHMS(record.totalTime) : '-'}</td>
                      <td>{record.images &&
                            record.images.map((itemFile, index) => {
                              return (
                                <div
                                  className="d-flex justify-content-between align-items-center"
                                  key={index}
                                >
                                  <span
                                    
                                    className="text-truncate cursor_pointer fileName "
                                    style={{ maxWidth: "150px" }}
                                  >
                                    {itemFile.substr(0, 23).concat("...") +
                                      itemFile.split(".")[1]}
                                  </span>


                            <div className="d-flex justify-content-center align-items-center">

                                  <span
                                    
                                    className="text-success cursor_pointer  rounded-circle download_bg"
                                  >
                                    {/* <MdDownloadForOffline className="downloadIcon rounded-circle" /> */}

                                    
                                  </span>
                                  <span className="text-success cursor_pointer  rounded-circle download_bg">
                                      {/* <MdDelete
                                  className="actionIcon p-2 rounded-circle cursor_pointer deleteIcon"
                                  onClick={() => deletePhoto(item._id , index)}
                                /> */}

                                  </span>


                                  </div>
                                 
                                </div>
                              );
                            })}</td>
                      <td>{record.status ==="Check In"? 

                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <button type="button" className="btn btn-danger" onClick={()=>checkOut()}>
                          Check out
                        </button>
                      </div>
                      
                      :

                      <div className="d-flex justify-content-center align-items-center">
                        <button type="button" className="btn btn-success">
                            Completed
                        </button>
                      </div>

                    
                    }</td>
                      {/* <td>

                        {record.status ==="Check In"? 

                        
                        <div className="d-flex justify-content-center align-items-center gap-2">
                        <button type="button" className="btn btn-primary">
                        Edit
                        </button>
                        <button type="button" className="btn btn-danger">
                        Delete
                        </button>
                        </div>

                        :

                        "-"
                        
                      
                      }
                        
                      
                      </td> */}
                    </tr>
                  ))}
          
              </tbody>
            </table>
          </div>

          <div
            className="text-center d-flex justify-content-center align-items-center"
            id="plusBtn"
          >

           
            
          </div>
        </div>
        <div className="col"></div>
      </div>


: "" }

{/* <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#sampleShift">
  Shift demo modal
</button> */}


<div className="modal fade" id="sampleShift" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form action="" onSubmit={(event)=>submitShift(event)}>
          
         
      <div className="modal-body">
       
        <div className="">
          <input type="text" value={shift} onChange={(e)=>setShift(e.target.value)} className='form-control' />
          <input type="time"value={startTime} onChange={(e)=>setStartTime(e.target.value)} className='form-control' />
          <input type="time" value={endTime} onChange={(e)=>setEndTime(e.target.value)}  className='form-control' />
        </div>

      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="submit" className="btn btn-primary">Save changes</button>
      </div>
      </form>
    </div>
  </div>
</div>

{/* <button onClick={()=>submitEmp()}>Submit emp</button> */}

    </div>
  );
};



export default Attendance;
