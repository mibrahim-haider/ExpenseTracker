import { updatePieChart, setupExportExpenseButton } from './reports/E-pie-chart.js';
import { updateIncomePieChart, setupExportIncomeButton } from './reports/I-pie-chart.js';
import { updateBarChart, filterTransactionsByMonth, calculateMonthlyCategoryTotals, setupExportBarButton } from './reports/bar-chart.js';




export let eTransactions = [];
export let iTransactions = [];

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
      t.amount = parseFloat(t.amount);
      t.date = new Date(t.date).toLocaleDateString('en-GB');   // Ensure amount is a number
    });
    // / Filter transactions to include only those with type 'expense'
    const expenseTransactions = data.filter((t) => t.type === 'expense');
    const incomeTransactions = data.filter((t) => t.type === 'income');

    // Update the local transactions array
    eTransactions.length = 0; // Clear the existing array
    eTransactions.push(...expenseTransactions); // Populate with filtered data

    iTransactions.length = 0;
    iTransactions.push(...incomeTransactions);

    console.log(eTransactions);
    console.log(iTransactions);

  } catch (error) {
    console.error('Error fetching transactions:', error);
  }
};


const setupExportAllButton = () => {
  const exportButton = document.getElementById("exportAllButton");
  exportButton.addEventListener("click", () => {
    // Select all three chart containers by their IDs
    const chartContainers = [
      document.getElementById("chartE"),
      document.getElementById("chartI"),
      document.getElementById("barMonthlyChart"),
     
    ];

    // Create a PDF instance
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("landscape", "mm", "a4");

    // Capture each chart and add to the PDF
    Promise.all(
      chartContainers.map((container) =>
        html2canvas(container, { scale: 6, allowTaint: true }).then((canvas) => {
          const imgData = canvas.toDataURL("image/jpeg", 0.8); // Compressed to 80% quality
          return {
            imgData,
            width: canvas.width,
            height: canvas.height
          }; // Pass imgData and dimensions
        })
      )
    ).then((images) => {
      images.forEach(({ imgData, width, height }, index) => {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = 300; // Set a fixed width (adjust as needed)
        const imgHeight = (height * imgWidth) / width; // Maintain aspect ratio

        const xOffset = (pageWidth - imgWidth) / 2;
        const yOffset = 20; // Add a top margin

        // Add the image to the PDF
        if (index > 0) {
          pdf.addPage(); // Add a new page for each chart
        }
        pdf.addImage(imgData, "JPEG", xOffset, yOffset, imgWidth, imgHeight);
      });

      // Save the PDF
      pdf.save("charts.pdf");
    });
  });
};


// Attach the export functionality to the button
// document.getElementById("exportButton").addEventListener("click",  setupExportButton() );

setupExportAllButton();
// for exports the charts one by one 
setupExportExpenseButton();
setupExportIncomeButton();
setupExportBarButton();

document.addEventListener("DOMContentLoaded", async () => {
  await fetchTransactions(); // Fetch transactions from the database
  updatePieChart(); // Then update the pie chart
  updateIncomePieChart();

});

