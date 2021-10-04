// 延迟函数
function delay (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 格式化持续时间
function formatDuration (ms) {
  let s = Math.floor(ms / 1000);
  let hours = Math.floor(s / 3600);
  let minutes = Math.floor((s - hours * 3600) / 60);
  let seconds = s - hours * 3600 - minutes * 60;

  hours = String(hours).padStart(2, '0');
  minutes = String(minutes).padStart(2, '0');
  seconds = String(seconds).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

module.exports = {
  delay,
  formatDuration,
};
