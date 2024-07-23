// import React from 'react'
import '../assets/css/loginPage.css'
import EmployeeLogin from './employeeLogin'
import AdminLogin from './adminLogin'
// import PageNotFound from './pageNotFound'
import { Routes , Route , Link} from 'react-router-dom'
const Login = () => {
  return (
    <div id="login_page">
        <div className="container">
            <div className="row pt-4">
                <div className="col"></div>
                <div className="col-4">

                <div className="p-4 rounded-3 border border-dark">

                        <h3 className='fw-bold text-center pb-4'>Login</h3>

                        <div className="d-flex justify-content-center align-items-center gap-2 ">
                            <Link to="/" className="px-4 py-2 rounded-3 border w-100 text-center">Employee</Link>
                            <Link to="/adminLogin" className="px-4 py-2 rounded-3 border w-100 text-center">Admin</Link>
                        </div>

                        <Routes>
                            <Route path="/" element={<EmployeeLogin />} />
                            <Route path="/adminLogin" element={<AdminLogin />} />
                        </Routes>

                </div>

                </div>
                <div className="col"></div>
            </div>
        </div>       
    
    </div>
  )
}

export default Login