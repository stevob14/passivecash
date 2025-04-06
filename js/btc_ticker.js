// PassiveCash.xyz - btc_ticker.js

// Function to fetch and display BTC price
function btc_get_price() {
    const url = 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD';

    $.ajax({
        url: url,
        method: 'GET',
        success: function(data) {
            if (data && data.USD) {
                const price = data.USD;
                const formattedPrice = price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                $('.BtcPrice').text(formattedPrice); // Update the price span

                // Update page title using the function from crypto.html
                if (typeof updatePageTitle === 'function') {
                    updatePageTitle(price);
                }
            } else {
                $('.BtcPrice').text('Error loading price');
                console.error("Error: Invalid data format received from CoinGecko API for BTC.");
                 // Update page title if the function exists
                 if (typeof updatePageTitle === 'function') {
                    updatePageTitle(null); // Pass null to indicate error or reset
                }
            }
        },
        error: function(error) {
            console.error("Error fetching BTC price:", error);
            $('.BtcPrice').text('Error loading price');
             // Update page title if the function exists
             if (typeof updatePageTitle === 'function') {
                updatePageTitle(null); // Pass null to indicate error or reset
            }
        }
    });
}

    // get_price() // Removed initial call
    // setInterval(get_price, 1000) // Removed interval - will be managed by crypto.html
 
// Removed redundant numberWithCommas and btc_changePageTitle functions
