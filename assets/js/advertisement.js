const ads = []
ads[0] = '<a href="https://join.robinhood.com/stephec1028" style="color: #ffa500 !important;">Robinhood - Get up to $200 in free stock</a>'
ads[1] = '<a href="https://app.groundfloor.us/r/od0e9f" style="color: #ffa500 !important;">Groundfloor - Get $50 when you invest $100</a>'
ads[2] = '<a href="https://coinbase.com/join/MG2TWZF" style="color: #ffa500 !important;">Coinbase - Get $20 after your first trade of $20 or more</a>'
ads[3] = '<a href="https://fundrise.com/r/4k7r3v" style="color: #ffa500 !important;">Fundrise - Get $50 in shares when you invest $10</a>'
ads[4] = '<a href="https://a.webull.com/iHwte0AKHLHI3C70Xf" style="color: #ffa500 !important;">Webull - Get 12 FREE stocks</a>'

random = Math.floor(Math.random() * 5);

document.getElementById("advertisement").innerHTML =  ads[random]
