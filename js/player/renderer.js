
/**
 * Folder: js/player/ File: renderer.js v3.8 - No Autoplay Fix
 */
const Renderer = {
  videoEl:null, textEl:null, emptyHint:null, currentClip:null,
  init(){
    this.videoEl=document.getElementById('realVideo');
    this.textEl=document.getElementById('textOverlay');
    this.emptyHint=document.getElementById('emptyHint');
    console.log('Renderer v3.8 - No Autoplay - Professional');
    if(this.videoEl){
      this.videoEl.style.display='block';
      this.videoEl.muted=true;
      this.videoEl.loop=false; // FIX: No repeat
      this.videoEl.autoplay=false; // FIX: No direct play
      this.videoEl.playsInline=true;
      this.videoEl.pause();
    }
    if(this.textEl){
      this.textEl.style.display='none';
      this.textEl.style.zIndex='9999';
    }
    if(window.EventBus){
      EventBus.on(EventBus.EVENTS.CLIP_SELECTED, (clip)=> {
        const real = clip.clip || clip;
        const found = window.TimelineUI ? TimelineUI.clips.find(c=>c.id===real.id) : null;
        this.showClip(found || real);
      });
      EventBus.on(EventBus.EVENTS.CLIP_DESELECTED, ()=> this._hideTextOnly());
      EventBus.on(EventBus.EVENTS.PLAY_PAUSE, (d)=> {
        if(d.playing) this.videoEl?.play().catch(()=>{});
        else this.videoEl?.pause();
      });
      EventBus.on(EventBus.EVENTS.PLAYHEAD, (d)=>{
        if(this.currentClip && this.videoEl && this.currentClip.type==='video' && d.time>=this.currentClip.startTime && d.time<=this.currentClip.startTime+this.currentClip.duration){
          const rel = d.time - this.currentClip.startTime;
          if(Math.abs(this.videoEl.currentTime - rel) > 0.3) this.videoEl.currentTime = rel;
        }
      });
    }
  },
  showClip(clip){
    if(!clip) return;
    this.currentClip=clip;
    console.log('Renderer v3.8 showClip', clip.type, clip.name);
    if(this.emptyHint) this.emptyHint.style.display='none';
    const st=document.getElementById('status');
    if(st) st.textContent = 'Selected: '+clip.name+' ('+clip.type+') - Paused';
    
    if(clip.type==='video' || clip.type==='image' || clip.type==='pip' || clip.type==='overlay'){
      this.showVideo(clip);
    } else if(clip.type==='text'){
      this.showText(clip);
      const under = window.TimelineUI ? TimelineUI.clips.find(c=> (c.type==='video'||c.type==='image') && c.startTime <= clip.startTime && c.startTime+c.duration >= clip.startTime) : null;
      if(under) this.showVideo(under, true);
    } else if(clip.type==='audio'){
      this._hideTextOnly();
      const videoClip = window.TimelineUI ? TimelineUI.clips.find(c=> c.type==='video'||c.type==='image') : null;
      if(videoClip) this.showVideo(videoClip, true);
    }
  },
  showVideo(clip, isBackground=false){
    if(!this.videoEl) this.videoEl=document.getElementById('realVideo');
    if(!this.videoEl) return;
    if(clip.src){
      if(this.videoEl.src !== clip.src){
        this.videoEl.src = clip.src;
        this.videoEl.load();
        this.videoEl.pause(); // Stay paused - no autoplay
      }
      this.videoEl.style.display='block';
      this.videoEl.style.opacity='1';
      if(clip.transform && !isBackground){
        const t=clip.transform;
        let tr=`translate(${t.x*3}px, ${t.y*3}px) rotate(${t.rotation||0}deg) scale(${t.scale||1})`;
        if(t.flipX) tr+=' scaleX(-1)';
        this.videoEl.style.transform = tr;
      }
    }
  },
  showText(clip){
    if(!this.textEl) this.textEl=document.getElementById('textOverlay');
    if(!this.textEl) return;
    this.textEl.style.display='block';
    this.textEl.textContent = clip.text || clip.name || 'Text';
    this.textEl.style.fontSize = (clip.fontSize||32)+'px';
    this.textEl.style.color = clip.fontColor||'#FFF';
    this.textEl.style.fontFamily = clip.fontFamily||'Inter';
    this.textEl.style.fontWeight='700';
    if(clip.fontColor && clip.fontColor.includes('gradient')){
      this.textEl.style.background = clip.fontColor;
      this.textEl.style.webkitBackgroundClip='text';
      this.textEl.style.backgroundClip='text';
      this.textEl.style.webkitTextFillColor='transparent';
      this.textEl.style.color='transparent';
    } else {
      this.textEl.style.background='transparent';
      this.textEl.style.webkitBackgroundClip='initial';
      this.textEl.style.backgroundClip='initial';
      this.textEl.style.webkitTextFillColor='initial';
      this.textEl.style.color=clip.fontColor||'#FFF';
    }
    if(clip.transform){
      const t=clip.transform;
      this.textEl.style.transform=`translate(-50%,-50%) translate(${t.x*3}px, ${t.y*3}px) rotate(${t.rotation||0}deg) scale(${t.scale||1})`;
    } else {
      this.textEl.style.transform='translate(-50%,-50%)';
    }
  },
  _hideTextOnly(){ if(this.textEl) this.textEl.style.display='none'; },
  _hide(){ this._hideTextOnly(); },
  _forceShow(clip){ this.showClip(clip); }
};
window.Renderer=Renderer;
setTimeout(()=>Renderer.init(), 200);
