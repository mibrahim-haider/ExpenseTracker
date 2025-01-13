import { exportToCSV, exportToExcel } from "./settings/Export-csv-excel.js";
import { importTransactions, parseCSV, handleCSVImport, handleExcelImport } from "./settings/import-csv-excel.js";
import { deleteAllData } from "./settings/clear.js";
import { handleUpdatePasswardForm, showPopup } from "./settings/change-passward.js";






// import { fetchTransactions } from "./dashboard.js";


let transactions = [];

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
            t.amount = parseFloat(t.amount); // Ensure amount is a number
        });
        // Update the local transactions array
        transactions.length = 0; // Clear the existing array
        transactions.push(...data); // Populate with new data

    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
};

// Event listener for file input
document.getElementById("importBtn").addEventListener("click", () => {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0]; // Get the selected file

    if (!file) {
        alert("Please select a file.");
        return;
    }
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension === "csv") {
        handleCSVImport(file);
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
        handleExcelImport(file);
    } else {
        alert("Unsupported file format. Please upload a CSV or Excel file.");
    }

});


document.getElementById("delBtn").addEventListener("click", async () => {
    deleteAllData();
});

document.getElementById("changeForm").addEventListener("submit", handleUpdatePasswardForm);

document.getElementById("exportCSVBtn").addEventListener("click", async () => {
    exportToCSV(transactions);
});

document.getElementById("exportExcelBtn").addEventListener("click", async () => {
    exportToExcel(transactions);
});



// profile
async function fetchUserProfile() {
    try {
        const response = await fetch('/api/user-profile');
        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }
        const userData = await response.json();

        // Update the DOM elements with the user data
        document.getElementById('name').textContent = userData.FullName;
        document.getElementById('email').textContent = userData.Email;
        console.log(userData.FullName)
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

// Attach event listener to the button
document.addEventListener("DOMContentLoaded", async () => {
    await fetchUserProfile();
    await fetchTransactions(); // Fetch transactions from the database
    console.log(transactions);
});


