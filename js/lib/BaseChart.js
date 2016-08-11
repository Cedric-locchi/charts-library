var BaseChart = function() {

    this._init = function() {
        this.conf = {};
        this.series = [];
    };

    this.renderTo = function(o) {

        var container;

        if(typeof o === 'string') {
            container = document.querySelector(o);
        }

        var canvas;
        if (canvas === undefined) {
            canvas = document.createElement('canvas');
            canvas.id     = this.conf.name || 'chart-' + Math.floor(Math.random());
            canvas.width  = container.clientWidth;
            canvas.height = container.clientHeight;
            canvas.style.border   = '1px solid #999';

            container.appendChild(canvas);
        }

        this._drawChart(canvas);

    };

    this._drawChart = function(canvas) {
        throw new Error('Don\'t render the BaseChart, use a specialized type (PieChart, HistogramChart,...)' );
    };
};