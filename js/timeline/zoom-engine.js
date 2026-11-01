/**
 * js/timeline/zoom-engine.js - Professional Pinch & Wheel Zoom
 * CapCut Style: 2 fingers pinch -> zoom 20-200px/s
 */
const ZoomEngine = {
  minPPS: 20,
  maxPPS: 200,
  defaultPPS: 80,
  lastPinchDistance: 0,
  isPinching: false,

  init() {
    if(!window.TimelineUI) {
      setTimeout(()=>this.init(), 500);
      return;
    }
    this.bindPinch();
    this.bindWheel();
    console.log('ZoomEngine Ready - Pinch & Wheel Zoom 20-200');
  },

  bindPinch() {
    const canvas = window.TimelineUI.canvas;
    if(!canvas) return;

    canvas.addEventListener('touchstart', (e) => {
      if(e.touches.length === 2) {
        this.isPinching = true;
        this.lastPinchDistance = this.getDistance(e.touches[0], e.touches[1]);
        e.preventDefault();
      }
    }, {passive: false});

    canvas.addEventListener('touchmove', (e) => {
      if(e.touches.length === 2 && this.isPinching) {
        e.preventDefault();
        const newDist = this.getDistance(e.touches[0], e.touches[1]);
        const ratio = newDist / this.lastPinchDistance;
        
        let newPPS = window.TimelineUI.pixelsPerSecond * ratio;
        newPPS = Math.max(this.minPPS, Math.min(this.maxPPS, newPPS));
        
        window.TimelineUI.setZoom(newPPS);
        this.lastPinchDistance = newDist;
        
        if(Math.abs(ratio - 1) > 0.04 && navigator.vibrate) navigator.vibrate(10);
      }
    }, {passive: false});

    canvas.addEventListener('touchend', () => {
      this.isPinching = false;
      this.lastPinchDistance = 0;
    });
  },

  bindWheel() {
    const canvas = window.TimelineUI?.canvas;
    if(!canvas) return;

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -12 : 12;
      let newPPS = window.TimelineUI.pixelsPerSecond + delta;
      newPPS = Math.max(this.minPPS, Math.min(this.maxPPS, newPPS));
      window.TimelineUI.setZoom(newPPS);
    }, {passive: false});
  },

  getDistance(t1, t2) {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx*dx + dy*dy);
  },

  zoomIn() {
    if(window.TimelineUI) {
      let pps = window.TimelineUI.pixelsPerSecond + 20;
      pps = Math.min(this.maxPPS, pps);
      window.TimelineUI.setZoom(pps);
    }
  },

  zoomOut() {
    if(window.TimelineUI) {
      let pps = window.TimelineUI.pixelsPerSecond - 20;
      pps = Math.max(this.minPPS, pps);
      window.TimelineUI.setZoom(pps);
    }
  },

  getZoomLevel() {
    if(!window.TimelineUI) return 0;
    const pps = window.TimelineUI.pixelsPerSecond;
    return ((pps - this.minPPS) / (this.maxPPS - this.minPPS)) * 100;
  }
};
window.ZoomEngine = ZoomEngine;