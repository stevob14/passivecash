// --- Cookie Helper Functions ---

/**
 * Sets a cookie.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {number} days - The number of days until the cookie expires.
 */
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    // Set expiry far in the future (e.g., 10 years) for persistence
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  // Encode value to handle special characters, use SameSite=Lax for security
  document.cookie = name + "=" + (encodeURIComponent(value) || "") + expires + "; path=/; SameSite=Lax";
  console.log("Cookie Set:", name, value); // For debugging
}

/**
 * Gets a cookie value by name.
 * @param {string} name - The name of the cookie.
 * @returns {string|null} - The cookie value or null if not found.
 */
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) {
      const value = decodeURIComponent(c.substring(nameEQ.length, c.length));
      console.log("Cookie Found:", name, value); // For debugging
      return value;
    }
  }
  console.log("Cookie Not Found:", name); // For debugging
  return null;
}

/**
 * Deletes a cookie by name.
 * @param {string} name - The name of the cookie to delete.
 */
function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;';
    console.log("Cookie Erased:", name); // For debugging
}


// --- Main Application Logic ---

document.addEventListener("DOMContentLoaded", function() {
  loadDataFromCookie(); // Load data first
  calculateRebalance(); // Then calculate based on loaded/default data
  // Add event listener for deposit input changes
  document.getElementById("deposit").addEventListener("input", calculateRebalance);
});

/**
 * Saves the current state (deposit and investments) to a cookie.
 */
function saveDataToCookie() {
  const deposit = document.getElementById("deposit").value || "0"; // Save deposit value
  const table = document.getElementById("investmentTable");
  let investments = [];

  for (let i = 0; i < table.rows.length; i++) {
    const symbolInput = table.rows[i].cells[0].querySelector('input[name="symbol"]');
    const valueInput = table.rows[i].cells[1].querySelector('input[name="value"]');
    const allocationInput = table.rows[i].cells[2].querySelector('input[name="allocation"]');

    // Only save if all inputs exist (robustness)
    if (symbolInput && valueInput && allocationInput) {
         investments.push({
            symbol: symbolInput.value,
            value: valueInput.value || "0", // Store as string, handle empty
            allocation: allocationInput.value || "0" // Store as string, handle empty
         });
    }
  }

  const dataToSave = {
    deposit: deposit,
    investments: investments
  };

  try {
     // Store for ~10 years
    setCookie("portfolioData", JSON.stringify(dataToSave), 3650);
  } catch (e) {
      console.error("Error saving data to cookie:", e);
      // Handle potential errors, like data being too large for a cookie
      alert("Error saving portfolio data. It might be too large for cookies.");
  }
}

/**
 * Loads data from the cookie and populates the form.
 */
function loadDataFromCookie() {
  const savedDataString = getCookie("portfolioData");
  if (!savedDataString) {
      console.log("No saved portfolio data found in cookies.");
      // Optional: Add a default row if no data is loaded
      // if (document.getElementById("investmentTable").rows.length === 0) {
      //    addInvestment();
      // }
      return; // Exit if no cookie found
  }

  try {
    const savedData = JSON.parse(savedDataString);

    // Load deposit
    document.getElementById("deposit").value = savedData.deposit || 0;

    // Load investments
    const table = document.getElementById("investmentTable");
    // Clear existing rows before loading (important!)
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }

    if (savedData.investments && savedData.investments.length > 0) {
      savedData.investments.forEach(investment => {
        addInvestment(investment); // Pass loaded data to addInvestment
      });
    } else {
       // Optional: Add a default row if the loaded data had no investments
       // addInvestment();
    }

  } catch (e) {
    console.error("Error parsing saved data from cookie:", e);
    alert("Could not load saved portfolio data. It might be corrupted.");
    // Optionally clear the corrupted cookie
    // eraseCookie("portfolioData");
    // Add a default row in case of error
    // addInvestment();
  }
}


