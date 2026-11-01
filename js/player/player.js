/**
 * js/player/player.js - REAL Player v2 - Does NOT delete Import Button
 */
const Player = {
  videoElement: null,
  currentTime: 0,
  isPlaying: false,
  currentClip: null,

  init() {
    this.videoElement = document.getElementById('realVideo');
    if(!this.videoElement) return;
    
    this.videoElement.addEventListener('timeupdate', ()=>{
      this.currentTime = this.videoElement.currentTime;
    });

    this.videoElement.addEventListener('ended', ()=>{
      this.isPlaying = false;
      this.updateOverlay();
    });

    this.videoElement.addEventListener('play', ()=>{
      this.isPlaying = true;
      this.updateOverlay();
    });

    this.videoElement.addEventListener('pause', ()=>{
      this.isPlaying = false;
      this.updateOverlay();
    });

    console.log('Real Player v2 Ready');
  },

  loadClip(clip) {
    if(!clip || !clip.url) return;
    if(!this.videoElement) this.init();
    
    this.currentClip = clip;
    this.videoElement.src = clip.url;
    this.videoElement.load();
    this.videoElement.style.display = 'block';
    
    const importBtn = document.getElementById('importBtn');
    if(importBtn) importBtn.style.display = 'none';
    
    this.videoElement.onloadeddata = () => {
      this.videoElement.currentTime = clip.sourceOffset || 0;
      const status = document.getElementById('status');
      if(status) status.textContent = `Playing: ${clip.name} - ${clip.duration.toFixed(1)}s`;
    };
    
    console.log('Loaded REAL video:', clip.name);
  },

  play() {
    if(this.videoElement && this.videoElement.src) {
      this.videoElement.play();
    }
  },

  pause() {
    if(this.videoElement) this.videoElement.pause();
  },

  togglePlay() {
    if(this.isPlaying) this.pause();
    else this.play();
  },

  seekTo(time) {
    this.currentTime = time;
    if(this.currentClip && this.videoElement) {
      const clipTime = time - this.currentClip.startTime + (this.currentClip.sourceOffset||0);
      if(!this.isPlaying && clipTime>=0) {
        this.videoElement.currentTime = clipTime;
      }
    }
  },

  updateOverlay() {
    const overlay = document.getElementById('playOverlay');
    if(!overlay) return;
    overlay.style.display = this.isPlaying ? 'none' : 'block';
  },

  getCurrentTime(){ return this.currentTime; }
};
window.Player = Player;