/**
 * js/timeline/zoom-engine.js - v2.0 FINAL - 5px/s to 300px/s
 * Professional: 5px/s = Full video in screen, 300px/s = Frame by frame
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
    console.log('ZoomEngine v2.0 FINAL - 5 to 300px/s');
  },

  // Zoom by scale factor (for pinch)
  zoomBy(scale) {
    let newPps = this.currentPps * scale;
    this.setZoom(newPps);
  },

  setZoom(pps) {
    pps = Math.max(this.minPps, Math.min(this.maxPps, pps));
    this.currentPps = pps;
    
    if(window.TimelineUI) {
      TimelineUI.setZoom(pps);
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
    if(!duration || !window.TimelineUI || !TimelineUI.canvas) return;
    
    const width = TimelineUI.canvas.width / 2;
    // Fit whole video in 70% of screen like your 01:02 screenshot
    const targetPps = (width * 0.7) / duration;
    this.setZoom(targetPps);
    
    // Center the video
    if(window.TimelineUI) {
      const centerOffset = (width/2) / targetPps;
      TimelineUI.scrollOffset = -centerOffset + 0.15;
      TimelineUI.render();
    }
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

  // For buttons
  handlePinch(startDist, currentDist) {
    const scale = currentDist / startDist;
    this.zoomBy(scale);
  }
};
window.ZoomEngine = ZoomEngine;

// Auto init
if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ()=>ZoomEngine.init());
} else {
  setTimeout(()=>ZoomEngine.init(), 200);
}