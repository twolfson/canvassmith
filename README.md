# canvassmith [![Build status](https://travis-ci.org/twolfson/canvassmith.png?branch=master)](https://travis-ci.org/twolfson/canvassmith)

[node-canvas][canvas] engine for [spritesmith][].

[canvas]: https://github.com/Automattic/node-canvas
[spritesmith]: https://github.com/Ensighten/spritesmith

## Requirements
By default, binaries for macOS, Linux and Windows will be downloaded.
But if you don't have a supported OS or processor architecture the module will be compiled on your system.
This requires several dependencies from [node-canvas][canvas], you must install [Cairo][] and Pango.

Instructions on how to do this are provided in the [node-canvas wiki][canvas-wiki].

Additionally, you will need to install [node-gyp][].

[Cairo]: http://cairographics.org/
[canvas-wiki]: https://github.com/Automattic/node-canvas/wiki/_pages
[node-gyp]: https://github.com/nodejs/node-gyp

```bash
npm install -g node-gyp
```

## Getting Started
Install the module with: `npm install canvassmith`

```js
// Load in our dependencies
var Canvassmith = require('canvassmith');

// Create a new engine
var canvassmith = new Canvassmith();

// Interpret some images from disk
canvassmith.createImages(['img1.jpg', 'img2.png'], function handleImages (err, imgs) {
  // If there was an error, throw it
  if (err) {
    throw err;
  }

  // We recieve images in the same order they were given
  imgs[0].width; // 50 (pixels)
  imgs[0].height; // 100 (pixels)

  // Create a canvas that fits our images (200px wide, 300px tall)
  var canvas = canvassmith.createCanvas(200, 300);

  // Add the images to our canvas (at x=0, y=0 and x=50, y=100 respectively)
  canvas.addImage(imgs[0], 0, 0);
  canvas.addImage(imgs[1], 50, 100);

  // Export canvas to image
  var resultStream = canvas['export']({format: 'png'});
  resultStream; // Readable stream outputting PNG image of the canvas
});
```

## Documentation
This module was built to the specification for spritesmith engines.

**Specification version:** 2.0.0

https://github.com/twolfson/spritesmith-engine-spec/tree/2.0.0

### `engine.createImages(images, cb)`
Our `createImages` methods supports the following types of images:

- image `String` - Filepath to image
- image `Object` - Vinyl object with buffer for image (uses buffer)
- image `Object` - Vinyl object with stream for image (uses stream)
- image `Object` - Vinyl object with `null` for image (reads buffer from provided filepath)

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint using `npm run lint` and test via `npm test`.

## Donating
Support this project and [others by twolfson][twolfson-projects] via [donations][twolfson-support-me].

<http://twolfson.com/support-me>

[twolfson-projects]: http://twolfson.com/projects
[twolfson-support-me]: http://twolfson.com/support-me

## License
Copyright (c) 2013 Todd Wolfson

Licensed under the MIT license.
