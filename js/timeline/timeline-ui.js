/**
 * js/timeline/timeline-ui.js - Professional Timeline UI v1.7
 * Real Import - Clear Dummy - Pinch Zoom + 2s Markers + Playhead Center
 * Formula: screenX = (clipTime - scrollOffset) * pixelsPerSecond
 */
const TimelineUI = {
  container: null,
  canvas: null,
  ctx: null,
  pixelsPerSecond: 80,
  scrollOffset: 0,
  trackHeight: 45,
  tracks: ['V1', 'V2', 'Text', 'A1', 'A2'],
  clips: [],
  selectedClip: null,
  isDragging: false,
  dragType: null,
  dragStartX: 0,
  dragStartClip: null,

  init(containerId = 'timelineArea') {
    this.container = document.getElementById(containerId);
    if(!this.container) return;

    this.container.innerHTML = '';
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.container.clientWidth * 2;
    this.canvas.height = (this.tracks.length * this.trackHeight + 30) * 2;
    this.canvas.style.width = '100%';
    this.canvas.style.height = (this.tracks.length * this.trackHeight + 30) + 'px';
    this.canvas.style.cursor = 'grab';
    this.canvas.style.touchAction = 'none';
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(2,2);

    this.container.appendChild(this.canvas);
    this.bindEvents();
    this.render();
    console.log('TimelineUI v1.7 Ready - Real Import');
  },

  timeToPixel(time) {
    return (time - this.scrollOffset) * this.pixelsPerSecond;
  },

  pixelToTime(pixel) {
    return (pixel / this.pixelsPerSecond) + this.scrollOffset;
  },

  addClip(clip) {
    this.clips.push(clip);
    this.render();
  },

  getTrackY(trackName) {
    const index = this.tracks.indexOf(trackName);
    return index * this.trackHeight + 20;
  },

  // Clear all dummy clips - for Real Import
  clearAll() {
    this.clips = [];
    this.selectedClip = null;
    this.render();
    console.log('Timeline cleared - Ready for real video');
  },

  render() {
    if(!this.ctx || !this.canvas) return;
    
    const width = this.canvas.width / 2;
    const height = this.canvas.height / 2;
    
    this.ctx.fillStyle = '#1E1E1E';
    this.ctx.fillRect(0,0,width,height);

    this.drawRuler();

    this.tracks.forEach((track, i) => {
      const y = i * this.trackHeight + 20;
      this.ctx.fillStyle = i % 2 === 0 ? '#2A2A2A' : '#252525';
      this.ctx.fillRect(0, y, width, this.trackHeight);
      
      this.ctx.fillStyle = '#666';
      this.ctx.font = '10px monospace';
      this.ctx.fillText(track, 6, y + 14);
      
      this.ctx.strokeStyle = '#333';
      this.ctx.beginPath();
      this.ctx.moveTo(0, y + this.trackHeight);
      this.ctx.lineTo(width, y + this.trackHeight);
      this.ctx.stroke();
    });

    this.clips.forEach(clip => {
      const x = this.timeToPixel(clip.startTime);
      const w = clip.duration * this.pixelsPerSecond;
      const trackY = this.getTrackY(clip.track || 'V1');
      
      if(x + w < -50 || x > width+50) return;

      let color = '#FF3B30';
      if(clip.track === 'V2') color = '#4CAF50';
      if(clip.track === 'Text') color = '#2196F3';
      if(clip.track === 'A1' || clip.track === 'A2') color = '#FF9800';

      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, trackY+2, w, this.trackHeight-4);
      
      if(this.selectedClip && this.selectedClip.id === clip.id) {
        this.ctx.strokeStyle = '#FFF';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, trackY+2, w, this.trackHeight-4);
      }

      this.ctx.fillStyle = '#FFF';
      this.ctx.font = '10px sans-serif';
      const text = (clip.name || clip.type || 'Clip').substring(0, 14);
      this.ctx.fillText(text, x+4, trackY+16);
      
      this.ctx.fillStyle = 'rgba(255,255,255,0.7)';
      this.ctx.font = '8px monospace';
      this.ctx.fillText(clip.duration.toFixed(1)+'s', x+4, trackY+28);

      this.ctx.fillStyle = '#FFF';
      this.ctx.fillRect(x, trackY+2, 4, this.trackHeight-4);
      this.ctx.fillRect(x+w-4, trackY+2, 4, this.trackHeight-4);

      if(clip.waveform && (clip.track === 'A1' || clip.track === 'A2')) {
        this.drawWaveformMini(x, trackY, w, clip.waveform);
      }
    });

    const centerX = width / 2;
    this.ctx.fillStyle = '#FF3B30';
    this.ctx.fillRect(centerX-1, 0, 2, height);
    this.ctx.beginPath();
    this.ctx.moveTo(centerX-8, 0);
    this.ctx.lineTo(centerX+8, 0);
    this.ctx.lineTo(centerX, 10);
    this.ctx.closePath();
    this.ctx.fill();

    if(window.MarkersEngine) {
      MarkersEngine.drawSnapLines(this.ctx, this);
      MarkersEngine.drawBeats(this.ctx, this);
      MarkersEngine.drawMarkers(this.ctx, this);
    }
  },

  drawRuler() {
    const width = this.canvas.width / 2;
    this.ctx.fillStyle = '#111';
    this.ctx.fillRect(0,0,width,20);
    
    const pps = this.pixelsPerSecond;
    let majorStep = 1;
    let minorStep = 0.5;
    
    if(pps < 40) {
      majorStep = 2;
      minorStep = 1;
    } else if(pps < 70) {
      majorStep = 1;
      minorStep = 0.5;
    } else if(pps > 120) {
      majorStep = 0.5;
      minorStep = 0.1;
    }
    
    const startTime = Math.floor(this.scrollOffset / majorStep) * majorStep;
    const endTime = Math.ceil((this.scrollOffset + width / pps) / majorStep) * majorStep;
    
    for(let t=startTime; t<=endTime; t+=minorStep) {
      const x = this.timeToPixel(t);
      if(x < -20 || x > width+20) continue;
      
      const isMajor = Math.abs(t % majorStep) < 0.0001;
      
      if(isMajor) {
        this.ctx.fillStyle = '#555';
        this.ctx.fillRect(x, 0, 1, 20);
        this.ctx.fillStyle = '#BBB';
        this.ctx.font = '9px monospace';
        if(majorStep >= 2) {
          if(t % 2 === 0) this.ctx.fillText(t+'s', x+2, 12);
        } else {
          this.ctx.fillText(t.toFixed(1)+'s', x+2, 12);
        }
      } else {
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(x, 10, 1, 10);
      }
    }
    
    this.ctx.fillStyle = '#FF3B30';
    this.ctx.font = '8px sans-serif';
    const zoomPercent = window.ZoomEngine ? ZoomEngine.getZoomLevel().toFixed(0) : 0;
    this.ctx.fillText('Zoom:'+zoomPercent+'% '+pps.toFixed(0)+'px/s', width-130, 12);
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
      this.ctx.fillRect(px, middle+min, Math.max(1, step*0.8), max-min);
    }
  },

  bindEvents() {
    if(!this.canvas) return;
    let lastX = 0;

    this.canvas.addEventListener('touchstart', (e) => {
      if(e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        this.handleStart(x, y);
        lastX = x;
      }
    });

    this.canvas.addEventListener('touchmove', (e) => {
      if(e.touches.length === 1) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const deltaX = x - lastX;
        this.handleMove(deltaX, x);
        lastX = x;
      }
    }, {passive: false});

    this.canvas.addEventListener('touchend', () => this.handleEnd());

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
    const time = this.pixelToTime(x);
    const trackIndex = Math.floor((y-20) / this.trackHeight);
    const trackName = this.tracks[trackIndex];
    
    const clickedClip = this.clips.find(c => 
      c.track === trackName && 
      time >= c.startTime && time <= c.startTime + c.duration
    );

    if(clickedClip) {
      this.selectedClip = clickedClip;
      const clipX = this.timeToPixel(clickedClip.startTime);
      const clipW = clickedClip.duration * this.pixelsPerSecond;
      
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

      // Load into player
      if(window.Player && clickedClip.type === 'video') {
        Player.loadClip(clickedClip);
      }
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
      
      if(window.SnapEngine) {
        const snapResult = SnapEngine.checkSnap(this.selectedClip, this.clips);
        if(snapResult && snapResult.snapped) {
          this.selectedClip.startTime = snapResult.time;
          if(window.MarkersEngine) MarkersEngine.addSnapLine(snapResult.time, 'clip');
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
      this.render();
      return;
    }

    this.render();
  },

  handleEnd() {
    this.dragType = null;
    this.dragStartClip = null;
  },

  setZoom(pps) {
    this.pixelsPerSecond = Math.max(20, Math.min(200, pps));
    if(window.MarkersEngine) {
      const currentTime = MarkersEngine.playheadTime;
      const screenWidth = this.canvas ? this.canvas.width/2 : 360;
      this.scrollOffset = currentTime - (screenWidth/2 / this.pixelsPerSecond);
      if(this.scrollOffset < 0) this.scrollOffset = 0;
    }
    this.render();
  },

  syncClips(externalClips) {
    this.clips = externalClips;
    this.render();
  }
};
window.TimelineUI = TimelineUI;