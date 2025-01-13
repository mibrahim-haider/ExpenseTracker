document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.getElementById('logoutbtn');

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      // this is the alert to confirm from user
      const userConfirmed = window.confirm("Are you sure you want to log out?");
      
      if (userConfirmed) {
        // If confirm 
        fetch('/api/logout', { method: 'POST' })
          .then(response => {
            if (response.ok) {
              // Redirect to the landing page on successful logout
              window.location.href = '/';
            } else {
              console.error('Logout failed.');
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
      // If the user click on cancle come back means nothing 
    });
  }
});
  


// for sidebar toggle btn 1 

document.getElementById('sidebarToggle').addEventListener('click', function () {
  const sidebar = document.getElementById('sidebar');
  const togglebtn = document.getElementById('sidebarToggle');
    sidebar.classList.remove('d-none'); // Show sidebar
    togglebtn.classList.add('d-none'); // hide toggle btn
});

// for sidebar toggle btn 2 (cross btn ) 

document.getElementById('cross-btn').addEventListener('click', function () {
  const sidebar = document.getElementById('sidebar');
  const togglebtn = document.getElementById('sidebarToggle');
  sidebar.classList.add('d-none'); // remove sidebar
  togglebtn.classList.remove('d-none'); // show toggle btn

//   if (!sidebar.classList.contains('d-none')) {
//     sidebar.classList.add('d-none'); // Show sidebar
//     tonglebtn.classList.remove('d-none'); // Show sidebar
// } else {
//     sidebar.classList.remove('d-none'); // Hide sidebar
// }

});



