// PassiveCash.xyz - chart.js (Unified Chart Logic)

// Define Dark Theme Options Globally for Highcharts
const darkThemeOptions = {
    chart: {
        backgroundColor: '#111',
        plotBorderColor: '#00ff00',
        style: {
            fontFamily: "'Courier New', Courier, monospace"
        }
    },
    colors: ['#00ff00', '#00dd00', '#00bb00', '#009900', '#007700'], // Green color palette
    title: {
        style: { color: '#e0e0e0' }
    },
    subtitle: {
        style: { color: '#cccccc' }
    },
    xAxis: {
        gridLineColor: 'rgba(0, 255, 0, 0.1)',
        lineColor: 'rgba(0, 255, 0, 0.3)',
        tickColor: 'rgba(0, 255, 0, 0.3)',
        labels: { style: { color: '#e0e0e0' } },
        title: { style: { color: '#e0e0e0' } },
        crosshair: { // Keep crosshair style global
             width: 1,
             color: '#00ff00'
        }
    },
    yAxis: {
        gridLineColor: 'rgba(0, 255, 0, 0.1)',
        lineColor: 'rgba(0, 255, 0, 0.3)',
        tickColor: 'rgba(0, 255, 0, 0.3)',
        labels: { style: { color: '#e0e0e0' } },
        title: { style: { color: '#e0e0e0' } }
    },
    plotOptions: {
        series: {
            dataLabels: { color: '#e0e0e0' },
            marker: { lineColor: '#333' }
        },
        area: { // Default area styling
             fillOpacity: 0.2,
        },
        line: { // Default line styling
             lineWidth: 2,
        },
        column: { // Default column styling (for volume)
             color: 'rgba(0, 255, 0, 0.4)',
             borderWidth: 0,
             pointPadding: 0,
             groupPadding: 0.05
        }
    },
    legend: {
        itemStyle: { color: '#e0e0e0' },
        itemHoverStyle: { color: '#fff' },
        itemHiddenStyle: { color: '#606060' }
    },
    tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Slightly darker
        style: { color: '#e0e0e0' },
        borderWidth: 0, // Remove border
        shadow: false // Remove shadow
    },
    navigator: {
        handles: { backgroundColor: '#111', borderColor: '#00ff00' },
        outlineColor: '#00ff00',
        maskFill: 'rgba(0, 255, 0, 0.2)',
        series: { color: '#00ff00', lineColor: '#00ff00' },
        xAxis: { gridLineColor: 'rgba(0, 255, 0, 0.1)', labels: { style: { color: '#e0e0e0' } } }
    },
    rangeSelector: {
        buttonTheme: {
            fill: 'none',
            stroke: 'none',
            style: { color: '#00ff00', fontWeight: 'bold' },
            states: {
                hover: { /* fill: '#303030' */ }, // Optional hover fill
                select: { fill: '#00ff00', style: { color: '#0a0a0a' } }
            }
        },
        inputStyle: { backgroundColor: '#333', color: '#e0e0e0' },
        labelStyle: { color: '#e0e0e0' }
    },
    scrollbar: { // Style scrollbar if enabled (currently false)
         barBackgroundColor: '#333',
         barBorderColor: '#555',
         buttonArrowColor: '#e0e0e0',
         buttonBackgroundColor: '#333',
         buttonBorderColor: '#555',
         rifleColor: '#e0e0e0',
         trackBackgroundColor: '#1a1a1a',
         trackBorderColor: '#555'
    },
    // General options
    lang: { thousandsSep: "," },
    credits: { enabled: false },
};

// Apply the theme globally
Highcharts.setOptions(darkThemeOptions);

// --- Helper Function for Regression Line ---
function addRegressionLine(chart, priceData, trendLineId) {
    // Ensure linear function is available
    if (typeof linear !== 'function') {
        console.error("Linear regression function not found!");
        return;
    }

    // Extract x and y values from price data
    var kx = [], ky = [];
    if (!priceData || priceData.length === 0) {
        console.warn("No price data available for regression.");
        return;
    }

    for (var i = 0; i < priceData.length; i++) {
        var point = priceData[i];
        // Ensure point is a valid array [timestamp, price]
        if (Array.isArray(point) && point.length === 2 && typeof point[0] === 'number' && typeof point[1] === 'number') {
            kx.push(point[0]); // timestamp
            ky.push(point[1]); // price
        }
    }

    if (kx.length < 2) {
        console.warn("Not enough valid data points for regression.");
        return;
    }

    var lr = linear(kx, ky);
    if (!lr || lr.length < 2 || !lr[0] || !lr[1] || typeof lr[0][1] !== 'number' || typeof lr[1][1] !== 'number') {
         console.warn("Linear regression calculation failed or returned invalid data.");
         return;
    }

    var series_color = (lr[0][1] < lr[1][1]) ? 'rgba(0, 255, 0, 0.7)' : 'rgba(255, 68, 68, 0.7)';

    // Remove previous line if exists
    if (chart.get(trendLineId)) {
        chart.get(trendLineId).remove(false);
    }

    // Add the new regression line series
    chart.addSeries({
        type: 'line',
        name: 'Regression Line',
        marker: { enabled: false },
        lineWidth: 2,
        yAxis: 0,
        data: lr,
        color: series_color,
        dashStyle: 'shortdash',
        id: trendLineId,
        enableMouseTracking: false
    }, true); // Redraw after adding

     // Safety check (shouldn't be needed now but keep just in case)
     while (chart.series.filter(s => s.options.id === trendLineId).length > 1) {
        chart.get(trendLineId).remove(false);
    }
     console.log(`Regression line ${trendLineId} added/updated.`);
}


