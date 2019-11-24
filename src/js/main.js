/*
 * scatter-chart-generator
 * https://github.com/mognom/scatter-chart-generator-operator
 *
 * Copyright (c) 2018 CoNWeT
 * Licensed under the MIT license.
 */

(function () {

    "use strict";
    var xData = null;
    var yData = null;

    var init = function init() {
        // update the chart on preference change
        MashupPlatform.prefs.registerCallback(function (plotChart) {
        }.bind(this));

        MashupPlatform.wiring.registerCallback("x-data-serie", function (data) {
            xData = parseInput(data, "X axis");
            plotChart();
        });
        MashupPlatform.wiring.registerCallback("y-data-serie", function (data) {
            yData = parseInput(data, "Y axis");
            plotChart();
        });
    };

    // Allow stringified json as input
    var parseInput = function (data, endpoint) {
        if (typeof data == "string") {
            try {
                data = JSON.parse(data);
            } catch (e) {
                throw new MashupPlatform.wiring.EndpointTypeError(endpoint + " input has no valid JSON");
            }
        }

        return data;
    };

    var plotChart = function plotChart() {
        // make sure both inputs are filled
        if (!(xData && yData)) {
            return;
        }

        if (xData.length !== yData.length) {
            throw new MashupPlatform.wiring.EndpointTypeError("Data must have the same length to plot a scatter chart");
        }

        // Build data series
        var series = [];
        var i;
        for (i = 0; i < xData.length; i++) {
            series.push([xData[i], yData[i]]);
        }

        // highchart options
        var HighChartOptions = {
            chart: {
                type: 'scatter',
                zoomType: 'xy'
            },
            title: {
                text: MashupPlatform.prefs.get('title')
            },
            xAxis: {
                title: {
                    enabled: true,
                    text: MashupPlatform.prefs.get('x-axis-label') || ""
                },
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true
            },
            yAxis: {
                title: {
                    text: MashupPlatform.prefs.get('y-axis-label') || ""
                }
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 100,
                y: 70,
                floating: true,
                backgroundColor: '#FFFFFF',
                borderWidth: 1
            },
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{point.x} - {point.y}</b><br>',
                        pointFormat: ''
                    }
                }
            },
            series: [{
                animation: MashupPlatform.prefs.get('animation'),
                data: series
            }]
        };

        MashupPlatform.wiring.pushEvent("HighChart-options", HighChartOptions);


        var EChartOptions = {

            title: {
                text: MashupPlatform.prefs.get('title') || ' ',
                top: '-5'
            },

            grid: {
                left: '56',
            },

            lineStyle: {
                normal: {
                    type: 'solid'
                }
            },

            xAxis: {
                type: 'value',
                name: MashupPlatform.prefs.get('x-axis-label') || ' ',
                nameLocation: 'middle',
                nameGap: 30,

                nameTextStyle: {
                    fontSize: 16,
                    fontWeight: 80
                }

            },
            yAxis: {
                type: 'value',
                name: MashupPlatform.prefs.get('y-axis-label') || ' ',
                nameLocation: 'middle',
                nameRotate: 90,
                nameGap: 38,
                nameTextStyle: {
                    fontSize: 16,
                    fontWeight: 80
                }


            },
            series: [{
                animation: MashupPlatform.prefs.get('animation'),
                symbolSize: 18,
                data: series,
                type: 'scatter'
            }]
        };

        // Push the ECharts options
        MashupPlatform.wiring.pushEvent("EChart-options", EChartOptions);

    };

    init();
})();
