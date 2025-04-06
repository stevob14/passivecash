// PassiveCash.xyz - eth_ticker.js

// Function to fetch and display ETH price
function eth_get_price() {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'; // Using CoinGecko for consistency

    $.ajax({
        url: url,
        method: 'GET',
        success: function(data) {
            if (data && data.ethereum && data.ethereum.usd) {
                const price = data.ethereum.usd;
                const formattedPrice = price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                $('.EthPrice').text(formattedPrice); // Update the price span

                // Update page title using the function from crypto.html
                if (typeof updatePageTitle === 'function') {
                    updatePageTitle(price);
                }
            } else {
                $('.EthPrice').text('Error loading price');
                console.error("Error: Invalid data format received from CoinGecko API for ETH.");
                 // Update page title if the function exists
                 if (typeof updatePageTitle === 'function') {
                    updatePageTitle(null); // Pass null to indicate error or reset
                }
            }
        },
        error: function(error) {
            console.error("Error fetching ETH price:", error);
            $('.EthPrice').text('Error loading price');
             // Update page title if the function exists
             if (typeof updatePageTitle === 'function') {
                updatePageTitle(null); // Pass null to indicate error or reset
            }
        }
    });
}

    // get_price() // Removed initial call
    // setInterval(get_price, 1000) // Removed interval - will be managed by crypto.html
 
// Removed redundant numberWithCommas and eth_changePageTitle functions
