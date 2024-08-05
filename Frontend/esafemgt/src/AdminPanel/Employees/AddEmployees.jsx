
import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { registerEmployee , fetchShiftDetails } from '../apiCall';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const AddEmployees = () => {

    const [image, setImage] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const webcamRef = useRef(null);
  const canvasRef = useRef();
  const navigate = useNavigate();

  // const [employeeName, setEmployeeName] = useState('');
  const [employeeDetails, setEmployeeDetails] = useState({
    empName: '',
    empEmail: '',
    empPassword: '',
    shift: ''
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  useEffect(()=>{

    fetchShiftData();

  },[])

  const fetchShiftData = async()=>{
    console.log("fetching shifts...")
    const response = await fetchShiftDetails();
    if(response){
      console.log("shifts = " ,response.data )
      setsaveShift(response.data)
    }
  }


  const openCamera = () => {
    setIsCameraOpen(true);
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    setIsCameraOpen(false);
  };

  const retakeImage = () => {
    setImage(null);
    setIsCameraOpen(true);
  };

  const registerEmp = async (event) => {
    event.preventDefault();
    // let url = "https://facerecognitioncheck.onrender.com/uploadSingleImage";
    const newFormData = new FormData();
    let empName = employeeDetails.empName
    newFormData.append('image', dataURItoBlob(image), `${empName}.png`);
    newFormData.append('employeeName', employeeDetails.empName);
    newFormData.append('employeeEmail', employeeDetails.empEmail);
    newFormData.append('employeePassword', employeeDetails.empPassword);
    newFormData.append('shift', employeeDetails.shift);

    const response = await registerEmployee(newFormData);
    if(response){
      navigate('/AdminPanel/employees');
    }

  
  };

  // console.log("employeeDetails.shift = ", employeeDetails.shift)

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  };


  const [shift , setShift] = useState('');
  const [startTime , setStartTime]= useState('');
  const [endTime , setEndTime]= useState('');

  const [saveShift , setsaveShift] = useState([]);


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
      // setsaveShift(response.data.response)
    }

    console.log(shift , startTime , endTime)


  }


  return (
    <div className='p-2'>
        <div className="row p-2">
            <div className="col"></div>
            <div className="col-lg-8 col-12">

                <h4 className="text-center fw-bold my-3">Employee Registration</h4>

                <form action="" className='px-2' onSubmit={registerEmp}>
              <div className="form-group">
                <label htmlFor="" className='my-2'>Employee Name: </label>
                <input type="text" className='form-control' value={employeeDetails.empName} name="empName" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="" className='my-2'>Work Shift: </label>
                <select name="shift" id="" onChange={handleChange} className='form-control'>
                  <option value="">--- Select shift --</option>
                  {saveShift && saveShift.map(item=>(
                       <option value={item._id} key={item._id}>{item.shiftName}</option>
                  ))}
                </select>
                {/* <input type="text" className='form-control' value={employeeDetails.name} onChange={handleChange} required /> */}
              </div>
              <div className="form-group">
                <label htmlFor="" className='my-2'>Email: </label>
                <input type="email" className='form-control' name="empEmail" value={employeeDetails.empEmail}  onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="" className='my-2'>Password: </label>
                <input type="password" className='form-control' name="empPassword" value={employeeDetails.empPassword}  onChange={handleChange}  required />
              </div>
              <div className="pt-5">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {!isCameraOpen && !image && (
                    <button className='btn btn-primary' type='button' onClick={openCamera}>Open Camera</button>
                  )}
                  {isCameraOpen && (
                    <div className='text-center'>
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={720}
                        height={560}
                        className='videoCanva'
                      />
                      <div className="d-flex justify-content-center align-items-center">

                      <button className='btn btn-primary' type='button' onClick={captureImage} style={{ display: 'block', marginTop: '10px' }}>Capture Image</button>
                      </div>
                    </div>
                  )}
                  {image && (
                    <div className='d-flex justify-content-center align-items-center flex-column gap-2'>
                      {/* <h2>Captured Image</h2> */}
                      <img src={image} alt="Captured" />
                      <button className='btn btn-primary' type='button' onClick={retakeImage} style={{ display: 'block', marginTop: '10px' }}>Retake</button>
                    </div>
                  )}
                </div>
                <canvas ref={canvasRef} className='img-fluid' style={{ display: 'none' }}></canvas>
                <div className="text-center">
                  <button className='btn btn-success mt-4 px-4'>Register</button>
                </div>
              </div>
            </form>

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


            </div>
            <div className="col"></div>
        </div>
    </div>
  )
}

export default AddEmployees