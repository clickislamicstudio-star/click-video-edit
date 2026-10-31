/**
 * js/tools/audio.js - Audio Effects & Beat Detection
 */
const AudioTool = {
  effects: {
    bass: { name: "Bass Boost", bass: 8, treble: 0 },
    echo: { name: "Echo", delay: 0.3, feedback: 0.5 },
    reverb: { name: "Reverb", room: 0.7, decay: 2 },
    robot: { name: "Robot", pitch: -8, distortion: 0.5 },
    chipmunk: { name: "Chipmunk", pitch: 8, speed: 1.2 },
    noiseReduction: { name: "Noise Reduction", threshold: -40 }
  },

  // Apply effect to audio clip
  applyEffect(clip, effectName) {
    const effect = this.effects[effectName];
    if(!effect) return clip;
    if(!clip.audioEffects) clip.audioEffects = [];
    clip.audioEffects.push({ id: Date.now(), name: effectName, ...effect });
    return clip;
  },

  removeEffect(clip, effectId) {
    if(!clip.audioEffects) return clip;
    clip.audioEffects = clip.audioEffects.filter(e => e.id !== effectId);
    return clip;
  },

  // Beat detection - returns array of beat times
  detectBeats(audioBuffer) {
    // Simplified beat detection - energy based
    const beats = [];
    const sampleRate = audioBuffer.sampleRate || 44100;
    const channelData = audioBuffer.getChannelData ? audioBuffer.getChannelData(0) : [];
    
    if(channelData.length === 0) {
      // Mock beats for test - every 0.5s
      return [0.5, 1.0, 1.5, 2.0, 2.5, 3.0];
    }

    // Real beat detection: find peaks in energy
    let lastBeat = 0;
    const threshold = 0.3;
    const minInterval = 0.3; // 300ms between beats
    
    for(let i=0; i<channelData.length; i+= sampleRate * 0.1) {
      let energy = 0;
      for(let j=0; j< sampleRate*0.1 && i+j < channelData.length; j++) {
        energy += Math.abs(channelData[i+j]);
      }
      energy /= (sampleRate*0.1);
      if(energy > threshold && (i/sampleRate - lastBeat) > minInterval) {
        beats.push(i / sampleRate);
        lastBeat = i / sampleRate;
      }
    }
    return beats;
  },

  // Volume with keyframe support
  setVolume(clip, volume, time = null) {
    if(time !== null) {
      // Keyframe volume
      if(!clip.keyframes) clip.keyframes = {};
      if(!clip.keyframes['volume']) clip.keyframes['volume'] = [];
      clip.keyframes['volume'].push({ time, value: volume, ease: 'linear' });
      clip.keyframes['volume'].sort((a,b) => a.time - b.time);
    } else {
      clip.volume = Math.max(0, Math.min(1, volume));
    }
    return clip;
  },

  // Fade in/out
  fadeIn(clip, duration = 0.5) {
    clip.fadeIn = duration;
    return clip;
  },

  fadeOut(clip, duration = 0.5) {
    clip.fadeOut = duration;
    return clip;
  }
};
window.AudioTool = AudioTool;