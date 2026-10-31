/**
 * js/tools/text.js - Text Tool with Animations (InShot Style)
 */
const TextTool = {
  // Default text style
  defaultStyle: {
    text: "Click Editor",
    fontSize: 48,
    fontFamily: "Arial",
    color: "#FFFFFF",
    backgroundColor: "transparent",
    bold: false,
    italic: false,
    align: "center",
    strokeWidth: 0,
    strokeColor: "#000000",
    shadow: false,
    lineHeight: 1.2,
    letterSpacing: 0
  },

  // Animation presets: In, Out, Combo
  animations: {
    in: ["FadeIn", "SlideUp", "SlideDown", "ScaleIn", "BounceIn", "Typewriter"],
    out: ["FadeOut", "SlideDown", "ScaleOut", "BounceOut"],
    combo: ["Bounce", "Shake", "Pulse", "Wobble", "Glow"]
  },

  createTextClip(options = {}) {
    const style = { ...this.defaultStyle, ...options };
    const clip = new Clip({
      type: "text",
      track: "text",
      startTime: options.startTime || 0,
      duration: options.duration || 3,
      text: style.text,
      style: style,
      animationIn: options.animationIn || null,
      animationOut: options.animationOut || null,
      animationCombo: options.animationCombo || null,
      keyframes: [] // For text animations
    });
    return clip;
  },

  // Keyframe formula: progress = (currentTime - k1.time)/(k2.time - k1.time)
  applyAnimation(clip, currentTime) {
    // Returns transform matrix for current time
    let progress = 1;
    if(clip.animationIn) {
      const animDuration = 0.5;
      if(currentTime - clip.startTime < animDuration) {
        progress = (currentTime - clip.startTime) / animDuration;
        return { opacity: progress, scale: progress, y: (1-progress)*50 };
      }
    }
    return { opacity: 1, scale: 1, y: 0 };
  },

  updateStyle(clip, newStyle) {
    clip.style = { ...clip.style, ...newStyle };
    return clip;
  }
};
window.TextTool = TextTool;