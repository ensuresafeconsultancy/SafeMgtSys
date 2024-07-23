import { useState } from 'react'

const EmployeeLogin = () => {

    const [userCredentials , setUserCredentials] = useState({
        role : 'Employee' , 
        userName : '',
        password : ''
    })
    const [validationErrors, setValidationErrors] = useState({});


    const handleSubmit = (event)=>{
        event.preventDefault();

        const errors = validateForm(); // Check for errors before submission

        if (Object.keys(errors).length === 0) {

        // adminLogin(userCredentials);
        
        // adminRegister(formData)
        // Submit form data (e.g., send to server using fetch or axios)
        console.log('Submitting form data:', userCredentials);
        // Clear form or redirect to success page
        } else {
            setValidationErrors(errors); // Display validation errors
        }

    }

    const validateForm = () => {
        const errors = {};

        if (userCredentials.password.length < 8) {
          alert("Password must be at least 8 characters")
          errors.password = 'Password must be at least 8 characters';
        }
    
        return errors;
      };

  return (
    <form onSubmit={()=>handleSubmit(event)}>
        <div className="form-group">
            <label htmlFor="userName" className="py-2">User Name :</label>
            <input type="text" className="form-control" onChange={(e)=>setUserCredentials({...userCredentials , userName : e.target.value})} required />
       
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
  )
}

export default EmployeeLogin