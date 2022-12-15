---
description: ETH Price Ticker
title: 
---
<script src="{{ base.url | prepend: site.url }}/assets/js/eth_ticker.js"></script>
<script src="{{ base.url | prepend: site.url }}/assets/js/jquery-3.6.0.min.js"></script>
<script src="{{ base.url | prepend: site.url }}/assets/js/highstock.js"></script>
<script src="{{ base.url | prepend: site.url }}/assets/js/linear_regression.js"></script>
<script src="{{ base.url | prepend: site.url }}/assets/js/eth_chart.js"></script>
<link id="stylesheet" rel="stylesheet" type="text/css" href="{{ base.url | prepend: site.url }}/assets/css/eth_ticker.css">

<h2>ETH Price(USD)</h2>

<span class="Price"></span>

<p>Ethereum is the first decentralized blockchain network that can run smart contracts and is powered by the ETH cryptocurrency. Smart contracts are applications that run exactly as programmed without any chance of censorship, fraud or third-party interference. What makes this unique is the ability of developers to build custom smart contracts for various applications using the Ethereum network. For example, <a href="https://www.passivecash.xyz/#defi">DeFi</a> applications built using the Ethereum network.</p>

<div id="chart" name="chart"></div>
