// Load in our dependencies
var fs = require('fs');
var async = require('async');
var concat = require('concat-stream');
var Image = require('canvas').Image;
var vinylFile = require('vinyl-file');
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
  createImage: function (file, callback) {
    async.waterfall([
      function createVinylObject (cb) {
        // If the file is a string, upcast it to buffer-based vinyl
        // DEV: We don't use `Vinyl.isVinyl` since that was introduced in Sep 2015
        //   We want some backwards compatibility with older setups
        if (typeof file === 'string') {
          vinylFile.read(file, cb);
        // Otherwise, callback with the existing vinyl object
        } else {
          cb(null, file);
        }
      },
      function loadVinylContent (file, cb) {
        // If the vinyl object is null, then load from disk
        if (file.isNull()) {
          fs.readFile(file.path, cb);
        // Otherwise, pipe buffer/stream contents into a buffer and callback
        } else {
          var concatStream = concat(function handleFileBuffer (buff) {
            cb(null, buff);
          });
          // https://github.com/gulpjs/vinyl/commit/d14ba4a7b51f0f3682f65f2aa4314d981eb1029d
          if (file.isStream()) {
            file.contents.pipe(concatStream);
          } else if (file.isBuffer()) {
            concatStream.end(file.contents);
          } else {
            throw new Error('Unrecognized Vinyl type');
          }
        }
      },
      function createImageFn (imgBuffer, cb) {
        // Create an image object with the proper source file
        var img = new Image();
        img.src = imgBuffer;

        // Callback with the image
        cb(null, img);
      }
    ], callback);
  },
  createImages: function (files, callback) {
    async.map(files, this.createImage.bind(this), callback);
  }
};

// Export the engine
module.exports = Canvassmith;
