/**
 * js/tools/trim-split.js - Phase 2 - Real Trim/Split - Professional
 */
const TrimSplitTool = {
  showTrimUI(clip) {
    if(!clip) clip = window.Selection?.selectedClip || window.TimelineUI?.selectedClip;
    if(!clip) { console.log('No clip to trim'); return; }
    const info=document.getElementById('info');
    if(info) {
      info.textContent = `Trim Mode: Drag white handles | Start:${clip.startTime.toFixed(2)}s Dur:${clip.duration.toFixed(2)}s Offset:${(clip.sourceOffset||0).toFixed(2)}s`;
      info.style.color='#4CAF50';
      setTimeout(()=>{ info.textContent='Phase 2: Contextual Toolbar Ready'; info.style.color='#FF3B30'; },3000);
    }
    if(window.Selection) Selection.selectClip(clip);
  },

  splitAtPlayhead(clip) {
    if(!clip) clip = window.Selection?.selectedClip;
    if(!clip) return;
    
    const playhead = window.TimelineUI?.currentTime || 0;
    if(playhead <= clip.startTime || playhead >= clip.endTime) {
      console.log('Playhead not inside clip');
      return;
    }
    
    const leftDuration = playhead - clip.startTime;
    const rightDuration = clip.endTime - playhead;
    
    if(leftDuration < 0.2 || rightDuration < 0.2) return;
    
    // Left clip - trim end
    clip.duration = leftDuration;
    
    // Right clip - new clip
    const newClip = new Clip({
      name: clip.name + ' (2)',
      src: clip.src,
      type: clip.type,
      track: clip.track,
      startTime: playhead,
      duration: rightDuration,
      originalDuration: clip.originalDuration,
      sourceOffset: (clip.sourceOffset||0) + leftDuration,
      color: clip.color
    });
    
    if(window.TimelineUI) {
      TimelineUI.addClip(newClip);
      TimelineUI.render();
    }
    
    console.log('Split at', playhead, 'into', clip.duration, '+', rightDuration);
    if(navigator.vibrate) navigator.vibrate([30,20,30]);
  }
};
window.TrimSplitTool = TrimSplitTool;
