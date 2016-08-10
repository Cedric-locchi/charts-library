var assert = require('chai').assert;
var AiconoaCharts = require('../src/js-charts/AiconoaCharts.js');

var baseCharts = require('../src/js-charts/BaseChart.js');

describe('Available charts', function() {
    var tests = [
        { type: 'PieChart'},
        { type: 'HistogramChart'},
        { type: 'LineChart'}
    ];

    // TODO USE HOOK

    tests.forEach(function(test) {
        describe('AiconoaCharts.' + test.type, function () {
            it('should be available', function () {
                assert.isDefined(AiconoaCharts[test.type], 'Missing AiconoaCharts.' + test.type);
            });

            it('should be a function', function () {
                assert.strictEqual(typeof AiconoaCharts[test.type], 'function', 'AiconoaCharts.' + test.type + ' should be a function');
            });

            it('should have baseChart as a prototype', function () {
                assert.strictEqual(AiconoaCharts[test.type].prototype, baseCharts, 'AiconoaCharts.' + test.type + '.prototype should be baseCharts');
            });


            var chart = new AiconoaCharts[test.type]();

            it('should have a conf (object) property', function () {
                assert.isDefined(chart.conf, 'A AiconoaCharts.' + test.type + ' must have a conf property');
                assert.isObject(chart.conf, 'A AiconoaCharts.' + test.type + ' conf must be an object');
            });

            it('should have a series (array) property', function () {
                assert.isDefined(chart.series, 'A AiconoaCharts.' + test.type + ' must have a conf property');
                assert.isArray(chart.series, 'A AiconoaCharts.' + test.type + ' conf must be an array');
            });
        });
    });

});





// TODO karma tests
//var pieChart1 = new AiconoaCharts.PieChart();
//pieChart1.conf['background-color'] = '#cecece';
//pieChart1.series[0] = [1,2,3];
//pieChart1.renderTo("#pie1");
//
//var pieChart2 = new AiconoaCharts.PieChart();
//pieChart2.conf['background-color'] = 'red';
//pieChart2.series[0] = [10,20,30];
//pieChart2.renderTo("#pie1");
//
//console.log(pieChart1.conf);
//console.log(pieChart1.series);
//
//console.log(pieChart2.conf);
//console.log(pieChart2.series);
//
//var histogramChart = new AiconoaCharts.HistogramChart();
//histogramChart.conf['background-color'] = 'red';
//histogramChart.series[0] = [10,20,30];
//histogramChart.renderTo("#histo1");