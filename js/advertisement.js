const ads = []
ads[0] = '<a href="https://join.robinhood.com/stephec1028" target="_blank" style="color: #ffa500 !important;">Robinhood - Get up to $200 in FREE stock</a>'
ads[1] = '<a href="https://coinbase.com/join/MG2TWZF" target="_blank" style="color: #ffa500 !important;">Coinbase - Sign up now to get $30 in BTC</a>'
ads[2] = '<a href="https://a.webull.com/iHwte0AKHLHI3C70Xf" target="_blank" style="color: #ffa500 !important;">Webull - Get up to 20 FREE stocks</a>'
ads[3] = '<a href="https://stockevents.app/join/VBOIVO" target="_blank" style="color: #ffa500 !important;">Stock Events - Track Dividends, Earnings, Stocks, ETFs, Crypto, Commodities and more</a>'
random = Math.floor(Math.random() * 4);

document.getElementById("advertisement").innerHTML =  ads[random]
