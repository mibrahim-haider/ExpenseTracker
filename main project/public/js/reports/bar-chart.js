import { eTransactions, fetchTransactions } from '../reports.js';




export const filterTransactionsByMonth = (selectedMonth) => {
    if (!selectedMonth) {
        console.error("Invalid selectedMonth");
        return []; // Return an empty array if no valid data
    }

    const [year, month] = selectedMonth.split('-');
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    return eTransactions.filter((transaction) => {
        // Extract the day, month, and year from the DD/MM/YYYY format
        const [day, transMonth, transYear] = transaction.date.split('/').map(Number);
        const transactionDate = new Date(transYear, transMonth - 1, day); // Convert to Date object

        // Compare the transaction date against the range
        return transactionDate >= firstDay && transactionDate <= lastDay;
    });
};

export const calculateMonthlyCategoryTotals = (filteredTransactions) => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
        console.error("No transactions to process");
        return {}; // Return an empty object to prevent further errors
    }

    const totals = {};

    filteredTransactions.forEach((transaction) => {
        const category = transaction.category;
        if (!totals[category]) {
            totals[category] = 0;
        }
        totals[category] += transaction.amount;
    });

    return totals;
};



// Function to update the bar chart
export const updateBarChart = (filteredTransactions) => {
    const totals = calculateMonthlyCategoryTotals(filteredTransactions);
    const categories = Object.keys(totals);
    const amounts = Object.values(totals);


    const colors = ['#0088fe', '#00c49f', '#ffbb28', '#8884d8', '#618f72', '#bc3cd6',
        '#FFA500', '#e09fed', '#90c2e8', '#90c2e8', '#fc8f00', '#fc8f00' , '#008080', 
        '#00FFFF', '#20B2AA', '#FF6F61', '#33FFBD', '#fa9643', '#db4b6a', '#98c983'];

    // Render the bar chart
    renderBarChart(categories, amounts, colors);

    // Create a legend below the chart
    renderBarLegend(categories, amounts, colors);
};


const renderBarChart = (labels, data, colors) => {
    const ctx = document.getElementById("barChart").getContext("2d");

  
    // Clear existing chart if any
    if (window.barChartInstance) {
        window.barChartInstance.destroy();
    }


    // if (data.length === 0 || labels.length === 0) {
    //     console.error("yes ");
    //     return;
    // }
    

    window.barChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Expenses by Category",
                    data: data,
                    backgroundColor: colors,
                    borderColor: "rgb(255, 255, 255)", // Optional: border color for bars
                    borderWidth: 1, // Decrease border width for bars
                    maxBarThickness: 45,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || "";
                            const value = context.raw || 0;
                            return `${label}: ${value}`;
                        },
                    },
                    backgroundColor: "white",
                    titleColor: "black",
                    bodyColor: "black",
                    borderColor: "rgba(255, 255, 255, 0.72)",
                    borderWidth: 1,
                    cornerRadius: 5,
                    padding: 10,
                },
                legend: {
                    display: false, // Disable default legend
                },
            },
            scales: {
                x: {
                    border: {
                        color: 'gray',
                    },
                    title: {
                        display: true,
                        text: "Categories",
                        color: "white", // Set Y-axis labels (amount values) to white
                        font: {
                            size: 13,
                            weight: "bold",
                            // spacing: 5,
                            family: "sans-serif",
                        },
                        padding: 10, // Add margin/padding around the labels

                    },
                    // padding: { top: 10, bottom: 10 }, // Margin around the axis title
                    ticks: {
                        color: '#b8b6b6', // Set Y-axis labels (amount values) to white
                    },
                    grid: {
                        drawOnChartArea: false, // Removes grid lines on x-axis

                    },

                    // barPercentage: 10, // Reduce bar width (default is 0.9)
                    // categoryPercentage: 0.6, // Adjust the gap between bars in groups
                },
                y: {
                    border: {
                        color: 'gray',
                    },
                    title: {
                        display: true,
                        text: "Amount",
                        color: "white", // Set Y-axis labels (amount values) to white
                        font: {
                            size: 13,
                            weight: "bold",
                            // spacing: 5,
                            family: "sans-serif",
                        },
                        padding: 10, // Add margin/padding around the labels

                    },
                    // margin: { top: 20, bottom: 10 }, // Margin around the axis title
                    ticks: {
                        beginAtZero: true,
                        color: '#b8b6b6', // Set Y-axis labels (amount values) to white
                    },
                    grid: {
                        color: "rgba(255, 255, 255, 0.29)", // Light white grid lines
                        borderDash: [5, 5], // Dashed grid lines

                    },
                },
            },
        },
    });

};


