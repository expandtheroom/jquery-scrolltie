mocha.checkLeaks();
mocha.globals(['jQuery*', 'requestAnimationFrame', 'sinon']);

if (!window.__karma__) {
  mocha.run();
}
