/**
 * js/tools/text.js - Text Tool FIXED
 * Bug Fix: Clip.text property was missing
 */
const TextTool = {
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

  animations: {
    in: ["FadeIn", "SlideUp", "SlideDown", "ScaleIn", "BounceIn", "Typewriter"],
    out: ["FadeOut", "SlideDown", "ScaleOut", "BounceOut"],
    combo: ["Bounce", "Shake", "Pulse", "Wobble", "Glow"]
  },

  createTextClip(options = {}) {
    const style = { ...this.defaultStyle, ...options };
    
    // Create clip normally
    const clip = new Clip({
      type: "text",
      track: "text",
      startTime: options.startTime || 0,
      duration: options.duration || 3,
      src: null
    });

    // FIX: Explicitly set text properties - this is the fix
    clip.text = options.text || style.text || "Click Editor";
    clip.style = style;
    clip.animationIn = options.animationIn || null;
    clip.animationOut = options.animationOut || null;
    clip.animationCombo = options.animationCombo || null;
    clip.keyframes = [];
    
    return clip;
  },

  applyAnimation(clip, currentTime) {
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
    if(newStyle.text) clip.text = newStyle.text;
    return clip;
  }
};
window.TextTool = TextTool;