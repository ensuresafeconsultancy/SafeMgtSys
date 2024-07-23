import axios from 'axios';
import { APIURL } from '../APIURL/apiUrl';
import { SERVER_VARIABLES } from '../ServerVariables/serverVariables';
import Swal from 'sweetalert2';

function checkConnection() {
    if (navigator.onLine) {
      console.log("You are online");
      return true;
    } else {
      // Enhanced SweetAlert2 for Offline Message:
      Swal.fire({
        icon: 'error', // Use the 'error' icon for better visual feedback
        title: 'Oops! No internet connection',
        text: 'Please check your internet connection and try again.',
        showConfirmButton: true,
        confirmButtonColor: '#3085d6', // Customize button color (optional)
      });

      return false;
    }
  }


export const submitCheckInTime = async(location ,lateReason, geoPhotos)=>{
    try{


    const newFormData = new FormData();

    newFormData.append('empId' , '669b70de7f081744a4a62128');

    if(location){
        newFormData.append('location' , location)
    }
    if(lateReason){
        newFormData.append('notes' , lateReason)
    }

    for(let i=0;i<geoPhotos.length;i++){
        newFormData.append('geoPhotos' , geoPhotos[i])
    }
    
    if(checkConnection()){

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
            headers: { 'Content-Type': 'multipart/form-data' },
        })

        if(response && response.data.status === 1){
            Swal.close();
            // Swal.fire({
            //   icon: 'success',
            //   title: 'Success',
            //   text: 'Successfully submitted!'
            // });
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
        // Swal.close();
        console.log("hello 2")
    
        console.log(response)
        return false;
    }else{

        return false;

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

export const checkInList = async(employeeId)=>{
    try{

        console.log("navigator.onLine = " , navigator.onLine)

        if(checkConnection()){
            const response = await axios.get(APIURL + SERVER_VARIABLES.checkInList + `/${employeeId}`);
            if(response){
                return response;
            }
        }else{
            return false;
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

export const empCheckOut = async(empId , index)=>{
    try{

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

            const response = await axios.post(APIURL + SERVER_VARIABLES.empCheckOut + `/${empId}/${index}`)

            Swal.close();

            if(response){
                return response;
            }else{
                return false;
            }

        } else {
            return false;
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