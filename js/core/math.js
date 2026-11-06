/**
 * js/core/math.js v2.3 FINAL - Single Source - Pinch Chain Root - Base + Master Prompt - SVG Only - No Emoji
 * Base from index.txt: TimelineMath config pps 80, timeToPixel(time,scroll){(time-scroll)*pps}
 * Fix: setPps clamped 5-300, sync to ZoomEngine, TimelineUI, Transport, EventBus
 */
const TimelineMath = {
  config: { pixelsPerSecond:80, minPps:5, maxPps:300, screenWidth:360, trackHeight:45 },
  timeToPixel(time, scroll){ return (time - (scroll||0)) * this.config.pixelsPerSecond; },
  pixelToTime(px, scroll){ return (px / this.config.pixelsPerSecond) + (scroll||0); },
  durationToPixel(d){ return d * this.config.pixelsPerSecond; },
  setPps(pps){
    const clamped = Math.max(this.config.minPps, Math.min(this.config.maxPps, pps));
    this.config.pixelsPerSecond = clamped;
    if(window.ZoomEngine && ZoomEngine.currentPps !== clamped) ZoomEngine.currentPps = clamped;
    if(window.TimelineUI && TimelineUI.pixelsPerSecond !== clamped) TimelineUI.pixelsPerSecond = clamped;
    if(window.Transport && Transport.pps !== clamped) Transport.pps = clamped;
    if(window.EventBus) try{ EventBus.emit(EventBus.EVENTS.TIMELINE_ZOOM, {pps:clamped}); }catch(e){}
    return clamped;
  },
  getPps(){ return this.config.pixelsPerSecond; },
  getScrollForTime(currentTime, viewportWidthPx){ return currentTime - (viewportWidthPx/2/this.config.pixelsPerSecond); },
  TRACKS: { V1:0, A1:1, A2:2, V3:3, V4:4, TEXT:5 }
};
window.TimelineMath = TimelineMath;
console.log('TimelineMath v2.3 FINAL - Single Source - 5 to 300px/s - CapCut Fixed Center - Base + Master Prompt - No Emoji');
