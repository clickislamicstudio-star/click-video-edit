/**
 * js/tools/effects.js - Visual Effects FIXED
 * Bug Fix: clip.effects was object, now handles both
 */
const EffectsTool = {
  presets: {
    vhs: { name: "VHS", type: "vhs", intensity: 0.5, scanlines: 0.3 },
    glitch: { name: "Glitch", type: "glitch", intensity: 0.6, offset: 10 },
    rgbSplit: { name: "RGB Split", type: "rgb", rOffset: 5, gOffset: 0, bOffset: -5 },
    blur: { name: "Blur", type: "blur", amount: 5 },
    pixelate: { name: "Pixelate", type: "pixelate", size: 10 },
    shake: { name: "Shake", type: "shake", intensity: 5, speed: 10 },
    oldFilm: { name: "Old Film", type: "oldFilm", grain: 0.3, scratches: 0.2 },
    chromatic: { name: "Chromatic", type: "chromatic", amount: 3 },
    mirror: { name: "Mirror", type: "mirror", axis: "x" },
    wave: { name: "Wave", type: "wave", amplitude: 10, frequency: 5 }
  },

  blendModes: ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "soft-light", "hard-light", "difference", "exclusion"],

  applyEffect(clip, effectName, intensity = 0.5) {
    const preset = this.presets[effectName];
    if(!preset) return clip;
    
    // FIX: Ensure effects is always an array
    if(!clip.effects || !Array.isArray(clip.effects)) {
      clip.effects = [];
    }
    
    clip.effects.push({
      id: 'fx_' + Date.now(),
      name: effectName,
      ...preset,
      intensity: intensity,
      enabled: true
    });
    return clip;
  },

  removeEffect(clip, effectId) {
    if(!clip.effects || !Array.isArray(clip.effects)) {
      clip.effects = [];
      return clip;
    }
    clip.effects = clip.effects.filter(e => e.id !== effectId);
    return clip;
  },

  setBlendMode(clip, mode) {
    if(!this.blendModes.includes(mode)) mode = 'normal';
    clip.blendMode = mode;
    return clip;
  },

  getEffectCSS(effect) {
    if(!effect || !effect.enabled) return "";
    switch(effect.type) {
      case 'blur': return `blur(${effect.amount}px)`;
      case 'vhs': return `contrast(1.2) saturate(1.3)`;
      default: return "";
    }
  },

  setMotionBlur(clip, value) {
    clip.motionBlur = Math.max(0, Math.min(100, value));
    return clip;
  }
};
window.EffectsTool = EffectsTool;