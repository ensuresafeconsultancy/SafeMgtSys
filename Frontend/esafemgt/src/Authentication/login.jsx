// import React from 'react'
import '../assets/css/loginPage.css'
import EmployeeLogin from './employeeLogin'
import AdminLogin from './adminLogin'
// import PageNotFound from './pageNotFound'
import { useEffect } from 'react'
import { Routes , Route , Link , Navigate , useNavigate } from 'react-router-dom'
const Login = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const path = window.location.pathname;
        if (path === '/adminLogin') {
        navigate('/');
        }
    }, []);

    function handleActiveBtnChange(event) {
      
        const clickedDiv = event.currentTarget;
        const allDivs = document.querySelectorAll('.loginAccount');
        allDivs.forEach(div => div.classList.remove('loginAccActive'));
        clickedDiv.classList.add('loginAccActive');

      }


  return (
    <div id="login_page">
        <div className="container">
            <div className="row pt-4">
                <div className="col"></div>
                <div className="col-4">

                <div className="p-4 rounded-3 border border-dark">

                        <h3 className='fw-bold text-center pb-4'>Login</h3>

                        <div className="d-flex justify-content-center align-items-center gap-2 ">
                            <Link to="/" className="px-4 py-2 rounded-3 border w-100 text-center text-decoration-none loginAccount loginAccActive" onClick={(event)=>handleActiveBtnChange(event)}>Employee</Link>
                            <Link to="/adminLogin" className="px-4 py-2 rounded-3 border w-100 text-center text-decoration-none loginAccount" onClick={(event)=>handleActiveBtnChange(event)}>Admin</Link>
                        </div>

                        <Routes>
                            <Route path="/" element={<EmployeeLogin />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
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