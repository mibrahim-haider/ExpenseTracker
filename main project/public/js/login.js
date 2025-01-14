// here i create a function to call everytime popup alert msg  by showPopup(message)
function showPopup(message) {
  const popupAlert = document.getElementById('popupAlert'); // select element by id for popup-alert
  popupAlert.innerHTML = message;
  popupAlert.classList.add('show');

  // Remove the popup after 4 seconds
  setTimeout(() => {
    popupAlert.classList.remove('show'); // this remove show class
    popupAlert.style.display = 'none';
  }, 4000);

  popupAlert.style.display = 'block'; // Ensure it's visible
}

// frontend api call starts from here

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form from refreshing the page
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const alertMessageDiv = document.getElementById('alertMessage'); // Get the alert div for msg not popup-alert
  
    try {
      const response = await fetch('/api/of/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        //  alert(data.message); // for simple alert use this if not need stylish 
        alertMessageDiv.style.color = 'green';
        alertMessageDiv.innerHTML = data.message ;
        alertMessageDiv.style.display = 'block';

        // Optionally, store user ID or token for session management
        localStorage.setItem('userId', data.userId);

        // Redirect to the dashboard or expense tracking page
        // window.location.href = 'dashboard.html'; // for load page without wait of 2 sec 
        setTimeout(() => {
          window.location.href = '/';// after isAuthenticated / become dashboard
        }, 2000); // Redirect after 2 seconds  (set time out )
      } else {
        // alert(data.message); //  for simple alert use this if not need stylish 
        showPopup(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      // alert('Failed to register user.'); //for simple alert use this if not need stylish 
      showPopup('Failed to register user.');
    }
  });
  