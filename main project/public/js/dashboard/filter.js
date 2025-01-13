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
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
  
    return transactions.filter((t) => {
      if (searchKeyword && !(t.description.toLowerCase().includes(searchKeyword) || t.category.toLowerCase().includes(searchKeyword))) return false;
      if (category !== 'all' && t.category !== category) return false;
      if (type !== 'all' && t.type !== type) return false;
      if (startDate && new Date(t.date) <= new Date(startDate)) return false;
      if (endDate && new Date(t.date) >= new Date(endDate)) return false;
      return true;
    });
};
  