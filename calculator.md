---
description: Compound Interest Calculator with monthly contributions and withdrawals
title: Compound Interest Calculator
---
<script src="{{ base.url | prepend: site.url }}/assets/js/calculator.js"></script>
<script src="{{ base.url | prepend: site.url }}/assets/js/advertisement.js" defer></script>
<link id="stylesheet" rel="stylesheet" type="text/css" href="{{ base.url | prepend: site.url }}/assets/css/calculator.css">
<h2>Compound Interest Calculator</h2>
<h4 id= "advertisement"></h4>
<div class="calculator">   
    <p>
    <label>Initial Investment:</label>
    <input id="capital" type="number" value="1000" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength = "128" onkeypress= "return isNumberKey(event)">
    </p>
    <p>
    <label>Monthly Contribution/Withdrawal:</label>
    <input id="contribution" type="number" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength = "128" onkeypress= "return allowNegativeNumber(event)">
    </p>
    <p>
    <label>APY(Annual Percentage Yield):</label>
    <input type="number" value="10" min="0" max="100" step="0.01" id="myPercent" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength = "128" onkeypress= "return isNumberKey(event)"/>
     </p>
     <p>
    <label>Length of Time in Years:</label>
    <input type="number" value="1" min="0" max="100" step="1" id="lengthoftime" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength = "128" onkeypress= "return isNumberKey(event)"/><span></span>
     </p>
     <p> 
    <label for="compound">Compound Frequency:</label>
<select name="compound" id="compound" form="compoundform" style="padding: 5px;">
  <option value="daily">Daily</option>
  <option value="weekly">Weekly</option>
  <option selected value="monthly">Monthly</option>
  <option value="quarterly">Quarterly</option>
  <option value="yearly">Yearly</option>
</select>
</p>
<p>
<button onclick="calculate()">Calculate</button> 
</p>
       
  </div>
  <div class="result">
    <span id="output" style="font-weight: bold"></span>
</div>

<p><a href="https://www.passivecash.xyz/">Home</a></p>
