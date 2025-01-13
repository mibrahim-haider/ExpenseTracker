// Show popup alert message
export function showPopup(message) {
    const popupAlert = document.getElementById('popupAlert');
    popupAlert.innerHTML = message;
    popupAlert.classList.add('show');

    setTimeout(() => {
        popupAlert.classList.remove('show');
        popupAlert.style.display = 'none';
    }, 4000);

    popupAlert.style.display = 'block';
}

// Frontend API call handler
export async function handleUpdatePasswardForm(event) {
    event.preventDefault(); // Prevent form from refreshing the page

    const password = document.getElementById('password').value;
    const newPassword = document.getElementById('newPassword').value;

    const alertMessageDiv = document.getElementById('alertMessage'); // Alert message container

    try {
        const response = await fetch('/api/change/password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newPassword, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Display success message
            alertMessageDiv.style.color = 'green';
            alertMessageDiv.innerHTML = data.message;
            alertMessageDiv.style.display = 'block';
            setTimeout(() => {
                // Reload the page
                window.location.reload();
            }, 2000);
        } else {
            // Handle error message
            showPopup(data.message || 'Something went wrong.');
        }
    } catch (error) {
        console.error('Error:', error);
        showPopup('Failed to update password.');
    }
}