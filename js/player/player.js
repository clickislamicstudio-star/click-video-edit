/**
 * js/player/player.js - v5 Professional Sync - CapCut Style
 * Logic: scrollOffset = currentTime - (screenWidth/2 / pps) - Playhead Fixed Center
 * No clamp - Allows negative like professional editors
 */
const Player = {
  videoElement: null,
  currentTime: 0,
  isPlaying: false,
  animationId: null,
  duration: 0,

  init() {
    this.videoElement = document.getElementById('realVideo');
    if(!this.videoElement) {
      console.log('realVideo not found, retry in 500ms');
      setTimeout(()=>this.init(), 500);
      return;
    }

    console.log('Player v5 - Professional Sync Ready');

    // Video events
    this.videoElement.addEventListener('loadedmetadata', ()=>{
      this.duration = this.videoElement.duration || 0;
      console.log('Video metadata - Duration:', this.duration);
      const status = document.getElementById('status');
      if(status) {
        status.textContent = `Ready: ${this.duration.toFixed(1)}s - Tap Play - Tap Timeline to Seek`;
        status.style.color = '#4CAF50';
      }
    });

    // Sync timeline on timeupdate
    this.videoElement.addEventListener('timeupdate', ()=>{
      this.currentTime = this.videoElement.currentTime;
      this.syncTimeline();
    });

    this.videoElement.addEventListener('play', ()=>{
      this.isPlaying = true;
      this.startSyncLoop();
      const badge = document.getElementById('badge');
      if(badge) badge.textContent = '▶️ Playing';
    });

    this.videoElement.addEventListener('pause', ()=>{
      this.isPlaying = false;
      this.stopSyncLoop();
      const badge = document.getElementById('badge');
      if(badge) badge.textContent = '⏸️ Paused - Tap to Play';
    });

    this.videoElement.addEventListener('ended', ()=>{
      this.isPlaying = false;
      this.stopSyncLoop();
      const badge = document.getElementById('badge');
      if(badge) badge.textContent = '✅ Ended - Tap to Replay';
    });

    // Click video to play/pause
    this.videoElement.addEventListener('click', ()=>{
      this.togglePlay();
    });
  },

  syncTimeline() {
    if(!window.TimelineUI || !TimelineUI.canvas) return;

    const width = TimelineUI.canvas.width / 2;
    const pps = TimelineUI.pixelsPerSecond || 80;
    const centerX = width / 2;

    // PROFESSIONAL FORMULA - CapCut Style
    // Playhead fixed center, timeline scrolls left as video plays
    // scrollOffset = currentTime - (centerX / pps)
    TimelineUI.scrollOffset = this.currentTime - (centerX / pps);

    // Update MarkersEngine playhead time
    if(window.MarkersEngine) {
      MarkersEngine.playheadTime = this.currentTime;
    }

    // Render timeline - This makes playhead move with video
    TimelineUI.render();
  },

  startSyncLoop() {
    this.stopSyncLoop();
    
    const tick = () => {
      if(!this.isPlaying) return;
      
      if(this.videoElement) {
        this.currentTime = this.videoElement.currentTime;
        this.syncTimeline();
      }
      
      this.animationId = requestAnimationFrame(tick);
    };
    
    this.animationId = requestAnimationFrame(tick);
  },

  stopSyncLoop() {
    if(this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  },

  loadClip(clip) {
    // For real video, already loaded via media-import
    console.log('Player.loadClip:', clip?.name, clip?.duration);
    if(clip && clip.url && this.videoElement) {
      // If different clip, load it
      if(this.videoElement.src !== clip.url) {
        this.videoElement.src = clip.url;
        this.videoElement.load();
      }
    }
  },

  play() {
    const v = document.getElementById('realVideo') || this.videoElement;
    if(!v) return;
    
    v.play().then(()=>{
      console.log('Playing');
    }).catch(err=>{
      console.log('Play blocked - needs user gesture:', err.message);
      const status = document.getElementById('status');
      if(status) {
        status.textContent = 'Tap Video to Play (Browser blocked autoplay)';
        status.style.color = '#FF9800';
      }
    });
  },

  pause() {
    const v = document.getElementById('realVideo') || this.videoElement;
    if(v) v.pause();
  },

  togglePlay() {
    const v = document.getElementById('realVideo') || this.videoElement;
    if(!v) return;
    
    if(v.paused) {
      this.play();
    } else {
      this.pause();
    }
  },

  seekTo(time) {
    const v = document.getElementById('realVideo') || this.videoElement;
    if(!v) return;
    
    // Clamp time
    if(time < 0) time = 0;
    if(this.duration > 0 && time > this.duration) time = this.duration;
    
    console.log('Seek to:', time.toFixed(2) + 's');
    
    v.currentTime = time;
    this.currentTime = time;
    
    // Immediately sync timeline to new time
    this.syncTimeline();
    
    const status = document.getElementById('status');
    if(status) {
      status.textContent = `Seek: ${time.toFixed(1)}s / ${(this.duration||0).toFixed(1)}s`;
      status.style.color = '#2196F3';
      setTimeout(()=>{
        if(this.isPlaying) {
          status.textContent = `Playing: ${time.toFixed(1)}s`;
          status.style.color = '#4CAF50';
        }
      }, 1000);
    }
  },

  getCurrentTime() {
    return this.currentTime;
  },

  getDuration() {
    return this.duration;
  }
};

// Auto init when loaded
if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ()=>Player.init());
} else {
  setTimeout(()=>Player.init(), 100);
}

window.Player = Player;