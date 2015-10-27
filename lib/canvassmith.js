// Load in our dependencies
var fs = require('fs');
var async = require('async');
var assert = require('assert');
// TODO: Stop using `streamToString`
var streamToString = require('./utils').streamToString;
var CanvasLib = require('canvas');
var ImageLib = CanvasLib.Image;
var engine = {};

// Define our canvas for drawing images on
function Canvas(width, height) {
  var canvas = new CanvasLib(width, height);
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
    // Grab the exporter
    var format = options.format || 'png';
    var exporter = exporters[format];

    // Assert it exists
    assert(exporter, 'Exporter ' + format + ' does not exist for spritesmith\'s canvas engine');

    // Render the item
    exporter.call(this, options, cb);
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
      var img = new ImageLib();
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
