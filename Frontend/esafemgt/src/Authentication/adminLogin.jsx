// import React from 'react'
import { useState } from 'react'
import { adminLogin } from './apiCall';
const AdminLogin = () => {

    const [userCredentials , setUserCredentials] = useState({
        role : 'Admin' , 
        email : '',
        password : ''
    })
    const [validationErrors, setValidationErrors] = useState({});


    const handleSubmit = async(event)=>{
        event.preventDefault();

        const errors = validateForm(); // Check for errors before submission

        if (Object.keys(errors).length === 0) {

            console.log('Submitting form data:', userCredentials);
            const response = await adminLogin(userCredentials);
            if(response){
                window.location.href = "/AdminPanel";
            }

        } else {
            setValidationErrors(errors); // Display validation errors
        }

    }

    const validateForm = () => {
        const errors = {};

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userCredentials.email)) {
            errors.email = 'Invalid email format';
            alert("Invalid email format")
      
          }

        if (userCredentials.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
          alert("Password must be at least 8 characters")
        }
    
        return errors;
      };

  return (
    <form onSubmit={()=>handleSubmit(event)}>
        <div className="form-group">
            <label htmlFor="adminEmail" className="py-2">Admin email :</label>
            <input type="email" className="form-control" onChange={(e)=>setUserCredentials({...userCredentials , email : e.target.value})} required />
       
        </div>
        <div className="form-group">
            <label htmlFor="password" className="py-2">Password :</label>
            <input type="password" className="form-control" onChange={(e)=>setUserCredentials({...userCredentials , password : e.target.value})} required />
            {validationErrors.password && (
                    <div className="invalid-feedback">{validationErrors.password}</div>
                )}
        </div>
        <div className="pt-4 text-center">
            <button type='submit' className="btn btn-primary">Submit</button>
        </div>
    </form>
  )
}

export default AdminLogin