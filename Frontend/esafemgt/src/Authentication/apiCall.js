
import axios from 'axios';
import { APIURL } from '../APIURL/apiUrl';
import { SERVER_VARIABLES } from '../ServerVariables/serverVariables';
import { showLoadingAlert , closeAlert , showSuccessAlert , showFailureAlert } from '../Utils/sweetAlertFunctions';
import { checkConnection } from '../Utils/common';
// import AuthContext from '../contexts/AuthContext'; // Replace with your context path
// import { useContext } from 'react';
export const employeeLogin = async(formData)=>{
    try{
        // const { setIsAuthenticated, setUserType } = useContext(AuthContext);
        if(checkConnection()){
            showLoadingAlert();
            console.log("making req")
            const response  = await axios.post(APIURL + SERVER_VARIABLES.employeeLogin , formData);
            closeAlert();
            if(response && response.data.token){
                // localStorage.setItem('employeeToken', response.data.token); // Store token in localStorage (optional)
                // setIsAuthenticated(true);
                // setUserType('employee'); // Update user type for routing or access control

                localStorage.setItem('isAuth' , true);
                localStorage.setItem('employeeToken' , response.data.token);
                localStorage.setItem('adminToken' , '');
                return true;
               
            } else {
                return false;
            }
        }else{
            return false;
        }
    }catch(err){
        closeAlert();
        return false;
    }
}


// localStorage.setItem('isAuth' , true);
// localStorage.setItem('employeeToken' , response.data.token);
// localStorage.setItem('adminToken' , '');


// localStorage.setItem('employeeIsAuth', true);
// localStorage.setItem('adminIsAuth', false);
// localStorage.setItem('employeeToken', response.data.token);
// localStorage.setItem('adminToken', '');


export const adminLogin = async(formData)=>{
    try{
        if(checkConnection()){
            showLoadingAlert();
            console.log("making req")
            const response  = await axios.post(APIURL + SERVER_VARIABLES.adminLogin , formData);
            closeAlert();
            if(response && response.data.token){
                localStorage.setItem('isAuth' , true);
                localStorage.setItem('adminToken' , response.data.token);
                localStorage.setItem('employeeToken' , '');

                // localStorage.setItem('employeeIsAuth', false);
                // localStorage.setItem('adminIsAuth', true);
                // localStorage.setItem('adminToken', response.data.token);
                // localStorage.setItem('employeeToken', '');
                return true;
            } else {
                return false;
            }
        }else{
            return false;
        }
    }catch(err){
        closeAlert();
        return false;
    }
}

export const adminRegister = async(formData)=>{
    try{
        if(checkConnection()){
            showLoadingAlert();
            console.log("making req")
            const response  = await axios.post(APIURL + SERVER_VARIABLES.adminRegister , formData);
            closeAlert();
            if(response){
                showSuccessAlert()
                return true;
            } else {
                showFailureAlert();
                return false;
            }
        }else{
            return false;
        }
    
    }catch(err){
        closeAlert();
        showFailureAlert();
        return false;
    }
}

