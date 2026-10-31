/**
 * js/tools/filter.js - Filters & Effects (InShot Style)
 * Effect is clip data, not separate track
 */
const FilterTool = {
  // InShot-like filter presets
  presets: {
    normal: { name: "Normal", brightness: 0, contrast: 0, saturation: 0 },
    bright: { name: "Bright", brightness: 15, contrast: 5, saturation: 10 },
    dark: { name: "Dark", brightness: -10, contrast: 10, saturation: -5 },
    bw: { name: "B&W", brightness: 0, contrast: 5, saturation: -100 },
    vintage: { name: "Vintage", brightness: 5, contrast: -5, saturation: -20, sepia: 30 },
    vivid: { name: "Vivid", brightness: 5, contrast: 15, saturation: 25 },
    warm: { name: "Warm", brightness: 5, temp: 15, saturation: 10 },
    cold: { name: "Cold", brightness: 0, temp: -15, saturation: 5 },
    film: { name: "Film", brightness: -5, contrast: 10, saturation: -10, grain: 20 }
  },

  // Apply filter to clip
  applyFilter(clip, filterName) {
    const preset = this.presets[filterName] || this.presets.normal;
    clip.filter = { ...preset, name: filterName };
    return clip;
  },

  // Custom adjustment
  adjust(clip, params) {
    // params: {brightness, contrast, saturation, temp, tint, exposure, highlights, shadows...}
    if(!clip.filter) clip.filter = { ...this.presets.normal };
    clip.filter = { ...clip.filter, ...params };
    return clip;
  },

  // WebGL fragment for export - filter math
  getFilterCSS(filter) {
    if(!filter) return "none";
    let css = "";
    if(filter.brightness) css += `brightness(${100+filter.brightness}%) `;
    if(filter.contrast) css += `contrast(${100+filter.contrast}%) `;
    if(filter.saturation) css += `saturate(${100+filter.saturation}%) `;
    if(filter.sepia) css += `sepia(${filter.sepia}%) `;
    return css.trim() || "none";
  },

  // Blend modes: Normal, Multiply, Screen, Overlay...
  blendModes: ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "soft-light"]
};
window.FilterTool = FilterTool;