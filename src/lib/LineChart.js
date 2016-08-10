var baseChart = require('./BaseChart.js');

var LineChart = function() {
    this._init();

    this._drawChart = function(canvas) {

        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');

            var chartPadding = 20;

            var drawArea = {
                x: chartPadding,
                y: chartPadding,
                width: canvas.clientWidth - chartPadding * 2,
                height: canvas.clientHeight - chartPadding * 2
            };

            var max = this.series[0].data.reduce( (prevMax, d) => {
                return d.value > prevMax ? d.value : prevMax;
            }, 0);


            var pointSpacing = drawArea.width / (this.series[0].data.length - 1) ;

            var pointRadius = 4;

            ctx.transform(1, 0, 0, -1, 0, canvas.height);

            ctx.strokeStyle = this.series[0].color;
            ctx.fillStyle = this.series[0].color;
            ctx.beginPath();
            ctx.moveTo(0,  this.series[0].data[0].value * drawArea.height / max);
            // lines
            for (let i = 1; i < this.series[0].data.length; i++) {
                ctx.lineTo(i * pointSpacing, this.series[0].data[i].value * drawArea.height / max);
            }
            ctx.stroke();
            // dots
            for (let i = 1; i < this.series[0].data.length; i++) {
                ctx.beginPath();
                ctx.arc(i * pointSpacing, this.series[0].data[i].value * drawArea.height / max, pointRadius, 0, 2*Math.PI);
                ctx.fill();

            }


        }

    };
};

LineChart.prototype = baseChart;

module.exports = LineChart;