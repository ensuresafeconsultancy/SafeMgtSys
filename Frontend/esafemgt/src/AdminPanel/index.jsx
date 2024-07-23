// import React from 'react'
import Sidebar from "../layouts/adminLayout/Sidebar"
import Header from "../layouts/userLayouts/Header"
import Dashboard from "./Dashboard"
import { Routes , Route } from "react-router-dom"
import AttendaceRecord from "./AttendanceRecords/AttendaceRecord"

const AdminPanel = () => {
  return (
    <div className="d-flex" id="wrapper">
        <Sidebar />
        <div id="page-content-wrapper">
          <Header />

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/attendanceRecords" element={<AttendaceRecord />} />

            {/* <Route path="/awshpForm" element={<AdminFormLists formName={'AWSHP'} addFormUrl={REG_FORM_URL_CLIENT_PATH.awshpForm} />} />
            <Route path="/vmbscForm" element={<AdminFormLists formName={'VMBSC'} addFormUrl={REG_FORM_URL_CLIENT_PATH.vmbscForm} />} />
            <Route path="/wshcmForm" element={<AdminFormLists formName={'WSHCM'} addFormUrl={REG_FORM_URL_CLIENT_PATH.wshcmForm} />} /> */}

            {/* <Route path="*" element={<Navigate to="/admin" replace />} /> */}
          </Routes>
        </div>
      </div>
)
}

export default AdminPanel;