

import { fetchTransactions } from '../settings.js';


// Function to handle CSV import
export const handleCSVImport = (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
        const csvContent = e.target.result;
        const transactions = parseCSV(csvContent);

        // Import transactions to the system
        await importTransactions(transactions);
    };
    reader.readAsText(file);
};

// Function to parse CSV content
export const parseCSV = (csvContent) => {
    const rows = csvContent
        .trim() // Remove any trailing spaces or newlines
        .split("\n")
        .map((row) => row.split(","));
    const [headers, ...data] = rows;

    // Map CSV rows to transaction objects
    return data.map((row) => {
        const rawDate = row[0]; // Assuming the date is in the first column
        let isoDate = null;

        if (rawDate && /^\d{2}\/\d{2}\/\d{4}$/.test(rawDate)) {                    // date become problem so focous on this its main 
            // Parse DD/MM/YYYY to ISO format (YYYY-MM-DD)
            const [day, month, year] = rawDate.split("/");
            isoDate = `${year}-${month}-${day}`;
        } else {
            console.error(`Invalid date format: ${rawDate}`);
        }

        return {
            date: isoDate, // Ensure 'YYYY-MM-DD' format
            type: row[1], // Assuming type is in the second column
            amount: parseFloat(row[2]), // Assuming amount is in the third column
            category: row[3], // Assuming category is in the fourth column
            description: row[4], // Assuming description is in the fifth column
        };
    });
};




export const importTransactions = async (newTransactions) => {
    try {
        // Send new transactions to the backend to check and update the database
        const response = await fetch("/api/import-transactions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTransactions),
        });

        if (!response.ok) {
            throw new Error("Failed to import transactions");
        }
        console.log('now');
         
        // Fetch updated transactions from the database
        await fetchTransactions(); // Re-fetch to update the system

        alert("Transactions imported successfully.");

        document.getElementById('importFile').value = '';
    } catch (error) {
        console.error("Error importing transactions:", error);
        alert("Error importing transactions.");
    }
};




export const handleExcelImport = (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Assuming the first sheet contains the data
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convert the sheet to JSON format
        const rawTransactions = XLSX.utils.sheet_to_json(firstSheet);

        // Format the dates in the transactions
        const transactions = rawTransactions.map((transaction) => {
            const rawDate = transaction.date; // Assumes the Excel column is named 'date'

            let isoDate = null;
            if (rawDate && /^\d{2}\/\d{2}\/\d{4}$/.test(rawDate)) {                               //date become problem so focous on this its main 
                // Parse DD/MM/YYYY to ISO format (YYYY-MM-DD)
                const [day, month, year] = rawDate.split("/");
                isoDate = `${year}-${month}-${day}`; // Rearrange to ISO format
            } else {
                console.error(`Invalid date format: ${rawDate}`);
            }

            return {
                ...transaction,
                date: isoDate, // Ensure 'YYYY-MM-DD' format
            };
        });

        // Import transactions to the system
        await importTransactions(transactions);
    };
    reader.readAsArrayBuffer(file);
};


