
import { iTransactions } from '../reports.js';

 

// Function to calculate category totals
  const calculateIncomeCategoryTotals = () => {
    const totals = {};

    iTransactions.forEach((transaction) => {
        const category = transaction.category;
        if (!totals[category]) {
            totals[category] = 0;
        }
        totals[category] += transaction.amount;
    });
    console.log(totals);
    return totals;
};

// Function to update the pie chart
export const updateIncomePieChart = () => {
    const totals = calculateIncomeCategoryTotals();
    const categories = Object.keys(totals);
    const amounts = Object.values(totals);
    const colors = ['#0088fe', '#00c49f', '#ffbb28', '#8884d8', '#618f72', '#bc3cd6',
        '#FFA500', '#e09fed', '#90c2e8', '#90c2e8', '#fc8f00', '#fc8f00' , '#008080', 
        '#00FFFF', '#20B2AA', '#FF6F61', '#33FFBD', '#fa9643', '#db4b6a', '#98c983'];
    // Render the pie chart
    renderIncomePieChart(categories, amounts, colors);

    // Create a legend below the chart
    renderIncomeLegend(categories, amounts, colors);
};

// chart 

// Function to render the pie chart
const renderIncomePieChart = (labels, data, colors) => {
    const ctx = document.getElementById("incomePieChart").getContext("2d");

    // // Clear existing chart if any
    // if (window.pieChartInstance) {
    //     window.pieChartInstance.destroy();
    // }

    window.pieChartInstance = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 1.2, // Decrease the border width (default is 2)
                },
            ],
        },
        options: {
            animation: {
                animateRotate: true,
                duration: 2000, // 2 seconds animation
                easing: "easeInOutCubic",
            },
            rotation: Math.PI, // Start drawing from the top
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || "";
                            const value = context.raw || 0;
                            const total = data.reduce((acc, val) => acc + val, 0);
                            const percentage = ((value / total) * 100).toFixed(2);
                            return `${label}: ${value} (${percentage}%)`;
                        },
                    },
                    backgroundColor: "white",
                    titleColor: "black",
                    bodyColor: "black",
                    borderColor: "rgba(0,0,0,0.2)",
                    borderWidth: 0.5,
                    cornerRadius: 5,
                    padding: 10,
                },
                legend: {
                    display: false, // Disable default legend
                },
            },
        },
    });
};



// Function to render the legend
const renderIncomeLegend = (categories, amounts, colors) => {
    const legendContainer = document.getElementById("incomelegend");
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

        const percentage = ((amounts[index] / totalAmount) * 100).toFixed(2);
        const label = document.createElement("span");
        label.style.color = colors[index];
        label.textContent = `${category}: ${percentage}%`;

        legendItem.appendChild(colorBox);
        legendItem.appendChild(label);

        legendContainer.appendChild(legendItem);
    });
};


// Function to setup the export button
export const setupExportIncomeButton = () => {
    const exportButton = document.getElementById("exportIButton");
    exportButton.addEventListener("click", () => {
        const chartContainer = document.getElementById("chartI");

        html2canvas(chartContainer, { scale: 7, allowTaint: true }).then((canvas) => {
            const imgData = canvas.toDataURL("image/jpeg", 0.8); // Compressed to 80% quality

            // Create a PDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF("landscape", "mm", [700, 2100]);

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
