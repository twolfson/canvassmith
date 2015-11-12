// Load in dependencies
var spritesmithEngineTest = require('spritesmith-engine-test');
var Canvassmith = require('../lib/engine');

// Run spritesmith-engine-test suite
spritesmithEngineTest.run({
  engine: Canvassmith,
  engineName: 'canvassmith',
  tests: {
    renderGifCanvas: false
  }
});
