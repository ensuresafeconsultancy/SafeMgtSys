
import './App.css'
// import DailyAttendance from './Daily_Attendance'
import Attendance from './Daily_Attendance/Attendance'

import './assets/css/dailyAttendance.css'

import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'
function App() {

  return (
    <>
      {/* <DailyAttendance /> */}
     

      <Router>

          <Routes>

            <Route path="" element={ <Attendance />} />

            
          </Routes>




      </Router>


    </>
  )
}

export default App;
