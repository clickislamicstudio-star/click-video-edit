/**
 * js/tools/trim-split.js - Trim & Split Tool (InShot Style)
 */
const TrimSplitTool = {
  // Split clip at playhead time
  splitClip(clip, splitTime) {
    if (splitTime <= clip.startTime || splitTime >= clip.endTime) return null;
    
    const leftDuration = splitTime - clip.startTime;
    const rightDuration = clip.endTime - splitTime;
    
    const leftClip = new Clip({
      track: clip.track,
      startTime: clip.startTime,
      duration: leftDuration,
      sourceOffset: clip.sourceOffset,
      type: clip.type,
      src: clip.src
    });
    
    const rightClip = new Clip({
      track: clip.track,
      startTime: splitTime,
      duration: rightDuration,
      sourceOffset: clip.sourceOffset + leftDuration,
      type: clip.type,
      src: clip.src
    });
    
    return [leftClip, rightClip];
  },

  // Trim from left or right
  trimClip(clip, side, deltaTime) {
    if (side === 'left') {
      clip.startTime += deltaTime;
      clip.duration -= deltaTime;
      clip.sourceOffset += deltaTime;
    } else {
      clip.duration += deltaTime;
    }
    if (clip.duration < 0.1) clip.duration = 0.1;
    return clip;
  }
};
window.TrimSplitTool = TrimSplitTool;