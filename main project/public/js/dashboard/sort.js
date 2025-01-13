// sort.js

export let sortDirection = 'descending';
export let sortColumn = 'date';

const updateSortStatus = (column) => {
    // Update the sort status text
    document.getElementById('sortStatus').innerHTML = `
      <embed src="../images/arrow-up-down.svg" type="image/svg+xml" width="22" height="22" class="me-2" />
      Sorted by ${column} (${sortDirection})
    `;
  
    // Update the column header indicator
    document.querySelectorAll('th').forEach((header) => header.classList.remove('ascending', 'descending'));
    document.querySelector(`th[data-column="${column}"]`).classList.add(sortDirection);
};

export const sortTransactions = (transactions, column) => {
  sortDirection = sortDirection === 'ascending' ? 'descending' : 'ascending';
  sortColumn = column;

  const sortedTransactions = [...transactions].sort((a, b) => {
    const aValue = column === 'amount' ? parseFloat(a[column]) : String(a[column] || '').toLowerCase();
    const bValue = column === 'amount' ? parseFloat(b[column]) : String(b[column] || '').toLowerCase();

    if (aValue === bValue) return 0;
    return sortDirection === 'ascending' ? (aValue < bValue ? -1 : 1) : (aValue < bValue ? 1 : -1);
  });
  // Update sort status and re-render the table
  updateSortStatus(column);

  return sortedTransactions;
};
