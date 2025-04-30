// passivecash/js/market_table.js

async function loadCryptoMarketTable() {
    const containerId = '#crypto-market-table-container';
    const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';
    const $container = $(containerId);

    if (!$container.length) {
        console.error(`Market table container ${containerId} not found.`);
        return;
    }

    const cacheKeyData = 'cryptoMarketTableData';
    const cacheKeyTimestamp = 'cryptoMarketTableTimestamp';
    const cacheDuration = 5 * 60 * 1000; // 5 minutes in milliseconds

    // --- Check Cache ---
    try {
        const cachedDataString = sessionStorage.getItem(cacheKeyData);
        const cachedTimestampString = sessionStorage.getItem(cacheKeyTimestamp);

        if (cachedDataString && cachedTimestampString) {
            const cachedTimestamp = parseInt(cachedTimestampString, 10);
            const now = Date.now();

            if (now - cachedTimestamp < cacheDuration) {
                console.log("Using cached market table data.");
                const cachedData = JSON.parse(cachedDataString);
                // Basic validation
                if (Array.isArray(cachedData)) {
                    buildMarketTableHTML(cachedData, $container); // Use cached data
                    return; // Exit function, cache is valid
                } else {
                    console.warn("Cached market table data is invalid. Fetching fresh.");
                    sessionStorage.removeItem(cacheKeyData);
                    sessionStorage.removeItem(cacheKeyTimestamp);
                }
            } else {
                console.log("Market table cache expired. Fetching fresh.");
            }
        }
    } catch (e) {
        console.error("Error reading market table cache:", e);
        // Clear potentially corrupted cache
        sessionStorage.removeItem(cacheKeyData);
        sessionStorage.removeItem(cacheKeyTimestamp);
    }

    // --- Fetch Fresh Data (if cache missed or expired) ---
    console.log("Fetching fresh market table data...");
    $container.html('<p class="loading-text">Loading market data...</p>'); // Show loading state

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (!Array.isArray(data)) {
             throw new Error('Invalid data format received from API.');
        }

        // Build and display table
        buildMarketTableHTML(data, $container);

        // Store fetched data in cache
        try {
            sessionStorage.setItem(cacheKeyData, JSON.stringify(data));
            sessionStorage.setItem(cacheKeyTimestamp, Date.now().toString());
            console.log("Cached fresh market table data.");
        } catch (e) {
            console.error("Error writing market table cache:", e);
        }

    } catch (error) {
        console.error('Error fetching or building crypto market table:', error);
        $container.html(`<p class="error-message">Error loading market data: ${error.message}</p>`);
        // Don't mark as loaded on error, allow retry on next view
    }
}

// --- Helper function to build table HTML ---
// Moved table building logic into its own function for clarity
function buildMarketTableHTML(data, $container) {
    let tableHTML = `
            <div class="table-scroll-wrapper">
                <table id="cryptoMarketTable">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Coin</th>
                            <th>Price</th>
                            <th>24h %</th>
                            <th>24h Volume</th>
                            <th>Market Cap</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        data.forEach(coin => {
            const rank = coin.market_cap_rank || 'N/A';
            const image = coin.image || '';
            const name = coin.name || 'N/A';
            const symbol = (coin.symbol || 'N/A').toUpperCase();
            // Adjust price formatting for potentially very small values
            const price = coin.current_price !== null ? coin.current_price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: coin.current_price < 0.01 ? 8 : 2 }) : 'N/A';
            const change24h = coin.price_change_percentage_24h !== null ? coin.price_change_percentage_24h.toFixed(2) : 'N/A';
            const volume24h = coin.total_volume !== null ? coin.total_volume.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) : 'N/A'; // Added Volume
            const marketCap = coin.market_cap !== null ? coin.market_cap.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) : 'N/A';

            let changeClass = '';
            if (change24h !== 'N/A') {
                changeClass = parseFloat(change24h) >= 0 ? 'positive' : 'negative';
            }

            tableHTML += `
                <tr>
                    <td data-label="#">${rank}</td>
                    <td data-label="Coin">
                        ${image ? `<img src="${image}" alt="${name} logo" width="20" height="20" style="vertical-align: middle; margin-right: 5px;">` : ''}
                        ${name} <span class="coin-symbol">(${symbol})</span>
                    </td>
                    <td data-label="Price">${price}</td>
                    <td data-label="24h %" class="${changeClass}">${change24h !== 'N/A' ? `${change24h}%` : 'N/A'}</td>
                    <td data-label="24h Volume">${volume24h}</td>
                    <td data-label="Market Cap">${marketCap}</td>
                </tr>
            `;
        });

        tableHTML += `
                    </tbody>
                </table>
            </div>
        `;

        $container.html(tableHTML);
        // No need for $container.data('loaded') anymore, cache handles it
}

// Make function globally accessible for now, can be refined later
window.loadCryptoMarketTable = loadCryptoMarketTable;