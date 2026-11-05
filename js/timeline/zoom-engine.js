
/**
 * Folder: js/timeline/ File: zoom-engine.js v2.2 FINAL - Pinch Fix Inline - Base + Current Merged - One Function Fix
 * Master Prompt Compliant - No Emoji - SVG Only - Single Source 5-300px/s
 */
const ZoomEngine = {
  minPps:5, maxPps:300, defaultPps:80, currentPps:80,
  init(){
    this.currentPps=this.defaultPps;
    if(window.TimelineMath) TimelineMath.config.pixelsPerSecond=this.currentPps;
    if(window.TimelineUI) TimelineUI.pixelsPerSecond=this.currentPps;
    if(window.Transport) Transport.pps=this.currentPps;
  },
  setZoom(pps){
    pps=Math.max(5, Math.min(300, pps));
    if(Math.abs(pps-this.currentPps)<0.3) return pps;
    this.currentPps=pps;
    if(window.TimelineMath) TimelineMath.config.pixelsPerSecond=pps;
    if(window.TimelineUI){ TimelineUI.pixelsPerSecond=pps; if(TimelineUI.render) TimelineUI.render(); }
    if(window.Transport){ Transport.pps=pps; if(Transport.renderRuler) Transport.renderRuler(); if(Transport.syncPlayhead) Transport.syncPlayhead(); }
    if(window.EventBus) try{ EventBus.emit(EventBus.EVENTS.TIMELINE_ZOOM,{pps}); }catch(e){}
    return pps;
  },
  zoomBy(scale){ this.setZoom(this.currentPps*scale); },
  handlePinch(s,c){ if(s===0) return; this.zoomBy(c/s); },
  getPps(){ return this.currentPps; }
};
window.ZoomEngine=ZoomEngine;
