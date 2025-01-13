// const XLSX = require('xlsx');

// import * as XLSX from 'xlsx';

export const exportToCSV = (transactions) => { 
    if (!transactions.length) {
        alert("No transactions available to export.");
        return;
    }

    // Adjust dates to local time zone
    const formattedTransactions = transactions.map((t) => ({
        ...t,
        date: new Date(t.date).toLocaleDateString("en-GB"), // Converts to local date in 'DD/MM/YYYY' format    date become problem so focous on this its main 
    }));

    // Create CSV content
    const headers = ["Date", "Type", "Amount", "Category", "Description"];
    const rows = formattedTransactions.map((t) => [
        t.date,
        t.type,
        t.amount,
        t.category,
        t.description,
    ]);
    const csvContent =
        [headers, ...rows].map((row) => row.join(",")).join("\n");

    // Create a downloadable blob
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Trigger download
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};



// // Helper function to format the date to local format (YYYY-MM-DD) imp because it prevent to shift the date by 1
// const formatDateToLocal = (dateString) => {
//     const date = new Date(dateString); // Parse the date string
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
// };


export const exportToExcel = (transactions) => {
    if (!transactions.length) {
        alert("No transactions available to export.");
        return;
    }

    // Adjust dates to local time zone
    const formattedTransactions = transactions.map((t) => ({
        ...t,
        date: new Date(t.date).toLocaleDateString("en-GB"), // Converts to local date   date become problem so focous on this its main 
    }));

    // Create a worksheet from the transactions data
    const worksheet = XLSX.utils.json_to_sheet(formattedTransactions);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    // Generate a binary string for the workbook and create a downloadable file
    const excelData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelData], { type: "application/octet-stream" });

    // Create a download link and trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transactions.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
