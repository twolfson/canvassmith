// Load in our dependencies
var fs = require('fs');
var async = require('async');
var assert = require('assert');
// TODO: Stop using `streamToString`
var streamToString = require('./utils').streamToString;
var NodeCanvas = require('canvas');
var Image = NodeCanvas.Image;
var engine = {};

// Define our canvas for drawing images on
function Canvas(width, height) {
  var canvas = new NodeCanvas(width, height);
  var ctx = canvas.getContext('2d');
  this.canvas = canvas;
  this.ctx = ctx;
}
Canvas.formatToCanvasMethodMap = {
  png: 'createPNGStream',
  'image/png': 'createPNGStream',
  jpg: 'createJPEGStream',
  jpeg: 'createJPEGStream',
  'image/jpg': 'createJPEGStream',
  'image/jpeg': 'createJPEGStream'
};
Canvas.prototype = {
  addImage: function addImage (img, x, y, cb) {
    var ctx = this.ctx;
    ctx.drawImage(img, x, y, img.width, img.height);
  },
  /**
   * @param {Object} options Options for export
   * @param {String} options.format Format to export as
   * @param {Mixed} options.* Any other options the exporter might have
   * @param {Function}
   */
  'export': function exportFn (options, cb) {
    // Find the matching canvas method
    var format = options.format || 'png';
    var methodKey = Canvas.formatToCanvasMethodMap[format];
    var canvas = this.canvas;
    assert(canvas[methodKey], '`canvassmith` doesn\'t support exporting "' + format + '". Please use "jpeg" or "png"');

    // Stream out the image to a binary string and callback
    var imgStream = canvas[methodKey]();
    streamToString(imgStream, cb);
  }
};

// Expose Canvas to engine
engine.Canvas = Canvas;

// Define a method for creating a canvas
function createCanvas(width, height, cb) {
  var canvas = new Canvas(width, height);
  process.nextTick(function handleNextTick () {
    cb(null, canvas);
  });
}
engine.createCanvas = createCanvas;

// Write out Image as a static property of engine
function createImage(file, cb) {
  async.waterfall([
    function readImageFile (cb) {
      // Read in the file as a buffer
      fs.readFile(file, cb);
    },
    function createImageFn (imgBuffer, cb) {
      // Create an image object with the proper source file
      var img = new Image();
      img.src = imgBuffer;

      // Callback with the image
      cb(null, img);
    }
  ], cb);
}
function createImages(files, cb) {
  async.map(files, createImage, cb);
}
engine.createImage = createImage;
engine.createImages = createImages;

// Export the canvas
module.exports = engine;
