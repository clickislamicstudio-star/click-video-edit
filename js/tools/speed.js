/**
 * js/tools/speed.js - Speed Control 0.2x to 100x + Curve
 */
const SpeedTool = {
  // Normal speed
  setSpeed(clip, speed) {
    // speed 0.2 to 100
    speed = Math.max(0.2, Math.min(100, speed));
    clip.speed = speed;
    clip.duration = clip.originalDuration / speed;
    return clip;
  },

  // Curve speed (keyframe based)
  setCurveSpeed(clip, curve) {
    // curve: [{time:0, speed:1}, {time:0.5, speed:3}, {time:1, speed:0.5}]
    clip.speedCurve = curve;
    return clip;
  },

  // Reverse
  reverse(clip) {
    clip.reversed = !clip.reversed;
    return clip;
  }
};
window.SpeedTool = SpeedTool;