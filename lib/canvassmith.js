// Load in our dependencies
var assert = require('assert');
var fs = require('fs');
var async = require('async');
var concat = require('concat-stream');
var NodeCanvas = require('canvas');
var Image = NodeCanvas.Image;
var engine = {};

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
engine.specVersion = '1.1.0';
module.exports = engine;