// Function to render the legend
const renderBarLegend = (categories, amounts, colors) => {
    const legendContainer = document.getElementById("barlegend");
    legendContainer.innerHTML = ""; // Clear previous legend items

    const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);

    categories.forEach((category, index) => {
        const legendItem = document.createElement("div");
        legendItem.classList.add("legend-item", "d-flex", "align-items-center", "mb-2");

        const colorBox = document.createElement("div");
        colorBox.classList.add("legend-color");
        colorBox.style.width = "15px";
        colorBox.style.height = "15px";
        colorBox.style.backgroundColor = colors[index];
        colorBox.style.marginRight = "10px";

        const percentage = totalAmount > 0
            ? ((amounts[index] / totalAmount) * 100).toFixed(2)
            : 0;
        const label = document.createElement("span");
        label.style.color = colors[index];
        label.textContent = `${category}: ${percentage}%`;

        legendItem.appendChild(colorBox);
        legendItem.appendChild(label);

        legendContainer.appendChild(legendItem);
    });
};


// Update the chart when the user selects a different month
monthInput.addEventListener('change', (event) => {
    const selectedMonth = event.target.value;
    console.log("Selected month:", selectedMonth);

    const filteredTransactions = filterTransactionsByMonth(selectedMonth);
    console.log("Filtered Transactions:", filteredTransactions);

    if (filteredTransactions.length > 0) {
        updateBarChart(filteredTransactions); // Pass filtered transactions as an argument
    } else {
        console.log("No transactions to display for the selected month");
        renderBarChart([], [], []); // Clear chart
        renderBarLegend([], [], []); // Clear Legend
        const legendContainer = document.getElementById("barlegend"); 
        const legendItem = document.createElement("div");
        legendItem.innerHTML = `<p style=" color: white;  text-align: center; "> No transaction to display for the current month  ( <b> ${selectedMonth} </b> ) <br>🙂🙃 </p> `;
        legendContainer.appendChild(legendItem);
    }
});



document.addEventListener('DOMContentLoaded', async () => {
    await fetchTransactions();

    const monthInput = document.getElementById('monthInput');

    // Set default to the current month
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    monthInput.value = currentMonth;

    // Filter transactions for the current month
    const filteredTransactions = filterTransactionsByMonth(currentMonth);
    console.log("Filtered Transactions for current month:", filteredTransactions);

    if (filteredTransactions.length > 0) {
        updateBarChart(filteredTransactions); // Pass filtered transactions to render the initial chart
    } else {
        console.log("No transactions to display for the current month");
        renderBarChart([], [], []); // Clear chart
        renderBarLegend([], [], []); // Clear Legend
        
        const legendContainer = document.getElementById("barlegend"); 
        const legendItem = document.createElement("div");
        legendItem.innerHTML = `<p style=" color: white;  text-align: center; "> No transaction to display for the current month  ( <b> ${currentMonth} </b> ) <br>🙂🙃 </p> `;
        legendContainer.appendChild(legendItem);
       
    }
    

});



// Function to setup the export button
export const setupExportBarButton = () => {
    const exportButton = document.getElementById("exportBarButton");
    exportButton.addEventListener("click", () => {
        const chartContainer = document.getElementById("barMonthlyChart");

        html2canvas(chartContainer, { scale: 2, allowTaint: true }).then((canvas) => {
            const imgData = canvas.toDataURL("image/jpeg", 0.8); // Compressed to 80% quality

            // Create a PDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF("landscape", "mm", [300, 600]);

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const imgWidth = canvas.width / 4; // Scale down proportionally
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            const xOffset = (pageWidth - imgWidth) / 2;
            const yOffset = (pageHeight - imgHeight) / 2;

            // Add image with compression
            pdf.addImage(imgData, "JPEG", xOffset, yOffset, imgWidth, imgHeight, null, "FAST");

            // Save the PDF
            pdf.save("chart.pdf");
        });
    });
};
