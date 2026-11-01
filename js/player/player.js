/**
 * js/player/player.js - REAL Player - Plays actual imported video
 * No mock - Uses HTML5 Video element + Timeline sync
 */
const Player = {
  videoElement: null,
  currentTime: 0,
  isPlaying: false,
  currentClip: null,
  animationId: null,

  init() {
    // Find or create video element in player area
    const playerArea = document.getElementById('playerArea');
    const playerCanvas = document.getElementById('playerCanvas');
    
    if(!playerCanvas) return;

    // Create real video element
    playerCanvas.innerHTML = '';
    this.videoElement = document.createElement('video');
    this.videoElement.style.width = '100%';
    this.videoElement.style.height = '100%';
    this.videoElement.style.objectFit = 'contain';
    this.videoElement.style.background = '#000';
    this.videoElement.controls = false;
    this.videoElement.muted = false;
    this.videoElement.playsInline = true;
    
    playerCanvas.appendChild(this.videoElement);

    // Create play/pause overlay button
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '50%';
    overlay.style.left = '50%';
    overlay.style.transform = 'translate(-50%,-50%)';
    overlay.style.fontSize = '40px';
    overlay.style.display = 'none';
    overlay.style.cursor = 'pointer';
    overlay.textContent = '▶️';
    overlay.id = 'playOverlay';
    playerCanvas.style.position = 'relative';
    playerCanvas.appendChild(overlay);

    playerCanvas.addEventListener('click', ()=> this.togglePlay());

    this.videoElement.addEventListener('timeupdate', ()=>{
      this.currentTime = this.videoElement.currentTime;
      if(window.MarkersEngine) {
        MarkersEngine.setPlayheadTime(this.currentTime);
      }
    });

    this.videoElement.addEventListener('ended', ()=>{
      this.isPlaying = false;
      this.updateOverlay();
    });

    console.log('Real Player Ready - Video element');
  },

  loadClip(clip) {
    if(!clip || !clip.url) {
      console.error('No clip url', clip);
      return;
    }

    if(!this.videoElement) this.init();

    this.currentClip = clip;
    this.videoElement.src = clip.url;
    this.videoElement.load();
    
    console.log('Loaded clip into player:', clip.name, clip.duration+'s');

    // Auto play after load
    this.videoElement.onloadeddata = () => {
      this.videoElement.currentTime = 0;
      this.seekTo(clip.startTime);
    };
  },

  play() {
    if(!this.videoElement || !this.videoElement.src) {
      console.warn('No video loaded');
      return;
    }
    this.videoElement.play();
    this.isPlaying = true;
    this.updateOverlay();
    this.startTicker();
  },

  pause() {
    if(this.videoElement) this.videoElement.pause();
    this.isPlaying = false;
    this.updateOverlay();
    this.stopTicker();
  },

  togglePlay() {
    if(this.isPlaying) this.pause();
    else this.play();
  },

  seekTo(time) {
    // time is timeline time
    this.currentTime = time;
    
    // If we have a clip, seek within that clip
    if(this.currentClip) {
      const clipTime = time - this.currentClip.startTime + (this.currentClip.sourceOffset||0);
      if(this.videoElement && clipTime >=0 && clipTime <= this.currentClip.duration) {
        // Only seek if not playing to avoid jitter
        if(!this.isPlaying) {
          this.videoElement.currentTime = Math.max(0, clipTime);
        }
      }
    }

    // Update timeline scroll
    if(window.TimelineUI) {
      TimelineUI.render();
    }
  },

  startTicker() {
    const tick = () => {
      if(!this.isPlaying) return;
      
      this.currentTime = this.videoElement.currentTime + (this.currentClip ? this.currentClip.startTime : 0);
      
      if(window.TimelineUI) {
        // Update playhead
        if(window.MarkersEngine) {
          MarkersEngine.playheadTime = this.currentTime;
          const screenWidth = TimelineUI.canvas.width/2;
          TimelineUI.scrollOffset = this.currentTime - (screenWidth/2 / TimelineUI.pixelsPerSecond);
          if(TimelineUI.scrollOffset < 0) TimelineUI.scrollOffset = 0;
        }
        TimelineUI.render();
      }

      this.animationId = requestAnimationFrame(tick);
    };
    tick();
  },

  stopTicker() {
    if(this.animationId) cancelAnimationFrame(this.animationId);
  },

  updateOverlay() {
    const overlay = document.getElementById('playOverlay');
    if(!overlay) return;
    overlay.style.display = this.isPlaying ? 'none' : 'block';
  },

  // Get current timeline time
  getCurrentTime() {
    return this.currentTime;
  }
};
window.Player = Player;

// Auto init
setTimeout(()=>{ if(window.Player) Player.init(); }, 800);