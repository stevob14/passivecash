document.addEventListener("DOMContentLoaded", function() {
  calculateRebalance();
});

function calculateRebalance() {
  let deposit = parseFloat(document.getElementById("deposit").value);
  if (isNaN(deposit)) {
    deposit = 0; // Treat NaN as 0
  }

  const table = document.getElementById("investmentTable");
  let investments = [];
  let totalAllocation = 0;

  for (let i = 0; i < table.rows.length; i++) {
    const symbol = table.rows[i].cells[0].querySelector('input').value;
    const value = parseFloat(table.rows[i].cells[1].querySelector('input').value);
    const allocation = parseFloat(table.rows[i].cells[2].querySelector('input').value) / 100;
    investments.push({ symbol, value, allocation });
    totalAllocation += allocation;
  }

  // Check if total allocation equals 100%
  if (totalAllocation !== 1) {
    document.getElementById("error-message").textContent = "The sum of each investment's target allocation must equal 100% before the portfolio can be rebalanced.";
    return;
  } else {
    document.getElementById("error-message").textContent = "";
  }

  let currentBalance = investments.reduce((acc, investment) => acc + investment.value, 0);

  document.getElementById("currentBalance").textContent = currentBalance.toFixed(2);

  let targetBalance = currentBalance + deposit; // Corrected target balance calculation

  for (let i = 0; i < investments.length; i++) {
    const investment = investments[i];
    const targetValue = targetBalance * investment.allocation;
    const rebalanceAmount = targetValue - investment.value;
    const rebalanceCells = table.querySelectorAll('.rebalanceAmount');
    rebalanceCells[i].textContent = rebalanceAmount.toFixed(2);
  }

  document.getElementById("targetBalance").textContent = targetBalance.toFixed(2);
}

function addInvestment() {
  const table = document.getElementById("investmentTable");
  const row = table.insertRow();
  const symbolCell = row.insertCell();
  const valueCell = row.insertCell();
  const allocationCell = row.insertCell();
  const rebalanceCell = row.insertCell();
  const actionCell = row.insertCell();

  symbolCell.innerHTML = '<input type="text" name="symbol">';
  valueCell.innerHTML = '<input type="number" name="value" value="0" oninput="calculateRebalance()">';
  allocationCell.innerHTML = '<input type="number" name="allocation" value="0" oninput="calculateRebalance()">%';
  rebalanceCell.className = "rebalanceAmount";
  actionCell.innerHTML = '<button type="button" onclick="removeInvestment(this)">Remove</button>';
  calculateRebalance();
}

function removeInvestment(button) {
  const row = button.parentNode.parentNode;
  const table = document.getElementById("investmentTable");
  table.deleteRow(row.rowIndex - 1);
  calculateRebalance();
}
