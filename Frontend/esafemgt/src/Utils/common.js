import Swal from 'sweetalert2';

export const checkConnection = ()=> {
    if (navigator.onLine) {
      console.log("You are online");
      return true;
    } else {
      // Enhanced SweetAlert2 for Offline Message:
      Swal.fire({
        icon: 'error', // Use the 'error' icon for better visual feedback
        title: 'Oops! No internet connection',
        text: 'Please check your internet connection and try again.',
        showConfirmButton: true,
        confirmButtonColor: '#3085d6', // Customize button color (optional)
      });

      return false;
    }
  }