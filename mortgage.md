---
description: Mortgage calculator
title: Mortgage Calculator
---
<script src="{{ base.url | prepend: site.url }}/assets/js/mortgage.js"></script>
<script src="{{ base.url | prepend: site.url }}/assets/js/advertisement.js" defer></script>
<link id="stylesheet" rel="stylesheet" type="text/css" href="https://www.passivecash.xyz/assets/css/mortgage.css" />

<h2>Mortgage Calculator</h2>
<h4 id= "advertisement"></h4>
<div class="mortgage">
<p>
<label>Loan Amount:</label>
    <input type="number" id="loanAmount" /></p><p>
    <label>Down Payment:</label>
    <input type="number" id="downPayment" /></p><p>
    <label>Interest Rate:</label>
    <input type="number" id="interestRate" /></p><p>
    <label>Loan Term (in years):</label>
    <input type="number" id="loanTerm" /></p><p>
    <label>Property Taxes:</label>
    <input type="number" id="propertyTaxes" /></p><p>
    <label>Home Insurance:</label>
    <input type="number" id="homeInsurance" /></p><p>
    <button onclick="calculateMortgage()">Calculate</button></p>
    <table id="resultTable" style="display: none">
      <tr>
        <th>Monthly Payment</th>
        <th>Total Payment</th>
        <th>Total Interest</th>
        <th>Property Taxes</th>
        <th>Home Insurance</th>
      </tr>
      <tr>
        <td id="monthlyPayment"></td>
        <td id="totalPayment"></td>
        <td id="totalInterest"></td>
        <td id="propertyTaxesMonthly"></td>
        <td id="homeInsuranceMonthly"></td>
      </tr>
    </table>
</div>

<p><a href="https://www.passivecash.xyz/">Home</a></p>
