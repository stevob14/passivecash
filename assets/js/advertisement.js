const ads = []
ads[0] = '<a href="https://join.robinhood.com/stephec1028" style="color: #ffa500 !important;">Robinhood - Get up to $200 in free stock</a>'
ads[1] = '<a href="https://app.groundfloor.us/r/od0e9f" style="color: #ffa500 !important;">Groundfloor - Get $50 when you invest $100</a>'
ads[2] = '<a href="https://coinbase.com/join/crooks_r" style="color: #ffa500 !important;">Coinbase - Get free Bitcoin worth $10</a>'

random = Math.floor(Math.random() * 3);

document.getElementById("advertisement").innerHTML =  ads[random]
