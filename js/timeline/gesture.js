/**
 * js/timeline/gesture.js - Drag, Trim, Pinch, LongPress
 */
const Gesture = {
  isDragging: false,
  startX: 0,
  startTime: 0,

  // Long Press 300ms to start drag (InShot Style)
  onTouchStart(e, clip) {
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
  }
};
window.Gesture = Gesture;