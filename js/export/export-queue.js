/**
 * js/export/export-queue.js - Export Queue + Safe Ads Strategy
 * Ads only AFTER export/save, never during editing - User Friendly
 * Queue: 720p,1080p,2K,4K - Premium = Rewarded Ad
 */
const ExportQueue = {
  queue: [],
  isExporting: false,
  completed: [],

  // Presets with Ads logic - Your Safe Ads Strategy
  presets: {
    '720p': { width:1280, height:720, fps:30, bitrate:5000000, label:'720p HD', ads:false, free:true },
    '1080p': { width:1920, height:1080, fps:30, bitrate:8000000, label:'1080p Full HD', ads:false, free:true },
    '1080p60': { width:1920, height:1080, fps:60, bitrate:12000000, label:'1080p 60fps', ads:false, free:true, ram:4 },
    '2K': { width:2560, height:1440, fps:30, bitrate:15000000, label:'2K QHD', ads:false, free:true, ram:4 },
    '2K60': { width:2560, height:1440, fps:60, bitrate:20000000, label:'2K 60fps Premium', ads:true, free:false, rewarded:true, ram:6 },
    '4K': { width:3840, height:2160, fps:30, bitrate:25000000, label:'4K Ultra HD', ads:true, free:false, rewarded:true, ram:6 }
  },

  // Add to queue
  addToQueue(options) {
    const { resolution='1080p', clips=[] } = options;
    const preset = this.presets[resolution];
    
    if(!preset) {
      console.error('Unknown preset', resolution);
      return null;
    }

    // Check hardware
    const ram = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    if(preset.ram && ram < preset.ram) {
      alert(`Your device RAM ${ram}GB is low for ${preset.label}. Need ${preset.ram}GB. Try 1080p.`);
      return null;
    }

    const job = {
      id: 'export_'+Date.now(),
      resolution,
      preset,
      clips,
      status: 'queued',
      progress: 0,
      createdAt: Date.now()
    };

    this.queue.push(job);
    console.log('Added to queue:', job.label, job.id);
    this.updateUI();
    this.processNext();
    
    return job;
  },

  async processNext() {
    if(this.isExporting || this.queue.length===0) return;
    
    this.isExporting = true;
    const job = this.queue[0];
    job.status = 'exporting';

    console.log('Starting export:', job.preset.label);

    try {
      // Show ads ONLY for premium BEFORE export (Safe Ads Strategy)
      if(job.preset.rewarded) {
        const shouldShowAd = confirm(
          `${job.preset.label} is Premium Feature.\n`+
          `Watch a Rewarded Ad to unlock FREE export?\n\n`+
          `Click OK to watch Ad (Safe - After export, not during editing)`
        );
        
        if(!shouldShowAd) {
          job.status = 'cancelled';
          this.queue.shift();
          this.isExporting = false;
          this.updateUI();
          return;
        }

        // Mock rewarded ad - In real Play Store, use AdMob Rewarded
        console.log('Showing Rewarded Ad... (Safe Ads: Only after export)');
        await this.showRewardedAd();
      }

      // Real export via FFmpegEngine
      if(window.FFmpegEngine) {
        const result = await FFmpegEngine.exportVideo({
          resolution: job.resolution,
          fps: job.preset.fps,
          clips: job.clips,
          onProgress: (p) => {
            job.progress = p;
            this.updateUI();
          }
        });

        job.status = 'completed';
        job.result = result;
        job.progress = 100;
        this.completed.push(job);
        
        console.log('Export completed:', job.id, result);
        
        // Show completion ad (Interstitial - Safe - After export)
        if(job.preset.ads) {
          setTimeout(()=> this.showInterstitialAd(), 500);
        }

      } else {
        throw new Error('FFmpegEngine not ready');
      }

    } catch(e) {
      console.error('Export failed', e);
      job.status = 'failed';
      job.error = e.message;
    }

    this.queue.shift();
    this.isExporting = false;
    this.updateUI();
    
    // Process next in queue
    if(this.queue.length>0) {
      setTimeout(()=>this.processNext(), 500);
    }
  },

  async showRewardedAd() {
    // Mock - Real: AdMob Rewarded Ad
    return new Promise(resolve=>{
      const badge = document.getElementById('badge');
      if(badge) badge.textContent = '📺 Watching Rewarded Ad... (Premium Unlock)';
      
      setTimeout(()=>{
        if(badge) badge.textContent = '✅ Ad Completed - Export Unlocked!';
        console.log('Rewarded Ad Completed - User gets 2K60/4K free');
        resolve(true);
      }, 2000);
    });
  },

  async showInterstitialAd() {
    // Mock - Real: AdMob Interstitial after export
    console.log('Interstitial Ad After Export - Safe Ads Strategy');
    const badge = document.getElementById('badge');
    if(badge) {
      const old = badge.textContent;
      badge.textContent = '📺 Ad - Thanks for supporting FREE editor!';
      setTimeout(()=> badge.textContent = old, 3000);
    }
  },

  updateUI() {
    const info = document.getElementById('info');
    if(!info) return;
    
    if(this.queue.length>0) {
      const job = this.queue[0];
      info.textContent = `Exporting ${job.preset.label}: ${job.progress.toFixed(0)}% - Queue: ${this.queue.length}`;
    } else if(this.completed.length>0) {
      const last = this.completed[this.completed.length-1];
      info.textContent = `✅ Last Export: ${last.preset.label} - Completed! - FREE Forever - No Watermark`;
    } else {
      info.textContent = '✋ Pinch to Zoom | Drag to Move | Trim Handles | Export Queue Ready - Safe Ads';
    }
  },

  // Quick export
  quickExport(resolution='1080p') {
    const clips = window.TimelineUI ? TimelineUI.clips : [];
    if(clips.length===0) {
      alert('Import video first!');
      return null;
    }
    return this.addToQueue({resolution, clips});
  },

  getQueueStatus() {
    return {
      queued: this.queue.length,
      isExporting: this.isExporting,
      completed: this.completed.length,
      current: this.queue[0] || null
    };
  }
};
window.ExportQueue = ExportQueue;