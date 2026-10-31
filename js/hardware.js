/**
 * js/hardware.js - Hardware Detection for Safe Export
 * Decides max export quality based on device RAM/CPU
 */
const HardwareDetector = {
  info: {
    ram: 0,
    cores: 0,
    isLowEnd: false,
    maxPreset: "1080p"
  },

  async detect() {
    // RAM detection
    if(navigator.deviceMemory) {
      this.info.ram = navigator.deviceMemory; // GB
    } else {
      this.info.ram = 4; // Assume 4GB if not supported
    }

    // CPU cores
    if(navigator.hardwareConcurrency) {
      this.info.cores = navigator.hardwareConcurrency;
    } else {
      this.info.cores = 4;
    }

    // GPU detection via WebGL
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if(gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if(debugInfo) {
          this.info.gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
      }
    } catch(e) {
      this.info.gpu = "unknown";
    }

    // Decide if low-end
    this.info.isLowEnd = this.info.ram <= 2 || this.info.cores <= 2;
    
    // Set max export preset
    if(this.info.ram >= 8 && this.info.cores >= 8) {
      this.info.maxPreset = "4K";
    } else if(this.info.ram >= 4 && this.info.cores >= 4) {
      this.info.maxPreset = "2K";
    } else if(this.info.ram >= 3) {
      this.info.maxPreset = "1080p";
    } else {
      this.info.maxPreset = "720p";
    }

    console.log('Hardware Detected:', this.info);
    return this.info;
  },

  // Check if device can handle preset
  canHandle(presetName) {
    const order = ["720p", "1080p", "2K", "2K60", "4K"];
    const deviceMaxIndex = order.indexOf(this.info.maxPreset);
    const requestedIndex = order.indexOf(presetName);
    return requestedIndex <= deviceMaxIndex;
  },

  // Get safe export settings
  getSafeSettings(requestedPreset) {
    if(this.canHandle(requestedPreset)) {
      return ExportEngine.presets[requestedPreset];
    } else {
      // Fallback to device max
      return ExportEngine.presets[this.info.maxPreset];
    }
  }
};
window.HardwareDetector = HardwareDetector;
HardwareDetector.detect();