function calculateRebalance() {
  let deposit = parseFloat(document.getElementById("deposit").value);
  if (isNaN(deposit)) {
    deposit = 0; // Treat NaN as 0
  }

  const table = document.getElementById("investmentTable");
  let investments = [];
  let totalAllocation = 0;
  let parsingError = false; // Flag for input errors

  for (let i = 0; i < table.rows.length; i++) {
    const symbolInput = table.rows[i].cells[0].querySelector('input');
    const valueInput = table.rows[i].cells[1].querySelector('input');
    const allocationInput = table.rows[i].cells[2].querySelector('input');

    const symbol = symbolInput ? symbolInput.value : ''; // Handle missing input
    const value = parseFloat(valueInput ? valueInput.value : '0');
    const allocation = parseFloat(allocationInput ? allocationInput.value : '0') / 100;

     // Basic validation for numeric inputs
     if (isNaN(value) || isNaN(allocation * 100)) {
        parsingError = true;
        // Optionally provide visual feedback on the row with the error
        // table.rows[i].style.backgroundColor = 'lightcoral';
     } else {
        // Reset background color if previously marked as error
        // table.rows[i].style.backgroundColor = '';
        investments.push({ symbol, value, allocation });
        totalAllocation += allocation;
     }
  }

   // Handle parsing errors first
   if (parsingError) {
     document.getElementById("error-message").textContent = "Please ensure 'Current Value' and 'Target Allocation %' contain valid numbers.";
     // Clear results as they are invalid
     document.getElementById("currentBalance").textContent = "Error";
     document.getElementById("targetBalance").textContent = "Error";
      // Clear rebalance amounts
      for (let i = 0; i < table.rows.length; i++) {
           const rebalanceCell = table.rows[i].cells[3];
           if (rebalanceCell) {
               rebalanceCell.textContent = "";
               rebalanceCell.className = "rebalanceAmount"; // Reset class
           }
       }
     return; // Stop calculation
  }


  // Check if total allocation equals 100%
  // Use a small tolerance for floating point comparisons
  if (Math.abs(totalAllocation - 1.0) > 0.001) {
    document.getElementById("error-message").textContent = "The sum of each investment's target allocation must equal 100% before the portfolio can be rebalanced. Current total: " + (totalAllocation * 100).toFixed(2) + "%";
    document.getElementById("currentBalance").textContent = ""; // Clear results
    document.getElementById("targetBalance").textContent = "";
     // Clear rebalance amounts
      for (let i = 0; i < table.rows.length; i++) {
           const rebalanceCell = table.rows[i].cells[3];
            if (rebalanceCell) {
               rebalanceCell.textContent = "";
               rebalanceCell.className = "rebalanceAmount"; // Reset class
           }
      }
    return; // Stop calculation
  } else {
    document.getElementById("error-message").textContent = ""; // Clear error message
  }

  // --- Calculations (only if inputs are valid and allocation is 100%) ---
  let currentBalance = investments.reduce((acc, investment) => acc + investment.value, 0);
  document.getElementById("currentBalance").textContent = currentBalance.toFixed(2);

  let targetBalance = currentBalance + deposit;
  document.getElementById("targetBalance").textContent = targetBalance.toFixed(2);

  for (let i = 0; i < investments.length; i++) {
    const investment = investments[i];
    const targetValue = targetBalance * investment.allocation;
    const rebalanceAmount = targetValue - investment.value;
    const rebalanceCell = table.rows[i].cells[3];
    if (rebalanceCell) { // Check if cell exists
         rebalanceCell.textContent = rebalanceAmount.toFixed(2);
         rebalanceCell.className = "rebalanceAmount " + (rebalanceAmount > 0.001 ? "positive" : (rebalanceAmount < -0.001 ? "negative" : "neutral")); // Add tolerance
    }
  }

  // --- Save data after successful calculation ---
  saveDataToCookie();
}

/**
 * Adds a new investment row to the table.
 * Optionally populates it with data (used during loading).
 * @param {object|null} data - Optional data to populate the row ({symbol, value, allocation}).
 */
function addInvestment(data = null) {
  const table = document.getElementById("investmentTable");
  const row = table.insertRow(); // Inserts at the end by default
  const symbolCell = row.insertCell();
  const valueCell = row.insertCell();
  const allocationCell = row.insertCell();
  const rebalanceCell = row.insertCell();
  const actionCell = row.insertCell();

  // Use data if provided (from loading), otherwise use defaults
  const symbolValue = data ? data.symbol : '';
  const valueValue = data ? data.value : '0';
  const allocationValue = data ? data.allocation : '0';

  // Set innerHTML with values and ensure oninput calls calculateRebalance
  symbolCell.innerHTML = `<input type="text" name="symbol" value="${symbolValue}" oninput="calculateRebalance()">`; // Also save on symbol change
  valueCell.innerHTML = `<input type="number" name="value" value="${valueValue}" step="any" min="0" oninput="calculateRebalance()">`; // Use step="any" for decimals
  allocationCell.innerHTML = `<input type="number" name="allocation" value="${allocationValue}" step="any" min="0" max="100" oninput="calculateRebalance()">`; // Use step="any"
  rebalanceCell.className = "rebalanceAmount";
  rebalanceCell.textContent = ""; // Start empty
  actionCell.innerHTML = '<button type="button" onclick="removeInvestment(this)">Remove</button>';

  // If adding manually (not loading), recalculate and save
  if (!data) {
     calculateRebalance();
  }
}

function removeInvestment(button) {
  const row = button.parentNode.parentNode;
  const table = document.getElementById("investmentTable");
  table.deleteRow(rowIndex - 1);// Removes the row from its parent (tbody or table)

  calculateRebalance(); // Recalculate and save after removal
}
