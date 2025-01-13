import { updateBudgetProgress } from './budget-progress.js';
import { transactions } from './Transaction.js';
import { fetchBudgets } from '../dashboard.js';


// Global storage for budgets
export let budgets = [];

// Function to add a new budget
export const addBudget = async (category, amount, period) => {
  const existingBudget = budgets.find(b => b.category === category);

  if (existingBudget) {
    existingBudget.amount = amount;
    existingBudget.period = period;
  } else {
    budgets.push({ category, amount, period });
  }
  try {
    const response = await fetch('/api/budgets', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, amount, period }),
    });
    console.log('insert and update successfully database ');

    if (!response.ok) throw new Error('Failed to add/update budget');

    await fetchBudgets(); // Refresh budgets
  } catch (error) {
    console.error('Error adding/updating budget:', error);
    updateBudgetProgress(transactions);
  }
  
};





// Function to calculate progress for each budget
export const calculateBudgetStatus = (budget, transactions) => {
  const totalSpent = transactions
    .filter(t => t.type === 'expense' && t.category === budget.category)
    .reduce((sum, t) => sum + t.amount, 0);

  let remaining = budget.amount - totalSpent;
  if (remaining < 0) remaining = 0;

  const percentageSpent = (totalSpent / budget.amount) * 100;

  let color = 'green';
  let alert = '';

  if (percentageSpent > 50 && percentageSpent <= 80) {
    color = 'orange';
  } else if (percentageSpent > 80 && percentageSpent < 100) {
    color = 'yellow';
    alert = '⚠ Approaching budget limit';
  } else if (percentageSpent >= 100) {
    color = 'red';
    alert = '⚠ Budget exceeded!';
  }

  return { totalSpent, percentageSpent, remaining, color, alert };
};
