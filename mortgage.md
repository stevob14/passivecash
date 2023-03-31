---
description: Mortgage Calculator with Property Taxes, Home Insurance and PMI
title: Mortgage Calculator
---
<script src="{{ base.url | prepend: site.url }}/assets/js/mortgage.js"></script>
<script src="{{ base.url | prepend: site.url }}/assets/js/advertisement.js" defer></script>
<link id="stylesheet" rel="stylesheet" type="text/css" href="{{ base.url | prepend: site.url }}/assets/css/mortgage.css">
<h2>Mortgage Calculator</h2>
<h4 id= "advertisement"></h4>
<div class="mortage">
    <form>
      <p>
        <label for="homeValue">Home Value:</label>
        <input type="number" id="homeValue" value="400000" required></p>
      <p>
        <label for="downPayment">Down Payment:</label>
        <input type="number" id="downPayment" value="80000" required>
      </p>
      <p>
      <label for="loanTerm">Loan Term (in years):</label>
        <input type="number" id="loanTerm" value="30" required>
      </p>
        
     <p>
     <label for="interestRate">Interest Rate (%):</label>
        <input type="number" step="0.01" id="interestRate" value="6.88" required>
     </p>
        
    <p>
    <label for="taxes">Property Taxes (Annual):</label>
        <input type="number" id="taxes" required>
    </p>
        
   <p>
   <label for="insurance">Home Insurance (Annual):</label>
        <input type="number" id="insurance" required>
   </p>
        
      <p>
      <label for="pmi">PMI (%):</label>
        <input type="number" id="pmi" required>
      </p>
        
    <p>
     <button type="button" onclick="calculate()">Calculate</button>
    </p>
     
    </form>
    <div id="result"></div>
  </div>

<p><a href="https://www.passivecash.xyz/">Home</a></p>
