---
description: Compound Interest Calculator with monthly contributions and withdrawals
title: Compound Interest Calculator
---
<script src="{{ base.url | prepend: site.url }}/assets/js/calculator.js"></script>
<link id="stylesheet" rel="stylesheet" type="text/css" href="{{ base.url | prepend: site.url }}/assets/css/calculator.css">
<div class="calculator">
    <h2>Compound Interest Calculator</h2>
    <h4><a href="https://blockfi.mxuy67.net/Q7rqA" target="_'blank'" style="color: #ffa500 !important;">Blockfi - Earn up to 9% APY on Crypto</a></h4>
    <label>Initial Investment:</label>
    <input id="capital" type="number" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength = "128" onkeypress= "return isNumberKey(event)">
    <br/>
    <br/>
    <label>Monthly Contribution/Withdrawal:</label>
    <input id="contribution" type="number" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength = "128" onkeypress= "return allowNegativeNumber(event)">
    <br/>
    <br/>
    <label>APY(Annual Percentage Yield):</label>
    <input type="number" min="0" max="100" step="0.01" id="myPercent" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength = "128" onkeypress= "return isNumberKey(event)"/>
    <br/>
    <br/>
    <label>Length of Time in Years:</label>
    <input type="number" min="0" max="100" step="1" id="lengthoftime" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength = "128" onkeypress= "return isNumberKey(event)"/><span></span>
     <br/>
     <br/>
    <label for="compound">Compound Frequency:</label>
<select name="compound" id="compound" form="compoundform" style="padding: 5px;">
  <option value="weekly">Weekly</option>
  <option selected value="monthly">Monthly</option>
  <option value="quarterly">Quarterly</option>
  <option value="yearly">Yearly</option>
</select>
<br/>
<br/>



        <button onclick="calculate()">Calculate</button>
      <br/>
      <br/>
<div class="result">
    <span id="output" style="font-weight: bold"></span>

    <span id="output2" style="font-weight: bold"></span>

    <span id="output3" style="font-weight: bold"></span>
</div>
  </div>
