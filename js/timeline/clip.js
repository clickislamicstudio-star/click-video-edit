/**
 * js/timeline/clip.js - Clip Object Model
 */
class Clip {
  constructor(data) {
    this.id = data.id || 'clip_' + Date.now();
    this.track = data.track || 0; // 0=V1, 1=A1, etc
    this.startTime = data.startTime || 0;
    this.duration = data.duration || 2;
    this.sourceOffset = data.sourceOffset || 0;
    this.type = data.type || 'video'; // video, audio, text, sticker
    this.src = data.src || '';
    this.effects = data.effects || {};
    this.transform = data.transform || { x:0, y:0, scaleX:1, scaleY:1, rotation:0 };
  }
  get endTime() { return this.startTime + this.duration; }
}
window.Clip = Clip;