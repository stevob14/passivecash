let compoundChartInstance = null; // Global variable to hold the chart instance

function calculateCompoundInterest() {
    const outputElement = document.getElementById("output");
    if (!outputElement) { console.error("Output element not found"); return; }
    outputElement.innerHTML = ""; // Clear previous results

    // --- Get Inputs ---
    const principal = Number(document.getElementById("capital").value);
    const annualRate = Number(document.getElementById("myPercent").value) / 100;
    const years = Number(document.getElementById("lengthoftime").value);
    const frequencyValue = String(document.getElementById("compoundFrequency").value);
    const monthlyContribution = Number(document.getElementById("contribution").value);

    // --- Input Validation ---
    if (years <= 0) {
        outputElement.innerHTML = "Investment Duration must be greater than 0";
        if (compoundChartInstance) { compoundChartInstance.destroy(); compoundChartInstance = null; } // Clear chart on error
        return false;
    }
    if (annualRate <= 0) {
        outputElement.innerHTML = "Annual Interest Rate must be greater than 0";
         if (compoundChartInstance) { compoundChartInstance.destroy(); compoundChartInstance = null; } // Clear chart on error
        return false;
    }

    let n; // Compounding periods per year
    if (frequencyValue == "daily") { n = 365; }
    else if (frequencyValue == "weekly") { n = 52; }
    else if (frequencyValue == "monthly") { n = 12; }
    else if (frequencyValue == "quarterly") { n = 4; }
    else if (frequencyValue == "yearly") { n = 1; }
    else {
        outputElement.innerHTML = "Invalid compounding frequency selected.";
         if (compoundChartInstance) { compoundChartInstance.destroy(); compoundChartInstance = null; } // Clear chart on error
        return false;
    }

    // --- Calculate Year-by-Year Data for Chart ---
    const chartYears = [0]; // Start chart at year 0
    const chartBalances = [principal];
    let currentBalance = principal;
    const ratePerPeriod = annualRate / n;
    // Assume contribution happens at the end of each compounding period
    const contributionPerPeriod = (monthlyContribution * 12) / n;

    for (let i = 1; i <= years; i++) {
        let yearEndBalance = currentBalance;
        for (let j = 0; j < n; j++) {
            yearEndBalance = yearEndBalance * (1 + ratePerPeriod) + contributionPerPeriod;
        }
        currentBalance = yearEndBalance; // Update balance for next year's start
        chartYears.push(i);
        chartBalances.push(currentBalance);
    }

    // --- Calculate Final Results for Text Output ---
    const finalBalance = chartBalances[chartBalances.length - 1];
    const totalContributions = monthlyContribution * 12 * years;
    const totalInterest = finalBalance - principal - totalContributions;

    // --- Display Text Results ---
    outputElement.innerHTML = "Total Interest Earned: <span style='color: #ffa500 !important;'>" + totalInterest.toLocaleString("en-US", { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }) + "</span>" +
                              "<br />Final Balance after " + years + " year(s): <span style='color: #ffa500 !important;'>" + finalBalance.toLocaleString("en-US", { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }) + "</span>" +
                              "<br />Based on " + frequencyValue + " compounding.";

    // --- Display Chart ---
    displayCompoundChart(chartYears, chartBalances);
}

function displayCompoundChart(years, balances) {
    const ctx = document.getElementById('compoundInterestChart');
    if (!ctx) {
        console.error("Canvas element 'compoundInterestChart' not found.");
        return;
    }
    const context = ctx.getContext('2d');

    // Destroy previous chart instance if it exists
    if (compoundChartInstance) {
        compoundChartInstance.destroy();
    }

    // Create new chart
    compoundChartInstance = new Chart(context, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Investment Value',
                data: balances,
                borderColor: '#00ff00', // Green line
                backgroundColor: 'rgba(0, 255, 0, 0.1)', // Light green fill
                tension: 0.1,
                pointBackgroundColor: '#ffa500', // Orange points
                pointBorderColor: '#e0e0e0',
                pointHoverBackgroundColor: '#e0e0e0',
                pointHoverBorderColor: '#ffa500',
                fill: true // Enable fill below line
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true, // Allow chart to resize height
            plugins: {
                legend: {
                    labels: { color: '#e0e0e0' } // Light text for legend
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year',
                        color: '#e0e0e0' // Light text for X axis title
                    },
                    ticks: { color: '#e0e0e0' }, // Light text for X axis labels
                    grid: { color: 'rgba(224, 224, 224, 0.2)' } // Dim grid lines
                },
                y: {
                    title: {
                        display: true,
                        text: 'Value ($)',
                        color: '#e0e0e0' // Light text for Y axis title
                    },
                    ticks: {
                        color: '#e0e0e0', // Light text for Y axis labels
                        callback: function(value, index, values) {
                            return '$' + value.toLocaleString(); // Format Y axis labels as currency
                        }
                    },
                    grid: { color: 'rgba(224, 224, 224, 0.2)' } // Dim grid lines
                }
            }
        }
    });
}


// --- Input Validation Helpers (Keep existing ones) ---
function isNumberKeyCompound(evt){
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode === 8 || charCode === 46) // Allow backspace and decimal
				return true;
    else if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    else
    		return true;
}

function allowNegativeNumberCompound(e)
	{
	  var charCode = (e.which) ? e.which : event.keyCode
  if (charCode > 31 && (charCode < 45 || charCode > 57 || charCode === 47)) { // Allow minus (45), block slash (47) etc.
	    return false;
	  }
	  // Prevent multiple minus signs or minus sign not at the beginning (basic check)
	  if (charCode === 45) {
	      const input = e.target;
	      // Allow if it's the first character OR if text is selected (to allow replacement)
	      if (input.value.indexOf('-') !== -1 && input.selectionStart > 0) {
	          return false;
	      }
	  }
	  return true;
	}