// --- Unified Chart Creation Function ---
function create_crypto_chart(cryptoType, containerId) {
    if (!cryptoType || (cryptoType !== 'btc' && cryptoType !== 'eth' && cryptoType !== 'sol')) {
        console.error("Invalid cryptoType provided to create_crypto_chart:", cryptoType);
        return;
    }
    if (!containerId) {
        console.error("No containerId provided to create_crypto_chart");
        return;
    }

    // Map cryptoType to CoinGecko coin ID
    let coinId;
    if (cryptoType === 'btc') {
        coinId = 'bitcoin';
    } else if (cryptoType === 'eth') {
        coinId = 'ethereum';
    } else if (cryptoType === 'sol') {
        coinId = 'solana';
    } else {
        // Should be caught by validation above, but as a fallback
        console.error("Cannot determine coinId for cryptoType:", cryptoType);
        return;
    }
    const apiUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=365`;
    const trendLineId = `${cryptoType}-trend`; // Unique ID for trend line

    // Fetch data and create chart
    $.getJSON(apiUrl, function(data) {
        if (!data || !data.prices || !data.total_volumes) {
             console.error(`Failed to fetch or parse data for ${cryptoType} from ${apiUrl}`);
             // Optionally display an error message in the container
             $(`#${containerId}`).html(`<p style="color: red; text-align: center; padding-top: 50px;">Error loading chart data for ${cryptoType.toUpperCase()}.</p>`);
             return;
        }

        // Create the chart
        new Highcharts.StockChart({
            chart: {
                renderTo: containerId, // Use the provided container ID
                zoomType: 'x'
                // Theme options are global now
                // Removed chart load event
            },
            rangeSelector: {
                buttons: [
                    { type: 'month', count: 1, text: '1m' },
                    { type: 'month', count: 3, text: '3m' },
                    { type: 'month', count: 6, text: '6m' },
                    { type: 'ytd', text: 'YTD' }
                ],
                selected: 3, // Select YTD by default
                inputEnabled: false
            },
            scrollbar: {
                enabled: false
            },
            yAxis: [
                { // Primary Y Axis (Price)
                    title: { text: 'Price (USD)' },
                    labels: { align: 'right', x: -5 },
                    floor: 0,
                    maxPadding: 0
                },
                { // Secondary Y Axis (Volume)
                    labels: { enabled: false },
                    title: { enabled: false },
                    floor: 0,
                    minPadding: 0,
                    top: '80%',
                    height: '20%'
                }
            ],
            xAxis: {
                // Theme options are global
                // Removed xAxis events
            },
            tooltip: {
                shared: true,
                split: false,
                padding: 5,
                borderRadius: 4
                // Theme options are global
            },
            plotOptions: {
                series: {
                    states: { hover: { enabled: false } },
                    dataGrouping: { enabled: false }
                }
                // Theme options are global
            },
            series: [
                {
                    type: 'area',
                    name: 'Price',
                    data: data.prices,
                    yAxis: 0,
                    color: "#00ff00", // Specific color
                    fillOpacity: 0.2 // Specific fill
                },
                {
                    type: 'column',
                    name: 'Volume',
                    data: data.total_volumes,
                    yAxis: 1,
                    color: 'rgba(0, 255, 0, 0.4)' // Specific color
                }
            ]
        }); // End of new Highcharts.StockChart call

        // Get the newly created chart instance (Highcharts constructor returns it)
        // Note: Highcharts might store charts in Highcharts.charts array too
        var chartIndex = Highcharts.charts.length - 1; // Assuming it's the last one created
        var chartInstance = Highcharts.charts[chartIndex];

        // Add regression line directly after chart creation, if instance found
        if (chartInstance && chartInstance.renderTo && chartInstance.renderTo.id === containerId) {
             addRegressionLine(chartInstance, data.prices, trendLineId);
        } else {
             console.warn(`Could not reliably find chart instance for ${containerId} to add regression line.`);
             // Fallback: Try finding by container ID if the index method failed
             chartInstance = Highcharts.charts.find(c => c && c.renderTo && c.renderTo.id === containerId);
             if (chartInstance) {
                 addRegressionLine(chartInstance, data.prices, trendLineId);
             } else {
                  console.error(`Failed to find chart instance for ${containerId}. Regression line not added.`);
             }
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        // Handle AJAX errors specifically
        console.error(`AJAX error fetching chart data for ${cryptoType}: ${textStatus}, ${errorThrown}`);
        $(`#${containerId}`).html(`<p style="color: red; text-align: center; padding-top: 50px;">Failed to load chart data for ${cryptoType.toUpperCase()}. Please check network connection or API status.</p>`);
    });
}

// Note: The actual calls to create_crypto_chart('btc', 'chart') and
// create_crypto_chart('eth', 'chart-eth') will be managed by crypto.html
// based on which section is active.
