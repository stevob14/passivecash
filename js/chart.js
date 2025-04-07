// PassiveCash.xyz - chart.js (Unified Chart Logic with localStorage Caching)

// --- Global Theme Options ---
const darkThemeOptions = {
    chart: { backgroundColor: '#111', plotBorderColor: '#00ff00', style: { fontFamily: "'Courier New', Courier, monospace" } },
    colors: ['#00ff00', '#00dd00', '#00bb00', '#009900', '#007700'],
    title: { style: { color: '#e0e0e0' } },
    subtitle: { style: { color: '#cccccc' } },
    xAxis: { gridLineColor: 'rgba(0, 255, 0, 0.1)', lineColor: 'rgba(0, 255, 0, 0.3)', tickColor: 'rgba(0, 255, 0, 0.3)', labels: { style: { color: '#e0e0e0' } }, title: { style: { color: '#e0e0e0' } }, crosshair: { width: 1, color: '#00ff00' } },
    yAxis: { gridLineColor: 'rgba(0, 255, 0, 0.1)', lineColor: 'rgba(0, 255, 0, 0.3)', tickColor: 'rgba(0, 255, 0, 0.3)', labels: { style: { color: '#e0e0e0' } }, title: { style: { color: '#e0e0e0' } } },
    plotOptions: { series: { dataLabels: { color: '#e0e0e0' }, marker: { lineColor: '#333' } }, area: { fillOpacity: 0.2 }, line: { lineWidth: 2 }, column: { color: 'rgba(0, 255, 0, 0.4)', borderWidth: 0, pointPadding: 0, groupPadding: 0.05 } },
    legend: { itemStyle: { color: '#e0e0e0' }, itemHoverStyle: { color: '#fff' }, itemHiddenStyle: { color: '#606060' } },
    tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.8)', style: { color: '#e0e0e0' }, borderWidth: 0, shadow: false },
    navigator: { handles: { backgroundColor: '#111', borderColor: '#00ff00' }, outlineColor: '#00ff00', maskFill: 'rgba(0, 255, 0, 0.2)', series: { color: '#00ff00', lineColor: '#00ff00' }, xAxis: { gridLineColor: 'rgba(0, 255, 0, 0.1)', labels: { style: { color: '#e0e0e0' } } } },
    rangeSelector: { buttonTheme: { fill: 'none', stroke: 'none', style: { color: '#00ff00', fontWeight: 'bold' }, states: { hover: {}, select: { fill: '#00ff00', style: { color: '#0a0a0a' } } } }, inputStyle: { backgroundColor: '#333', color: '#e0e0e0' }, labelStyle: { color: '#e0e0e0' } },
    scrollbar: { barBackgroundColor: '#333', barBorderColor: '#555', buttonArrowColor: '#e0e0e0', buttonBackgroundColor: '#333', buttonBorderColor: '#555', rifleColor: '#e0e0e0', trackBackgroundColor: '#1a1a1a', trackBorderColor: '#555' },
    lang: { thousandsSep: "," },
    credits: { enabled: false },
};
Highcharts.setOptions(darkThemeOptions);

// --- Helper Function for Regression Line ---
function addRegressionLine(chart, priceData, trendLineId) {
    if (typeof linear !== 'function') { console.error("Linear regression function not found!"); return; }
    var kx = [], ky = [];
    if (!priceData || priceData.length === 0) { console.warn("No price data for regression."); return; }
    for (var i = 0; i < priceData.length; i++) {
        var point = priceData[i];
        if (Array.isArray(point) && point.length === 2 && typeof point[0] === 'number' && typeof point[1] === 'number') {
            kx.push(point[0]); ky.push(point[1]);
        }
    }
    if (kx.length < 2) { console.warn("Not enough valid points for regression."); return; }
    var lr = linear(kx, ky);
    if (!lr || lr.length < 2 || !lr[0] || !lr[1] || typeof lr[0][1] !== 'number' || typeof lr[1][1] !== 'number') { console.warn("Linear regression failed."); return; }
    var series_color = (lr[0][1] < lr[1][1]) ? 'rgba(0, 255, 0, 0.7)' : 'rgba(255, 68, 68, 0.7)';
    if (chart.get(trendLineId)) { chart.get(trendLineId).remove(false); }
    chart.addSeries({ type: 'line', name: 'Regression Line', marker: { enabled: false }, lineWidth: 2, yAxis: 0, data: lr, color: series_color, dashStyle: 'shortdash', id: trendLineId, enableMouseTracking: false }, true);
    while (chart.series.filter(s => s.options.id === trendLineId).length > 1) { chart.get(trendLineId).remove(false); }
    console.log(`Regression line ${trendLineId} added/updated.`);
}

