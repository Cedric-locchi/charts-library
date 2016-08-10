var baseChart = require('./BaseChart.js');

var HistogramChart = function() {
    this._init();

    this._drawChart = function(canvas) {

        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');

            // todo pre-compute drawing area dimensions...
            // var rect = canvas.getBoundingClientRect();
            var chartPadding = 20;

            var drawArea = {
                x: chartPadding,
                y: chartPadding,
                width: canvas.clientWidth - chartPadding * 2,
                height: canvas.clientHeight - chartPadding * 2
            };

            var marginBetweenBars = 20;

            var max = this.series[0].data.reduce( (prevMax, d) => {
                return d.value > prevMax ? d.value : prevMax;
            }, 0);


            var barWidth = (drawArea.width - (this.series[0].data.length - 1) * marginBetweenBars) / this.series[0].data.length;

            var currentBarX = drawArea.x;

            // http://stackoverflow.com/questions/28574628/invert-x-and-y-coordinates-on-html5-canvas
            ctx.transform(1, 0, 0, -1, 0, canvas.height);

            this.series[0].data.forEach((d) => {
                ctx.fillStyle = this.series[0].color;
                ctx.fillRect(currentBarX, drawArea.y, barWidth, d.value * drawArea.height / max);
                currentBarX += barWidth + marginBetweenBars;
            });


        } else {
            // TODO fallback to unsupported code
        }
    };
};

HistogramChart.prototype = baseChart;

module.exports = HistogramChart;