function get_price() {
      fetch("https://api.pro.coinbase.com/products/eth-usd/book")
        .then(res => res.json())
        .then(res => {
          var price = numberWithCommas(res.bids[0][0]);
          $(".Price").html("$"+price)     
          changePageTitle(price)
        }).catch(err => {
          $(".Price").html("Error")
          changePageTitle(price)
        });
    }

    get_price()

    setInterval(get_price, 1000)
 
 function numberWithCommas(res){
 return res.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")
 }
    
 function changePageTitle(price) {
  document.querySelector('title').textContent= price;
        }
