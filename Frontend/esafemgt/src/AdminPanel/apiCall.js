import axios from 'axios';
import { APIURL } from '../APIURL/apiUrl';
import { SERVER_VARIABLES } from '../ServerVariables/serverVariables';
import { checkConnection } from '../Utils/common';



function getAdminJwtToken() {
    const isAuth = localStorage.getItem('isAuth');
    if(isAuth){
        const token = localStorage.getItem('adminToken');
        return token && token !== '' ? token : null; // Return null if token is empty
    }
   return null;
}

function redirectToLogin(){
    localStorage.setItem("isAuth" , '');
    window.location.href = "/";
    return;
}



export const fetchEmpAttRecords = async()=>{

    try{
        const token = getAdminJwtToken(); 
        if (token) {

        if(checkConnection()){

            // const obj = {
            //     empId : empId,
            //     date : date
            // }

            const response = await axios.post(APIURL + SERVER_VARIABLES.fetchEmployeeAttendanceRecords , {
                Authorization : `Bearer ${token}`
            }) 
            // const response = await axios.get(APIURL + SERVER_VARIABLES.fetchEmployeeAttendanceRecords + `/${empId}/${date}` , obj)

            if(response){

                return response;

            }else{
                return false;
            }

        }else{
            return false;
        }
        } else {
            console.error('Missing or empty JWT token');
            redirectToLogin();
        }
        

    }catch(err){
        console.log(err);
    }

}

export const fetchEmpAttendanceApi = async()=>{
    try{
        const token = getAdminJwtToken(); 
        if (token) {

            if(checkConnection()){

                const response = await axios.get(APIURL + SERVER_VARIABLES.fetchEmployeeAttendance , {
                    headers: {Authorization: `Bearer ${token}`},
                })
                if(response){
                    console.log(response)
                    return response;
                } else {
                    return false;
                }

            } else {
                return false;
            }
        } else {
            console.error('Missing or empty JWT token');
            redirectToLogin();
        }


    }catch(err){
        console.log(err)
        return false;
    }
}