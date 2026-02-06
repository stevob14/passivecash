const ads = []
ads[0] = '<a href="https://join.robinhood.com/stephec1028" target="_blank" style="color: #ffa500 !important;">Robinhood - Get up to $200 in FREE stock</a>'
ads[1] = '<a href="https://groundfloor.onelink.me/Jaqm/referral?code=od0e9f&af_dp=groundfloor%3A%2F%2F&deep_link_value=referral_code&deep_link_sub1=od0e9f" target="_blank" style="color: #ffa500 !important;">Groundfloor - Sign up now to get $50</a>'
ads[2] = '<a href="https://a.webull.com/iHwte0AKHLHI3C70Xf" target="_blank" style="color: #ffa500 !important;">Webull - Get up to 20 FREE stocks</a>'
random = Math.floor(Math.random() * 3);

document.getElementById("advertisement").innerHTML =  ads[random]
