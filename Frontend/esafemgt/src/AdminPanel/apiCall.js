import axios from 'axios';
import { APIURL } from '../APIURL/apiUrl';
import { SERVER_VARIABLES } from '../ServerVariables/serverVariables';
import { checkConnection } from '../Utils/common';

import { showLoadingAlert , closeAlert , showAlert } from '../Utils/sweetAlertFunctions';

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


//not used
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

export const downloadMonAttendanceApi = async(employeeId , month)=>{
    try{

        const token = getAdminJwtToken(); 
        if (token) {

            if(checkConnection()){
                showLoadingAlert();

                const response = await axios.get(APIURL + SERVER_VARIABLES.downloadMonthlyAttendance + `/${employeeId}/${month}`,{
                    headers : {Authorization : `Bearer ${token}`}
                });
                closeAlert();
                if(response){
                    const url = `${APIURL}/${response.data.filePath}`; // Use the file path from the backend
                    window.open(url, '_blank'); // Open the PDF in a new tab
                    return true;
                }

            } else {
                return false;
            }
        } else {
            console.error('Missing or empty JWT token');
            redirectToLogin();
        }

    }catch(err){
        closeAlert();
        showAlert('error', 'Not found', err.response.data.message);
        console.log(err)
        return false;
        
    }
}


export const fetchEmpAcc = async()=>{
    try{

        const token = getAdminJwtToken(); 
        if (token) {

            if(checkConnection()){

                const response = await axios.get(APIURL + SERVER_VARIABLES.fetchEmployeeAccounts ,{
                    headers : {Authorization : `Bearer ${token}`}
                });

                if(response){
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
        closeAlert();
        showAlert('error', 'Not found', err.response.data.message);
        console.log(err)
        return false;
        
    }
}

export const fetchShiftDetails = async()=>{
    try{

        const token = getAdminJwtToken(); 
        if (token) {

            if(checkConnection()){

                const response = await axios.get(APIURL + SERVER_VARIABLES.fetchShiftDetails ,{
                    headers : {Authorization : `Bearer ${token}`}
                });

                if(response){
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
        closeAlert();
        showAlert('error', 'Not found', err.response.data.message);
        console.log(err)
        return false;
        
    }
}

export const registerEmployee = async(newFormData)=>{
    try{

        const token = getAdminJwtToken(); 
        if (token) {

            if(checkConnection()){

                try {
                    showLoadingAlert()
              
                    const response = await axios.post(APIURL + SERVER_VARIABLES.registerEmployee, newFormData, {
                      headers: { 'Content-Type': 'multipart/form-data' , Authorization : `Bearer ${token}`},
                    });
              
                    closeAlert();

                    if (response) {
                        showAlert('success' , 'sucess');
                      console.log(response);
                      console.log("File uploaded successfully");
                    } else {
                        showAlert('error', 'Error!', response.data);
                    }
                  } catch (error) {
                    showAlert('error', 'Error uploading image', error.response.data);

                    console.error('Error uploading image:', error);
                  }

            } else {
                return false;
            }
        } else {
            console.error('Missing or empty JWT token');
            redirectToLogin();
        }

    }catch(err){
        closeAlert();
        showAlert('error', 'Not found', err.response.data.message);
        console.log(err)
        return false;
        
    }
}