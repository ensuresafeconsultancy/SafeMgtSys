import { Link } from 'react-router-dom'
// import EnsureSafeLogo from '../assets/logos'
// import ESLogo from '../assets/logos/es_logo.png'

import { MdSpaceDashboard } from "react-icons/md";
// import { SiGoogleforms } from "react-icons/si";

// import downArrow from '../assets/logos/down_arrow.svg';
// import { IoIosArrowDown } from "react-icons/io";

import '../../assets/css/userSidebar.css'

export default function Sidebar(){

    function openForms(event) {

        const productTypeSidebar = document.getElementById('sidebarForms');
        const changeDownArrow = productTypeSidebar.children[1]; // Assuming the second child is the down arrow
      
        changeDownArrow.classList.toggle('transform_rotate_180deg');
      
        const productTypeItems = document.getElementById('product_type_items');
        productTypeItems.classList.toggle('d-none');
        // activeBtn(event)

        handleActiveBtnChange(event)
      
      }

      function handleActiveBtnChange(event) {
        // Get the parent container of the clicked div
        // const parentContainer = event.currentTarget.parentNode;
      
        // Get all divs within the container with the 'classTypeChange' class
        // const allDivs = parentContainer.querySelectorAll('.classTypeChange');
      
        // Remove 'registrationLogoBoxActive' from all divs within the container
        // allDivs.forEach(div => div.classList.remove('registrationLogoBoxActive'));
      
        // Add 'registrationLogoBoxActive' to the clicked div
        const clickedDiv = event.currentTarget;
        // clickedDiv.classList.add('registrationLogoBoxActive');
    
        const allDivs = document.querySelectorAll('.sidebarBtn');
          
        // Remove the 'registrationLogoBoxActive' class from all divs first
        allDivs.forEach(div => div.classList.remove('activeAdminBtnBg'));
      
        // Add the 'registrationLogoBoxActive' class only to the clicked div
        // const clickedDiv = event.currentTarget;
        clickedDiv.classList.add('activeAdminBtnBg');
    
    
    
    
      }

    //   function activeBtn(event){

    //     const activeBtnTag = event.target;

    //     const otherTags = document.getElementsByClassName('sidebarBtn');

    //     for(let i=0;i<otherTags.length;i++){
    //         otherTags.classList.remove('activeAdminBtnBg')
    //     }

    //     activeBtnTag.classList.add('activeAdminBtnBg')


    //     console.log("worlddddd" , activeBtnTag.classList)


    //   }

    // function activeBtn(event) {
    //     event.stopPropagation(); // Prevent bubbling
    
    //     const otherTags = document.getElementsByClassName('sidebarBtn');
    //     for (let i = 0; i < otherTags.length; i++) {
    //         otherTags[i].classList.remove('activeAdminBtnBg');
    //     }
    
    //     const activeBtnTag = event.target;
    //     activeBtnTag.classList.add('activeAdminBtnBg');
    //     console.log("worlddddd", activeBtnTag.classList);
    // }
    
    // onClick={(e)=>activeBtn(e)}
    return (
        <>
            <div className="border-end " id="sidebar-wrapper">
                <Link className="sidebar-heading text-decoration-none border-bottom d-flex align-items-center justify-content-center"  to="/admin/dashboard" >
                      <img src="" alt="" className='esLogoAdminpanel' />
                      <strong className="d-inline-block h6  fw-bolder m-0 text-nowrap">User Panel</strong> 
                </Link>

                <div className="" >
                    <div className="w-100 d-flex justify-content-start align-items-center  sidebarBtn" onClick={(event)=>handleActiveBtnChange(event)} >
                       
                        <Link className=" w-100 text-decoration-none d-flex justify-content-start p-3 gap-2 align-items-center" to="/UserPanel/dashboard" >
                        <MdSpaceDashboard className='btnIcon' />
                             Dashboard
                             </Link>
                    </div>
                </div>
                <div className="" >
                    <div className="w-100 d-flex justify-content-start align-items-center  sidebarBtn" onClick={(event)=>handleActiveBtnChange(event)} >
                       
                        <Link className=" w-100 text-decoration-none d-flex justify-content-start p-3 gap-2 align-items-center" to="/UserPanel/attendance" >
                        <MdSpaceDashboard className='btnIcon' />
                             Attendance
                        </Link>
                    </div>
                </div>

                {/* <div className="" id=''>

                    <div  id='sidebarForms' onClick={(event)=> openForms(event)} className="d-flex sidebarBtn justify-content-between align-items-center cursor_pointer p-3">
                        <div className="d-flex justify-content-center align-items-center ">
                            <SiGoogleforms   className='btnIcon' />
                            <h6 className="m-0 ps-2">Forms</h6>
                        </div>
                            <img src={downArrow} className="down_arrow change_down_arrow" id="" alt="" />
                            <IoIosArrowDown className="down_arrow change_down_arrow"  />
                    </div>

                    <div className='' id="product_type_items">

                        <div className="d-flex justify-content-start align-items-center  sidebarBtn" onClick={(event)=>handleActiveBtnChange(event)} >
                            <Link className="ps-5 w-100 text-decoration-none d-inline-block p-3" to="/admin/awshpForm" >AWSHP Forms</Link>
                            
                        </div>
                        <div className="d-flex justify-content-start align-items-center  sidebarBtn" onClick={(event)=>handleActiveBtnChange(event)} >
                            <Link className="ps-5 w-100 text-decoration-none d-inline-block p-3" to="/admin/vmbscForm" >vmbsc Forms</Link>
                            
                        </div>
                        <div className="d-flex justify-content-start align-items-center  sidebarBtn" onClick={(event)=>handleActiveBtnChange(event)} >
                            <Link className="ps-5 w-100 text-decoration-none d-inline-block p-3" to="/admin/wshcmForm" >WSHCM Forms</Link>
                            
                        </div>

                    </div>


                </div> */}
               
                
            </div>
            

        </>
    )
}