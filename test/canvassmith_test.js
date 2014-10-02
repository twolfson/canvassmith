// Load in dependencies
var spritesmithEngineTest = require('spritesmith-engine-test');
var canvassmith = require('../lib/canvassmith');

// Run spritesmith-engine-test suite
spritesmithEngineTest.run({
  engine: canvassmith,
  engineName: 'canvassmith'
});
