/**
 * js/player/player.js - REAL Sync - Video + Timeline + Playhead together
 * Principle: scrollOffset = currentTime - (screenWidth/2 / pps) - CapCut Style
 */
const Player = {
  videoElement: null,
  currentTime: 0,
  isPlaying: false,
  animationId: null,

  init() {
    this.videoElement = document.getElementById('realVideo');
    if(!this.videoElement) {
      setTimeout(()=>this.init(), 500);
      return;
    }

    // Timeupdate - Sync Timeline every frame
    this.videoElement.addEventListener('timeupdate', ()=>{
      this.currentTime = this.videoElement.currentTime;
      this.syncTimeline();
    });

    this.videoElement.addEventListener('play', ()=>{
      this.isPlaying = true;
      this.startSync();
    });

    this.videoElement.addEventListener('pause', ()=>{
      this.isPlaying = false;
      this.stopSync();
    });

    this.videoElement.addEventListener('ended', ()=>{
      this.isPlaying = false;
      this.stopSync();
    });

    console.log('Player v4 - Real Sync Ready');
  },

  syncTimeline() {
    // Update MarkersEngine playhead time
    if(window.MarkersEngine) {
      MarkersEngine.playheadTime = this.currentTime;
    }

    // CapCut Style: Playhead fixed center, Timeline scrolls
    if(window.TimelineUI && window.TimelineUI.canvas) {
      const screenWidth = TimelineUI.canvas.width / 2;
      const pps = TimelineUI.pixelsPerSecond;
      
      // This is the MAGIC FORMULA - Principle #2
      TimelineUI.scrollOffset = this.currentTime - (screenWidth / 2 / pps);
      if(TimelineUI.scrollOffset < 0) TimelineUI.scrollOffset = 0;
      
      TimelineUI.render();
    }
  },

  startSync() {
    // Use requestAnimationFrame for smooth 60fps sync
    const tick = () => {
      if(!this.isPlaying) return;
      
      if(this.videoElement) {
        this.currentTime = this.videoElement.currentTime;
        this.syncTimeline();
      }
      
      this.animationId = requestAnimationFrame(tick);
    };
    tick();
  },

  stopSync() {
    if(this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  },

  loadClip(clip) {
    console.log('loadClip', clip?.name);
    // Already handled in media-import
  },

  play() {
    const v = document.getElementById('realVideo');
    if(v) v.play().catch(e=>console.log('Play blocked', e));
  },

  pause() {
    const v = document.getElementById('realVideo');
    if(v) v.pause();
  },

  togglePlay() {
    const v = document.getElementById('realVideo');
    if(!v) return;
    if(v.paused) v.play();
    else v.pause();
  },

  seekTo(time) {
    const v = document.getElementById('realVideo');
    if(!v) return;
    
    // time is timeline time (e.g. 5s), seek video to that time
    v.currentTime = time;
    this.currentTime = time;
    this.syncTimeline();
  },

  getCurrentTime() {
    return this.currentTime;
  }
};
window.Player = Player;