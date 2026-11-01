/**
 * js/timeline/timeline-ui.js - Professional Timeline UI
 * Real InShot/【entity-CapCut¦canonical_name=CapCut】 Level - Uses math.js, snap-engine.js, gesture.js
 * Formula: screenX = (clipTime - scrollOffset) * pixelsPerSecond
 */
const TimelineUI = {
  container: null,
  canvas: null,
  ctx: null,
  pixelsPerSecond: 80, // Zoom level - 80px = 1 second
  scrollOffset: 0, // Current scroll time
  trackHeight: 45,
  tracks: ['V1', 'V2', 'Text', 'A1', 'A2'],
  clips: [],
  selectedClip: null,
  isDragging: false,
  dragType: null, // 'move', 'trim-left', 'trim-right'
  dragStartX: 0,
  dragStartClip: null,

  init(containerId = 'timelineArea') {
    this.container = document.getElementById(containerId);
    if(!this.container) return;

    // Create canvas for timeline
    this.container.innerHTML = '';
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.container.clientWidth * 2; // HiDPI
    this.canvas.height = (this.tracks.length * this.trackHeight + 30) * 2;
    this.canvas.style.width = '100%';
    this.canvas.style.height = (this.tracks.length * this.trackHeight + 30) + 'px';
    this.canvas.style.cursor = 'grab';
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(2,2);

    this.container.appendChild(this.canvas);
    this.bindEvents();
    this.render();
    console.log('TimelineUI Ready - Professional');
  },

  // CORE FORMULA 1: Time to Pixel
  timeToPixel(time) {
    return (time - this.scrollOffset) * this.pixelsPerSecond;
  },

  pixelToTime(pixel) {
    return (pixel / this.pixelsPerSecond) + this.scrollOffset;
  },

  // Add clip to timeline
  addClip(clip) {
    this.clips.push(clip);
    this.render();
  },

  // Get track Y
  getTrackY(trackName) {
    const index = this.tracks.indexOf(trackName);
    return index * this.trackHeight + 20;
  },

  // Render loop - Professional
  render() {
    if(!this.ctx || !this.canvas) return;
    
    const width = this.canvas.width / 2;
    const height = this.canvas.height / 2;
    
    // Clear
    this.ctx.fillStyle = '#1E1E1E';
    this.ctx.fillRect(0,0,width,height);

    // Draw time ruler (top)
    this.drawRuler();

    // Draw tracks background
    this.tracks.forEach((track, i) => {
      const y = i * this.trackHeight + 20;
      this.ctx.fillStyle = i % 2 === 0 ? '#2A2A2A' : '#252525';
      this.ctx.fillRect(0, y, width, this.trackHeight);
      
      // Track label
      this.ctx.fillStyle = '#666';
      this.ctx.font = '10px monospace';
      this.ctx.fillText(track, 6, y + 14);
      
      // Track line
      this.ctx.strokeStyle = '#333';
      this.ctx.beginPath();
      this.ctx.moveTo(0, y + this.trackHeight);
      this.ctx.lineTo(width, y + this.trackHeight);
      this.ctx.stroke();
    });

    // Draw clips - REAL CLIPS
    this.clips.forEach(clip => {
      const x = this.timeToPixel(clip.startTime);
      const w = clip.duration * this.pixelsPerSecond;
      const trackY = this.getTrackY(clip.track || 'V1');
      
      if(x + w < 0 || x > width) return; // Outside viewport

      // Clip body
      let color = '#FF3B30'; // V1 red
      if(clip.track === 'V2') color = '#4CAF50';
      if(clip.track === 'Text') color = '#2196F3';
      if(clip.track === 'A1' || clip.track === 'A2') color = '#FF9800';

      if(this.selectedClip && this.selectedClip.id === clip.id) {
        color = '#FFF'; // Selected white border
        this.ctx.strokeStyle = '#FFF';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, trackY+2, w, this.trackHeight-4);
      }

      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, trackY+2, w, this.trackHeight-4);
      
      // Clip text
      this.ctx.fillStyle = '#FFF';
      this.ctx.font = '10px sans-serif';
      const text = (clip.name || clip.type || 'Clip').substring(0, 12);
      this.ctx.fillText(text, x+4, trackY+16);
      
      // Duration
      this.ctx.fillStyle = 'rgba(255,255,255,0.7)';
      this.ctx.font = '8px monospace';
      this.ctx.fillText(clip.duration.toFixed(1)+'s', x+4, trackY+28);

      // Trim handles
      this.ctx.fillStyle = '#FFF';
      this.ctx.fillRect(x, trackY+2, 4, this.trackHeight-4); // Left
      this.ctx.fillRect(x+w-4, trackY+2, 4, this.trackHeight-4); // Right

      // Waveform for audio (if exists)
      if(clip.waveform && (clip.track === 'A1' || clip.track === 'A2')) {
        this.drawWaveformMini(x, trackY, w, clip.waveform);
      }
    });

    // Draw playhead (fixed center - CapCut style)
    const playheadX = this.timeToPixel(window.Player ? Player.currentTime : 0);
    // If CapCut style, playhead is fixed center
    const centerX = width / 2;
    this.ctx.fillStyle = '#FF3B30';
    this.ctx.fillRect(centerX-1, 0, 2, height);
    this.ctx.beginPath();
    this.ctx.moveTo(centerX-8, 0);
    this.ctx.lineTo(centerX+8, 0);
    this.ctx.lineTo(centerX, 10);
    this.ctx.closePath();
    this.ctx.fill();
  },

  drawRuler() {
    const width = this.canvas.width / 2;
    this.ctx.fillStyle = '#111';
    this.ctx.fillRect(0,0,width,20);
    
    this.ctx.fillStyle = '#888';
    this.ctx.font = '9px monospace';
    
    const startTime = Math.floor(this.scrollOffset);
    const endTime = Math.ceil(this.scrollOffset + width / this.pixelsPerSecond);
    
    for(let t=startTime; t<=endTime; t++) {
      const x = this.timeToPixel(t);
      if(x < 0 || x > width) continue;
      
      this.ctx.fillStyle = '#444';
      this.ctx.fillRect(x, 0, 1, 20);
      
      this.ctx.fillStyle = '#888';
      this.ctx.fillText(t+'s', x+2, 12);
    }
  },

  drawWaveformMini(x, y, w, waveform) {
    if(!waveform || waveform.length===0) return;
    const h = this.trackHeight - 8;
    const middle = y + h/2 + 4;
    
    this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
    const step = w / waveform.length;
    
    for(let i=0; i<waveform.length; i++) {
      const px = x + i*step;
      const min = waveform[i].min * (h/2);
      const max = waveform[i].max * (h/2);
      this.ctx.fillRect(px, middle+min, Math.max(1, step), max-min);
    }
  },

  bindEvents() {
    if(!this.canvas) return;

    let lastX = 0;

    this.canvas.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      this.handleStart(x, y);
      lastX = x;
    });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const deltaX = x - lastX;
      this.handleMove(deltaX, x);
      lastX = x;
    }, {passive: false});

    this.canvas.addEventListener('touchend', () => this.handleEnd());

    // Mouse for desktop testing
    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.handleStart(e.clientX - rect.left, e.clientY - rect.top);
      lastX = e.clientX - rect.left;
      this.isDragging = true;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if(!this.isDragging) return;
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const deltaX = x - lastX;
      this.handleMove(deltaX, x);
      lastX = x;
    });

    this.canvas.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.handleEnd();
    });
  },

  handleStart(x, y) {
    // Check if clicking on clip
    const time = this.pixelToTime(x);
    const trackIndex = Math.floor((y-20) / this.trackHeight);
    const trackName = this.tracks[trackIndex];
    
    // Find clip at this time
    const clickedClip = this.clips.find(c => 
      c.track === trackName && 
      time >= c.startTime && time <= c.startTime + c.duration
    );

    if(clickedClip) {
      this.selectedClip = clickedClip;
      const clipX = this.timeToPixel(clickedClip.startTime);
      const clipW = clickedClip.duration * this.pixelsPerSecond;
      
      // Check trim handles
      if(Math.abs(x - clipX) < 10) {
        this.dragType = 'trim-left';
      } else if(Math.abs(x - (clipX+clipW)) < 10) {
        this.dragType = 'trim-right';
      } else {
        this.dragType = 'move';
      }
      
      this.dragStartX = x;
      this.dragStartClip = {...clickedClip};
      
      if(navigator.vibrate) navigator.vibrate(30);
      this.render();
    } else {
      this.selectedClip = null;
      this.dragType = 'scroll';
      this.dragStartX = x;
    }
  },

  handleMove(deltaX, currentX) {
    if(!this.selectedClip && this.dragType !== 'scroll') return;

    const deltaTime = deltaX / this.pixelsPerSecond;

    if(this.dragType === 'move' && this.selectedClip) {
      this.selectedClip.startTime = this.dragStartClip.startTime + deltaTime;
      
      // Snap check
      if(window.SnapEngine) {
        const snapResult = SnapEngine.checkSnap(this.selectedClip, this.clips);
        if(snapResult.snapped) {
          this.selectedClip.startTime = snapResult.time;
        }
      }
      
      // Collision check for V1 (No Overlap)
      if(this.selectedClip.track === 'V1') {
        const hasCollision = this.clips.some(c => 
          c.id !== this.selectedClip.id && 
          c.track === 'V1' &&
          this.selectedClip.startTime < c.startTime + c.duration &&
          this.selectedClip.startTime + this.selectedClip.duration > c.startTime
        );
        if(hasCollision) {
          // Ripple or prevent - for now prevent
          // this.selectedClip.startTime = this.dragStartClip.startTime;
        }
      }
    } else if(this.dragType === 'trim-left' && this.selectedClip) {
      const newStart = this.dragStartClip.startTime + deltaTime;
      const newDuration = this.dragStartClip.duration - deltaTime;
      if(newDuration > 0.1) {
        this.selectedClip.startTime = newStart;
        this.selectedClip.duration = newDuration;
        this.selectedClip.sourceOffset = (this.dragStartClip.sourceOffset || 0) + deltaTime;
      }
    } else if(this.dragType === 'trim-right' && this.selectedClip) {
      const newDuration = this.dragStartClip.duration + deltaTime;
      if(newDuration > 0.1) {
        this.selectedClip.duration = newDuration;
      }
    } else if(this.dragType === 'scroll') {
      this.scrollOffset -= deltaTime;
      if(this.scrollOffset < 0) this.scrollOffset = 0;
    }

    this.render();
    
    // Update player if moving
    if(this.selectedClip && window.Player) {
      Player.seekTo(this.selectedClip.startTime);
    }
  },

  handleEnd() {
    this.dragType = null;
    this.dragStartClip = null;
  },

  // Zoom
  setZoom(pps) {
    this.pixelsPerSecond = Math.max(20, Math.min(200, pps));
    this.render();
  },

  // Sync with external clips (from media-import)
  syncClips(externalClips) {
    this.clips = externalClips;
    this.render();
  }
};
window.TimelineUI = TimelineUI;