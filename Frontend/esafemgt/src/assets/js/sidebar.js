window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});


// const sidebarForms = document.getElementById('sidebarForms');

//  function openForms(event) {

//   const productTypeSidebar = document.getElementById('sidebarForms');
//   const changeDownArrow = productTypeSidebar.children[1]; // Assuming the second child is the down arrow

//   changeDownArrow.classList.toggle('transform_rotate_180deg');

//   const productTypeItems = document.getElementById('product_type_items');
//   productTypeItems.classList.toggle('d-none');

// }


// $('#product_type_sidebar').on('click', function (event) {

//     let product_type_sidebar = document.getElementById('product_type_sidebar')
//     let change_down_arrow = product_type_sidebar.children[1]
//     change_down_arrow.classList.toggle('transform_rotate_180deg')

//     let product_type_items = document.getElementById('product_type_items')
//     product_type_items.classList.toggle('d-none')
// });