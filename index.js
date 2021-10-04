/**
 * @description 网页视频录制功能
 * @author jhqu
 * @date 2019-07-26
 */

const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const bytes = require('bytes');
const chalk = require('chalk');
const timesnap = require('timesnap');
const timecut = require('timecut');
const { performance } = require('perf_hooks');
const utils = require('./utils');

// timecut默认选项
const defaultTimecutOptions = {
  url: 'index.html',
  fps: 60,
  duration: 5,
  selector: null,
  headless: true,
  start: 0,
  startDelay: 0,
  output: 'video.mp4',
  viewport: {
    width: 800,
    height: 600,
  },
  launchArguments: [
    '--disable-infobars',
  ],
  inputOptions: [],
  outputOptions: [],
};

// 默认的自定义扩展属性
const defaultExtraOptions = {
  audio: null,
};

// 获取选项对象
function getOptions (options) {
  // 合并用户选项与默认选项
  options = _.mergeWith(
    {},
    defaultTimecutOptions,
    defaultExtraOptions,
    options,
    (objValue, srcValue) => {
      // 对数据类型的值进行连接并移除掉数组中的空数据元素
      if (_.isArray(objValue)) {
        return objValue.concat(_.compact(srcValue));
      }
    }
  );

  // 如果存在音频参数，设置ffmpeg音频相关参数
  if (!_.isEmpty(options.audio)) {
    options.audio = path.resolve(process.cwd(), options.audio);
    _.merge(options, {
      // ffmpeg输入参数
      inputOptions: _.toArray(options.inputOptions).concat([
        // 添加音频
        '-i', options.audio
      ]),

      outputOptions: _.toArray(options.outputOptions).concat([
        // 清除音频上文件的元数据
        '-map_metadata', '-1',

        // 对音频进行转码输出
        '-absf', 'aac_adtstoasc',

        // 使用音频/视频中最短长度进行裁剪
        '-shortest'
      ]),
    });
  }

  // 快照模式
  if (options.snapshotMode) {
    options.output === defaultTimecutOptions.output && (options.output = 'snapshot.png');
    const output = path.parse(path.resolve(process.cwd(), options.output));
    options.outputPattern = output.base;
    options.outputDirectory = output.dir;
  }

  return {
    options,

    // 删除options上的自定义属性，只保留timecut所需的选项
    timecutOptions: _.omit(options, _.keys(defaultExtraOptions)),
  };
}

// 日志函数
function clog (quiet = false, ...args) {
  !quiet && console.log(...args);
}

// 录制网页视频函数
async function capture (opts = {}) {
  const { options, timecutOptions } = getOptions(opts);
  const { quiet, snapshotMode } = options;
  const log = _.partial(clog, quiet);

  try {
    // 输出选项
    log(
      chalk.magenta('Capture Options: ') +
      chalk.cyanBright(JSON.stringify(options, null, 2))
    );

    // 开始录制
    log(chalk.magenta('Capture Start...'));
    const startTime = performance.now();

    if (snapshotMode) {
      await timesnap(timecutOptions);
    } else {
      await timecut(timecutOptions);
    }

    try {
      const time = (performance.now() - startTime).toFixed(3);
      const { size } = fs.statSync(options.output);

      // 录制成功
      log(chalk.green('Capture Success: '));

      // 输出视频文件相关信息
      log(chalk.magenta(
        `${snapshotMode ? 'image' : 'video'} path: ${ path.resolve(process.cwd(), options.output) }\n`
        + `file size: ${ bytes(size) }\n`
        + `take time: ${ utils.formatDuration(time) }(total ${ time }ms)`
      ));
    } catch (err) {
      throw new Error('An exception occurred when generate video, Please check the parameters or permissions.');
    }
  } catch (err) {
    // 录制出错
    console.error(
      chalk.red('Capture Failure: ') +
      chalk.redBright(err)
    );
  }
}

module.exports = capture;
