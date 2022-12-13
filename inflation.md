---
description: Inflation calculator using consumer price index changes from 1913 to 2021
title: Inflation Calculator
---
<script src="{{ base.url | prepend: site.url }}/assets/js/inflation_calculator.js"></script>
<link id="stylesheet" rel="stylesheet" type="text/css" href="{{ base.url | prepend: site.url }}/assets/css/calculator.css">

<div class="inflation">
<h2>Inflation Calculator</h2>
<h4><a href="https://app.groundfloor.us/r/od0e9f" target="_'blank'" style="color: #ffa500 !important;">Groundfloor Real Estate up to 10% Returns  -  Get $50 when you invest $100</a></h4>
<label>Dollar Amount (US):</label>

 <input id="dollarField" type="number" value="25" oninput="javascript: if (this.value.length &gt; this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength="128" onkeypress="return isNumberKey(event)"/>
<br/>
<br/>
 <label for="start">Starting Year:</label>

 <input id="startYearField" type="number" value="1913" min="1913" max="2021" oninput="javascript: if (this.value.length &gt; this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength="128" onkeypress="return isNumberKey(event)"/>
<br/>
<br/>
<label>End Year:  </label>
 <input id="endYearField" type="number" value="2021" min="1913" max="2021" oninput="javascript: if (this.value.length &gt; this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength="128" onkeypress="return isNumberKey(event)"/>
<br/>
<br/>
 <button onClick="calculate()">Calculate</button>
<br/>
<br/>

<div class="result">
 <label id="output"></label>
</div>

</div>
