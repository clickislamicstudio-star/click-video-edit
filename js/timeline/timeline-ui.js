/**
 * js/timeline/timeline-ui.js - v2.0 FINAL - Professional CapCut Style
 * Fix: MM:SS Format, Zero Repeat Bug, Dot System, 5-300px/s Zoom
 * Formula: screenX = (time - scrollOffset) * pps
 */
const TimelineUI = {
  container: null,
  canvas: null,
  ctx: null,
  pixelsPerSecond: 80,
  scrollOffset: -2,
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
    
    const centerOffset = (this.canvas.width/2/2) / this.pixelsPerSecond;
    this.scrollOffset = -centerOffset + 0.15;
    
    this.bindEvents();
    this.render();
    console.log('TimelineUI v2.0 FINAL Ready - MM:SS Format');
  },

  timeToPixel(time) {
    return (time - this.scrollOffset) * this.pixelsPerSecond;
  },

  pixelToTime(pixel) {
    return (pixel / this.pixelsPerSecond) + this.scrollOffset;
  },

  // Professional Time Format - MM:SS
  formatTime(seconds) {
    if(seconds < 0) seconds = 0;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    
    const mm = mins.toString().padStart(2, '0');
    const ss = secs.toString().padStart(2, '0');
    
    // For zoom in show milliseconds like 00:00^07
    if(this.pixelsPerSecond > 150) {
      const msStr = ms.toString().padStart(2, '0');
      return `${mm}:${ss}^${msStr}`;
    }
    return `${mm}:${ss}`;
  },

  addClip(clip) {
    if(this.clips.length === 0) {
      const centerOffset = (this.canvas ? this.canvas.width/2/2 : 180) / this.pixelsPerSecond;
      this.scrollOffset = -centerOffset + 0.15;
    }
    this.clips.push(clip);
    this.render();
  },

  getTrackY(trackName) {
    const index = this.tracks.indexOf(trackName);
    return index * this.trackHeight + 20;
  },

  clearAll() {
    this.clips = [];
    this.selectedClip = null;
    const centerOffset = (this.canvas ? this.canvas.width/2/2 : 180) / this.pixelsPerSecond;
    this.scrollOffset = -centerOffset + 0.15;
    this.render();
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
      
      if(x + w < -100 || x > width+100) return;

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
      this.ctx.font = '11px sans-serif';
      const text = (clip.name || 'Video').substring(0, 12);
      if(w > 50) this.ctx.fillText(text, x+6, trackY+16);
      
      this.ctx.fillStyle = 'rgba(255,255,255,0.8)';
      this.ctx.font = '9px monospace';
      const durText = this.formatTime(clip.duration);
      if(w > 40) this.ctx.fillText(durText, x+6, trackY+30);

      this.ctx.fillStyle = '#FFF';
      this.ctx.fillRect(x, trackY+2, 4, this.trackHeight-4);
      this.ctx.fillRect(x+w-4, trackY+2, 4, this.trackHeight-4);
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
    }
  },

  drawRuler() {
    const width = this.canvas.width / 2;
    this.ctx.fillStyle = '#111';
    this.ctx.fillRect(0,0,width,20);
    
    const pps = this.pixelsPerSecond;
    let majorStep, minorStep, labelStep;
    
    // Professional Zoom Levels - Like your 01:02 screenshot
    if(pps < 15) {
      majorStep = 10; minorStep = 2; labelStep = 10;
    } else if(pps < 30) {
      majorStep = 5; minorStep = 1; labelStep = 10;
    } else if(pps < 60) {
      majorStep = 2; minorStep = 0.5; labelStep = 5;
    } else if(pps < 120) {
      majorStep = 1; minorStep = 0.5; labelStep = 2;
    } else {
      majorStep = 0.5; minorStep = 0.1; labelStep = 1;
    }
    
    const startTime = Math.max(0, Math.floor(this.scrollOffset / minorStep) * minorStep);
    const endTime = Math.ceil((this.scrollOffset + width / pps) / minorStep) * minorStep + 1;
    
    let lastLabelX = -100;
    
    for(let t=startTime; t<=endTime; t+=minorStep) {
      if(t < 0) continue;
      const x = this.timeToPixel(t);
      if(x < -10 || x > width+10) continue;
      
      const isMajor = Math.abs(t % majorStep) < 0.001;
      const isLabel = Math.abs(t % labelStep) < 0.001;
      
      if(isLabel) {
        // Avoid duplicate labels
        if(Math.abs(x - lastLabelX) < 40) continue;
        
        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(x, 0, 1, 20);
        this.ctx.fillStyle = '#CCC';
        this.ctx.font = '10px monospace';
        this.ctx.fillText(this.formatTime(t), x+3, 12);
        lastLabelX = x;
      } else if(isMajor) {
        this.ctx.fillStyle = '#444';
        this.ctx.fillRect(x, 8, 1, 12);
      } else {
        // Small dots
        this.ctx.fillStyle = '#2A2A2A';
        this.ctx.beginPath();
        this.ctx.arc(x, 14, 1, 0, Math.PI*2);
        this.ctx.fill();
      }
    }
    
    // Zoom info
    this.ctx.fillStyle = '#FF3B30';
    this.ctx.font = '8px monospace';
    const zoomPercent = Math.round((pps / 80) * 100);
    this.ctx.fillText(`${zoomPercent}% ${pps.toFixed(0)}px/s`, width-110, 12);
  },

  bindEvents() {
    if(!this.canvas) return;
    let lastX = 0;
    let lastDist = 0;

    this.canvas.addEventListener('touchstart', (e) => {
      if(e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        this.handleStart(x, y);
        lastX = x;
      } else if(e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastDist = Math.sqrt(dx*dx + dy*dy);
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
      } else if(e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(lastDist > 0) {
          const scale = dist / lastDist;
          if(window.ZoomEngine) {
            ZoomEngine.zoomBy(scale);
          }
        }
        lastDist = dist;
      }
    }, {passive: false});

    this.canvas.addEventListener('touchend', (e) => {
      if(e.touches.length < 2) lastDist = 0;
      if(e.touches.length === 0) this.handleEnd();
    });

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

    this.canvas.addEventListener('wheel', (e) => {
      if(e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        if(window.ZoomEngine) ZoomEngine.zoomBy(delta);
      } else {
        e.preventDefault();
        const deltaTime = e.deltaX / this.pixelsPerSecond;
        this.scrollOffset += deltaTime;
        if(this.scrollOffset < -5) this.scrollOffset = -5;
        this.render();
      }
    }, {passive: false});
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
      
      if(Math.abs(x - clipX) < 12) {
        this.dragType = 'trim-left';
      } else if(Math.abs(x - (clipX+clipW)) < 12) {
        this.dragType = 'trim-right';
      } else {
        this.dragType = 'move';
      }
      
      this.dragStartX = x;
      this.dragStartClip = {...clickedClip};
      if(navigator.vibrate) navigator.vibrate(30);
      this.render();

      if(window.Player && clickedClip.type === 'video') {
        Player.loadClip(clickedClip);
      }
    } else {
      this.selectedClip = null;
      this.dragType = 'scroll';
      this.dragStartX = x;
      
      if(time >= 0 && window.Player) {
        Player.seekTo(time);
      }
      this.render();
    }
  },

  handleMove(deltaX, currentX) {
    const deltaTime = deltaX / this.pixelsPerSecond;

    if(this.dragType === 'move' && this.selectedClip) {
      this.selectedClip.startTime = this.dragStartClip.startTime + deltaTime;
      if(this.selectedClip.startTime < 0) this.selectedClip.startTime = 0;
      if(window.SnapEngine) {
        const snapResult = SnapEngine.checkSnap(this.selectedClip, this.clips);
        if(snapResult && snapResult.snapped) {
          this.selectedClip.startTime = snapResult.time;
        }
      }
    } else if(this.dragType === 'trim-left' && this.selectedClip) {
      const newStart = this.dragStartClip.startTime + deltaTime;
      const newDuration = this.dragStartClip.duration - deltaTime;
      if(newDuration > 0.2 && newStart >= 0) {
        this.selectedClip.startTime = newStart;
        this.selectedClip.duration = newDuration;
        this.selectedClip.sourceOffset = (this.dragStartClip.sourceOffset || 0) + deltaTime;
      }
    } else if(this.dragType === 'trim-right' && this.selectedClip) {
      const newDuration = this.dragStartClip.duration + deltaTime;
      if(newDuration > 0.2) {
        this.selectedClip.duration = newDuration;
      }
    } else if(this.dragType === 'scroll') {
      this.scrollOffset -= deltaTime;
      if(this.scrollOffset < -10) this.scrollOffset = -10;
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
    const centerTime = this.canvas ? this.pixelToTime(this.canvas.width/2/2) : 0;
    this.pixelsPerSecond = Math.max(5, Math.min(300, pps));
    if(this.canvas) {
      const centerX = this.canvas.width/2/2;
      this.scrollOffset = centerTime - (centerX / this.pixelsPerSecond);
    }
    this.render();
  },

  syncClips(externalClips) {
    this.clips = externalClips;
    this.render();
  }
};
window.TimelineUI = TimelineUI;