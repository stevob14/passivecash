#!/usr/bin/env python3
"""
Automated CPI Updater for PassiveCash.xyz
Fetches the official U.S. Bureau of Labor Statistics (BLS) Consumer Price Index (CPI-U)
series CUUR0000SA0 and updates js/inflation_calculator.js automatically.
"""

import json
import re
import ssl
import urllib.request
from collections import defaultdict
from pathlib import Path

BLS_API_URL = "https://api.bls.gov/publicAPI/v1/timeseries/data/CUUR0000SA0"

def fetch_bls_cpi_data():
    headers = {"User-Agent": "Mozilla/5.0 (PassiveCash-CPI-Updater)"}
    req = urllib.request.Request(BLS_API_URL, headers=headers)
    
    try:
        ctx = ssl.create_default_context()
        resp = urllib.request.urlopen(req, timeout=15, context=ctx)
    except (ssl.SSLError, urllib.error.URLError):
        # Fallback for systems lacking local CA roots (e.g. some local macOS python builds)
        ctx = ssl._create_unverified_context()
        resp = urllib.request.urlopen(req, timeout=15, context=ctx)

    with resp:
        data = json.loads(resp.read().decode("utf-8"))
    
    if data.get("status") != "REQUEST_SUCCEEDED":
        raise ValueError(f"BLS API request failed: {data.get('message')}")
    
    series_data = data["Results"]["series"][0]["data"]
    
    annual_averages = {}
    monthly_by_year = defaultdict(list)
    
    for entry in series_data:
        year = int(entry["year"])
        period = entry["period"]
        val_str = entry["value"]
        
        if val_str in ("-", "", None):
            continue
        try:
            val = float(val_str)
        except ValueError:
            continue
            
        if period == "M13": # Official Annual Average
            annual_averages[year] = val
        elif period.startswith("M") and period[1:].isdigit():
            monthly_by_year[year].append(val)
            
    # For current ongoing year, calculate YTD average if M13 isn't available yet
    for year, vals in monthly_by_year.items():
        if year not in annual_averages and vals:
            ytd_avg = round(sum(vals) / len(vals), 3)
            annual_averages[year] = ytd_avg
            
    return annual_averages

def update_inflation_calculator():
    js_path = Path(__file__).resolve().parent.parent / "js" / "inflation_calculator.js"
    if not js_path.exists():
        raise FileNotFoundError(f"Could not find {js_path}")
        
    with open(js_path, "r", encoding="utf-8") as f:
        js_content = f.read()

    # Find all existing cpi.rates[index] = value; //year
    pattern = re.compile(r'cpi\.rates\[(\d+)\]\s*=\s*([\d.]+);\s*//(\d+)')
    matches = pattern.findall(js_content)
    if not matches:
        raise ValueError("Could not parse existing cpi.rates in inflation_calculator.js")

    existing_years = {}
    for idx_str, val_str, yr_str in matches:
        existing_years[int(yr_str)] = (int(idx_str), float(val_str))

    max_year = max(existing_years.keys())
    max_idx = existing_years[max_year][0]

    print(f"Current latest year in file: {max_year} (index {max_idx})")

    # Fetch latest BLS data
    bls_data = fetch_bls_cpi_data()
    print(f"Fetched BLS data for years: {sorted(bls_data.keys())}")

    updated = False
    new_lines = []
    
    for yr in sorted(bls_data.keys()):
        if yr > max_year:
            max_idx += 1
            rate = bls_data[yr]
            line = f"cpi.rates[{max_idx}] = {rate:.3f}; //{yr}"
            new_lines.append(line)
            print(f"Adding new year {yr}: {line}")
            updated = True
        elif yr == max_year and yr in bls_data:
            # If current year was only partial and now has a revised annual average
            old_idx, old_val = existing_years[yr]
            new_val = bls_data[yr]
            if round(old_val, 3) != round(new_val, 3):
                old_line = f"cpi.rates[{old_idx}] = {old_val}; //{yr}"
                new_line = f"cpi.rates[{old_idx}] = {new_val:.3f}; //{yr}"
                js_content = js_content.replace(old_line, new_line)
                print(f"Updated year {yr}: {old_val} -> {new_val:.3f}")
                updated = True

    if new_lines:
        last_match_pattern = rf"cpi\.rates\[{existing_years[max_year][0]}\]\s*=\s*[^;\n]+;\s*//{max_year}"
        replacement = f"\\g<0>\n" + "\n".join(new_lines)
        js_content = re.sub(last_match_pattern, replacement, js_content)

    latest_year = max(max_year, max(bls_data.keys())) if bls_data else max_year
    update_calculators_html(latest_year)

    if updated:
        with open(js_path, "w", encoding="utf-8") as f:
            f.write(js_content)
        print("Successfully updated js/inflation_calculator.js!")
    else:
        print("js/inflation_calculator.js is already up-to-date.")

    return updated

def update_calculators_html(latest_year):
    html_path = Path(__file__).resolve().parent.parent / "calculators.html"
    if not html_path.exists():
        return
    with open(html_path, "r", encoding="utf-8") as f:
        html_content = f.read()

    # Update input value and placeholder: value="..." placeholder="e.g., ..."
    new_html = re.sub(
        r'(<input type="number" id="endYearField" value=")\d+(" placeholder="e\.g\., )\d+(")',
        rf'\g<1>{latest_year}\g<2>{latest_year}\g<3>',
        html_content
    )
    # Update cache-busting script tag
    new_html = re.sub(
        r'src="js/inflation_calculator\.js(\?v=\d+)?"',
        rf'src="js/inflation_calculator.js?v={latest_year}"',
        new_html
    )
    if new_html != html_content:
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(new_html)
        print(f"Successfully updated calculators.html default end year to {latest_year}")

if __name__ == "__main__":
    update_inflation_calculator()

