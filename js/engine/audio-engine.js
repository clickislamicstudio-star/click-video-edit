
/**
 * Folder: js/engine/ File: audio-engine.js v2.0 FINAL - Audio Fix - No Emoji - Master Prompt
 * Rendering Layer + Export Layer ready for Kotlin WebView
 */
const AudioEngine = {
  audioEl: null,
  init(){
    if(this.audioEl) return;
    this.audioEl = document.createElement('audio');
    this.audioEl.id = 'bgAudio';
    this.audioEl.style.display = 'none';
    this.audioEl.preload = 'auto';
    this.audioEl.crossOrigin = 'anonymous';
    document.body.appendChild(this.audioEl);
    console.log('AudioEngine v2.0 - Audio Fix - Unmuted - No Emoji');
    if(window.EventBus){
      EventBus.on(EventBus.EVENTS.PLAY_PAUSE, (d)=>{ if(d.playing) this.play(); else this.pause(); });
      EventBus.on(EventBus.EVENTS.PLAYHEAD, (d)=>{ this.sync(d.time); });
    }
  },
  loadClip(clip){
    if(!clip || !clip.src) return;
    if(clip.type==='audio'){
      if(this.audioEl.src!==clip.src) this.audioEl.src=clip.src;
      this.audioEl.volume = clip.volume ?? 1;
      this.audioEl.muted = false;
    }
    if((clip.type==='video'||clip.type==='pip') && window.Renderer && Renderer.videoEl){
      Renderer.videoEl.muted = false;
      Renderer.videoEl.volume = clip.volume ?? 1;
    }
  },
  play(){
    const sel = window.Selection?.selectedClip;
    if(sel) this.loadClip(sel);
    if(this.audioEl && this.audioEl.src){
      this.audioEl.muted=false;
      this.audioEl.play().catch(()=>{});
    }
    if(window.Renderer && Renderer.videoEl){
      Renderer.videoEl.muted=false;
      Renderer.videoEl.volume=1;
    }
  },
  pause(){
    if(this.audioEl) this.audioEl.pause();
  },
  sync(time){
    if(!window.TimelineUI) return;
    const playingAudio = TimelineUI.clips.find(c=> c.type==='audio' && time>=c.startTime && time<=c.startTime+c.duration);
    if(playingAudio && this.audioEl){
      if(this.audioEl.src!==playingAudio.src) this.audioEl.src=playingAudio.src;
      const rel = time - playingAudio.startTime;
      if(Math.abs(this.audioEl.currentTime - rel) > 0.3) this.audioEl.currentTime = rel;
      this.audioEl.volume = playingAudio.volume ?? 1;
      this.audioEl.muted = false;
    }
  }
};
window.AudioEngine = AudioEngine;
setTimeout(()=>AudioEngine.init(), 300);
