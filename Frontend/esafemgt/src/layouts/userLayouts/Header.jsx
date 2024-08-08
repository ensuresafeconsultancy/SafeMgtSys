import { useState } from "react";

import { GoSidebarCollapse } from "react-icons/go";
import { GoSidebarExpand } from "react-icons/go";
// import { useContext } from 'react';
// import AuthContext from '../../contexts/AuthContext'; // Replace with your context path

import Swal from 'sweetalert2';

export default function Header() {

    // const { logout } = useContext(AuthContext);
    const [iconChange , seticonChange] = useState(false);
    const iconChangeForSlider = () =>{
        if(iconChange){
            seticonChange(false);
        }else{
            seticonChange(true);
        }
    }

    const sideBarHideShow = (event)=>{
        const sidebarToggle = document.body.querySelector('#sidebarToggle');
        if (sidebarToggle) {
            // Uncomment Below to persist sidebar toggle between refreshes
            // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
            //     document.body.classList.toggle('sb-sidenav-toggled');
            // }
            // sidebarToggle.addEventListener('click', event => {
                event.preventDefault();
                document.body.classList.toggle('sb-sidenav-toggled');
               
                localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
            // });
        }
    }

    const logoutSwal = () => {
        Swal.fire({
          title: 'Logout',
          text: 'Are you sure you want to logout?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          dangerMode: true
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.setItem('isAuth', '');
            localStorage.setItem('employeeToken', '');
            localStorage.setItem('adminToken', '');
            // logout(); // Call the logout function from the context
            window.location.href = '/';
          }
        });
      };

   

    return (
        <>
           <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom py-1">
                <div className="container-fluid">
                    <span style={{cursor:'pointer' , fontSize:'27px'}} id="sidebarToggle" onClick={sideBarHideShow}>{iconChange?  <GoSidebarCollapse onClick={iconChangeForSlider} /> : <GoSidebarExpand  onClick={iconChangeForSlider} />   }</span>
                    {/* <span style={{cursor:'pointer' , fontSize:'27px'}} id="sidebarToggle" onClick={sideBarHideShow}>{iconChange?  <i onClick={iconChangeForSlider} className="fa-solid fa-circle-arrow-right"></i> : <i onClick={iconChangeForSlider} className="fa-solid fa-circle-arrow-left"></i>   }</span> */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
                    <div className="collapse navbar-collapse" style={{height:'55px'}} id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mt-2 mt-lg-0 me-5 d-flex align-items-center">
                      
                            <li className="nav-item mx-2"><a className="nav-link font-large" href="#!">Balaji K <i className="fa-regular fa-user"></i></a></li>
                            <li className="nav-item mx-2"><a className="nav-link font-large cursor_pointer" onClick={logoutSwal} >Logout <i className="fa-solid fa-arrow-right-from-bracket"></i></a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}