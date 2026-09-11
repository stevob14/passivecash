let compoundChartInstance = null; // Global variable to hold the chart instance

function calculateCompoundInterest() {
    const outputElement = document.getElementById("output");
    const chartContainer = document.getElementById("chartContainer");
    const canvasWrapper = document.querySelector(".chart-canvas-wrapper");
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
        if (chartContainer) chartContainer.style.display = 'block';
        if (canvasWrapper) canvasWrapper.style.display = 'none';
        outputElement.innerHTML = `<div class="rh-chart-error">Investment Duration must be greater than 0.</div>`;
        if (compoundChartInstance) { compoundChartInstance.destroy(); compoundChartInstance = null; }
        return false;
    }
    if (annualRate <= 0) {
        if (chartContainer) chartContainer.style.display = 'block';
        if (canvasWrapper) canvasWrapper.style.display = 'none';
        outputElement.innerHTML = `<div class="rh-chart-error">Annual Interest Rate must be greater than 0.</div>`;
        if (compoundChartInstance) { compoundChartInstance.destroy(); compoundChartInstance = null; }
        return false;
    }

    let n; // Compounding periods per year
    if (frequencyValue == "daily") { n = 365; }
    else if (frequencyValue == "weekly") { n = 52; }
    else if (frequencyValue == "monthly") { n = 12; }
    else if (frequencyValue == "quarterly") { n = 4; }
    else if (frequencyValue == "yearly") { n = 1; }
    else {
        if (chartContainer) chartContainer.style.display = 'block';
        if (canvasWrapper) canvasWrapper.style.display = 'none';
        outputElement.innerHTML = `<div class="rh-chart-error">Invalid compounding frequency selected.</div>`;
        if (compoundChartInstance) { compoundChartInstance.destroy(); compoundChartInstance = null; }
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

    // --- Calculate Final Results for Text Output (Hero Format) ---
    const finalBalance = chartBalances[chartBalances.length - 1];
    const totalContributions = monthlyContribution * 12 * years;
    const totalInterest = finalBalance - principal - totalContributions;
    const totalInvested = principal + totalContributions;
    const growthPercent = totalInvested > 0 ? ((totalInterest / totalInvested) * 100).toFixed(1) : 0;

    outputElement.innerHTML = `
      <div class="rh-chart-header">
        <div class="rh-chart-balance">${finalBalance.toLocaleString("en-US", { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })}</div>
        <div class="rh-chart-sub">
          <span class="rh-pill-green">+${totalInterest.toLocaleString("en-US", { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })} (+${growthPercent}%)</span>
          <span class="rh-meta">Total Interest • ${years} yr (${frequencyValue})</span>
        </div>
      </div>
    `;

    if (canvasWrapper) canvasWrapper.style.display = 'block';
    if (chartContainer) chartContainer.style.display = 'block';

    // --- Display Chart ---
    displayCompoundChart(chartYears, chartBalances, principal, monthlyContribution, finalBalance, totalInterest, growthPercent, frequencyValue);
}

