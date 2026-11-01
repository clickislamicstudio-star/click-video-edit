/**
 * js/timeline/markers.js - Playhead + Snap Markers + Beat Markers
 * Playhead Fixed Center CapCut Style + Snap Lines
 */
const MarkersEngine = {
  playheadTime: 0,
  snapLines: [], // {time, type}
  beatMarkers: [], // From AudioTool.detectBeats
  markers: [], // User markers

  // Playhead - Fixed Center Logic
  setPlayheadTime(time) {
    this.playheadTime = time;
    
    // CapCut style: scrollOffset = currentTime - (screenWidth/2 / pps)
    if(window.TimelineUI) {
      const screenWidth = TimelineUI.canvas ? TimelineUI.canvas.width/2 : 360;
      TimelineUI.scrollOffset = time - (screenWidth/2 / TimelineUI.pixelsPerSecond);
      if(TimelineUI.scrollOffset < 0) TimelineUI.scrollOffset = 0;
      TimelineUI.render();
    }

    // Update player
    if(window.Player) {
      Player.seekTo(time);
    }
  },

  // Add snap line (when clip snaps)
  addSnapLine(time, type = 'clip') {
    this.snapLines.push({ time, type, visibleUntil: Date.now() + 1000 });
    // Auto remove after 1s
    setTimeout(() => {
      this.snapLines = this.snapLines.filter(s => s.time !== time);
      if(window.TimelineUI) TimelineUI.render();
    }, 1000);
  },

  // Draw snap lines (called from TimelineUI render)
  drawSnapLines(ctx, timelineUI) {
    this.snapLines.forEach(snap => {
      const x = timelineUI.timeToPixel(snap.time);
      ctx.strokeStyle = snap.type === 'playhead' ? '#FF3B30' : '#4CAF50';
      ctx.lineWidth = 1;
      ctx.setLineDash([4,4]);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);
    });
  },

  // Beat markers from audio
  setBeats(beats) {
    this.beatMarkers = beats;
    if(window.TimelineUI) TimelineUI.render();
  },

  drawBeats(ctx, timelineUI) {
    this.beatMarkers.forEach(beatTime => {
      const x = timelineUI.timeToPixel(beatTime);
      ctx.fillStyle = '#FF9800';
      ctx.fillRect(x-1, 0, 2, 20);
      // Small dot on ruler
      ctx.beginPath();
      ctx.arc(x, 8, 3, 0, Math.PI*2);
      ctx.fill();
    });
  },

  // User markers (like InShot markers)
  addMarker(time, label = '') {
    const marker = {
      id: 'marker_' + Date.now(),
      time,
      label,
      color: '#2196F3'
    };
    this.markers.push(marker);
    return marker;
  },

  removeMarker(id) {
    this.markers = this.markers.filter(m => m.id !== id);
  },

  drawMarkers(ctx, timelineUI) {
    this.markers.forEach(marker => {
      const x = timelineUI.timeToPixel(marker.time);
      ctx.fillStyle = marker.color;
      ctx.fillRect(x-1, 0, 2, timelineUI.canvas.height/2);
      if(marker.label) {
        ctx.fillStyle = marker.color;
        ctx.font = '9px sans-serif';
        ctx.fillText(marker.label, x+4, 12);
      }
    });
  },

  // Get all snap times (clip starts/ends + playhead + markers)
  getSnapTimes(excludeClipId = null) {
    const times = [];
    
    if(window.TimelineUI) {
      TimelineUI.clips.forEach(clip => {
        if(clip.id === excludeClipId) return;
        times.push(clip.startTime); // Start
        times.push(clip.startTime + clip.duration); // End
      });
    }
    
    times.push(this.playheadTime); // Playhead
    this.markers.forEach(m => times.push(m.time));
    
    return [...new Set(times)]; // Unique
  }
};
window.MarkersEngine = MarkersEngine;