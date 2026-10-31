/**
 * js/tools/media-import.js - File Picker & Media Import
 * Gallery -> Timeline V1
 */
const MediaImportTool = {
  supportedTypes: ["video/mp4", "video/webm", "video/mov", "audio/mp3", "audio/wav", "audio/m4a", "image/jpeg", "image/png"],

  // Open file picker
  async pickFiles(options = {}) {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = options.accept || "video/*,audio/*,image/*";
      input.multiple = options.multiple || true;
      
      input.onchange = async (e) => {
        const files = Array.from(e.target.files);
        const clips = [];
        
        for(const file of files) {
          const clip = await this.fileToClip(file);
          if(clip) clips.push(clip);
        }
        
        resolve(clips);
      };
      
      input.onerror = reject;
      input.click();
    });
  },

  // Convert File to Clip
  async fileToClip(file) {
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('video') ? 'video' : file.type.startsWith('audio') ? 'audio' : 'image';
    
    // Get duration
    let duration = 3; // default for image
    if(type === 'video' || type === 'audio') {
      duration = await this.getMediaDuration(url, type);
    }

    const clip = new Clip({
      id: 'clip_' + Date.now() + '_' + Math.random().toString(36).substr(2,5),
      type: type,
      track: type === 'video' ? 'V1' : type === 'audio' ? 'A1' : 'V2',
      startTime: window.Timeline ? Timeline.getNextStartTime(type === 'video' ? 'V1' : type === 'audio' ? 'A1' : 'V2') : 0,
      duration: duration,
      originalDuration: duration,
      sourceOffset: 0,
      src: url,
      file: file,
      name: file.name,
      size: file.size,
      waveform: null
    });

    // Generate waveform for audio/video
    if(type === 'audio' || type === 'video') {
      if(window.WaveformEngine) {
        WaveformEngine.generateWaveform(file, { width: 200 }).then(wf => {
          clip.waveform = wf;
          console.log('Waveform ready for', clip.name);
          // Redraw timeline if needed
          if(window.App && App.updateTimeline) App.updateTimeline();
        });
      }
    }

    // Save to IndexedDB
    if(window.Store && Store.saveMedia) {
      Store.saveMedia(clip.id, file);
    }

    console.log(`Imported: ${file.name} -> ${type} ${duration.toFixed(2)}s`);
    return clip;
  },

  // Get media duration
  getMediaDuration(url, type) {
    return new Promise((resolve) => {
      const el = document.createElement(type);
      el.preload = 'metadata';
      el.onloadedmetadata = () => {
        URL.revokeObjectURL(url); // Don't revoke yet, need for playback
        resolve(el.duration || 5);
      };
      el.onerror = () => resolve(5);
      el.src = url;
    });
  },

  // Add to timeline
  async importToTimeline() {
    const clips = await this.pickFiles({ multiple: true });
    
    clips.forEach(clip => {
      if(window.Timeline && Timeline.addClip) {
        Timeline.addClip(clip);
      }
      if(window.App && window.App.currentProject) {
        App.currentProject.clips.push(clip);
        App.currentProject.duration = Math.max(App.currentProject.duration, clip.endTime || clip.startTime + clip.duration);
      }
    });

    console.log(`Imported ${clips.length} clips to timeline`);
    
    // Update UI
    if(window.App && App.showWelcome) {
      App.showWelcome(); // Refresh will show clips count
    }
    
    return clips;
  }
};
window.MediaImportTool = MediaImportTool;