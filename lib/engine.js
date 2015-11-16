// Load in our dependencies
var fs = require('fs');
var async = require('async');
var concat = require('concat-stream');
var Image = require('canvas').Image;
var Vinyl = require('vinyl');
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
      function createVinylObject (cb) {
        // TODO: Abstract me
        // If the file is a string, upcast it to buffer-based vinyl
        if (!Vinyl.isVinyl(file)) {
          fs.readFile(file, function handleFileContent (err, buff) {
            // If there is an error, callback with it
            if (err) {
              return cb(err);
            }

            // Otherwise, callback with a buffer-based vinyl object
            cb(null, new Vinyl({
              path: file,
              contents: buff
            }));
          });
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
          file.pipe(concat(function handleFileBuffer (buff) {
            cb(null, buff);
          }));
        }
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
