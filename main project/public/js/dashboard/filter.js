// filter.js

export const addCategoryInFilter = (transactions) => {
    const categorySelect = document.getElementById('categoryFilter');
    categorySelect.innerHTML = '';
  
    // Add "All Categories" option
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.innerText = 'All Categories';
    categorySelect.appendChild(allOption);
  
    // Add unique categories
    const uniqueCategories = new Set(transactions.map((t) => t.category));
    uniqueCategories.forEach((category) => {
      const option = document.createElement('option');
      option.innerText = category;
      option.value = category;
      categorySelect.appendChild(option);
    });
};
  
export const filterTransactions = (transactions) => {
  const searchKeyword = document.getElementById('search').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const type = document.getElementById('typeFilter').value;
  const startDate = document.getElementById('startDate').value; // in YYYY-MM-DD
  const endDate = document.getElementById('endDate').value; // in YYYY-MM-DD

  console.log(startDate);

  // Parse transaction date from DD/MM/YYYY to Date object
  const parseTransactionDate = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day); // Month is zero-based
  };

  // Convert startDate and endDate from YYYY-MM-DD to Date objects
  const parsedStartDate = startDate ? new Date(startDate) : null;
  const parsedEndDate = endDate ? new Date(endDate) : null;

  return transactions.filter((t) => {
    const transactionDate = parseTransactionDate(t.date);

    if (searchKeyword && !(t.description.toLowerCase().includes(searchKeyword) || t.category.toLowerCase().includes(searchKeyword))) return false;
    if (category !== 'all' && t.category !== category) return false;
    if (type !== 'all' && t.type !== type) return false;
    // Date comparisons with equality for startDate
    if (parsedStartDate && transactionDate < parsedStartDate) return false; // Include startDate
    if (parsedEndDate && transactionDate > parsedEndDate) return false;
    return true;
  });
};
  
