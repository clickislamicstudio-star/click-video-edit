/**
 * js/core/math.js - Phase 0 FIXED - Single Source of Truth
 * All modules must use TimelineMath.getPps() - No dual pps
 */
const TimelineMath = {
  config: {
    pixelsPerSecond: 80,
    minPps: 5,
    maxPps: 300,
    screenWidth: 360,
    trackHeight: 45
  },

  timeToPixel(time, scrollOffset) {
    return (time - scrollOffset) * this.config.pixelsPerSecond;
  },

  pixelToTime(pixel, scrollOffset) {
    return (pixel / this.config.pixelsPerSecond) + scrollOffset;
  },

  durationToPixel(duration) {
    return duration * this.config.pixelsPerSecond;
  },

  setPps(pps) {
    const clamped = Math.max(this.config.minPps, Math.min(this.config.maxPps, pps));
    this.config.pixelsPerSecond = clamped;
    if(window.EventBus) EventBus.emit(EventBus.EVENTS.TIMELINE_ZOOM, { pps: clamped });
    return clamped;
  },

  getPps() {
    return this.config.pixelsPerSecond;
  },

  getScrollForTime(currentTime, viewportWidthPx) {
    return currentTime - (viewportWidthPx / 2 / this.config.pixelsPerSecond);
  },

  TRACKS: {
    V1: { id: 0, name: 'V1', type: 'video' },
    V2: { id: 1, name: 'V2', type: 'video' },
    V3: { id: 2, name: 'V3', type: 'video' },
    TEXT: { id: 3, name: 'Text', type: 'text' },
    STICKER: { id: 4, name: 'Sticker', type: 'image' },
    A1: { id: 5, name: 'A1', type: 'audio' },
    A2: { id: 6, name: 'A2', type: 'audio' }
  }
};
window.TimelineMath = TimelineMath;
