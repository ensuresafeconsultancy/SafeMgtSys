import Swal from 'sweetalert2';

export const showLoadingAlert = ()=>{
  Swal.fire({
    title: 'Loading...',
    allowEscapeKey: false,
    allowOutsideClick: false,
    showConfirmButton: false,
    willOpen: () => {
      Swal.showLoading();
    }
  });
}

export const closeAlert = ()=>{
    Swal.close();
}

export const showAlert=(icon, title, text)=>{
  Swal.fire({
      icon: icon,
      title: title,
      text: text
  });
}

export const showSuccessAlert=()=> {
  Swal.fire({
    icon: 'success',
    title: 'Success!',
    timer: 1000, // Automatically close after 1 second (1000 milliseconds)
    showConfirmButton: false, // Hide confirm button
    allowOutsideClick: false // Prevent closing by clicking outside
  });
}

export const showFailureAlert=()=>{
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Something went wrong',
    showConfirmButton: true, // Show confirm button
    confirmButtonText: 'OK'
  });
}