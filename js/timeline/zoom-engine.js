/**
 * Folder: js/timeline/ File: zoom-engine.js v2.0 FINAL RESTORED - User Saved File
 * Professional: 5px/s = Full video in screen, 300px/s = Frame by frame - Pinch Zoom
 */
const ZoomEngine = {
  minPps: 5,
  maxPps: 300,
  defaultPps: 80,
  currentPps: 80,
  init() {
    this.currentPps = 80;
    if(window.TimelineUI) {
      TimelineUI.pixelsPerSecond = this.currentPps;
    }
    if(window.Transport) {
      Transport.pps = this.currentPps;
    }
    console.log('ZoomEngine v2.0 FINAL RESTORED - 5 to 300px/s - Pinch Ready');
  },
  zoomBy(scale) {
    let newPps = this.currentPps * scale;
    this.setZoom(newPps);
  },
  setZoom(pps) {
    pps = Math.max(this.minPps, Math.min(this.maxPps, pps));
    this.currentPps = pps;
    if(window.TimelineUI) {
      TimelineUI.pixelsPerSecond = pps;
      TimelineUI.render();
    }
    if(window.Transport) {
      Transport.pps = pps;
      Transport.renderRuler();
      Transport.syncPlayhead();
    }
    if(window.EventBus){
      EventBus.emit(EventBus.EVENTS.TIMELINE_ZOOM, {pps:pps});
    }
    this.updateUI();
  },
  zoomIn() {
    this.setZoom(this.currentPps * 1.3);
  },
  zoomOut() {
    this.setZoom(this.currentPps * 0.7);
  },
  zoomToFit(duration) {
    if(!duration || !window.TimelineUI || !TimelineUI.container) return;
    const width = window.innerWidth * 0.7;
    const targetPps = (width * 0.7) / duration;
    this.setZoom(targetPps);
  },
  getZoomLevel() {
    return (this.currentPps / this.defaultPps) * 100;
  },
  getPps() {
    return this.currentPps;
  },
  updateUI() {
    const zoomText = document.getElementById('zoomLevel');
    if(zoomText) {
      zoomText.textContent = Math.round(this.getZoomLevel()) + '%';
    }
  },
  handlePinch(startDist, currentDist) {
    const scale = currentDist / startDist;
    this.zoomBy(scale);
  }
};
window.ZoomEngine = ZoomEngine;
if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ()=>ZoomEngine.init());
} else {
  setTimeout(()=>ZoomEngine.init(), 200);
}
