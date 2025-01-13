const contentDiv = document.getElementById('content');
const links = document.querySelectorAll('#sidebar a');

async function loadPage(page) {
    const url = `/api/djfFGdgtdDth/%20ffD/%20/${page}`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const html = await response.text();
            contentDiv.innerHTML = html;
            // Handle sidebar navigation clicks
           initializePageLogic();

        } else {
            throw new Error('Page not found');
        }
    } catch (error) {
        contentDiv.innerHTML = `<p>Error loading page: ${error.message}</p>`;
    }
}


// Handle sidebar navigation clicks
links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.href.split('/').pop();
        history.pushState(null, '', `/home/${page}`);
        loadPage(page);
        // initializePageLogic();

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



function initializePageLogic() {
    // Re-attach event listeners for filters, buttons, etc.

    // Example for handling the 'addTransaction' button dynamically
    const addTransactionBtn = document.getElementById('addTransactionBtn');
    if (addTransactionBtn) {
        addTransactionBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addTransaction();
            updateBudgetProgress(budgets);
            renderTransactions(transactions); // Automatically update the table with all transactions
            addcategoryinfilter(transactions); // Update category filter
        });
    }
    // Using event delegation for filter changes
    contentDiv.addEventListener('change', (e) => {
        if (e.target.matches('#categoryFilter, #typeFilter, #startDate, #endDate')) {
            filterTransactions();
        }
    });

    // Handle search input dynamically
    contentDiv.addEventListener('input', (e) => {
        if (e.target.matches('#search')) {
            filterTransactions();
        }
    });
    // Sorting logic (dynamically add event listener for sorting)
    document.querySelectorAll('.sortable').forEach((header) => {
        header.addEventListener('click', () => {
            const column = header.dataset.column; // Get the column name from a data attribute
            sortTransactions(column);
        });
    });



    const addbudgetbtn = document.getElementById('setBudgetBtn');

    addbudgetbtn.addEventListener('click', (e) => {
        e.preventDefault();
        const category = document.getElementById('budgetCategory').value;
        const amount = parseFloat(document.getElementById('budgetAmount').value);
        const period = document.getElementById('budgetPeriod').value;

        if (category && !isNaN(amount) && amount > 0) {
            addBudget(category, amount, period);

            // Clear input fields
            document.getElementById('budgetCategory').value = '';
            document.getElementById('budgetAmount').value = '';
            // document.getElementById('budgetPeriod').value = 'Monthly';
        } else {
            alert('Please enter valid budget details');
        }

    });
    // Re-render transactions after page load
    if (typeof renderTransactions === 'function' && transactions) {
        renderTransactions(transactions);
    }

    // Re-attach budget-related logic (if any)
    if (typeof updateBudgetProgress === 'function') {
        updateBudgetProgress(); // Update budget progress dynamically
    }
    // Re-attach budget-related logic (if any)
    // updateBudgetProgress(); // Update budget progress dynamically

    // Attach any other page-specific initialization logic here...
}