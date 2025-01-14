// Show popup alert message
function showPopup(message) {
  const popupAlert = document.getElementById('popupAlert');
  popupAlert.innerHTML = message;
  popupAlert.classList.add('show');

  setTimeout(() => {
    popupAlert.classList.remove('show');
    popupAlert.style.display = 'none';
  }, 4000);

  popupAlert.style.display = 'block';
}

// Frontend API call
document.getElementById('resetForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent form from refreshing the page

  const email = document.getElementById('email').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  const alertMessageDiv = document.getElementById('alertMessage'); // Alert message container

  // Check if passwords match
  if (newPassword !== confirmPassword) {
    showPopup('Passwords do not match!');
    return;
  }

  try {
    const response = await fetch('/api/of/of/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, newPassword, confirmPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      // Display success message
      alertMessageDiv.style.color = 'green';
      alertMessageDiv.innerHTML = data.message;
      alertMessageDiv.style.display = 'block';

      // Optionally, store user ID or token for session management
      localStorage.setItem('userId', data.userId);

      // Redirect after success (1 second delay)
      setTimeout(() => {
        window.location.href = 'login';
      }, 1000);
    } else {
      // Handle error message
      showPopup(data.message || 'Something went wrong.');
    }
  } catch (error) {
    console.error('Error:', error);
    showPopup('Failed to reset password.');
  }
});