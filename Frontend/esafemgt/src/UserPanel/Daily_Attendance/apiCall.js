import axios from 'axios';
import { APIURL } from '../../APIURL/apiUrl'
import { SERVER_VARIABLES } from '../../ServerVariables/serverVariables';
import Swal from 'sweetalert2';
import { checkConnection } from '../../Utils/common';

function getEmpJwtToken() {
    const isAuth = localStorage.getItem('isAuth');
    if(isAuth){
        const token = localStorage.getItem('employeeToken');
        return token && token !== '' ? token : null; // Return null if token is empty
    }
   return null;
}

function redirectToLogin(){
    localStorage.setItem("isAuth" , '');
    window.location.href = "/";
    return;
}


export const submitCheckInTime = async(location ,lateReason, geoPhotos)=>{
    try{

        const token = getEmpJwtToken(); 
        if (token) {
            if(checkConnection()){

                    const newFormData = new FormData();
                    // newFormData.append('empId' , employee_Id);
                    if(location){
                        newFormData.append('location' , location)
                    }
                    if(lateReason){
                        newFormData.append('lateReason' , lateReason)
                    }
                    for(let i=0;i<geoPhotos.length;i++){
                        newFormData.append('geoPhotos' , geoPhotos[i])
                    }
                    Swal.fire({
                        title: 'Submitting',
                        text: 'Please wait...',
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        willOpen: () => {
                        Swal.showLoading();
                        }
                    });
                        
                    const response = await axios.post(APIURL + SERVER_VARIABLES.submitCheckInTime , newFormData , {
                        headers: { 'Content-Type': 'multipart/form-data' , Authorization: `Bearer ${token}`},
                    })

                    if(response && response.data.status === 1){
                        Swal.close();
                        return response;
                    } else {
                        Swal.close();
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Something went wrong. Please try again later.'
                        });

                        console.log("hello")
                        //   return false;
                    }
                    console.log(response)
                    return false;

                } else{
                    return false;
                }
            } else {
                console.error('Missing or empty JWT token');
                redirectToLogin();
            }
    
    }catch(err){
        Swal.close();
        Swal.fire({
            icon: 'error',
            title: err.message==="Network Error"? "Server Error" : "Error",
            text: 'Something went wrong. Please try again later.'
          });
        console.log(err.message);
    }
}

export const checkInList = async()=>{
    try{

        console.log("navigator.onLine = " , navigator.onLine)

        const token = getEmpJwtToken(); 
        if (token) {
            if(checkConnection()){
            
                    const response = await axios.get(
                    APIURL + SERVER_VARIABLES.checkInList,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                    );
            
                    if (response) {
                    return response;
                    }
            } else{
                return false;
            }
        } else {
            console.error('Missing or empty JWT token');
            redirectToLogin();
        }

        

    }catch(err){
        Swal.fire({
            icon: 'error',
            title: err.message==="Network Error"? "Server Error" : "Error",
            text: 'Something went wrong. Please try again later.'
          });
        console.log(err);
    }
}

export const empCheckOut = async(index)=>{
    try{

        const token = getEmpJwtToken();
        if(token){
            if(checkConnection()){
                    Swal.fire({
                        title: 'check-out',
                        text: 'Please wait...',
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        willOpen: () => {
                        Swal.showLoading();
                        }
                    });
        
                    const response = await axios.post(APIURL + SERVER_VARIABLES.empCheckOut + `/${index}` , {}, // No data in the body (optional, adjust if needed)
                    {
                    headers: { Authorization: `Bearer ${token}` }, // Attach token to headers
                    });
        
                    Swal.close();
        
                    if(response){
                        return response;
                    }else{
                        return false;
                    }

                }  else {
                return false;
            }
        } else {
            redirectToLogin();
        }

    }catch(err){
        Swal.fire({
            icon: 'error',
            title: err.message==="Network Error"? "Server Error" : "Error",
            text: 'Something went wrong. Please try again later.'
          });
        console.log(err);
    }
}