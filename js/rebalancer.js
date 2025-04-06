document.addEventListener("DOMContentLoaded", function() {

  calculateRebalance();

});


function calculateRebalance() {

  let deposit = parseFloat(document.getElementById("deposit").value);

  if (isNaN(deposit)) {

    deposit = 0; // Treat NaN as 0

  }


  const table = document.getElementById("investmentTable");
  // Add checks for table and tbody existence
  if (!table) {
      console.error("Rebalancer table not found!");
      return;
  }
  const tbody = table.tBodies[0]; // Target tbody explicitly
  if (!tbody) {
      console.error("Rebalancer table tbody not found!");
      return; // Exit if tbody doesn't exist
  }
  let investments = [];

  let totalAllocation = 0;


  // Iterate over tbody rows only
  for (let i = 0; i < tbody.rows.length; i++) {

    const row = tbody.rows[i]; // Get current row from tbody
    // Check if cells exist before querying
    if (row.cells.length < 4) continue; // Need at least 4 cells

    const symbolInput = row.cells[0].querySelector('input');
    const valueInput = row.cells[1].querySelector('input');
    const allocationInput = row.cells[2].querySelector('input');

    // Add checks for null inputs before accessing value
    const symbol = symbolInput ? symbolInput.value : '';
    const value = valueInput ? parseFloat(valueInput.value) : NaN;
    const allocation = allocationInput ? parseFloat(allocationInput.value) / 100 : NaN;

    // Skip row if essential data is missing or invalid
    if (!symbolInput || !valueInput || !allocationInput || isNaN(value) || isNaN(allocation) || allocation < 0) {
        // console.warn("Skipping row with invalid data:", i);
        // Optionally clear rebalance amount for this row
         if (row.cells[3]) row.cells[3].textContent = "";
        continue;
    }

    investments.push({ symbol, value, allocation });

    totalAllocation += allocation;

  }


  // Check if total allocation equals 100%

  if (totalAllocation.toFixed(2) != 1) {

    // Ensure the error message element exists or handle gracefully
    const errorElement = document.getElementById("error-message");
    if (errorElement) {
        errorElement.textContent = "The sum of each investment's target allocation must equal 100% before the portfolio can be rebalanced. Current total: " + (totalAllocation * 100).toFixed(2) + "%";
    }
    // Clear balance displays even if error element doesn't exist
    const currentBalanceElement = document.getElementById("currentBalance");
    if (currentBalanceElement) currentBalanceElement.textContent = "";
    const targetBalanceElement = document.getElementById("targetBalance");
    if (targetBalanceElement) targetBalanceElement.textContent = "";
    // Clear rebalance amounts in all rows on error
     for (let i = 0; i < tbody.rows.length; i++) {
         if (tbody.rows[i].cells[3]) tbody.rows[i].cells[3].textContent = "";
     }

    return;

  } else {

    const errorElement = document.getElementById("error-message");
    if (errorElement) errorElement.textContent = ""; // Clear error message

  }


  let currentBalance = investments.reduce((acc, investment) => acc + investment.value, 0);

  const currentBalanceElement = document.getElementById("currentBalance");
  if (currentBalanceElement) currentBalanceElement.textContent = currentBalance.toLocaleString("en-US",{style:'currency',currency: 'USD', maximumFractionDigits:2});


  let targetBalance = currentBalance + deposit;

  const targetBalanceElement = document.getElementById("targetBalance");
  if (targetBalanceElement) targetBalanceElement.textContent = targetBalance.toLocaleString("en-US",{style:'currency',currency: 'USD', maximumFractionDigits:2});


  for (let i = 0; i < investments.length; i++) {

    const investment = investments[i];
    // Ensure row exists and has enough cells
     if (!tbody.rows[i] || tbody.rows[i].cells.length < 4) continue;

    const targetValue = targetBalance * investment.allocation;

    const rebalanceAmount = targetValue - investment.value;

    const rebalanceCell = tbody.rows[i].cells[3]; // Target cell in tbody row

    rebalanceCell.textContent = rebalanceAmount.toLocaleString("en-US",{style:'currency',currency: 'USD', maximumFractionDigits:2});

    rebalanceCell.className = "rebalanceAmount " + (rebalanceAmount > 0.001 ? "positive" : (rebalanceAmount < -0.001 ? "negative" : "neutral")); // Add tolerance

  }

}


function addInvestment() {

  const table = document.getElementById("investmentTable");
  // Check if table exists before proceeding
  if (!table) {
      console.error("Investment table not found for adding row.");
      return;
  }
  const tbody = table.tBodies[0]; // Target tbody
  if (!tbody) return; // Exit if no tbody

  const row = tbody.insertRow(); // Insert row into tbody

  const symbolCell = row.insertCell();

  const valueCell = row.insertCell();

  const allocationCell = row.insertCell();

  const rebalanceCell = row.insertCell();

  const actionCell = row.insertCell();


  // Add data-label attributes for mobile view
  symbolCell.setAttribute('data-label', 'Symbol');
  valueCell.setAttribute('data-label', 'Value ($)');
  allocationCell.setAttribute('data-label', 'Target (%)');
  rebalanceCell.setAttribute('data-label', 'Rebalance');
  actionCell.setAttribute('data-label', 'Action');


  symbolCell.innerHTML = '<input type="text" name="symbol" oninput="calculateRebalance()">'; // Trigger rebalance on symbol change too? Maybe not.
  valueCell.innerHTML = '<input type="number" name="value" value="0" step="any" oninput="calculateRebalance()">'; // Allow decimals
  allocationCell.innerHTML = '<input type="number" name="allocation" value="0" step="any" oninput="calculateRebalance()">'; // Allow decimals

  rebalanceCell.className = "rebalanceAmount";

  actionCell.innerHTML = '<button type="button" onclick="removeInvestment(this)">Remove</button>';

  // Optional: Recalculate after adding a new row (might be desired)
  calculateRebalance();
}


function removeInvestment(button) {

  const row = button.parentNode.parentNode;

  const table = document.getElementById("investmentTable");

  // Check if table and tbody exist before trying to delete
  if (table && table.tBodies[0] && row.parentNode === table.tBodies[0]) {
      // Use deleteRow on the tbody, passing the row's index within the tbody
      table.tBodies[0].deleteRow(row.sectionRowIndex); // Use sectionRowIndex for index within tbody
      calculateRebalance(); // Recalculate after removing
  } else {
      console.error("Could not remove row:", row);
  }

}
