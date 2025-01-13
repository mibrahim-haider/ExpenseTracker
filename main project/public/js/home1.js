const contentDiv = document.getElementById('content');
const links = document.querySelectorAll('#sidebar a');

async function loadPage(page) {
    const url = `/api/djfFGdgtdDth/%20ffD/%20/${page}`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const html = await response.text();
            contentDiv.innerHTML = html;

            // Re-attach event listeners for buttons after content is loaded
            // attachDynamicEventListeners();

            // Load the relevant JavaScript for the newly loaded content
        } else {
            throw new Error('Page not found');
        }
    } catch (error) {
        contentDiv.innerHTML = `<p>Error loading page: ${error.message}</p>`;
    }
}

// Function to attach event listeners to dynamically loaded buttons

// Handle sidebar navigation clicks
links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.href.split('/').pop();
        history.pushState(null, '', `/home/${page}`);
        loadPage(page);
    });
});

// Prevent /home and /home/home route
const currentPage = window.location.pathname.split('/').pop() || 'dashboard';
if (currentPage !== 'home') {
    loadPage(currentPage);
} else {
    history.replaceState(null, '', '/home/dashboard');
    loadPage('dashboard');
}



