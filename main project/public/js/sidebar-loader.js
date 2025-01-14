async function loadSidebar() {
    try {
        const response = await fetch('./html/sidebar.html'); // Adjust the path
        if (response.ok) {
            const sidebarHTML = await response.text();
            document.getElementById('sidebar-container').innerHTML = sidebarHTML;

            // Attach event listeners (if needed)
            initializeSidebar();
        } else {
            console.error('Failed to load sidebar:', response.status);
        }
    } catch (error) {
        console.error('Error loading sidebar:', error);
    }
}

function initializeSidebar() {
    const links = document.querySelectorAll('#sidebar a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.href.split('/').pop();
            history.pushState(null, '', `/home/${page}`);
            // loadPage(page);
        });
    });
}

// Load the sidebar when the page is ready
document.addEventListener('DOMContentLoaded', loadSidebar);