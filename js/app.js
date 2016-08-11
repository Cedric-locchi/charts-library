(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var pieChart = new PieChart();
pieChart.conf['background-color'] = '#cecece';
pieChart.series[0] = {
    data: [
        {
            value: 10,
            color: 'red'
        },
        {
            value: 20,
            color: 'blue'
        },
        {
            value: 30,
            color: 'green'
        }
    ]
};
pieChart.renderTo('#pie1');

var histogramChart = new HistogramChart();
histogramChart.conf['background-color'] = '#cecece';
histogramChart.series[0] =
{
    color: 'red',
    data: [
        {
            value: 10
        },
        {
            value: 20
        },
        {
            value: 30
        }
    ]
};
histogramChart.renderTo('#histo1');

var lineChart = new LineChart();
lineChart.conf['background-color'] = '#cecece';
lineChart.series[0] =
{
    color: 'red',
    data: [
        {
            value: 10
        },
        {
            value: 40
        },
        {
            value: 20
        },
        {
            value: 30
        },
        {
            value: 60
        },
        {
            value: 25
        }
    ]
};
lineChart.renderTo('#line1');


},{}]},{},[1])


//# sourceMappingURL=app.js.map
