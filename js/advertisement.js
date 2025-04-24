const ads = []
ads[0] = '<a href="https://join.robinhood.com/stephec1028" target="_blank" style="color: #ffa500 !important;">Robinhood - Get up to $200 in free stock</a>'
ads[1] = '<a href="https://coinbase.com/join/MG2TWZF" target="_blank" style="color: #ffa500 !important;">Coinbase - Get $20 after your first trade of $20 or more</a>'
ads[2] = '<a href="https://a.webull.com/iHwte0AKHLHI3C70Xf" target="_blank" style="color: #ffa500 !important;">Webull - Get 12 FREE stocks</a>'
ads[3] = '<a href="https://twitter.com/passivecashxyz" target="_blank" style="color: #ffa500 !important;">Follow PassiveCash.xyz on X</a>'
ads[4] = '<a href="https://stockevents.app/join/VBOIVO" target="_blank" style="color: #ffa500 !important;">Track Dividends, Earnings, Stocks, ETFs, Crypto, Commodities and more.</a>'
random = Math.floor(Math.random() * 5);

document.getElementById("advertisement").innerHTML =  ads[random]
