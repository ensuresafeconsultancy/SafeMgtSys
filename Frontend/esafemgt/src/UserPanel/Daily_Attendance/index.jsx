// import React from 'react'
import { useState, useEffect } from 'react';
const DailyAttendance = () => {
    const [location, setLocation] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);

  const fetchCoordinates = ()=>{
    navigator.geolocation.getCurrentPosition(
        (position) => {

        setLocation(()=>{})
  
          console.log(position)
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setErrorMessage(error.message);
        }
      );
  }

  useEffect(() => {
    fetchCoordinates();
  }, []);


  return (
    <div className="container">
        <div className="row">
            <div className="col"></div>
            <div className="col-5">
                <div className="pt-5">
                    <h2 className="text-center pb-3 fw-bold">Daily Attendance</h2>

                    <form action="">
                        <div className="form-group py-2">
                            <label htmlFor="" className="form-label">Employee ID :</label>
                            <input type="text" className="form-control" />
                        </div>
                        <div className="form-group py-2">
                            <label htmlFor="" className="form-label">Employee Name :</label>
                            <input type="text" className="form-control" />
                        </div>
                        <div className="form-group py-2">
                            <label htmlFor="companyName" className="form-label">Company Name :</label>
                            <select name="companyName" className="form-control" id="companyName">
                                <option value="-">---Select company----</option>
                                <option value="Ensure Safe consultancy">Ensure Safe consultancy</option>
                                <option value="Designbuild Construction Pte Ltd ">Designbuild Construction Pte Ltd </option>
                                <option value="BMS contractors ">BMS contractors </option>
                                <option value="Lk Engineering ">Lk Engineering </option>
                            </select>
                           
                        </div>
                        <div className="form-group py-2">
                            <label htmlFor="" className="form-label">Location :</label>
                            <input type="text" className='form-control' />
                        </div>

                        <div className="form-group py-2">
                            <label htmlFor="" className='form-label'>Upload Geo tag photo:</label>
                            <input type="file" className='form-control' />
                        </div>

                        {/* <div className="form-group py-2">
                            <button
                                onClick={() => fetchCoordinates()}
                                type="button"
                                className="btn btn-success"
                            >
                                Get Your Co-ordinates
                            </button>
                            {location.latitude && (
                                <p>
                                Your current location is: ({location.latitude}, {location.longitude})
                                </p>
                            )}
                            {errorMessage && <p>Error: {errorMessage}</p>}
                    
                        </div> */}
                        <div className="form-group py-2 text-center">
                            <input type="button" className="btn btn-primary px-4" value="Submit" />
                        </div>
                    </form>
                </div>
            </div>
            <div className="col"></div>
        </div>
    </div>
  )
}

export default DailyAttendance;