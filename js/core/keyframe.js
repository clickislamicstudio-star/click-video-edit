/**
 * js/core/keyframe.js - Keyframe Engine (THE HEART of Editor)
 * Formula you approved: progress = (currentTime - k1.time)/(k2.time - k1.time)
 * currentValue = k1.value + (k2.value - k1.value)*easedProgress
 */
const KeyframeEngine = {
  // Easing functions
  easing: {
    linear: t => t,
    easeIn: t => t*t,
    easeOut: t => t*(2-t),
    easeInOut: t => t<0.5 ? 2*t*t : -1+(4-2*t)*t,
    bounce: t => {
      if(t<1/2.75) return 7.5625*t*t;
      if(t<2/2.75) return 7.5625*(t-=1.5/2.75)*t+0.75;
      if(t<2.5/2.75) return 7.5625*(t-=2.25/2.75)*t+0.9375;
      return 7.5625*(t-=2.625/2.75)*t+0.984375;
    }
  },

  // Add keyframe to clip
  addKeyframe(clip, property, time, value, ease = 'linear') {
    if(!clip.keyframes) clip.keyframes = {};
    if(!clip.keyframes[property]) clip.keyframes[property] = [];
    
    clip.keyframes[property].push({ time, value, ease });
    clip.keyframes[property].sort((a,b) => a.time - b.time);
    return clip;
  },

  // GET VALUE AT CURRENT TIME - Main formula
  getValueAtTime(clip, property, currentTime) {
    if(!clip.keyframes || !clip.keyframes[property] || clip.keyframes[property].length === 0) {
      return null; // No keyframes
    }

    const kfs = clip.keyframes[property];
    
    // Before first keyframe
    if(currentTime <= kfs[0].time) return kfs[0].value;
    // After last keyframe
    if(currentTime >= kfs[kfs.length-1].time) return kfs[kfs.length-1].value;

    // Find surrounding keyframes
    let k1, k2;
    for(let i=0; i<kfs.length-1; i++) {
      if(currentTime >= kfs[i].time && currentTime <= kfs[i+1].time) {
        k1 = kfs[i];
        k2 = kfs[i+1];
        break;
      }
    }

    if(!k1 || !k2) return kfs[0].value;

    // YOUR APPROVED FORMULA
    const progress = (currentTime - k1.time) / (k2.time - k1.time);
    const easedProgress = (this.easing[k1.ease] || this.easing.linear)(progress);
    const currentValue = k1.value + (k2.value - k1.value) * easedProgress;
    
    return currentValue;
  },

  removeKeyframe(clip, property, time) {
    if(!clip.keyframes || !clip.keyframes[property]) return clip;
    clip.keyframes[property] = clip.keyframes[property].filter(k => k.time !== time);
    return clip;
  }
};
window.KeyframeEngine = KeyframeEngine;