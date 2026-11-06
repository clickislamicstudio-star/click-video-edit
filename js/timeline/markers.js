/**
 * js/timeline/gesture.js - Drag, Trim, Pinch, LongPress
 */
const Gesture = {
  isDragging: false,
  isPinching: false,
  startX: 0,
  startTime: 0,
  startDist: 0,
  startPps: 80,
  lastScale: 1,

  // Long Press 300ms to start drag (InShot Style) + Pinch - Base + Fix - Pinch was in timeline-ui.js, now also here
  onTouchStart(e, clip) {
    if(e.touches && e.touches.length===2){
      this.isPinching=true;
      const dx=e.touches[0].clientX - e.touches[1].clientX;
      const dy=e.touches[0].clientY - e.touches[1].clientY;
      this.startDist=Math.sqrt(dx*dx+dy*dy);
      this.startPps=window.ZoomEngine ? ZoomEngine.currentPps : 80;
      this.lastScale=1;
      console.log('PINCH START (Gesture v2.3) dist', Math.round(this.startDist), 'pps', this.startPps);
      clearTimeout(this.longPressTimer);
      if(e.cancelable) e.preventDefault();
      return;
    }
    this.startX = e.touches[0].clientX;
    this.startTime = clip.startTime;
    this.isDragging = false;
    
    this.longPressTimer = setTimeout(() => {
      this.isDragging = true;
      console.log('LongPress: Start Drag', clip.id);
      if(navigator.vibrate) navigator.vibrate(50);
    }, 300);
  },

  onTouchMove(e, clip) {
    if(e.touches && e.touches.length===2 && this.isPinching){
      const dx=e.touches[0].clientX - e.touches[1].clientX;
      const dy=e.touches[0].clientY - e.touches[1].clientY;
      const curDist=Math.sqrt(dx*dx+dy*dy);
      const scale=curDist/this.startDist;
      if(Math.abs(scale-this.lastScale)<0.01) return;
      this.lastScale=scale;
      console.log('PINCH MOVE (Gesture v2.3) scale', scale.toFixed(3), 'newPps', Math.round(this.startPps*scale));
      if(window.ZoomEngine) ZoomEngine.handlePinch(this.startDist, curDist);
      if(e.cancelable) e.preventDefault();
      return;
    }
    if(!this.isDragging) return;
    const deltaX = e.touches[0].clientX - this.startX;
    const deltaTime = deltaX / TimelineMath.config.pixelsPerSecond;
    clip.startTime = this.startTime + deltaTime;
    
    // Snap check
    const threshold = 15 / TimelineMath.config.pixelsPerSecond;
    const snap = SnapEngine.findSnap(clip, Timeline.clips, [], 0, threshold);
    if(snap) clip.startTime = snap.time;
  },

  onTouchEnd() {
    clearTimeout(this.longPressTimer);
    this.isDragging = false;
    this.isPinching = false;
    this.startDist = 0;
  },
  init(){
    console.log('Gesture v2.3 - Document Level Backup Pinch + LongPress Drag - Ready');
    const els=[document.getElementById('timelineArea'), document.getElementById('rulerCanvas'), document.body, document];
    els.forEach(el=>{
      if(!el || el._pinchBackupV23) return;
      el.addEventListener('touchstart', (e)=>this.onTouchStart(e, null), {passive:false});
      el.addEventListener('touchmove', (e)=>this.onTouchMove(e, null), {passive:false});
      el.addEventListener('touchend', (e)=>this.onTouchEnd(e), {passive:false});
      el._pinchBackupV23=true;
    });
  }
};
window.Gesture = Gesture;
