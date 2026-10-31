const TimelineMath = {
  config: { pixelsPerSecond: 80, screenWidth: 360 },
  timeToPixel(time, scroll) { return (time - scroll) * this.config.pixelsPerSecond; },
  pixelToTime(px, scroll) { return (px / this.config.pixelsPerSecond) + scroll; },
  TRACKS: { V1:0, A1:1, A2:2, V2:3, V3:4, TEXT:5 }
};
window.TimelineMath = TimelineMath;