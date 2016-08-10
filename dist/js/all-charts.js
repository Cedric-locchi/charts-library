(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){

var rng;

if (global.crypto && crypto.getRandomValues) {
  // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
  // Moderately fast, high quality
  var _rnds8 = new Uint8Array(16);
  rng = function whatwgRNG() {
    crypto.getRandomValues(_rnds8);
    return _rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var  _rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return _rnds;
  };
}

module.exports = rng;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
//     uuid.js
//
//     Copyright (c) 2010-2012 Robert Kieffer
//     MIT License - http://opensource.org/licenses/mit-license.php

// Unique ID creation requires a high quality random # generator.  We feature
// detect to determine the best RNG source, normalizing to a function that
// returns 128-bits of randomness, since that's what's usually required
var _rng = require('./rng');

// Maps for number <-> hex string conversion
var _byteToHex = [];
var _hexToByte = {};
for (var i = 0; i < 256; i++) {
  _byteToHex[i] = (i + 0x100).toString(16).substr(1);
  _hexToByte[_byteToHex[i]] = i;
}

// **`parse()` - Parse a UUID into it's component bytes**
function parse(s, buf, offset) {
  var i = (buf && offset) || 0, ii = 0;

  buf = buf || [];
  s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
    if (ii < 16) { // Don't overflow!
      buf[i + ii++] = _hexToByte[oct];
    }
  });

  // Zero out remaining bytes if string was short
  while (ii < 16) {
    buf[i + ii++] = 0;
  }

  return buf;
}

// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
function unparse(buf, offset) {
  var i = offset || 0, bth = _byteToHex;
  return  bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

// random #'s we need to init node and clockseq
var _seedBytes = _rng();

// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
var _nodeId = [
  _seedBytes[0] | 0x01,
  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
];

// Per 4.2.2, randomize (14 bit) clockseq
var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

// Previous uuid creation time
var _lastMSecs = 0, _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};

  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  var node = options.node || _nodeId;
  for (var n = 0; n < 6; n++) {
    b[i + n] = node[n];
  }

  return buf ? buf : unparse(b);
}

// **`v4()` - Generate random UUID**

// See https://github.com/broofa/node-uuid for API details
function v4(options, buf, offset) {
  // Deprecated - 'format' argument, as supported in v1.2
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || _rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ii++) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || unparse(rnds);
}

// Export public API
var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;
uuid.parse = parse;
uuid.unparse = unparse;

