# webpage-video-capture

**webpage-video-capture** 是一个可以录制网页视频的[Node.js](https://nodejs.org)程序，它能录制使用**JavaScript**动画的网页生成流畅视频。它采用[timecut](https://github.com/tungs/timecut)和[puppeteer](https://github.com/GoogleChrome/puppeteer)打开一个网页，覆盖其时间处理函数，生成网页快照图片，然后将这些图片帧序列传递给[ffmpeg](https://ffmpeg.org)编码成视频。它可以精准的生成任意低于或高于网页实时FPS的视频，且生成的视频是平滑流畅的，同时支持在视频中插入背景音乐。

你可以从命令行或Node.js库运行**webpage-video-capture**。它依赖**ffmpeg**，**Node.js v10.0.0**或更高版本以及**npm**，请确保系统环境中已安装相关依赖。

## 使用指南

使用以下命令来安装`webpage-video-capture`：

```bash
npm install webpage-video-capture -g
```

由于[puppeteer的一个权限问题](https://github.com/GoogleChrome/puppeteer/issues/375)，**Mac**或**Linux**的用户在安装全局包时可能出现权限错误。你可以配置`npm`将全局包安装到当前用户的指定目录，详细方法请参考这篇教程: https://docs.npmjs.com/getting-started/fixing-npm-permissions#option-two-change-npms-default-directory

你也可以选择直接用**root**用户来安装，通过以下命令：

```bash
sudo npm install -g webpage-video-capture --unsafe-perm=true --allow-root
```

国内用户可能会遇到下载**puppeteer**很慢而导致安装卡住或报错的情况，可以尝试使用`cnpm`来安装或这使用以下命令修改**puppeteer**的下载源后再来安装：

```bash
npm config set PUPPETEER_DOWNLOAD_HOST=https://npm.taobao.org/mirrors
npm install webpage-video-capture -g
```

接下来你就可以在命令行中直接使用`webpage-video-capture`命令了：

```bash
webpage-video-capture --help
```

使用方式：

```bash
webpage-video-capture "url" [options]
```

`url`可以是web url（例如`https://example.com`）或文件路径。如果未指定`url`，则默认为`index.html`。注意用引号括起包含特殊字符（如`#`和`&`）的网址，**options**相关参数下面会进行详细说明

---

下面是一些使用示例，**默认行为**：

```bash
webpage-video-capture
```
上面的命令将打开当前工作目录下的`index.html`，将视口设置为800 x 600，以每秒60帧的速度录制5秒，并使用`yuv420p`像素格式生成名为`video.mp4`的视频文件到当前工作目录中。默认值可能在将来发生变化，所以对于长期脚本来说，建议明确的传递相关的选项参数，如下例所示。

录制一个网络上的`https://example.com`页面，并输出到`./videos/example.mp4`:

```bash
webpage-video-capture https://example.com --output ./videos/example.mp4
```

设置页面视口尺寸为1920 x 1080（这通常也等于视频的分辨率），FPS为24，录制时长为10秒：

```bash
webpage-video-capture index.html --viewport 1920,1080 --fps 24 --duration 10 --output video-24fps-10s.mp4
```

为视频添加背景音乐：

```bash
webpage-video-capture index.html --audio audio.mp3 --output video-with-audio.mp4
```

录制页面中的指定区域，宽800像素，高600像素，距离页面左上角偏移x轴100像素，y轴200像素，此时输出的视频分辨率将是800 x 600像素：

```bash
webpage-video-capture index.html -V 1920,1080 --width 800 --height 600 -x 100 -y 200 video-800x600.mp4
```

## 命令行参数选项

* 音频：`-a`, `--audio` *path*
    * 音频文件路径，用作视频的背景音乐。

* 输出: `-O`, `--output` *path*
    * 视频文件的保存路径，如果没有明确的设置**ffmpeg**的编码格式参数，该文件的扩展名将用于确定编码格式。

* 帧率：`-R`, `--fps` *frame rate*
    * 录制视频的帧率（FPS，默认值：60）。

* 时长：`-d`, `--duration` *seconds*
    * 视频录制时长，以秒为单位（默认值：5）。

* CSS选择器：`-S`, `--selector` "*selector*"
    * CSS选择器找到的第一个元素将作为视频每一帧的裁切边界框。

* 视口尺寸：`-V`, `--viewport` *dimensions*
    * 网页视口尺寸，以像素为单位。例如：`800`（宽度）或`800,600`（宽度和高度，默认值）。

* Canvas模式：`--canvas-capture-mode` *\[format\]*
    * 从Canvas数据录制帧图像，而不是网页截图。从Canvas元素直接拷贝数据，这通常比使用网页截图模式要快（但需要网页支持），可以提供可选的图像格式（例如`png`），否则它使用保存的图像的扩展名，或者png如果未指定或支持格式则默认使用。可以使格式前缀`immediate:`（例如`immediate:png`）以在渲染后立即获取像素数据，这有时是某些WebGL渲染器所需要的。使用`--selector`选项指定Canvas元素，否则默认为网页中的第一个Canvas元素。

* 动画起始秒数：`-s`, `--start` *n seconds*
    * 在保持任何帧之前运行n个**虚拟秒**的代码（默认值：`0`）。

* 延迟开始录制：`--start-delay` *n seconds*
    * 在页面加载后延迟**n个真实秒**后开始录制。

* X轴偏移：`-x`, `--x-offset` *pixels*
    * 页面录制区域框的X轴偏移距离，单位为像素（默认值：`0`）。

* Y轴偏移：`-y`, `--y-offset` *pixels*
    * 页面录制区域框的Y轴偏移距离，单位为像素（默认值：`0`）。

* 录制宽度：`-W`, `--width` *pixels*
    * 页面录制区域框的宽度，单位为像素，未指定时将为整个页面的宽度。

* 录制宽度：`-H`, `--height` *pixels*
    * 页面录制区域框的高度，单位为像素，未指定时将为整个页面的高度。

* 左边缘：`-l`, `--left` *pixels*
    * 页面录制区域框与内容左边缘的距离，单位为像素。等同于`--x-offset`。

* 右边缘：`-r`, `--right` *pixels*
    * 页面录制区域框与内容右边缘的距离，单位为像素。在设置了`--width`时，该参数将被忽略。

* 上边缘：`-t`, `--top` *pixels*
    * 页面录制区域框与内容上边缘的距离，单位为像素。等同于`--y-offset`.

* 下边缘：`-b`, `--bottom` *pixels*
    * 页面录制区域框与内容下边缘的距离，单位为像素。在设置了`--height`时，该参数将被忽略。

* 禁用偶数自动宽度：`--no-round-to-even-width`
    * 禁用录制宽度自动舍入到最近的偶数（不建议禁用，偶数像素跨端兼容性更好）。

* 禁用偶数自动高度：`--no-round-to-even-height`
    * 禁用录制高度自动舍入到最近的偶数（不建议禁用，偶数像素跨端兼容性更好）。

* 浏览器可执行文件路径：`--executable-path` *path*
    * 使用该路径上的Chromium/Chrome作为puppeteer的实例。

* Puppeteer启动参数：`-L`, `--launch-arguments` *arguments*
    * 传递给Puppeteer/Chromium的启动参数，用引号括起来。示例：`--launch-arguments="--single-process"`。可以在[这里](https://peter.sh/experiments/chromium-command-line-switches)找到参数列表。

* 禁用无头模式：`--no-headless`
    * 禁用无头模式，运行Chromium/Chrome在窗口模式下。

* 快照模式：`--snapshot-mode`
    * 开启快照模式，将只输出网页快照图片，而非视频。

* FFmpeg输入参数：`-e`, `--input-options` *options*
    * 额外的ffmpeg 输入参数，用引号括起来。例如：`--input-options="-framerate 30"`

* FFmpeg输出参数：`-E`, `--output-options` *options*
    * 额外的ffmpeg 输入参数，用引号括起来。例如：`--output-options="-vf scale=320:240"`

* 静默模式：`-q`, `--quiet`
    * 关闭所有控制台日志（不包括出错提示）。

* 版本号：`-v`, `--version`
    * 显示命令行工具的版本号，然后直接退出。

* 帮助：`-h`, `--help`
    * 显示命令行工具的参数选项说明，然后直接退出。

## Node API

Node API的使用方式及参数选项与命令行工具类似，你以通过调用**webpage-video-capture**导出的`capture`函数实现同样的功能：

```javascript
const capture = require('webpage-video-capture');

capture({
  url: './index.html',
  fps: 30,
  duration: 20,
  viewport: {
    width: 1920,
    height: 1080
  },
  output: './video-30fps.mp4',
  audio: './resources/audio.mp3'
});
```
