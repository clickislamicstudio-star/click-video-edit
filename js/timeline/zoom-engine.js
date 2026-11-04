
/**
 * Folder: js/timeline/ File: zoom-engine.js v2.0 FINAL - 5px/s to 300px/s - No Emoji - Master Prompt
 */
const ZoomEngine = {
  currentPps: 80,
  minPps: 5,
  maxPps: 300,
  init(){
    console.log('ZoomEngine v2.0 FINAL - 5px/s to 300px/s - Master Prompt');
    this.currentPps = 80;
  },
  setZoom(pps){
    const clamped = Math.max(this.minPps, Math.min(this.maxPps, pps));
    this.currentPps = clamped;
    if(window.TimelineUI) TimelineUI.pixelsPerSecond = clamped;
    if(window.Transport) Transport.pps = clamped;
    if(window.EventBus) EventBus.emit(EventBus.EVENTS.TIMELINE_ZOOM, {pps: clamped});
    if(window.TimelineUI && TimelineUI.render) TimelineUI.render();
    if(window.Transport && Transport.renderRuler) Transport.renderRuler();
    return clamped;
  },
  zoomIn(){ return this.setZoom(this.currentPps * 1.2); },
  zoomOut(){ return this.setZoom(this.currentPps / 1.2); },
  reset(){ return this.setZoom(80); }
};
window.ZoomEngine = ZoomEngine;
setTimeout(()=>ZoomEngine.init(), 200);
