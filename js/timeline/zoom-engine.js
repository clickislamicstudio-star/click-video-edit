/**
 * Folder: js/timeline/ File: zoom-engine.js v2.2 FINAL - Visual Zoom Fix - Base + Current Merged - One Function Fix
 * Base File: js/timeline/zoom-engine.js v2.0 FINAL - 5-300px/s from base file7048266801042578919.txt
 * Current Code Preservation: Keeps Play v3.9.3, Transport SVG, Blue Line to Toolbar, Outside Handles, Permission Once
 * Master Prompt Compliance: Single Source - Timeline Layer - Decoupled - Kotlin WebView ready
 * Fixes Pinch Chain Root:
 * 1. math.js single source not synced
 * 2. timeline-ui.js track-content min-width not set
 * 3. transport ruler min-width not set
 */

const ZoomEngine = {
  minPps: 5,
  maxPps: 300,
  defaultPps: 80,
  currentPps: 80,

  init(){
    console.log('ZoomEngine v2.2 FINAL - Visual Zoom Fix - Single Source - 5 to 300px/s - Master Prompt');
    this.currentPps = this.defaultPps;
    if(window.TimelineMath){
      TimelineMath.config.pixelsPerSecond = this.currentPps;
    }
    if(window.TimelineUI){
      TimelineUI.pixelsPerSecond = this.currentPps;
    }
    if(window.Transport){
      Transport.pps = this.currentPps;
    }
  },

  setZoom(pps){
    pps = Math.max(this.minPps, Math.min(this.maxPps, pps));
    if(Math.abs(pps - this.currentPps) < 0.2) return pps;
    this.currentPps = pps;
    
    // Single source - update all layers
    if(window.TimelineMath){
      TimelineMath.config.pixelsPerSecond = pps;
    }
    if(window.TimelineUI){
      TimelineUI.pixelsPerSecond = pps;
      if(TimelineUI.setZoom){
        TimelineUI.setZoom(pps);
      } else if(TimelineUI.render){
        TimelineUI.render();
      }
    }
    if(window.Transport){
      Transport.pps = pps;
      if(Transport.renderRuler) Transport.renderRuler();
      if(Transport.syncPlayhead) Transport.syncPlayhead();
    }
    if(window.EventBus){
      try{ EventBus.emit(EventBus.EVENTS.TIMELINE_ZOOM, {pps: pps, zoomLevel: this.getZoomLevel()}); }catch(e){}
    }
    this.updateUI();
    return pps;
  },

  zoomBy(scale){
    if(!scale || isNaN(scale)) return;
    this.setZoom(this.currentPps * scale);
  },

  setZoomAbsolute(pps){
    this.setZoom(pps);
  },

  zoomIn(){
    this.setZoom(this.currentPps * 1.3);
  },

  zoomOut(){
    this.setZoom(this.currentPps * 0.7);
  },

  zoomToFit(duration){
    if(!duration){
      if(window.Transport) duration = Transport.totalDuration;
      else duration = 10;
    }
    const width = window.innerWidth * 0.7;
    const targetPps = (width * 0.7) / duration;
    this.setZoom(targetPps);
  },

  handlePinch(startDist, currentDist){
    if(!startDist || startDist===0) return;
    const scale = currentDist / startDist;
    this.zoomBy(scale);
  },

  getZoomLevel(){
    return (this.currentPps / this.defaultPps) * 100;
  },

  getPps(){
    return this.currentPps;
  },

  updateUI(){
    const zoomEl = document.getElementById('zoomLevel');
    if(zoomEl){
      zoomEl.textContent = Math.round(this.getZoomLevel()) + '%';
    }
  }
};

window.ZoomEngine = ZoomEngine;

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', ()=>ZoomEngine.init());
} else {
  setTimeout(()=>ZoomEngine.init(), 300);
}

console.log('ZoomEngine v2.2 FINAL loaded - Visual Zoom Fix - Base + Current - Single Source - Play Preserved - No Emoji');
