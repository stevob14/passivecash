function calculate() {
  // get input values
  var homeValue = document.getElementById("homeValue").value;
  var downPayment = document.getElementById("downPayment").value;
  var loanTerm = document.getElementById("loanTerm").value;
  var interestRate = document.getElementById("interestRate").value;
  var taxes = document.getElementById("taxes").value || 0;
  var insurance = document.getElementById("insurance").value || 0;
  var pmi = document.getElementById("pmi").value || 0;
  
   // check if input values are valid
  var errorMsg = "";
  if (isNaN(homeValue) || homeValue <= 0) {
    errorMsg += "Home value must be a positive number. ";
  }
  if (isNaN(downPayment) || downPayment <= 0) {
    errorMsg += "Down payment must be a positive number. ";
  }
  if (isNaN(loanTerm) || loanTerm <= 0) {
    errorMsg += "Loan term must be a positive number. ";
  }
  if (isNaN(interestRate) || interestRate <= 0) {
    errorMsg += "Interest rate must be a positive number. ";
  }
  if ( taxes < 0) {
    errorMsg += "Property taxes must be a positive number. ";
  }
  if (insurance < 0) {
    errorMsg += "Home insurance must be a positive number. ";
  }
  if (pmi < 0) {
    errorMsg += "PMI rate must be a positive number. ";
  }
  if (errorMsg !== "") {
    var resultDiv = document.getElementById("result");
    resultDiv.innerHTML = errorMsg;
    return;
  }

  // convert values to numbers
  homeValue = Number(homeValue);
  downPayment = Number(downPayment);
  loanTerm = Number(loanTerm);
  interestRate = Number(interestRate);
  taxes = Number(taxes);
  insurance = Number(insurance);
  pmi = Number(pmi);

  // calculate mortgage payment
  var principal = homeValue - downPayment;
  var monthlyInterestRate = interestRate / 1200;
  var numberOfPayments = loanTerm * 12;
  var mortgagePayment =
    (principal *
      (monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  // calculate taxes and insurance
  var monthlyTaxes = taxes / 12;
  var monthlyInsurance = insurance / 12;

  // calculate PMI if down payment is less than 20%
  var includePMI = true;
  if (downPayment >= 0.2 * homeValue) {
    includePMI = false;
  }
  var monthlyPMI = includePMI ? (pmi / 100) * principal / 12 : 0;

  // calculate total monthly payment
  var totalMonthlyPayment = mortgagePayment + monthlyTaxes + monthlyInsurance + monthlyPMI;

  // display result
  var resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "Your monthly payment is: $" + totalMonthlyPayment.toFixed(2);
}
