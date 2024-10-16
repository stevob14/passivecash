function get_price() {
      fetch("https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD")
        .then(res => res.json())
        .then(res => {
          var price = numberWithCommas(res.USD);
          $(".Price").html("$"+price)     
          changePageTitle(price)
        }).catch(err => {
          $(".Price").html("Error")
        });
    }

    get_price()

    setInterval(get_price, 1000)
 
 function numberWithCommas(res){
 return res.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")
 }
    
 function changePageTitle(price) {
  document.querySelector('title').textContent= price + " | BTCUSD";
        }
