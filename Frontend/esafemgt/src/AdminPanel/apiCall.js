import axios from 'axios';
import { APIURL } from '../APIURL/apiUrl';
import { SERVER_VARIABLES } from '../ServerVariables/serverVariables';
import { checkConnection } from '../UserPanel/Daily_Attendance/apiCall';
export const fetchEmpAttRecords = async(empId , date)=>{

    try{

        if(checkConnection()){

            const obj = {
                empId : empId,
                date : date
            }

            const response = await axios.post(APIURL + SERVER_VARIABLES.fetchEmployeeAttendanceRecords , obj)
            // const response = await axios.get(APIURL + SERVER_VARIABLES.fetchEmployeeAttendanceRecords + `/${empId}/${date}` , obj)

            if(response){

                return response;

            }else{
                return false;
            }

        }else{
            return false;
        }
        

    }catch(err){
        console.log(err);
    }

}