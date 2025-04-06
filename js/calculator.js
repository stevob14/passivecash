var x;
    var y;
    function calculateCompoundInterest() { // Renamed to match HTML onclick
      console.log("calculateCompoundInterest called"); // DEBUG
      const outputElement = document.getElementById("output");
      if (!outputElement) { console.error("Output element not found"); return; }
      outputElement.innerHTML = "";
      x = Number(document.getElementById("capital").value);
      y = Number(document.getElementById("myPercent").value/100);
      z = Number(document.getElementById("lengthoftime").value);
      t = String(document.getElementById("compoundFrequency").value);
      r = Number(document.getElementById("contribution").value); // Convert to Number

      if(z <= 0) { // Use numerical comparison
        console.log("Exiting: Invalid length of time"); // DEBUG
        outputElement.innerHTML = "Length of Time must be greater than 0";
      	return false;
      }
      if(y <= 0) { // Use numerical comparison
        console.log("Exiting: Invalid APY"); // DEBUG
        outputElement.innerHTML = "Annual Interest Rate must be greater than 0";
        return false;
      }
      else
			{
      if (t == "daily") {
          tf = 365;
      } else if (t == "weekly") {
          tf = 52;
      } else if (t == "monthly") {
          tf = 12;
      } else if (t == "quarterly") {
          tf = 4;
      } else if (t == "yearly") {
          tf = 1;
      } else { // Correct else block for truly invalid frequency
          console.error("Invalid frequency value detected:", t); // DEBUG
          outputElement.innerHTML = "Invalid compounding frequency selected.";
          return false;
      }
      console.log("Frequency check passed. Calling calculateTotalCompoundInterest..."); // DEBUG
      var u = calculateTotalCompoundInterest(x,y,tf,z,r);
      console.log("calculateTotalCompoundInterest returned:", u); // DEBUG
      if (typeof u !== 'number' || isNaN(u)) {
          console.error("Calculation resulted in NaN or non-number"); // DEBUG
          outputElement.innerHTML = "Calculation error.";
          return false;
      }
      var result = x + u; // Assuming u is total interest as per last revert
     outputElement.innerHTML = "Compounded Interest: " + u.toLocaleString("en-US",{style:'currency',currency: 'USD', maximumFractionDigits:2}) + " *<br /><span style='color: #ffa500 !important;'>In " + z + " year(s), you will have " + result.toLocaleString("en-US",{style:'currency',currency: 'USD', maximumFractionDigits:2})+"</span><br/> * "+ t + " reinvestments";
      console.log("Output updated."); // DEBUG
    }}

 function calculateTotalCompoundInterest(principal, annual_rate, n_times, t_years, contribution) {
      var pow = Math.pow(1 + annual_rate / n_times, n_times*t_years)
    	var A =  principal * (pow - 1);

      var B = contribution * ((pow -1) / (annual_rate / 12))


     	return A+B
    }

function isNumberKeyCompound(evt){ // Renamed to match HTML onkeypress
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode === 8 || charCode === 46)
				return true;
    else if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    else
    		return true;
}

function allowNegativeNumberCompound(e) // Renamed to match HTML onkeypress
	{
	  var charCode = (e.which) ? e.which : event.keyCode
  if (charCode > 31 && (charCode < 45 || charCode > 57 )) {
	    return false;
	  }
	  return true;
	}
