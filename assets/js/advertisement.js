const ads = []
ads[0] = '<a href="https://join.robinhood.com/stephec1028" style="color: #ffa500 !important;">Robinhood - Get up to $200 in free stock</a>'
ads[1] = '<a href="https://coinbase.com/join/MG2TWZF" style="color: #ffa500 !important;">Coinbase - Get $20 after your first trade of $20 or more</a>'
ads[2] = '<a href="https://a.webull.com/iHwte0AKHLHI3C70Xf" style="color: #ffa500 !important;">Webull - Get 12 FREE stocks</a>'

random = Math.floor(Math.random() * 3);

document.getElementById("advertisement").innerHTML =  ads[random]
