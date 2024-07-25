// import React from 'react'
import '../assets/css/loginPage.css'
// import EmployeeLogin from './employeeLogin'
// import AdminLogin from './adminLogin'
// import PageNotFound from './pageNotFound'
// import { useEffect } from 'react'
// import { Routes , Route , Link , Navigate , useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { adminRegister } from './apiCall'

const AdminRegister = () => {

    const [userCredentials , setUserCredentials] = useState({
        role : 'Admin' , 
        adminName : '',
        adminEmail : '',
        password : ''
    })
    const [validationErrors, setValidationErrors] = useState({});


    const handleSubmit = async(event)=>{
        event.preventDefault();

        const errors = validateForm(); // Check for errors before submission

        if (Object.keys(errors).length === 0) {
            console.log('Submitting form data:', userCredentials);
            const response = await adminRegister(userCredentials);
            if(response){
                window.location.href = "/adminLogin";
            }
        } else {
            setValidationErrors(errors); // Display validation errors
        }

    }

    const validateForm = () => {
        const errors = {};

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userCredentials.adminEmail)) {
            alert("Invalid email format")
            errors.adminEmail = 'Invalid email format';
          }


        if (userCredentials.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
            alert("Password must be at least 8 characters")
        }
    
        return errors;
      };

  return (
    <div id="login_page">
        <div className="container">
            <div className="row pt-4">
                <div className="col"></div>
                <div className="col-4">

                <div className="p-4 rounded-3 border border-dark">

                        <h3 className='fw-bold text-center pb-4'>Admin register</h3>
                        <form onSubmit={(event)=>handleSubmit(event)}>
                                <div className="form-group">
                                    <label htmlFor="userName" className="py-2">Admin Name :</label>
                                    <input type="text" className="form-control" onChange={(e)=>setUserCredentials({...userCredentials , adminName : e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="userName" className="py-2">Admin email :</label>
                                    <input type="email" className="form-control" onChange={(e)=>setUserCredentials({...userCredentials , adminEmail : e.target.value})} required />
                                    {validationErrors.adminEmail && (
                                            <div className="invalid-feedback">{validationErrors.adminEmail}</div>
                                            )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="userName" className="py-2">Password :</label>
                                    <input type="password" className="form-control" onChange={(e)=>setUserCredentials({...userCredentials , password : e.target.value})} required />
                                    {validationErrors.password && (
                                            <div className="invalid-feedback">{validationErrors.password}</div>
                                        )}
                                </div>
                                <div className="pt-4 text-center">
                                    <button type='submit' className="btn btn-primary">Submit</button>
                                </div>
                            </form>
                </div>

                </div>
                <div className="col"></div>
            </div>
        </div>       
    
    </div>
  )
}

export default AdminRegister;