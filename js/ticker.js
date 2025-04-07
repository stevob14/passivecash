// PassiveCash.xyz - ticker.js (Unified Ticker Logic)

// Function to fetch and display crypto price based on type and target element selector
function get_crypto_price(cryptoType, priceElementSelector) {
    // Add 'sol' to the list of valid types
    if (!cryptoType || (cryptoType !== 'btc' && cryptoType !== 'eth' && cryptoType !== 'sol')) {
        console.error("Invalid cryptoType provided to get_crypto_price:", cryptoType);
        return;
    }
     if (!priceElementSelector) {
        console.error("No priceElementSelector provided to get_crypto_price");
        return;
    }

    const symbol = cryptoType.toUpperCase(); // BTC or ETH
    const url = `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD`;
    // const priceElementSelector = `.${symbol}Price`; // Now passed as argument

    $.ajax({
        url: url,
        method: 'GET',
        success: function(data) {
            // Use setTimeout to ensure DOM update happens after potential section switch
            setTimeout(() => {
                // Removed log
                const priceElement = document.querySelector(priceElementSelector);
                let price = null;

                if (!priceElement) {
                    // Removed duplicate comment
                    console.error(`Price element ${priceElementSelector} not found via querySelector.`); // Keep general error
                }

                if (data && data.USD) {
                    price = data.USD;
                    // Removed log
                    if (priceElement) {
                        try {
                            const formattedPrice = price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                            // Removed log
                            priceElement.textContent = formattedPrice;
                        } catch (formatError) {
                             console.error(`Error formatting price for ${symbol}:`, formatError); // Keep general error
                             priceElement.textContent = 'Error formatting';
                        }
                    }
                } else {
                    console.error(`Error: Invalid data format received for ${symbol}.`); // Keep general error
                    if (priceElement) {
                        priceElement.textContent = 'Error loading data';
                    }
                }

                // Update title (this part seems to work)
                if (typeof updatePageTitle === 'function') {
                    updatePageTitle(cryptoType, price);
                } else {
                    console.warn("updatePageTitle function not found."); // Keep general warning
                }
            }, 0); // Delay of 0ms
        },
        error: function(error) {
            console.error(`Error fetching ${symbol} price:`, error);
            const priceElement = $(priceElementSelector);
            if (priceElement.length) {
                priceElement.text('Error loading price');
            }
             // Update page title if the function exists
             if (typeof updatePageTitle === 'function') {
                updatePageTitle(cryptoType, null); // Pass cryptoType and null for error
            }
        }
    });
}

// Note: Initial call and setInterval are now managed by crypto.html
