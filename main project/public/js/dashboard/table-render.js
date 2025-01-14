import { fetchTransactions } from '../dashboard.js';




export const renderTransactions = (transactions) => {
    const tableBody = document.getElementById('transactionTable');
    tableBody.innerHTML = '';
  
    // Handle empty table
    if (transactions.length === 0) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 4;
      cell.textContent = 'No transactions found';
      cell.style.textAlign = 'center';
      row.appendChild(cell);
      tableBody.appendChild(row);
      return;
    }


    transactions.forEach((transaction) => {
      const row = document.createElement('tr');
       // Set a unique ID for the row
      //  row.setAttribute('data-id', transaction.TransactionID);  // use name of transaction id as it is because we use in databas as it is 

      row.innerHTML = `
        <td>${transaction.date}</td>
        <td>${transaction.category}</td>
        <td>${transaction.description}</td>
        <td class="${transaction.type}">${transaction.type === 'income' ? '+' : '-'}$${transaction.amount} </td>
        <td class="delete-transaction-btn  del-t-btn " type="button" data-id="${transaction.TransactionID}">×</td>
      `;
      tableBody.appendChild(row);
    });
    const deleteTransactionButtons = document.querySelectorAll('.delete-transaction-btn');
    deleteTransactionButtons.forEach(td => {
      td.addEventListener('click', () => {
        const delTcategory = td.getAttribute('data-id');
        deleteTBudget(delTcategory);
        // deleteBudget(category);
      });
    });
};
  
// Delete a budget
const deleteTBudget = async (delTcategory) => {
  try {
    const response = await fetch(`/api/transactions/delete/${delTcategory}`, { method: 'DELETE', credentials: 'include' });
    if (!response.ok) throw new Error('Failed to delete budget');
    // console.log(`this is the id ${delTcategory} which deleted  `);s
    await fetchTransactions(); // Refresh table
  } catch (error) {
    console.error('Error deleting budget:', error);
  }
};
