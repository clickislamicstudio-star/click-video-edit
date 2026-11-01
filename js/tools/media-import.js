/**
 * js/tools/media-import.js - REAL Video Import - No Mock
 * Uses File Picker + URL.createObjectURL + Video Duration
 */
const MediaImportTool = {
  lastFile: null,
  importedClips: [],

  async importToTimeline() {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'video/*,audio/*,image/*';
      input.multiple = true;

      input.onchange = async (e) => {
        const files = Array.from(e.target.files);
        const newClips = [];

        for(let i=0; i<files.length; i++) {
          const file = files[i];
          console.log('Importing REAL file:', file.name, (file.size/1024/1024).toFixed(1)+'MB');
          
          const clip = await this.createClipFromFile(file, i);
          if(clip) newClips.push(clip);
        }

        this.importedClips = newClips;
        this.lastFile = files[0] || null;

        // Add to TimelineUI
        if(window.TimelineUI && newClips.length>0) {
          newClips.forEach(c=>TimelineUI.addClip(c));
        }

        // Load first video into Player
        if(newClips.length>0 && window.Player) {
          const firstVideo = newClips.find(c=>c.type==='video');
          if(firstVideo) {
            Player.loadClip(firstVideo);
          }
        }

        resolve(newClips);
      };

      input.click();
    });
  },

  async createClipFromFile(file, index) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('video') ? 'video' : 
                   file.type.startsWith('audio') ? 'audio' : 'image';

      if(type === 'video') {
        const video = document.createElement('video');
        video.src = url;
        video.muted = true;
        video.preload = 'metadata';
        
        video.onloadedmetadata = async () => {
          const duration = video.duration || 5;
          console.log('Video duration:', duration);

          // Generate waveform if audio present
          let waveform = null;
          if(window.WaveformRenderer) {
            try {
              waveform = await WaveformRenderer.generateWaveform(file, 80);
            } catch(e){ waveform = null; }
          }

          const clip = new Clip({
            id: 'clip_'+Date.now()+'_'+index,
            track: index===0 ? 'V1' : 'V2',
            startTime: window.TimelineUI ? this.getNextV1Time() : 0,
            duration: duration,
            type: 'video',
            name: file.name,
            file: file,
            url: url,
            fileData: file,
            thumbnail: url,
            waveform: waveform,
            sourceDuration: duration,
            sourceOffset: 0
          });

          resolve(clip);
        };

        video.onerror = () => {
          // Fallback if metadata fails
          const clip = new Clip({
            id: 'clip_'+Date.now()+'_'+index,
            track: 'V1',
            startTime: this.getNextV1Time(),
            duration: 5,
            type: 'video',
            name: file.name,
            file: file,
            url: url
          });
          resolve(clip);
        };

      } else if(type === 'audio') {
        // Audio file
        const audio = document.createElement('audio');
        audio.src = url;
        audio.onloadedmetadata = async () => {
          const duration = audio.duration || 5;
          let waveform = null;
          if(window.WaveformRenderer) {
            waveform = await WaveformRenderer.generateWaveform(file, 80);
          }

          const clip = new Clip({
            id: 'clip_'+Date.now()+'_'+index,
            track: 'A1',
            startTime: this.getNextA1Time(),
            duration: duration,
            type: 'audio',
            name: file.name,
            file: file,
            url: url,
            waveform: waveform
          });
          resolve(clip);
        };
      } else {
        // Image - 3 seconds default
        const clip = new Clip({
          id: 'clip_'+Date.now()+'_'+index,
          track: 'V2',
          startTime: window.TimelineUI ? TimelineUI.clips.length : 0,
          duration: 3,
          type: 'image',
          name: file.name,
          file: file,
          url: url
        });
        resolve(clip);
      }
    });
  },

  getNextV1Time() {
    if(!window.TimelineUI || TimelineUI.clips.length===0) return 0;
    const v1Clips = TimelineUI.clips.filter(c=>c.track==='V1');
    if(v1Clips.length===0) return 0;
    const last = v1Clips[v1Clips.length-1];
    return last.startTime + last.duration;
  },

  getNextA1Time() {
    if(!window.TimelineUI) return 0;
    const a1Clips = TimelineUI.clips.filter(c=>c.track==='A1');
    if(a1Clips.length===0) return 0;
    const last = a1Clips[a1Clips.length-1];
    return last.startTime + last.duration;
  }
};
window.MediaImportTool = MediaImportTool;