// --- Chart Rendering Function ---
function renderChart(containerId, cryptoType, chartData) {
    const trendLineId = `${cryptoType}-trend`;
    if (!chartData || !chartData.prices || !chartData.total_volumes) {
        console.error(`Invalid chartData for ${cryptoType}`);
        $(`#${containerId}`).html(`<p style="color: red; text-align: center; padding-top: 50px;">Error preparing chart data for ${cryptoType.toUpperCase()}.</p>`);
        return;
    }
    // Clear container before rendering
    $(`#${containerId}`).empty();

    const chartInstance = new Highcharts.StockChart({
        chart: { renderTo: containerId, zoomType: 'x' },
        rangeSelector: { buttons: [{ type: 'month', count: 1, text: '1m' }, { type: 'month', count: 3, text: '3m' }, { type: 'month', count: 6, text: '6m' }, { type: 'ytd', text: 'YTD' }], selected: 3, inputEnabled: false },
        scrollbar: { enabled: false },
        yAxis: [{ title: { text: 'Price (USD)' }, labels: { align: 'right', x: -5 }, floor: 0, maxPadding: 0 }, { labels: { enabled: false }, title: { enabled: false }, floor: 0, minPadding: 0, top: '80%', height: '20%' }],
        xAxis: {},
        tooltip: { shared: true, split: false, padding: 5, borderRadius: 4 },
        plotOptions: { series: { states: { hover: { enabled: false } }, dataGrouping: { enabled: false } } },
        series: [
            { type: 'area', name: 'Price', data: chartData.prices, yAxis: 0, color: "#00ff00", fillOpacity: 0.2 },
            { type: 'column', name: 'Volume', data: chartData.total_volumes, yAxis: 1, color: 'rgba(0, 255, 0, 0.4)' }
        ]
    });

    if (chartInstance) {
        addRegressionLine(chartInstance, chartData.prices, trendLineId);
    } else {
        console.error(`Highcharts.StockChart failed for ${containerId}.`);
    }
}

// --- Unified Chart Creation Function with localStorage Caching ---
function create_crypto_chart(cryptoType, containerId) {
    const validTypes = ['btc', 'eth', 'sol'];
    if (!cryptoType || !validTypes.includes(cryptoType)) { console.error("Invalid cryptoType:", cryptoType); return; }
    if (!containerId) { console.error("No containerId provided"); return; }

    const cacheDuration = 24 * 60 * 60 * 1000; // 24 hours
    const dataCacheKey = `chartData_${cryptoType}`;
    const timestampCacheKey = `chartTimestamp_${cryptoType}`;
    let cachedData = null;
    let cacheTimestamp = 0;

    // Try reading from cache
    try {
        const cachedDataString = localStorage.getItem(dataCacheKey);
        const cachedTimestampString = localStorage.getItem(timestampCacheKey);
        if (cachedDataString && cachedTimestampString) {
            cachedData = JSON.parse(cachedDataString);
            cacheTimestamp = parseInt(cachedTimestampString, 10);
            // Basic validation of cached data structure
            if (!cachedData || !cachedData.prices || !cachedData.total_volumes) {
                 console.warn(`Cached data for ${cryptoType} has invalid structure. Discarding.`);
                 cachedData = null; // Discard invalid cache
                 localStorage.removeItem(dataCacheKey);
                 localStorage.removeItem(timestampCacheKey);
            }
        }
    } catch (e) {
        console.error(`Error reading or parsing cache for ${cryptoType}:`, e);
        localStorage.removeItem(dataCacheKey); // Clear potentially corrupted cache
        localStorage.removeItem(timestampCacheKey);
    }

    // Check cache validity
    const now = Date.now();
    if (cachedData && cacheTimestamp && (now - cacheTimestamp < cacheDuration)) {
        console.log(`Using valid cache for ${cryptoType}. Age: ${((now - cacheTimestamp)/1000/60).toFixed(1)} mins.`);
        // Use jQuery's ready to ensure container exists if called early
        $(function() { renderChart(containerId, cryptoType, cachedData); });
        return; // Use cache, skip fetch
    }

    // --- Fetch fresh data ---
    console.log(`No valid cache for ${cryptoType}. Fetching fresh data...`);
    $(`#${containerId}`).html(`<p style="color: #ffa500; text-align: center; padding-top: 50px;">Loading chart data for ${cryptoType.toUpperCase()}...</p>`);

    let coinId;
    if (cryptoType === 'btc') coinId = 'bitcoin';
    else if (cryptoType === 'eth') coinId = 'ethereum';
    else if (cryptoType === 'sol') coinId = 'solana';

    const apiUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=365`;

    $.getJSON(apiUrl, function(data) {
        if (data && data.prices && data.total_volumes) {
            console.log(`Fetched fresh data for ${cryptoType}. Caching...`);
            const dataToCache = { prices: data.prices, total_volumes: data.total_volumes };
            try {
                localStorage.setItem(dataCacheKey, JSON.stringify(dataToCache));
                localStorage.setItem(timestampCacheKey, Date.now().toString());
                console.log(`Cached fresh data for ${cryptoType}.`);
            } catch (e) {
                console.error(`Error saving to localStorage for ${cryptoType}:`, e);
                // Clear potentially partial cache on error
                localStorage.removeItem(dataCacheKey);
                localStorage.removeItem(timestampCacheKey);
            }
            renderChart(containerId, cryptoType, dataToCache); // Render with fresh data
        } else {
             console.error(`Invalid fresh data format for ${cryptoType}.`);
             $(`#${containerId}`).html(`<p style="color: red; text-align: center; padding-top: 50px;">Error loading chart data for ${cryptoType.toUpperCase()}. Invalid format.</p>`);
             // Don't use stale cache here as fetch succeeded but data was bad
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error(`AJAX error fetching chart data for ${cryptoType}: ${textStatus}, ${errorThrown}`);
        // Attempt to use stale cache on fetch failure
        if (cachedData) {
             console.warn(`Fetch failed for ${cryptoType}, using stale cache data.`);
             renderChart(containerId, cryptoType, cachedData);
             $(`#${containerId}`).append(`<p style="font-size: 0.8em; color: #aaa; text-align: center;">Showing outdated data (fetch failed).</p>`);
        } else {
             $(`#${containerId}`).html(`<p style="color: red; text-align: center; padding-top: 50px;">Failed to load chart data for ${cryptoType.toUpperCase()}. Check connection/API.</p>`);
        }
    });
}
