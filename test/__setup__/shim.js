global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0);
};

global.matchMedia = () => ({
  matches: false,
  addListener: () => {},
  removeListener: () => {},
});