function displayCompoundChart(years, balances, principal, monthlyContribution, finalBalance, totalInterest, growthPercent, frequencyValue) {
    const ctx = document.getElementById('compoundInterestChart');
    if (!ctx) {
        console.error("Canvas element 'compoundInterestChart' not found.");
        return;
    }
    const chartContainer = document.getElementById("chartContainer");
    if (chartContainer) {
        chartContainer.style.display = 'block';
    }    
	
    const context = ctx.getContext('2d');

    // Destroy previous chart instance if it exists
    if (compoundChartInstance) {
        compoundChartInstance.destroy();
    }

    // Reset header on mouse leave from canvas
    ctx.onmouseleave = function() {
        const balanceEl = document.querySelector('.rh-chart-balance');
        const pillEl = document.querySelector('.rh-pill-green');
        if (balanceEl && pillEl) {
            balanceEl.textContent = finalBalance.toLocaleString("en-US", { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
            pillEl.textContent = `+${totalInterest.toLocaleString("en-US", { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })} (+${growthPercent}%)`;
        }
    };

    const formattedLabels = years.map(y => 'Yr ' + y);

    // Create new chart
    compoundChartInstance = new Chart(context, {
        type: 'line',
        data: {
            labels: formattedLabels,
            datasets: [{
                label: 'Portfolio Value',
                data: balances,
                borderColor: '#00c805', // Electric green line
                borderWidth: 2.5,
                backgroundColor: function(context) {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) {
                        return null;
                    }
                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, 'rgba(0, 200, 5, 0.30)');
                    gradient.addColorStop(0.7, 'rgba(0, 200, 5, 0.04)');
                    gradient.addColorStop(1, 'rgba(0, 200, 5, 0.0)');
                    return gradient;
                },
                tension: 0.35, // Sleek modern spline curve
                pointRadius: 0, // Clean continuous line without dots
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#00c805',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 2.5,
                fill: true
            }]
        },
        plugins: [{
            id: 'rhVerticalHoverLine',
            afterDraw: (chart) => {
                const active = chart.tooltip ? (chart.tooltip.getActiveElements ? chart.tooltip.getActiveElements() : chart.tooltip._active) : null;
                if (active && active.length > 0) {
                    const x = active[0].element.x;
                    const { ctx: c, chartArea } = chart;
                    if (!chartArea) return;
                    c.save();
                    c.beginPath();
                    c.moveTo(x, chartArea.top);
                    c.lineTo(x, chartArea.bottom);
                    c.lineWidth = 1;
                    c.strokeStyle = 'rgba(255, 255, 255, 0.22)';
                    c.setLineDash([4, 3]);
                    c.stroke();
                    c.restore();
                }
            }
        }],
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            onHover: (event, activeElements) => {
                const balanceEl = document.querySelector('.rh-chart-balance');
                const pillEl = document.querySelector('.rh-pill-green');
                if (!balanceEl || !pillEl) return;

                if (activeElements && activeElements.length > 0) {
                    const idx = activeElements[0].index;
                    const curBal = balances[idx];
                    const curYr = years[idx];
                    const curContrib = (monthlyContribution || 0) * 12 * curYr;
                    const curInterest = curBal - (principal || 0) - curContrib;
                    const curInvested = (principal || 0) + curContrib;
                    const curPct = curInvested > 0 ? ((curInterest / curInvested) * 100).toFixed(1) : 0;
                    
                    balanceEl.textContent = curBal.toLocaleString("en-US", { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
                    pillEl.textContent = `${curInterest >= 0 ? '+' : ''}${curInterest.toLocaleString("en-US", { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })} (${curInterest >= 0 ? '+' : ''}${curPct}%) [Yr ${curYr}]`;
                }
            },
            plugins: {
                legend: {
                    display: false // Minimalist style without cluttering legend
                },
                tooltip: {
                    backgroundColor: '#12161d',
                    titleColor: '#8b949e',
                    bodyColor: '#00c805',
                    bodyFont: { weight: 'bold', size: 14 },
                    borderColor: '#1e232b',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            if (context.parsed.y !== null) {
                                return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(context.parsed.y);
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#8b949e',
                        font: { size: 11, family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
                        maxTicksLimit: 8
                    },
                    grid: { display: false }, // Clean style without vertical lines
                    border: { display: false }
                },
                y: {
                    position: 'right', // Display values on the right edge
                    ticks: {
                        color: '#8b949e',
                        font: { size: 11, family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
                        callback: function(value) {
                            if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
                            if (value >= 1000) return '$' + (value / 1000).toFixed(0) + 'k';
                            return '$' + value;
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.04)', // Very subtle horizontal hairline
                        drawBorder: false
                    },
                    border: { display: false }
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

// --- Add Resize Listener for Chart ---
// Debounce function to limit how often resize logic runs
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
	 var context = this, args = arguments;
	 var later = function() {
	  timeout = null;
	  if (!immediate) func.apply(context, args);
	 };
	 var callNow = immediate && !timeout;
	 clearTimeout(timeout);
	 timeout = setTimeout(later, wait);
	 if (callNow) func.apply(context, args);
	};
};

// Add the resize listener, debounced to avoid excessive calls
window.addEventListener('resize', debounce(function() {
	   if (compoundChartInstance) {
	       compoundChartInstance.resize();
	   }
}, 250)); // 250ms debounce delay
