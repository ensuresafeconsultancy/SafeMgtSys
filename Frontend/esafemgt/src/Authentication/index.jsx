// import React from 'react'
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'
// import Attendance from '..'
import Login from './login';
// import PageNotFound from './pageNotFound';
import UserPanel from '../UserPanel';
import AdminPanel from '../AdminPanel';

const isAuth = localStorage.getItem("isAuth") || false;
console.log("Authentication : ", isAuth);

const Authentication = () => {
  return (
    <>
      {/* <DailyAttendance /> */}
     

      <Router>

      {isAuth ? (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Login />} />
          
        </Routes>
      ) : (

        <Routes>

            {/* <Route path="/" element={ <UserPanel />} />
            <Route path="/UserPanel" element={ <UserPanel />} />
            <Route path="/UserPanel/*" element={ <UserPanel />} /> */}

            <Route path="/" element={ <AdminPanel />} />
            <Route path="/AdminPanel" element={ <AdminPanel />} />
            <Route path="/AdminPanel/*" element={ <AdminPanel />} />




        </Routes>
      )
      }
        


      </Router>


    </>
  )
}

export default Authentication