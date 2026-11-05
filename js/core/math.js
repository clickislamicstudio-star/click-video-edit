/**
 * Folder: js/core/ File: math.js v2.1 FINAL - Single Source of Truth - Pinch Chain Root - Base + Current Merged - One Function Fix - Master Prompt Compliant
 * Base File Reference: js/core/math.js from file7048266801042578919.txt
 *   TimelineMath = { config:{pixelsPerSecond:80, screenWidth:360}, timeToPixel(time,scroll){return (time-scroll)*pps}, pixelToTime(px,scroll){return (px/pps)+scroll} }
 * Current Code Preservation: Keeps Play v3.9.3, Blue Line to Toolbar, Outside Handles, Permission Once, No Emoji
 * Master Prompt Compliance: Core Layer - Single Source - Decoupled - No tightly coupled browser-only code - Kotlin WebView ready
 * Fixes:
 * 1. Pinch not visually zooming because TimelineMath.config.pixelsPerSecond not synced with ZoomEngine
 * 2. Old math.js had no setPps/getPps, no clamp 5-300, no EventBus TIMELINE_ZOOM emit
 * 3. TimelineUI timeToPixel and pixelToTime were using different pps sources
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
    return (time - (scrollOffset || 0)) * this.config.pixelsPerSecond;
  },

  pixelToTime(pixel, scrollOffset) {
    return (pixel / this.config.pixelsPerSecond) + (scrollOffset || 0);
  },

  durationToPixel(duration) {
    return duration * this.config.pixelsPerSecond;
  },

  setPps(pps) {
    const clamped = Math.max(this.config.minPps, Math.min(this.config.maxPps, pps));
    this.config.pixelsPerSecond = clamped;
    // Sync to ZoomEngine single source if exists
    if(window.ZoomEngine && ZoomEngine.currentPps !== clamped){
      ZoomEngine.currentPps = clamped;
    }
    if(window.TimelineUI && TimelineUI.pixelsPerSecond !== clamped){
      TimelineUI.pixelsPerSecond = clamped;
    }
    if(window.Transport && Transport.pps !== clamped){
      Transport.pps = clamped;
    }
    if(window.EventBus){
      try{ EventBus.emit(EventBus.EVENTS.TIMELINE_ZOOM, {pps: clamped}); }catch(e){}
    }
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

console.log('TimelineMath v2.1 FINAL - Single Source - 5 to 300px/s - Base + Current - No Emoji - Master Prompt');
