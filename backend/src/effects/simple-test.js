// Simple JavaScript test to verify Effect-TS basic functionality
const { Effect, Runtime } = require('effect');

console.log('Testing Effect-TS basic functionality...');

// Simple effect
const simpleEffect = Effect.sync(() => {
  console.log('✓ Effect.sync working');
  return 'Hello from Effect-TS!';
});

// Test runtime
Runtime.runPromise(Runtime.defaultRuntime)(simpleEffect)
  .then(result => {
    console.log('✓ Runtime execution working:', result);
    console.log('✓ Effect-TS integration test passed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('✗ Effect-TS test failed:', error);
    process.exit(1);
  });