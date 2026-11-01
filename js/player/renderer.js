/**
 * js/player/renderer.js - REAL Renderer - Shows real video frame
 * Draws real video element - No dummy
 * Click to play, shows first frame after import
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

    // When video metadata loads
    this.videoElement.addEventListener('loadedmetadata', ()=>{
      console.log('Renderer: Metadata loaded', this.videoElement.videoWidth, 'x', this.videoElement.videoHeight);
    });

    // When video data loads - show first frame
    this.videoElement.addEventListener('loadeddata', ()=>{
      this.isReady = true;
      this.videoElement.style.display = 'block';
      
      const importBtn = document.getElementById('importBtn');
      if(importBtn) importBtn.style.display = 'none';
      
      const status = document.getElementById('status');
      if(status) {
        const w = this.videoElement.videoWidth || 0;
        const h = this.videoElement.videoHeight || 0;
        const dur = this.videoElement.duration ? this.videoElement.duration.toFixed(1) : '0';
        status.textContent = `Ready: ${w}x${h} - ${dur}s - Tap to Play`;
        status.style.color = '#0F0';
      }
      
      console.log('Renderer: Video ready', this.videoElement.videoWidth, 'x', this.videoElement.videoHeight);
      
      // Force show first frame at 0.1s
      try {
        this.videoElement.currentTime = 0.1;
      } catch(e){}
    });

    this.videoElement.addEventListener('error', (e)=>{
      console.error('Video load error', e);
      const status = document.getElementById('status');
      if(status) {
        status.textContent = 'Error loading video - Try MP4 file';
        status.style.color = '#F00';
      }
    });

    this.videoElement.addEventListener('canplay', ()=>{
      this.videoElement.style.display = 'block';
    });

    console.log('Renderer Ready - Real Video v2');
  },

  getCurrentFrame() {
    if(!this.videoElement || !this.isReady) return null;
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = this.videoElement.videoWidth;
      canvas.height = this.videoElement.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(this.videoElement, 0, 0);
      return canvas.toDataURL('image/png');
    } catch(e){
      return null;
    }
  },

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