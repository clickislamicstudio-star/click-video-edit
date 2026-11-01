/**
 * js/tools/trim-split.js - v2.0 - Real Trim + Split - Professional
 * Trim: Adjust sourceOffset + duration, Split: Cut at playhead
 */
const TrimSplitTool = {
  
  showTrimUI() {
    // Trim UI already handled by white handles in timeline-ui.js
    // This is for additional trim controls if needed
    const clip = window.Toolbar?.currentClip || window.TimelineUI?.selectedClip;
    if(!clip) return;

    console.log('Trim UI for:', clip.name, 'Duration:', clip.duration, 'Offset:', clip.sourceOffset);
    
    // Show toast
    const status = document.getElementById('status');
    if(status) {
      status.textContent = `Trim: Drag white handles - Duration: ${clip.duration.toFixed(1)}s - Offset: ${(clip.sourceOffset||0).toFixed(1)}s`;
      status.style.color = '#4CAF50';
    }
  },

  splitAtPlayhead() {
    const clip = window.Toolbar?.currentClip || window.TimelineUI?.selectedClip;
    if(!clip || !window.Player || !window.TimelineUI) return;

    const playheadTime = Player.getCurrentTime();
    const clipStart = clip.startTime;
    const clipEnd = clip.startTime + clip.duration;
    
    // Check if playhead is inside clip
    if(playheadTime <= clipStart || playheadTime >= clipEnd) {
      const status = document.getElementById('status');
      if(status) {
        status.textContent = 'Move playhead inside clip to split';
        status.style.color = '#FF9800';
      }
      return;
    }

    // Calculate split point
    const splitOffset = playheadTime - clipStart;
    const firstDuration = splitOffset;
    const secondDuration = clip.duration - splitOffset;
    
    if(firstDuration < 0.2 || secondDuration < 0.2) {
      const status = document.getElementById('status');
      if(status) {
        status.textContent = 'Clip too short to split here';
        status.style.color = '#FF9800';
      }
      return;
    }

    // First clip: Keep original start, reduce duration
    clip.duration = firstDuration;
    
    // Second clip: New clip starting at playhead
    const secondClip = new Clip({
      id: 'clip_'+Date.now(),
      track: clip.track,
      startTime: playheadTime,
      duration: secondDuration,
      type: clip.type,
      name: clip.name + ' (2)',
      file: clip.file,
      url: clip.url,
      sourceDuration: clip.sourceDuration,
      sourceOffset: (clip.sourceOffset || 0) + splitOffset
    });

    TimelineUI.addClip(secondClip);
    TimelineUI.render();
    
    if(navigator.vibrate) navigator.vibrate([30, 30, 30]);

    const status = document.getElementById('status');
    if(status) {
      status.textContent = `Split at ${playheadTime.toFixed(1)}s - ${firstDuration.toFixed(1)}s + ${secondDuration.toFixed(1)}s`;
      status.style.color = '#4CAF50';
    }

    console.log('Split:', firstDuration, '+', secondDuration);
  },

  // Real trim logic - Called from timeline-ui.js drag
  applyTrim(clip, newStartTime, newDuration, sourceOffset) {
    if(!clip) return;
    
    clip.startTime = newStartTime;
    clip.duration = newDuration;
    clip.sourceOffset = sourceOffset;
    
    // Update player if current clip
    if(window.Player && window.Toolbar?.currentClip?.id === clip.id) {
      const v = document.getElementById('realVideo');
      if(v) {
        // Seek to new offset
        v.currentTime = sourceOffset + (Player.getCurrentTime() - newStartTime);
      }
    }
  },

  // For export - Get real export duration
  getExportParams(clip) {
    if(!clip) return null;
    
    return {
      sourceOffset: clip.sourceOffset || 0,
      duration: clip.duration,
      startTime: clip.startTime
    };
  }
};
window.TrimSplitTool = TrimSplitTool;