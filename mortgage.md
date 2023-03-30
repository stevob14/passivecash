---
description: Mortgage calculator
title: Mortgage Calculator
---
<html>
<script src="{{ base.url | prepend: site.url }}/assets/js/mortgage.js"></script>
<script src="{{ base.url | prepend: site.url }}/assets/js/advertisement.js" defer></script>
<link id="stylesheet" rel="stylesheet" type="text/css" href="https://www.passivecash.xyz/assets/css/mortgage.css" />

<h2>Mortgage Calculator</h2>
<h4 id="advertisement"></h4>
<div class="mortgage">
<p>
<label>Loan Amount:</label>
    <input value="400000" type="number" id="loanAmount" /></p><p>
    <label>Down Payment:</label>
    <input value="80000" type="number" id="downPayment" /></p><p>
    <label>Interest Rate:</label>
    <input value="6.88" type="number" id="interestRate" /></p><p>
    <label>Loan Term (in years):</label>
    <input value="30" type="number" id="loanTerm" /></p><p>
    <label>Property Taxes:</label>
    <input type="number" id="propertyTaxes" /></p><p>
    <label>Home Insurance:</label>
    <input type="number" id="homeInsurance" /></p><p>
    
    
    <label>HOA Fee:</label>
    <input type="number" id="hoaFee" /></p>
    <p>
    <label>Other Costs:</label>
    <input type="number" id="otherCosts" /></p><p>
    <button onclick="calculateMortgage()">Calculate</button></p>
    </div>
    <div id="errorMessages"></div>
    <div class="result">
    
   <table id="resultTable" style="display: none">
  <tbody>
    <tr>
      <td>&nbsp;</td>
      <td align="right"><b>Monthly</b></td>
      <td align="right"><b>Total</b></td>
    </tr>
    <tr>
      <td>Mortgage Payment</td>
      <td align="right" id="monthlyPaymentBeforeTaxInsurance"></td>
      <td align="right" id ="total360Payments"></td>
    </tr>
    <tr>
      <td>Property Tax</td>
      <td align="right" id="propertyTaxesMonthly"></td>
      <td id="ptt" align="right"></td>
    </tr>
    <tr>
      <td>Home Insurance</td>
      <td align="right" id="homeInsuranceMonthly"></td>
      <td id="hit" align="right"></td>
    </tr>
    
    <tr>
      <td>HOA Fee</td>
      <td align="right" id="HOAFeeMonthly"></td>
      <td id="hoaf" align="right"></td>
    </tr>
    <tr>
      <td>Other Costs</td>
      <td align="right" id="OtherCostsMonthly"></td>
      <td id="oc" align="right"></td>
    </tr>
    <tr>
      <td>Total Out-of-Pocket</td>
      <td align="right" id="monthlyPayment"></td>
      <td align="right" id="totalPayment"></td>
    </tr>
    <tr>
      <td colspan="3">&nbsp;</td>
    </tr>
    <tr >
      <td colspan="2"><b>House Price</b></td>
      <td id="housePrice" align="right"></td>
    </tr>
    <tr>
      <td colspan="2">Loan Amount</td>
      <td id="la" align="right"></td>
    </tr>
    <tr>
      <td colspan="2">Down Payment</td>
      <td id="dp" align="right"></td>
    </tr>
  
    <tr>
      <td colspan="2">Total Interest</td>
      <td id="totalInterest" align="right"></td>
    </tr>
  
  </tbody>
</table>
     
    </div>

<p><a href="https://www.passivecash.xyz/">Home</a></p>
    </html>
