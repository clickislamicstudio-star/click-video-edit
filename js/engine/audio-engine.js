
/**
 * Folder: js/engine/ File: audio-engine.js v1.0 NEW - Real Audio Playback Fix (No Audio Bug)
 */
const AudioEngine = {
  audioEl:null,
  ctx:null,
  init(){
    console.log('AudioEngine v1.0 - Fix No Audio');
    this.audioEl=document.createElement('audio');
    this.audioEl.id='bgAudio';
    this.audioEl.style.display='none';
    this.audioEl.preload='auto';
    document.body.appendChild(this.audioEl);
    
    if(window.EventBus){
      EventBus.on(EventBus.EVENTS.PLAY_PAUSE, (d)=>{
        if(d.playing) this.play();
        else this.pause();
      });
      EventBus.on(EventBus.EVENTS.PLAYHEAD, (d)=>{
        this.sync(d.time);
      });
      EventBus.on(EventBus.EVENTS.CLIP_SELECTED, (clip)=>{
        const real=clip.clip||clip;
        if(real.type==='audio' && real.src){
          if(this.audioEl.src!==real.src) this.audioEl.src=real.src;
        }
      });
    }
  },
  loadClip(clip){
    if(!clip || !clip.src) return;
    if(clip.type==='audio'){
      if(this.audioEl.src!==clip.src) this.audioEl.src=clip.src;
      this.audioEl.volume=clip.volume ?? 1;
    }
    if(clip.type==='video' && window.Renderer && Renderer.videoEl){
      Renderer.videoEl.muted=false;
      Renderer.videoEl.volume=clip.volume ?? 1;
    }
  },
  play(){
    const sel=window.Selection?.selectedClip;
    if(sel) this.loadClip(sel);
    if(this.audioEl && this.audioEl.src) this.audioEl.play().catch(()=>{});
    if(window.Renderer && Renderer.videoEl){
      Renderer.videoEl.muted=false;
      Renderer.videoEl.volume=1;
    }
  },
  pause(){
    if(this.audioEl) this.audioEl.pause();
    if(window.Renderer && Renderer.videoEl) Renderer.videoEl.pause();
  },
  sync(time){
    if(!window.TimelineUI) return;
    const playingAudio = TimelineUI.clips.find(c=> c.type==='audio' && time>=c.startTime && time<=c.startTime+c.duration);
    if(playingAudio && this.audioEl){
      if(this.audioEl.src!==playingAudio.src) this.audioEl.src=playingAudio.src;
      const rel=time-playingAudio.startTime;
      if(Math.abs(this.audioEl.currentTime-rel)>0.3) this.audioEl.currentTime=rel;
      this.audioEl.volume=playingAudio.volume ?? 1;
    }
  }
};
window.AudioEngine=AudioEngine;
setTimeout(()=>AudioEngine.init(),300);
