// main.js

import { transactions, addTransaction } from './dashboard/Transaction.js';
import { calculateTotalIncome, calculateTotalExpenses, updateTotals } from './dashboard/display.js';
import { renderTransactions } from './dashboard/table-render.js';
import { addCategoryInFilter, filterTransactions } from './dashboard/filter.js';
import { sortTransactions, sortColumn } from './dashboard/sort.js';
// for budget 
import { addBudget, budgets, calculateBudgetStatus } from './dashboard/budget.js';
import { updateBudgetProgress } from './dashboard/budget-progress.js';
// for database


// Function to fetch all transactions from the backend
export const fetchTransactions = async () => {
  try {
    const response = await fetch('/api/345refS3Ddd/transactions', {
      method: 'GET',
      credentials: 'include', // Includes session cookie for authenticated requests
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    const data = await response.json(); // Assuming the response contains an array of transactions
    data.forEach((t) => {
      t.amount = parseFloat(t.amount);
      t.date = new Date(t.date).toLocaleDateString('en-GB');   // Ensure amount is a number
    });
    // Update the local transactions array
    transactions.length = 0; // Clear the existing array
    transactions.push(...data); // Populate with new data


    // Update the UI
    renderTransactions(transactions);
    addCategoryInFilter(transactions);
    updateTotals(transactions);
    await fetchBudgets();  // for budget progress 
    console.log(transactions);

  } catch (error) {
    console.error('Error fetching transactions:', error);
  }
};


// Fetch all budgets from the backend
export const fetchBudgets = async () => {
  try {
    const response = await fetch('/api/fsrt465hrv/budgets', { method: 'GET', credentials: 'include' });
    if (!response.ok) throw new Error('Failed to fetch budgets');
    const data = await response.json(); // Assuming the response contains an array of transactions
    data.forEach((b) => {
      b.amount = parseFloat(b.amount); // Ensure amount is a number
    });
    // Update the local transactions array
    budgets.length = 0; // Clear the existing array
    budgets.push(...data); // Populate with new data
    console.log('retrive and update successfully app ');

    updateBudgetProgress(transactions); // Update the progress bars with fetched budgets
    console.log(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
  }
};


// Function to fetch userId from the session
export async function getUserId() {
  try {
    const response = await fetch('/api/user/id/from/cookies', { credentials: 'include' });
    if (!response.ok) {
      throw new Error('User not logged in');
    }
    const data = await response.json();
    return data.userId; // Extract the userId from the response
  } catch (error) {
    console.error('Error fetching userId:', error);
    return null; // Return null if user is not logged in
  }
}

// Use this function in your `addTransaction` function




// Combined Event Listener for Filter which Changes 
const filterElements = [
  'categoryFilter',
  'typeFilter',
  'startDate',
  'endDate'
];
// input for serch 
document.getElementById('search').addEventListener('input', () => {
  const filtered = filterTransactions(transactions);
  renderTransactions(filtered);
});
// changes here 
filterElements.forEach((id) => {
  document.getElementById(id).addEventListener('change', () => {
    const filtered = filterTransactions(transactions);
    renderTransactions(filtered);
  });
});

// Event Listener for Sorting Columns
document.querySelectorAll('.sortable').forEach((header) => {
  header.addEventListener('click', () => {
    const column = header.dataset.column;
    const sortedTransactions = sortTransactions(transactions, column);
    renderTransactions(sortedTransactions);
  });
});

// Event Listener for Adding Transactions
document.getElementById('addTransactionBtn').addEventListener('click', (e) => {
  e.preventDefault();
  addTransaction();

});

// Initial Render first now not need this because fetch transactions this 
renderTransactions(transactions);
updateTotals(transactions);



// for budget  
document.getElementById('setBudgetBtn').addEventListener('click', (e) => {
  e.preventDefault();
  const category = document.getElementById('budgetCategory').value;
  const amount = parseFloat(document.getElementById('budgetAmount').value);
  const period = document.getElementById('budgetPeriod').value;

  if (category && !isNaN(amount) && amount > 0) {
    document.getElementById('budgetCategory').value = '';
    document.getElementById('budgetAmount').value = '';

    addBudget(category, amount, period);
  } else {
    alert('Please enter valid budget details');
  }
});

// Initial render now no need this is also done by fetching budgets
// updateBudgetProgress(transactions);
// setInterval(() => updateBudgetProgress(transactions), 200);
// Load transactions on page load
document.addEventListener('DOMContentLoaded', async () => {
  await fetchTransactions(); // Fetch and render transactions on page load
  fetchBudgets();
});




// --------------------------------------------------------------------------------------------------------------------------