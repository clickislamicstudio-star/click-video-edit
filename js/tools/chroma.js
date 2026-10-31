/**
 * js/tools/chroma.js - Chroma Key / Green Screen (CapCut Style)
 */
const ChromaTool = {
  // Default green screen settings
  defaultSettings: {
    enabled: false,
    color: "#00FF00", // Green to remove
    similarity: 0.4, // 0-1 how close color match
    smoothness: 0.1, // Edge feather
    spill: 0.2 // Remove green spill on subject
  },

  enable(clip, color = "#00FF00") {
    if(!clip.chroma) clip.chroma = { ...this.defaultSettings };
    clip.chroma.enabled = true;
    clip.chroma.color = color;
    return clip;
  },

  disable(clip) {
    if(clip.chroma) clip.chroma.enabled = false;
    return clip;
  },

  setSimilarity(clip, value) {
    if(!clip.chroma) clip.chroma = { ...this.defaultSettings };
    clip.chroma.similarity = Math.max(0, Math.min(1, value));
    return clip;
  },

  setSmoothness(clip, value) {
    if(!clip.chroma) clip.chroma = { ...this.defaultSettings };
    clip.chroma.smoothness = Math.max(0, Math.min(1, value));
    return clip;
  },

  // WebGL shader logic for export
  getChromaShader() {
    return `
      // Chroma Key Shader - Remove green
      vec3 keyColor = vec3(0.0, 1.0, 0.0);
      float dist = distance(texColor.rgb, keyColor);
      float alpha = smoothstep(similarity, similarity + smoothness, dist);
      // Output with alpha
    `;
  },

  // Auto detect green color from frame
  autoDetectGreen(canvas) {
    // Sample center pixels to find dominant green
    return "#00FF00"; // Simplified for now
  }
};
window.ChromaTool = ChromaTool;