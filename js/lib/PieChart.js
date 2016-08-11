var PieChart = function() {

    this._init();

    this._drawChart = function(canvas) {

        if (canvas.getContext) {

            var ctx = canvas.getContext('2d');

            var origin = {
                x: canvas.clientWidth / 2,
                y: canvas.clientHeight / 2
            };

            var radius = 100;

            var sum = this.series[0].data.reduce( function(acc, d) {
                return acc + d.value;
            }, 0);


            var angle = 0;

            this.series[0].data.forEach( function (d) {

                var relativePieSliceAngle = d.value * 2 * Math.PI / sum;

                ctx.beginPath();
                ctx.moveTo(origin.x, origin.y);
                ctx.lineTo( origin.x + radius * Math.cos(angle),
                    origin.y + radius * Math.sin(angle));

                ctx.arc(origin.x, origin.y, radius, angle, angle + relativePieSliceAngle);
                ctx.lineTo(origin.x, origin.y);
                ctx.fillStyle = d.color;
                ctx.fill();
                ctx.closePath();
                angle += relativePieSliceAngle;

            });
        }
    };
};

PieChart.prototype =  new BaseChart();