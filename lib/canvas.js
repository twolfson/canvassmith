// Load in our dependencies
var assert = require('assert');
var NodeCanvas = require('canvas').Canvas;

// Define our canvas constructor
function Canvas(width, height) {
  var canvas = new NodeCanvas(width, height);
  var ctx = canvas.getContext('2d');
  this.canvas = canvas;
  this.ctx = ctx;
}
Canvas.defaultFormat = 'png';
Canvas.formatToCanvasFnMap = {
  png: function (canvas, options) {
    return canvas.createPNGStream();
  },
  jpeg: function (canvas, options) {
    return canvas.createJPEGStream();
  }
};
Canvas.formatToCanvasFnMap.jpg = Canvas.formatToCanvasFnMap.jpeg;
Canvas.prototype = {
  addImage: function (img, x, y) {
    var ctx = this.ctx;
    ctx.drawImage(img, x, y, img.width, img.height);
  },
  'export': function (options) {
    // Find the matching canvas method
    var format = options.format || Canvas.defaultFormat;
    var exportFn = Canvas.formatToCanvasFnMap[format];
    assert(exportFn, '`canvassmith` doesn\'t support exporting "' + format + '". Please use "jpeg" or "png"');

    // Stream out the image to a binary string and callback
    return exportFn(this.canvas, options);
  }
};

// Expose our canvas
module.exports = Canvas;
