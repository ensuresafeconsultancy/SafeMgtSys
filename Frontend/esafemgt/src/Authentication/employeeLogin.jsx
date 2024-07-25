import { useState } from 'react'
import { employeeLogin } from './apiCall';


const EmployeeLogin = () => {

    const [userCredentials , setUserCredentials] = useState({
        role : 'Employee' , 
        email : '',
        password : ''
    })
    const [validationErrors, setValidationErrors] = useState({});


    const handleSubmit = async(event)=>{
        event.preventDefault();

        const errors = validateForm(); // Check for errors before submission

        if (Object.keys(errors).length === 0) {

            const response = await employeeLogin(userCredentials);

            if(response){
                window.location.href="/"
            } else {
                // Handle login failure (e.g., show error message)
                console.log('Login failed');
              }


        console.log('Submitting form data:', userCredentials);

        } else {
            setValidationErrors(errors); // Display validation errors
        }

    }

    const validateForm = () => {
        const errors = {};

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userCredentials.email)) {
            alert("Invalid email format")
      
            errors.email = 'Invalid email format';
          }

        if (userCredentials.password.length < 8) {
          alert("Password must be at least 8 characters")
          errors.password = 'Password must be at least 8 characters';
        }
    
        return errors;
      };

  return (
    <form onSubmit={()=>handleSubmit(event)}>
        <div className="form-group">
            <label htmlFor="userEmail" className="py-2">Email :</label>
            <input type="email" className="form-control" onChange={(e)=>setUserCredentials({...userCredentials , email : e.target.value})} required />
            {validationErrors.email && (
                      <div className="invalid-feedback">{validationErrors.email}</div>
                    )}
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

export default EmployeeLogin