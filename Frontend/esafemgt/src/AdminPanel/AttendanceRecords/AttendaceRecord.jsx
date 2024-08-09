import {useState , useEffect} from 'react'

// import { fetchEmpAttRecords ,fetchEmpAttendanceApi } from "../apiCall";
import { fetchEmpAttendanceApi , downloadMonAttendanceApi } from "../apiCall";
import { convertMinutesToHMS } from '../../Utils/attendanceCommonFun';
import { IoMdDownload } from "react-icons/io";
import { FaEye } from "react-icons/fa";

import '../../assets/css/adminAttendanceRecords.css'
const AttendaceRecord = () => {

    const [attendanceList , setAttendanceList] = useState([]);
    const [attendanceRecords , setAttendanceRecords] = useState([]);


    useEffect(()=>{

        fetchEmployeeAttendance();

    },[])
   

    const fetchEmployeeAttendance = async()=>{
        const response = await fetchEmpAttendanceApi();
        if(response){
            setAttendanceList(response.data)
        }
    }

    console.log(attendanceList)

    const downloadMonthlyAttendance = async(employeeId , month)=>{

        await downloadMonAttendanceApi(employeeId , month);

    }

    const fetchAttendanceRecords = async(ID)=>{

        if(attendanceList){
            const gotEmpRecord = attendanceList.filter((item)=> item._id == ID)
            console.log(gotEmpRecord)
            setAttendanceRecords(gotEmpRecord[0].records)
        }
                
    }

    const months = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
      ];


  return (
    <div id="Attendance_Records" className="p-3">

        {/* <div className="row p-2">
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
        </div> */}

        <div className="row pt-3">
            <div className="col"></div>
            <div className="col-lg-10 col-12">
                <div className="dailyRecordsTable" >
                    <h5 className="text-center fw-bold">Today Check-in List</h5>

                    <table className="table table-hover" >
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Check-in Time</th>
                                <th>Late duration</th>
                                <th>Late Reason</th>
                                <th>Check-in Records</th>
                                {/* <th>Download</th> */}
           
                            </tr>
                        </thead>
                        <tbody style={{ overflowX : 'auto' }}>

                        {attendanceList && attendanceList.map((item, index) => (
                            <tr  className='' key={item._id} >
                                <td>{index + 1}.</td>
                                <td>{item.employeeId}</td>
                                <td>{item.employeeName}</td>
                                <td>{item.records && item.records[0] ? item.records[0].startTime : '-'}</td>
                                <td>{item.lateTime? item.lateTime : '-'}</td>
                                <td>{item.lateReason? item.lateReason : '-'}</td>
                                <td>
                                    <div className="d-flex justify-content-center align-items-center" >
                                        <div data-bs-toggle="modal" data-bs-target="#viewRecords" onClick={()=>fetchAttendanceRecords(item._id)} className="cursor_pointer p-2 bg-light rounded-circle d-flex justify-content-center align-items-center" >
                                             <FaEye />
                                        </div>
                                    </div>
                                    
                                   </td>
                                <td>
                                    
                                <div className="d-flex justify-content-center align-items-center" >
                                        {/* <div onClick={()=>downloadMonthlyAttendance(item.empId)} className="cursor_pointer p-2 bg-light rounded-circle d-flex justify-content-center align-items-center" >
                                             <IoMdDownload />
                                        </div> */}

                                        <div className="dropdown">
                                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <IoMdDownload />
                                            </a>

                                            <ul className="dropdown-menu">
                                            {months.map((month, index) => (
                                                <li key={index} onClick={() => downloadMonthlyAttendance(item.employeeId, index + 1)}>
                                                    <a className="dropdown-item" href="#">{month}</a>
                                                </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    
                                 
                                    
                                    </td>
                            </tr>
                            ))}
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

                    {/* {attendanceList && attendanceList[0]? <h5>Late reason : {attendanceList[0].lateReason}</h5> : ''} */}

                <table className="table table-hover" style={{overflowX : 'auto'}}>
                        <thead>
                       
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col" className='text-nowrap'>Work Location</th>
                                <th scope="col">Start time</th>
                                <th scope="col">End time</th>
                                <th scope="col" className='text-nowrap'>Total time</th>
                                <th scope="col" className='text-nowrap'>Check-In Address</th>
                                <th scope="col" className='text-nowrap'>Check-In Distance</th>
                                <th scope="col" className='text-nowrap'>Check-Out Address</th>
                                <th scope="col" className='text-nowrap'>Check-Out Distance</th>
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
                                        <td >{item.checkInAddress}</td>
                                        <td className='text-nowrap'>{item.checkInDistance} meters</td>
                                        <td >{item.checkOutAddress? item.checkOutAddress : `-`}</td>
                                        <td className='text-nowrap'>{item.checkOutDistance? `${item.checkOutDistance} meters` : `-`}</td>
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