module.exports = uuid;

},{"./rng":1}],3:[function(require,module,exports){
(function (global){
'use strict';

global.AllCharts = {};

global.AllCharts.PieChart = require('./lib/PieChart');
global.AllCharts.HistogramChart = require('./lib/HistogramChart');
global.AllCharts.LineChart = require('./lib/LineChart');

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./lib/HistogramChart":5,"./lib/LineChart":6,"./lib/PieChart":7}],4:[function(require,module,exports){
'use strict';

var UUID = require('uuid');

var BaseChart = function BaseChart() {

    this._init = function () {
        this.conf = {};
        this.series = [];
    };

    this.renderTo = function (o) {
        var container;
        if (typeof o === 'string') {
            // assume CSS selector here
            container = document.querySelector(o);
        }

        var canvas;
        if (canvas === undefined) {
            canvas = document.createElement('canvas');
            canvas.id = this.conf.name || 'chart-' + UUID.v4();
            canvas.width = container.clientWidth; // https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements
            canvas.height = container.clientHeight;
            //canvas.style.zIndex   = 8;
            //canvas.style.position = "absolute";
            canvas.style.border = '1px solid #999';

            container.appendChild(canvas);
        }

        this._drawChart(canvas);
    };

    this._drawChart = function (canvas) {
        throw new Error('Don\'t render the BaseChart, use a specialized type (PieChart, HistogramChart,...)');
    };
};

var chartsBasePrototype = new BaseChart();

module.exports = chartsBasePrototype;

},{"uuid":2}],5:[function(require,module,exports){
'use strict';

var baseChart = require('./BaseChart.js');

var HistogramChart = function HistogramChart() {
    this._init();

    this._drawChart = function (canvas) {
        var _this = this;

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

            var max = this.series[0].data.reduce(function (prevMax, d) {
                return d.value > prevMax ? d.value : prevMax;
            }, 0);

            var barWidth = (drawArea.width - (this.series[0].data.length - 1) * marginBetweenBars) / this.series[0].data.length;

            var currentBarX = drawArea.x;

            // http://stackoverflow.com/questions/28574628/invert-x-and-y-coordinates-on-html5-canvas
            ctx.transform(1, 0, 0, -1, 0, canvas.height);

            this.series[0].data.forEach(function (d) {
                ctx.fillStyle = _this.series[0].color;
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

},{"./BaseChart.js":4}],6:[function(require,module,exports){
'use strict';

var baseChart = require('./BaseChart.js');

var LineChart = function LineChart() {
    this._init();

    this._drawChart = function (canvas) {

        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');

            var chartPadding = 20;

            var drawArea = {
                x: chartPadding,
                y: chartPadding,
                width: canvas.clientWidth - chartPadding * 2,
                height: canvas.clientHeight - chartPadding * 2
            };

            var max = this.series[0].data.reduce(function (prevMax, d) {
                return d.value > prevMax ? d.value : prevMax;
            }, 0);

            var pointSpacing = drawArea.width / (this.series[0].data.length - 1);

            var pointRadius = 4;

            ctx.transform(1, 0, 0, -1, 0, canvas.height);

            ctx.strokeStyle = this.series[0].color;
            ctx.fillStyle = this.series[0].color;
            ctx.beginPath();
            ctx.moveTo(0, this.series[0].data[0].value * drawArea.height / max);
            // lines
            for (var i = 1; i < this.series[0].data.length; i++) {
                ctx.lineTo(i * pointSpacing, this.series[0].data[i].value * drawArea.height / max);
            }
            ctx.stroke();
            // dots
            for (var _i = 1; _i < this.series[0].data.length; _i++) {
                ctx.beginPath();
                ctx.arc(_i * pointSpacing, this.series[0].data[_i].value * drawArea.height / max, pointRadius, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    };
};

LineChart.prototype = baseChart;

module.exports = LineChart;

},{"./BaseChart.js":4}],7:[function(require,module,exports){
'use strict';

var baseChart = require('./BaseChart.js');

var PieChart = function PieChart() {
    this._init();

    this._drawChart = function (canvas) {

        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');

            var origin = {
                x: canvas.clientWidth / 2,
                y: canvas.clientHeight / 2
            };

            var radius = 100;

            var sum = this.series[0].data.reduce(function (acc, d) {
                return acc + d.value;
            }, 0);

            var angle = 0;

            this.series[0].data.forEach(function (d) {
                // draw circles
                // https://en.wikipedia.org/wiki/Circle#Equations
                // http://stackoverflow.com/questions/839899/how-do-i-calculate-a-point-on-a-circle-s-circumference
                // https://www.mathsisfun.com/data/pie-charts.html
                var relativePieSliceAngle = d.value * 2 * Math.PI / sum;

                ctx.beginPath();
                ctx.moveTo(origin.x, origin.y);
                ctx.lineTo(origin.x + radius * Math.cos(angle), origin.y + radius * Math.sin(angle));

                ctx.arc(origin.x, origin.y, radius, angle, angle + relativePieSliceAngle); // https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/arc
                ctx.lineTo(origin.x, origin.y);
                ctx.fillStyle = d.color;
                ctx.fill();
                ctx.closePath();
                angle += relativePieSliceAngle;
            });
        }
    };
};

PieChart.prototype = baseChart;

module.exports = PieChart;

},{"./BaseChart.js":4}]},{},[3])

