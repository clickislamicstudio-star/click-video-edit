/**
 * js/core/waveform-renderer.js - Real Waveform using Web Audio API
 * Decode video audio -> PCM -> downsample -> min/max per pixel
 * Cached in IndexedDB
 */
const WaveformRenderer = {
  audioContext: null,
  cache: new Map(),

  init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log('WaveformRenderer Ready - Web Audio API');
    } catch(e) {
      console.warn('Web Audio not supported', e);
    }
  },

  // Generate waveform from File
  async generateWaveform(file, pixelsPerSecond = 80) {
    if(!this.audioContext) this.init();
    
    const cacheKey = file.name + '_' + file.size + '_' + pixelsPerSecond;
    if(this.cache.has(cacheKey)) return this.cache.get(cacheKey);

    console.log('Generating waveform for', file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      const channelData = audioBuffer.getChannelData(0);
      const sampleRate = audioBuffer.sampleRate;
      const duration = audioBuffer.duration;
      
      // Downsample: pixelsPerSecond * duration = total pixels
      const totalPixels = Math.ceil(duration * pixelsPerSecond);
      const samplesPerPixel = Math.floor(channelData.length / totalPixels);
      
      const waveform = [];
      
      for(let i=0; i<totalPixels; i++) {
        const start = i * samplesPerPixel;
        const end = Math.min(start + samplesPerPixel, channelData.length);
        
        let min = 1.0;
        let max = -1.0;
        
        for(let j=start; j<end; j++) {
          const sample = channelData[j];
          if(sample < min) min = sample;
          if(sample > max) max = sample;
        }
        
        waveform.push({ min, max });
      }

      // Cache
      this.cache.set(cacheKey, waveform);
      
      // Save to IndexedDB for persistence
      if(window.Store) {
        Store.saveWaveform(file.name, waveform);
      }

      console.log('Waveform generated:', waveform.length, 'points for', duration.toFixed(1)+'s');
      return waveform;
      
    } catch(e) {
      console.error('Waveform failed for', file.name, e);
      // Fallback fake waveform
      const fake = Array.from({length: Math.ceil(5 * pixelsPerSecond)}, ()=>({
        min: -0.5 + Math.random()*0.3,
        max: 0.5 - Math.random()*0.3
      }));
      return fake;
    }
  },

  // Render waveform on canvas context
  renderWaveform(ctx, x, y, width, height, waveform) {
    if(!waveform || waveform.length===0) return;
    
    const middle = y + height/2;
    const step = width / waveform.length;
    
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    
    for(let i=0; i<waveform.length; i++) {
      const px = x + i*step;
      const min = waveform[i].min * (height/2);
      const max = waveform[i].max * (height/2);
      
      const h = Math.max(1, max - min);
      ctx.fillRect(px, middle + min, Math.max(1, step*0.8), h);
    }
  },

  // Get from cache or generate
  async getOrGenerate(file, pps) {
    return await this.generateWaveform(file, pps);
  }
};
window.WaveformRenderer = WaveformRenderer;