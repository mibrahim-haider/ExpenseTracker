// transactions.js
// import { renderTransactions } from './table-render';
import { fetchTransactions, getUserId } from '../dashboard.js';

export let transactions = [];


// Function to handle adding a new transaction
export const addTransaction = async () => {
  //  used here const variaable name as starts from capital letter because i use in database as it is 
  const type = document.getElementById('type').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const description = document.getElementById('description').value;
  const userId = await getUserId();
  if (!isNaN(amount) && amount > 0) {

    const transaction = {
      type,
      amount,
      category,
      description,
      date: new Date().toLocaleDateString('en-GB'), // ISO format (yyyy-mm-dd) // Add current date
    };

    // Check if the transaction already exists in the transactions array
    const duplicate = transactions.some(existingTransaction =>
      existingTransaction.UserID === userId && // Ensure this matches the correct key for userId
      existingTransaction.amount === transaction.amount &&
      existingTransaction.category === transaction.category &&
      existingTransaction.date === transaction.date &&
      existingTransaction.description === transaction.description &&
      existingTransaction.type === transaction.type
    );

    if (duplicate) {
      alert('This transaction already exists.');
      return; // Stop the function here if duplicate is found
    }


    // Update the UI immediately
    transactions.push(transaction);
    // renderTransactions(transactions);
    console.log(transactions);
    console.log('done');
  
    // Send the transaction to the backend
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });

      if (!response.ok){
        alert('failed to add ');
        console.log(err);
        throw new Error('Failed to add transaction');
    

      } 

      // Optionally refetch transactions from the backend
      await fetchTransactions(); // This ensures consistency with the backend
    } catch (error) {
      console.error('Error adding transaction:', error);
    }

    // Clear input fields
    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').value = '';
  } else {
    alert('Please enter a valid amount');
  }
};




