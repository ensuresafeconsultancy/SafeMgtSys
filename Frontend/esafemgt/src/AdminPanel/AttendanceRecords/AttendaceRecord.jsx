import React , {useState} from 'react'

import { fetchEmpAttRecords } from "../apiCall";
import { convertMinutesToHMS } from '../../Utils/attendanceCommonFun';
const AttendaceRecord = () => {

    const [attendanceRecords , setAttendanceRecords] = useState([]);


    const fetchAttendanceRecords = async()=>{

        const empId= "669b70de7f081744a4a62128";
        const currentData = new Date();

        const response = await fetchEmpAttRecords(empId , currentData.toLocaleDateString());
        if(response){
            setAttendanceRecords(response.data)
        }
        console.log(response)
        
    }



  return (
    <div id="Attendance_Records" className="p-3">

        <div className="row p-2">
            <div className="col-lg-4 p-3 border rounded-3">
                
                <h5>Today Attendance </h5>
                <hr />

                <table className="table" style={{overflowX : 'auto'}}>
                    <tbody style={{overflowX : 'auto'}}>
                        <tr>
                            <th>Check-in</th>
                            <th>12</th>
                        </tr>
                        <tr>
                            <th>Still not check-in</th>
                            <th>4</th> 
                        </tr>
                    </tbody>
                </table>
                
            </div>
            <div className="col"></div>
        </div>

        <div className="row">
            <div className="col"></div>
            <div className="col-lg-8 col-12">
                <div className="">
                    <h5 className="text-center fw-bold">Today Check-in List</h5>

                    <table className="table table-hover" style={{overflowX : 'auto'}}>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Check-in Time</th>
           
                            </tr>
                        </thead>
                        <tbody style={{ overflowX : 'auto' }}>
                           <tr className="cursor_pointer" onClick={fetchAttendanceRecords} data-bs-toggle="modal" data-bs-target="#viewRecords">
                               <td>1.</td>
                               <td>234434</td>
                               <td>Balaji K</td>
                               <td>09 : 12 AM</td>
                          
                           </tr>
                           <tr>
                               <td>2.</td>
                               <td>56534</td>
                               <td>Dinesh Kumar</td>
                               <td>10 : 12 AM</td>
                           </tr>
                        </tbody>
                    </table>

                </div>
            </div>
            <div className="col"></div>
        </div>
       


        <div className="modal fade" id="viewRecords" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-xl" >
                <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Check-in Records</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body" style={{overflowX : 'auto'}}>

                <table className="table table-hover" style={{overflowX : 'auto'}}>
                        <thead>
                       
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col" className='text-nowrap'>Work Location</th>
                                <th scope="col">Start time</th>
                                <th scope="col">End time</th>
                                <th scope="col" className='text-nowrap'>Total time</th>
                                <th scope="col">Image</th>
                                <th scope="col">Status</th>
                            </tr>
                        
                        </thead>
                        <tbody style={{ overflowX : 'auto' }}>

                            {attendanceRecords && attendanceRecords.map((item , index)=>{
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}.</td>
                                        <td className='text-nowrap'>{item.location}</td>
                                        <td className='text-nowrap'>{item.startTime}</td>
                                        <td className='text-nowrap'>{item.endTime}</td>
                                        <td className='text-nowrap'>{convertMinutesToHMS(item.totalTime)}</td>
                                        <td className='text-nowrap'>{item.images? 

                                    item.images.map((itemImage , index)=>{
                                        return <span key={index}>{itemImage.substr(0, 23).concat("...") +
                                        itemImage.split(".")[1]}</span>
                                    })
                                                    : ''
                                    }</td>
                                    <td className='text-nowrap'>{item.status}</td>
                                    </tr>
                                )
                            })}
                          
                        </tbody>
                    </table>

                    
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    {/* <button type="button" className="btn btn-primary">Save changes</button> */}
                </div>
                </div>
            </div>
            </div>


    </div>
  )
}

export default AttendaceRecord;