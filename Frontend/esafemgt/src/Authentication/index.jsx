import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'

import Login from './login';

import UserPanel from '../UserPanel';
import AdminPanel from '../AdminPanel';
import AdminRegister from './adminRegister';

const isAuth = localStorage.getItem("isAuth") || false;
const employeeAuth = localStorage.getItem("employeeToken") || false;
const adminAuth = localStorage.getItem("adminToken") || false;
console.log("Authentication : ", isAuth);

const Authentication = () => {
  return (
    <>
      <Router>
        {!isAuth ? (
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/adminRegister" element={<AdminRegister />} />
            <Route path="*" element={<Login />} />
          </Routes>
        ) : employeeAuth? (
          <Routes>
              <Route path="/" element={ <UserPanel />} />
              <Route path="/UserPanel" element={ <UserPanel />} />
              <Route path="/UserPanel/*" element={ <UserPanel />} />
          </Routes>
        ) : adminAuth? (
            <Routes>
              <Route path="/" element={ <AdminPanel />} />
              <Route path="/AdminPanel" element={ <AdminPanel />} />
              <Route path="/AdminPanel/*" element={ <AdminPanel />} /> 
            </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Login />} />
          </Routes>
        )
        }
      </Router>
    </>
  )
}

export default Authentication

