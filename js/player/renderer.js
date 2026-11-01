/**
 * js/player/renderer.js - REAL Renderer - Shows real video frame
 * Draws video element onto canvas + handles Playhead sync
 */
const Renderer = {
  videoElement: null,
  isReady: false,

  init() {
    this.videoElement = document.getElementById('realVideo');
    if(!this.videoElement) {
      setTimeout(()=>this.init(), 500);
      return;
    }

    // When video loads, show it
    this.videoElement.addEventListener('loadeddata', ()=>{
      this.isReady = true;
      this.videoElement.style.display = 'block';
      
      const importBtn = document.getElementById('importBtn');
      if(importBtn) importBtn.style.display = 'none';
      
      const status = document.getElementById('status');
      if(status) status.textContent = `Ready: ${this.videoElement.videoWidth}x${this.videoElement.videoHeight} - Tap to Play`;
      
      console.log('Renderer: Video ready', this.videoElement.videoWidth, 'x', this.videoElement.videoHeight);
      
      // Force render first frame
      this.videoElement.currentTime = 0.1;
    });

    this.videoElement.addEventListener('error', (e)=>{
      console.error('Video load error', e);
      const status = document.getElementById('status');
      if(status) status.textContent = 'Error loading video - Try MP4';
    });

    console.log('Renderer Ready - Real Video');
  },

  // Draw current video frame (for export thumbnail)
  getCurrentFrame() {
    if(!this.videoElement || !this.isReady) return null;
    
    const canvas = document.createElement('canvas');
    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.videoElement, 0, 0);
    
    return canvas.toDataURL('image/png');
  },

  // Show video
  show() {
    if(this.videoElement) {
      this.videoElement.style.display = 'block';
    }
  },

  hide() {
    if(this.videoElement) {
      this.videoElement.style.display = 'none';
    }
  }
};
window.Renderer = Renderer;
setTimeout(()=>Renderer.init(), 700);