// Load in our dependencies
var fs = require('fs');
var async = require('async');
var Image = require('canvas').Image;
var Canvas = require('./canvas');

// Define our engine constructor
function Canvassmith() {
  // No options for our engine
}
Canvassmith.specVersion = '2.0.0';
Canvassmith.prototype = {
  // Define a method for creating a canvas
  createCanvas: function (width, height) {
    var canvas = new Canvas(width, height);
    return canvas;
  },

  // Define method to create an image and multiple images
  createImage: function (file, cb) {
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
  },
  createImages: function (files, cb) {
    async.map(files, this.createImage.bind(this), cb);
  }
};

// Export the engine
module.exports = Canvassmith;
