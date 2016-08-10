var UUID = require('uuid');

var BaseChart = function() {

    this._init = function() {
        this.conf = {};
        this.series = [];
    };

    this.renderTo = function(o) {
        var container;
        if(typeof o === 'string') { // assume CSS selector here
            container = document.querySelector(o);
        }

        var canvas;
        if (canvas === undefined) {
            canvas = document.createElement('canvas');
            canvas.id     = this.conf.name || 'chart-' + UUID.v4();
            canvas.width  = container.clientWidth; // https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements
            canvas.height = container.clientHeight;
            //canvas.style.zIndex   = 8;
            //canvas.style.position = "absolute";
            canvas.style.border   = '1px solid #999';

            container.appendChild(canvas);
        }

        this._drawChart(canvas);

    };

    this._drawChart = function(canvas) {
        throw new Error('Don\'t render the BaseChart, use a specialized type (PieChart, HistogramChart,...)' );
    };
};

var chartsBasePrototype = new BaseChart();

module.exports = chartsBasePrototype;
