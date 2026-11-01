/**
 * js/tools/media-import.js - SUPER SIMPLE - Real Video Direct Show
 * No waveform, no complex - Just show video in player
 */
const MediaImportTool = {
  lastFile: null,

  async importToTimeline() {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'video/*';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if(!file) { resolve([]); return; }

        console.log('REAL FILE:', file.name, file.size);

        const url = URL.createObjectURL(file);
        this.lastFile = file;

        // DIRECT SHOW IN PLAYER - No Player.js needed
        const video = document.getElementById('realVideo');
        const importBtn = document.getElementById('importBtn');
        const status = document.getElementById('status');
        
        if(video) {
          video.src = url;
          video.style.display = 'block';
          video.muted = false;
          video.controls = false;
          video.load();
          
          // Force play first frame
          video.addEventListener('loadeddata', ()=>{
            console.log('Video loadeddata - showing');
            video.style.display = 'block';
            if(importBtn) importBtn.style.display = 'none';
            if(status) {
              status.textContent = `Playing: ${file.name} - ${(video.duration||0).toFixed(1)}s - Tap to Play/Pause`;
              status.style.color = '#0F0';
            }
            // Show first frame
            video.currentTime = 0.1;
            // Try autoplay
            video.play().catch(()=>{ console.log('Autoplay blocked - tap to play'); });
          }, {once:true});

          video.addEventListener('error', (err)=>{
            console.error('Video error', err);
            if(status) {
              status.textContent = 'Error: Try MP4 file';
              status.style.color = '#F00';
            }
          });

          // Click to play/pause
          video.onclick = ()=>{
            if(video.paused) video.play();
            else video.pause();
          };
        }

        // Clear timeline and add real clip
        if(window.TimelineUI) {
          TimelineUI.clearAll();
          
          // Wait for metadata to get real duration
          const tempVideo = document.createElement('video');
          tempVideo.src = url;
          tempVideo.onloadedmetadata = ()=>{
            const duration = tempVideo.duration || 10;
            console.log('Real duration:', duration);
            
            const clip = new Clip({
              id: 'real_'+Date.now(),
              track: 'V1',
              startTime: 0,
              duration: duration,
              type: 'video',
              name: file.name,
              file: file,
              url: url,
              sourceDuration: duration
            });
            
            TimelineUI.addClip(clip);
            
            const badge = document.getElementById('badge');
            if(badge) {
              badge.textContent = `✅ Real Video: ${file.name.substring(0,15)} - ${duration.toFixed(1)}s`;
              badge.style.background = '#4CAF50';
            }
            
            resolve([clip]);
          };
          
          tempVideo.onerror = ()=>{
            // Fallback 10s
            const clip = new Clip({
              id: 'real_'+Date.now(),
              track: 'V1',
              startTime: 0,
              duration: 10,
              type: 'video',
              name: file.name,
              file: file,
              url: url
            });
            TimelineUI.addClip(clip);
            resolve([clip]);
          };
        } else {
          resolve([]);
        }
      };
      input.click();
    });
  }
};
window.MediaImportTool = MediaImportTool;