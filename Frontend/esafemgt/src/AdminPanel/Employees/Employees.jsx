import { useState , useEffect } from 'react'
import { fetchEmpAcc } from '../apiCall';
import { IoPersonAdd } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { convertTo12HourFormat } from '../../Utils/attendanceCommonFun';

const Employees = () => {

    const [employeeAccounts , setEmployeeAccounts] = useState([]);
    const [shiftData , setShiftData] = useState([]);

    useEffect(()=>{
        fetchEmployeeAccounts();
    }, [])

    const fetchEmployeeAccounts = async()=>{
        const response = await fetchEmpAcc();
        if(response){
            setEmployeeAccounts(response.data.EmployeeAccounts);
            setShiftData(response.data.shiftData);
        }
    }

    const getShiftName = (shiftId) => {
        const shift = shiftData.find(shift => shift._id === shiftId);
        return shift ? shift.shiftName : 'N/A';
    }

    const getShiftTiming = (shiftId) => {
        const shift = shiftData.find(shift => shift._id === shiftId);
        if (shift) {
            const startTime12Hr = convertTo12HourFormat(shift.startTime);
            const endTime12Hr = convertTo12HourFormat(shift.endTime);
            return `${startTime12Hr} - ${endTime12Hr}`;
        }
        return 'N/A';
    }
    
  return (
    <div className='p-2'>
        <div className="row p-2">
            <div className="col"></div>
            <div className="col-lg-8 col-12">
                <div className="row">
                    <div className="col"></div>
                    <div className="col-lg-6">
                        <h4 className='text-center py-3'>Employees</h4>
                    </div>
                    
                    <div className="col">
                        <Link className='my-lg-3 btn rounded-3 border addEmployee d-flex justify-content-center align-items-center gap-1 mb-3' to="/AdminPanel/addEmployees"> <IoPersonAdd /> Add</Link>
                    </div>

                </div>


                <div className="" style={{ overflowX : 'auto' }}>
                    <table className="table table-hover" >
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Shift</th>
                                <th>Shift Timing</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody style={{ overflowX : 'auto' }}>

                            {employeeAccounts && employeeAccounts.map((item  , index)=>(
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.employeeId}</td>
                                    <td>{item.employeeName}</td>
                                    <td>{item.employeeEmail}</td>
                                    <td>{getShiftName(item.shift)}</td>
                                    <td>{getShiftTiming(item.shift)}</td>
                                    <td>Actions</td>
                                </tr>
                            ))}

                        
                        </tbody>
                    </table>

                </div>


            </div>
            <div className="col">
                
            </div>
        </div>
          
    </div>
  )
}

export default Employees;