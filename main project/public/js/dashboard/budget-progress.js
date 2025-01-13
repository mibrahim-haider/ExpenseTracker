// this is the import from budget 
import { budgets, calculateBudgetStatus } from './budget.js';
import { fetchBudgets } from '../dashboard.js';



export const updateBudgetProgress = (transactions) => {
  const progressContainer = document.getElementById('budgetProgressContainer');
  progressContainer.innerHTML = '';

  if (budgets.length === 0) {
    const noBudgetMessage = document.createElement('div');
    noBudgetMessage.classList.add('no-budget-message');
    noBudgetMessage.textContent = 'No budgets set. Set a budget to start tracking your spending.';
    progressContainer.appendChild(noBudgetMessage);
  } else {
    // Create divs for Monthly and Yearly
    const monthlyDiv = document.createElement('div');
    monthlyDiv.style.marginBottom = "50px";
    monthlyDiv.innerHTML = `<h3 class="fs-6 muted text-center mb-2">Monthly</h3>`;
    const yearlyDiv = document.createElement('div');
    yearlyDiv.innerHTML = `<h3 class="fs-6 muted text-center mb-2">Yearly</h3>`;

    let hasMonthlyBudget = false;
    let hasYearlyBudget = false;

    budgets.forEach((budget) => {
      const { totalSpent, percentageSpent, remaining, color, alert } = calculateBudgetStatus(budget, transactions);
      const progressBar = createProgressBar(budget, totalSpent, percentageSpent, remaining, color, alert);

      // Append progress bar to respective period div
      if (budget.period === 'monthly') {
        monthlyDiv.appendChild(progressBar);
        hasMonthlyBudget = true;
        console.log('monthly here')
      } else if (budget.period === 'yearly') {
        yearlyDiv.appendChild(progressBar);
        hasYearlyBudget = true;
        console.log('Yearly here')

      }
    });

    // Show message if no budgets are set for monthly or yearly
    if (!hasMonthlyBudget) {
      const noMonthlyMessage = document.createElement('div');
      noMonthlyMessage.classList.add('no-budget-message');
      noMonthlyMessage.textContent = 'No monthly budgets set.';
      monthlyDiv.appendChild(noMonthlyMessage);
    }
    if (!hasYearlyBudget) {
      const noYearlyMessage = document.createElement('div');
      noYearlyMessage.classList.add('no-budget-message');
      noYearlyMessage.textContent = 'No yearly budgets set. Set a budget to start tracking your spending yearly.';
      yearlyDiv.appendChild(noYearlyMessage);
    }

    // Append monthly and yearly divs to progress container
    progressContainer.appendChild(monthlyDiv);
    progressContainer.appendChild(yearlyDiv);

    const deleteBudgetButtons = document.querySelectorAll('.delete-budget-btn');
    deleteBudgetButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        const period = button.getAttribute('data-period');
        deleteBBudget(category, period);
      });
    });
  }
};


// Delete a budget
const deleteBBudget = async (delcategory, period) => {
  try {
    const response = await fetch(`/api/budgets/${delcategory}/${period}`, { method: 'DELETE', credentials: 'include' });
    if (!response.ok) throw new Error('Failed to delete budget');
    console.log(`yahan tak ${delcategory} ${period} `);
    await fetchBudgets(); // Refresh budgets
  } catch (error) {
    console.error('Error deleting budget:', error);
  }
};



const createProgressBar = (budget, totalSpent, percentageSpent, remaining, color, alert) => {
  const progressBar = document.createElement('div');
  progressBar.classList.add('budget-progress-bar');
  progressBar.innerHTML = `
    <div class="mb-3 p-3 rounded shadow d-flex align-items-center" style="justify-content: space-between;">
      <div style="flex: 1;">
        <div class="d-flex justify-content-between mb-1">
          <span class="fw-medium">${budget.category}</span>
          <span class="text-muted" style="font-size: 14px;">$${totalSpent.toFixed(1)} / $${budget.amount.toFixed(1)}</span>
        </div>
        <div class="custom-progress-bar" style="width: 100%; height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden;">
          <div class="progress-custom-style" style="width: ${Math.min(percentageSpent, 100)}%; background-color: ${color}; height: 100%;"></div>
        </div>
        <div class="d-flex justify-content-between mt-1">
          <span class="text-muted" style="font-size: 14px;">${percentageSpent.toFixed(1)}% spent</span>
          <span class="text-muted" style="font-size: 14px;">Remain: $${remaining.toFixed(1)}</span>
        </div>
        ${alert ? `<div class="text-danger" style="font-size: 14px;">${alert}</div>` : ''}
      </div>
      <button class="delete-budget-btn del-b-btn py-4" data-category="${budget.category}" data-period="${budget.period}">×</button>
    </div>
  `;
  return progressBar;
};



