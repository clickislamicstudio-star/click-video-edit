/**
 * js/player/player.js - v6 FINAL - Professional Sync + Text Overlay + Trim
 * Logic: scrollOffset = currentTime - (screenWidth/2 / pps) - Playhead Fixed Center
 * No clamp - Allows negative like professional editors
 * NEW: Text Overlay + Trim SourceOffset Support
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

    console.log('Player v6 FINAL - Text + Trim + Sync Ready');

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
    
    // NEW v6: Check text overlay visibility - Real Text on Player
    if(window.TextTool) {
      TextTool.checkTextVisibility(this.currentTime);
    }

    // NEW v6: Handle Trim - If clip has sourceOffset, adjust video time
    this.handleTrimPlayback();
  },

  // NEW v6: Trim Playback Logic - Real Trim
  handleTrimPlayback() {
    const activeClip = window.TimelineUI?.clips.find(c => 
      c.track === 'V1' && 
      this.currentTime >= c.startTime && 
      this.currentTime <= c.startTime + c.duration
    );

    if(activeClip && activeClip.sourceOffset !== undefined) {
      const clipLocalTime = this.currentTime - activeClip.startTime;
      const videoTime = activeClip.sourceOffset + clipLocalTime;
      
      // If video time differs too much, sync it (for trim)
      if(Math.abs(this.videoElement.currentTime - videoTime) > 0.3) {
        // Only sync if not actively playing (to avoid jitter)
        // For now, we handle trim via seek, not continuous sync
      }
    }
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
    console.log('Player.loadClip:', clip?.name, clip?.duration, 'Offset:', clip?.sourceOffset);
    if(clip && clip.url && this.videoElement) {
      if(this.videoElement.src !== clip.url) {
        this.videoElement.src = clip.url;
        this.videoElement.load();
      }
      
      // If clip has trim offset, seek to it
      if(clip.sourceOffset !== undefined) {
        setTimeout(()=>{
          this.videoElement.currentTime = clip.sourceOffset;
          this.currentTime = clip.sourceOffset;
        }, 100);
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
    
    if(time < 0) time = 0;
    if(this.duration > 0 && time > this.duration) time = this.duration;
    
    console.log('Seek to:', time.toFixed(2) + 's');
    
    // Check if there's a clip with sourceOffset at this time
    const activeClip = window.TimelineUI?.clips.find(c => 
      c.track === 'V1' && 
      time >= c.startTime && 
      time <= c.startTime + c.duration
    );

    let videoSeekTime = time;
    if(activeClip && activeClip.sourceOffset !== undefined) {
      const clipLocalTime = time - activeClip.startTime;
      videoSeekTime = activeClip.sourceOffset + clipLocalTime;
      console.log('Trim seek - Clip offset:', activeClip.sourceOffset, 'Local:', clipLocalTime, 'Video:', videoSeekTime);
    }
    
    v.currentTime = videoSeekTime;
    this.currentTime = time;
    
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