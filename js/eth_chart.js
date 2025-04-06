$.getJSON('https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=365', function(data) { // Reverted to 365 days
  Highcharts.setOptions({
    lang: {
      thousandsSep: ","
    },
  });
  var chart = new Highcharts.StockChart({
    chart: {
      events: {
        load: function() {
          Highcharts.fireEvent(
            this.xAxis[0],
            'afterSetExtremes', {
              redraw: true
            }
          );
        }
      },
      backgroundColor: '#111', // Match container background
      plotBorderColor: '#00ff00', // Add green border inside
      fontFamily: "'Courier New', Courier, monospace", // Match body font
      zoomType: 'x',
      type: "area",
      margin: [0, 0, 0, 0],
      spacingTop: 0,
      marginTop: 0,
      borderWidth: 0,
      spacing: 0,
      renderTo: 'chart-eth'
    },
    scrollbar: {
      enabled: false
    },
    navigator: {
      maskFill: 'rgba(0, 255, 0, 0.2)', // Green mask
      outlineColor: '#00ff00',
      handles: {
          backgroundColor: '#111',
          borderColor: '#00ff00'
      },
      series: { // Style navigator series
          color: '#00ff00',
          lineColor: '#00ff00'
      },
      xAxis: { // Style navigator axis
          gridLineColor: 'rgba(0, 255, 0, 0.1)',
          labels: {
              style: {
                  color: '#e0e0e0'
              }
          }
      }
    },
    credits: {
        enabled: false // Disable credits
    },
    rangeSelector: {
      buttons: [{ // Define only the buttons we want
          type: 'month',
          count: 1,
          text: '1m'
      }, {
          type: 'month',
          count: 3,
          text: '3m'
      }, {
          type: 'month',
          count: 6,
          text: '6m'
      }, {
          type: 'ytd',
          text: 'YTD'
      }],
      buttonTheme: { // styles for the buttons
        fill: 'none',
        stroke: 'none',
        'stroke-width': 0,
        r: 7,
        style: {
          color: '#00ff00', // Green buttons
          fontWeight: 'bold'
        },
        states: {
          hover: {
            fill: null // Keep default hover
          },
          select: {
            fill: '#00ff00', // Green selected fill
            style: {
              color: '#0a0a0a' // Dark text on select
            }
          }
        }
      },
      selected: 3, // Select YTD by default (index 3)
      inputEnabled: false,
    },
    yAxis: [{ // Primary Y Axis (Price)
            gridLineWidth: 0.3,
            gridLineColor: 'rgba(0, 255, 0, 0.1)', // Subtle green grid lines
            lineColor: 'rgba(0, 255, 0, 0.3)', // Axis line color
            tickColor: 'rgba(0, 255, 0, 0.3)', // Tick mark color
            floor: 0,
            maxPadding: 0,
            labels: {
                align: 'right',
                x: -5,
                style: {
                    color: '#e0e0e0' // Light label text
                }
            },
            title: { // Add title styling if needed
                text: 'Price (USD)',
                 style: {
                     color: '#e0e0e0'
                 }
            }
        }, {
            gridLineWidth: 0,
            floor: 0,
            minPadding: 0,
            top: '80%',
            height: '20%',
						labels: {
						          enabled: false
						      },
						      title: { // Add title styling if needed
						           enabled: false // Keep volume title disabled
						      }
        }],
 tooltip: {
        style: {
            color: '#e0e0e0' // Light text
        },
        shared: true,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker tooltip background
        split: false,
        crossharis: true,
        shadow: false,
        padding: 5,
        borderWidth: 0,
        borderRadius: 4,
        snap: "1/2"
        },
    xAxis: {
      gridLineColor: 'rgba(0, 255, 0, 0.1)', // Match Y axis grid
      lineColor: 'rgba(0, 255, 0, 0.3)', // Axis line color
      tickColor: 'rgba(0, 255, 0, 0.3)', // Tick mark color
      labels: {
          style: {
              color: '#e0e0e0' // Light label text
          }
      },
      crosshair: {
        width: 1, // Slightly thicker crosshair
        color: '#00ff00' // Green crosshair
      },
      events: {
        afterSetExtremes: function(e) {
          var points = e.target.series[0].points,
            chart = e.target.chart;
          var ky = [],
            i = 0,
            series_color,
            kx = [];
          for (i = 0; i < points.length; i++) {
            var xypoint = points[i];
            kx.push(xypoint.x);
            ky.push(xypoint.y);
          }
          var lr = linear(kx, ky);
          if (lr[0][1] < lr[1][1]) {
            series_color = 'rgba(0, 255, 0, 0.7)' // Brighter green trend
          } else {
            series_color = 'rgba(255, 68, 68, 0.7)' // Use site's red if available, else brighter red
          }
          chart.addSeries({
            name: 'Regression Line',
            marker: {
              enabled: false
            },
            lineWidth: 2,
            fillOpacity: 0,
            yAxis: 0,
            data: lr,
            color: series_color,
            dashStyle: 'shortdash',
            id: 'trend'
          }, e.redraw ? true : false);
          while (chart.series.length > 4) {
            chart.get('trend').remove();
          }
        }
      }
    },
    plotOptions: {
            series: {
                lineWidth: 2,
                states: {
                hover: {
                enabled: false,
                }
                },
                dataGrouping: {
                enabled: false,
                },
                area: {
                }
                }
                },
    series: [{
      fillOpacity: .2,
            color: "#00ff00", // Main green for price line
            name: 'Price',
            // Removed shadow as it might clash with dark theme
      data: data.prices
    }, {
      fillOpacity: .5,
            name: 'Volume',
            step: true,
            color: 'rgba(0, 255, 0, 0.4)', // Dim green for volume bars
            lineWidth: 0,
            showEmpty: false,
            offset: 2,
      			yAxis: 1,
      data: data.total_volumes
    }]
  });
});
