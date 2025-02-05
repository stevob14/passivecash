---
description: Rebalance your investment portfolio by depositing or withdrawing funds, or rebalance existing funds to achieve your desired asset allocation.
title: Portfolio Rebalancer
---
<script src="{{ base.url | prepend: site.url }}/assets/js/advertisement.js" defer></script>

<link id="stylesheet" rel="stylesheet" type="text/css" href="{{ base.url | prepend: site.url }}/assets/css/calculator.css">
<h2>Portfolio Rebalancer</h2>
<h4 id= "advertisement"></h4>
<html>
<head>
<style>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 5px;
}
.rebalanceAmount.positive {
  color: green;
}
.rebalanceAmount.negative {
  color: red;
}
</style>
</head>
<body>

<div class="calculator">   
<form id="portfolioForm">
  Deposit/Withdrawal: <input type="number" id="deposit" value="500" oninput="calculateRebalance()"><br><br>
  <table>
    <thead>
      <tr>
        <th>Symbol</th>
        <th>Current Value</th>
        <th>Target Allocation</th>
        <th>Rebalance Amount</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody id="investmentTable">
      <tr>
        <td><input type="text" name="symbol" value="VTI"></td>
        <td><input type="number" name="value" value="5000" oninput="calculateRebalance()"></td>
        <td><input type="number" name="allocation" value="60" oninput="calculateRebalance()">%</td>
        <td class="rebalanceAmount"></td>  
        <td><button type="button" onclick="removeInvestment(this)">Remove</button></td>
      </tr>
      <tr>
        <td><input type="text" name="symbol" value="BNDW"></td>
        <td><input type="number" name="value" value="3500" oninput="calculateRebalance()"></td>
        <td><input type="number" name="allocation" value="40" oninput="calculateRebalance()">%</td>
        <td class="rebalanceAmount"></td>  
        <td><button type="button" onclick="removeInvestment(this)">Remove</button></td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th colspan="5">Current Balance: <span id="currentBalance"></span></th>
      </tr>
      <tr>
        <th colspan="5">Target Balance: <span id="targetBalance"></span></th>
      </tr>
    </tfoot>
  </table>
  <button type="button" onclick="addInvestment()">Add Investment</button>
</form>
<p id="error-message" style="color: red;"></p>
</div>

</body>
</html>

<p><a href="https://www.passivecash.xyz/">Home</a></p>
