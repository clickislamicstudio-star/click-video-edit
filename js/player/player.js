/**
 * js/player/player.js - Phase 3 - Real Player with Filters, Text, Speed
 */
const Player = {
  video: null,
  isPlaying: false,
  currentClip: null,
  rafId: null,

  init() {
    this.video = document.getElementById('realVideo');
    if(!this.video) return;
    
    this.video.addEventListener('timeupdate', ()=> {
      const t = this.video.currentTime + (this.currentClip?.startTime||0) - (this.currentClip?.sourceOffset||0);
      if(window.TimelineUI) {
        TimelineUI.scrollOffset = t - (TimelineUI.width/2 / TimelineUI.pixelsPerSecond);
        TimelineUI.render();
      }
    });
    
    this.video.addEventListener('play', ()=>{ this.isPlaying=true; this._loop(); });
    this.video.addEventListener('pause', ()=>{ this.isPlaying=false; if(this.rafId) cancelAnimationFrame(this.rafId); });
    
    console.log('Player Phase3 - Real Player Ready');
  },

  loadClip(clip) {
    if(!clip || !this.video) return;
    if(clip.type!=='video' && clip.type!=='audio') {
      if(clip.type==='text' && window.TextTool) TextTool.renderPreview(clip);
      return;
    }
    
    this.currentClip = clip;
    if(clip.src && this.video.src !== clip.src) {
      this.video.src = clip.src;
      this.video.load();
    }
    
    // Apply filters
    this.video.style.filter = clip.filterCss || 'none';
    
    // Apply volume
    this.video.volume = clip.volume ?? 1;
    
    // Seek to sourceOffset
    const seek = clip.sourceOffset || 0;
    this.video.currentTime = seek;
    
    document.getElementById('importBtn').style.display='none';
    this.video.style.display='block';
  },

  togglePlay() {
    if(!this.video) return;
    if(this.isPlaying) this.video.pause();
    else this.video.play();
    
    const overlay=document.getElementById('playOverlay');
    if(overlay) overlay.style.display = this.isPlaying ? 'none' : 'block';
  },

  _loop() {
    if(!this.isPlaying) return;
    this.rafId = requestAnimationFrame(()=>this._loop());
    // Update timeline scroll
    if(this.video && this.currentClip) {
      const clipTime = this.video.currentTime;
      if(clipTime >= (this.currentClip.duration + this.currentClip.sourceOffset)) {
        // Clip ended
        if(this.currentClip) {
          // Try next clip
          const nextClip = window.TimelineUI?.clips.find(c=>c.startTime > this.currentClip.startTime);
          if(nextClip && nextClip.type==='video') {
            this.loadClip(nextClip);
            this.video.play();
          } else {
            this.video.pause();
          }
        }
      }
    }
  },

  setVolume(v) {
    if(this.video) this.video.volume = v;
  },

  updateDuration() {
    console.log('Player duration updated');
  }
};
window.Player = Player;
document.addEventListener('DOMContentLoaded', ()=> setTimeout(()=>Player.init(), 600));
