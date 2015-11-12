// Load in our dependencies
var assert = require('assert');
var concat = require('concat-stream');
var NodeCanvas = require('canvas');

// Define our canvas constructor
function Canvas(width, height) {
  var canvas = new NodeCanvas(width, height);
  var ctx = canvas.getContext('2d');
  this.canvas = canvas;
  this.ctx = ctx;
}
Canvas.formatToCanvasFnMap = {
  png: function (canvas, options) {
    return canvas.createPNGStream();
  },
  jpeg: function (canvas, options) {
    return canvas.createJPEGStream();
  }
};
Canvas.prototype = {
  addImage: function (img, x, y, cb) {
    var ctx = this.ctx;
    ctx.drawImage(img, x, y, img.width, img.height);
  },
  'export': function (options, cb) {
    // Find the matching canvas method
    var format = options.format;
    var exportFn = Canvas.formatToCanvasFnMap[format];
    assert(exportFn, '`canvassmith` doesn\'t support exporting "' + format + '". Please use "jpeg" or "png"');

    // Stream out the image to a binary string and callback
    var imgStream = exportFn(this.canvas, options);
    imgStream.on('error', cb);
    imgStream.pipe(concat(function handleBuff (imgBuff) {
      cb(null, imgBuff.toString('binary'));
    }));
  }
};

// Expose our canvas
module.exports = Canvas;
