#!/usr/bin/env node

/**
 * @description 网页视频录制功能CLI脚本
 * @author jhqu
 * @date 2019-07-26
 */

const program = require('commander');
const capture = require('./index.js');
const package = require('./package.json');

program
  .name(package.name)
  .version(package.version, '-v, --version')
  .usage('<url (default: index.html)> [options]')
  .description(package.description)
  .option('-a, --audio <path>', 'Audio file path, as the video background music.')
  .option('-O, --output <path>', 'Video output path (default: video.mp4)')
  .option('-R, --fps <frame rate>', 'Frames per second to capture (default: 60)', parseFloat)
  .option('-d, --duration <seconds>', 'Duration of capture, in seconds (default: 5)', parseFloat)
  .option('-S, --selector <selector>', 'CSS Selector of item to capture')
  .option('-V, --viewport <dimensions>', 'Viewport dimensions, in pixels (default: 800,600)', str => {
    let dims = str.split(',').map(function (d) { return parseInt(d); });
    return dims.length > 1 ? { width: dims[0], height: dims[1] } : { width: dims[0] };
  })
  .option('-e, --input-options <options>', 'Extra arguments for ffmpeg input', str => str.split(' '))
  .option('-E, --output-options <options>', 'Extra arguments for ffmpeg output', str => str.split(' '))
  .option('-s, --start <n seconds>', 'Runs code for n virtual seconds before saving any frames.', parseFloat, 0)
  .option('-x, --x-offset <pixels>', 'X offset of capture, in pixels', parseFloat, 0)
  .option('-y, --y-offset <pixels>', 'Y offset of capture, in pixels', parseFloat, 0)
  .option('-W, --width <pixels>', 'Width of capture, in pixels', parseInt)
  .option('-H, --height <pixels>', 'Height of capture, in pixels', parseInt)
  .option('-l, --left <pixels>', 'Left edge of capture, in pixels. Equivalent to --x-offset.', parseInt)
  .option('-r, --right <pixels>', 'Right edge of capture, in pixels. Ignored if width is specified.', parseInt)
  .option('-t, --top <pixels>', 'Top edge of capture, in pixels. Equivalent to --y-offset.', parseInt)
  .option('-b, --bottom <pixels>', 'Bottom edge of capture, in pixels. Ignored if height is specified.', parseInt)
  .option('--start-delay <n seconds>', 'Wait n real seconds after loading.', parseFloat, 0)
  .option('--canvas-capture-mode [type]', 'Switches to canvas mode, capturing the canvas selected by --selector as image type (default: png)')
  .option('--no-round-to-even-width', 'Disables automatic rounding of capture width up to the nearest even number.')
  .option('--no-round-to-even-height', 'Disables automatic rounding of capture height up to the nearest even number.')
  .option('-q, --quiet', 'Suppresses console logging')
  .option('--executable-path <path>', 'Uses Chromium/Chrome application at specified path for puppeteer')
  .option('-L, --launch-arguments <arguments>', 'Custom launch arguments for Puppeteer browser', str => str.split(' '))
  .option('--no-headless', 'Chromium/Chrome runs in a window instead of headless mode')
  .option('--snapshot-mode', 'Enable snapshot mode, will only output snapshot image.')
  .on('--help', () => {
    console.log('')
    console.log('Examples:');
    console.log(`  $ ${package.name} example.html`);
    console.log(`  $ ${package.name} https://example.com -O example.mp4`);
    console.log(`  $ ${package.name} index.html --fps 24 --duration 10 --output video-24fps.mp4`);
    console.log(`  $ ${package.name} index.html --viewport 1920,1080 --audio audio.mp3 --output video-with-audio.mp4`);
  })
  .parse(process.argv);

const options = {
  ...program.opts(),
  url: program.args[0] || 'index.html',
};

capture(options);
