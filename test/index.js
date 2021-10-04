const capture = require('../index');

// capture({
//   url: '../data-visualization/index.html',
//   // url: 'https://threejs.org/examples/webgl_materials_cubemap_dynamic',
//   fps: 60,
//   duration: 10,
//   output: './output/video.mp4',
//   audio: './resources/audio.mp3',
//   headless: false,
//   viewport: {
//     width: 1920,
//     height: 1080,
//   },
//   preparePage: async (page) => {
//     const browser = page.browser();
//     await page.evaluate(async () => {
//       console.log(window.__DATA__);
//     });
//     await utils.delay(2e4);
//     await page.evaluate(async () => {
//       window.draw(window.__DATA__.data);
//       console.log('start...');
//     });
//   }
// });

capture({
  url: '../data-visualization/index.html',
  // url: 'https://threejs.org/examples/webgl_materials_cubemap_dynamic',
  fps: 1,
  duration: 1,
  start: 22,
  snapshotMode: true,
  output: './output/snapshot.png',
  // output: './output/video.mp4',
  // audio: './resources/audio.mp3',
  headless: true,
  viewport: {
    width: 720,
    height: 1280,
    isMobile: true,
    hasTouch: true,
  }
});

module.exports = capture;
