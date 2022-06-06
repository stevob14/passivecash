var x;
    var y;
    function calculate() {
      document.getElementById("output").innerHTML = "";
      document.getElementById("output2").innerHTML = "";
      document.getElementById("output3").innerHTML = "";
      x = Number(document.getElementById("capital").value);
      y = Number(document.getElementById("myPercent").value/100);
      z = Number(document.getElementById("lengthoftime").value);
      t = String(document.getElementById("compound").value);
      r = String(document.getElementById("contribution").value);

      if(z == "0")
      	{
      	document.getElementById("output2").innerHTML = "";
      	document.getElementById("output3").innerHTML = "";
        document.getElementById("output").innerHTML = "Length of Time must be 1 or above"
      	return false
        }
      if(y == "0")
      {
      document.getElementById("output").innerHTML = "Annual Percentage Yield must be greater than 0";
      document.getElementById("output2").innerHTML = "";
      document.getElementById("output3").innerHTML = "";
      return false
      }
      else
			{
      if (t == "daily")
      {
      tf = 365
      }
				
      if (t == "weekly")
      {
      tf = 52
      }

      if (t == "monthly")
      {
      tf = 12
      }

      if (t == "quarterly")
      {
      tf = 4
      }

      if (t == "yearly")
      {
      tf = 1
      }

      var u = calculateTotalCompoundInterest(x,y,tf,z,r)
      var result = u + x;
    	document.getElementById("output3").innerHTML = "Compounded Interest: " + u.toLocaleString("en-US",{style:'currency',currency: 'USD', maximumFractionDigits:2}) + " *<br /><span style='color: #ffa500 !important;'>In " + lengthoftime.value + " year(s), you will have " + result.toLocaleString("en-US",{style:'currency',currency: 'USD', maximumFractionDigits:2})+"</span><br/> * "+ t + " reinvestments";
    }}

 function calculateTotalCompoundInterest(principal, annual_rate, n_times, t_years, contribution) {
      var pow = Math.pow(1 + annual_rate / n_times, n_times*t_years)
    	var A =  principal * (pow - 1);

      var B = contribution * ((pow -1) / (annual_rate / 12))


     	return A+B
    }

function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode === 8 || charCode === 46)
				return true;
    else if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    else
    		return true;
}

function allowNegativeNumber(e)
	{
	  var charCode = (e.which) ? e.which : event.keyCode
  if (charCode > 31 && (charCode < 45 || charCode > 57 )) {
	    return false;
	  }
	  return true;
	}
