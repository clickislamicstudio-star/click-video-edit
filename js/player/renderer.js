
/**
 * Renderer v3.6.3 - Player Fixed - Video Always Visible
 */
const Renderer = {
  videoEl:null, textEl:null, wrapEl:null, emptyHint:null,
  init(){
    this.videoEl=document.getElementById('realVideo');
    this.textEl=document.getElementById('textOverlay');
    this.wrapEl=document.getElementById('playerWrap');
    this.emptyHint=document.getElementById('emptyHint');
    console.log('Renderer v3.6.3 init', !!this.videoEl);
    if(this.videoEl){
      this.videoEl.style.display='block';
      this.videoEl.muted=true;
      this.videoEl.loop=true;
      this.videoEl.playsInline=true;
    }
    if(this.textEl){
      this.textEl.style.display='none';
      this.textEl.style.zIndex='9999';
    }
    if(window.EventBus){
      EventBus.on(EventBus.EVENTS.CLIP_SELECTED, (clip)=> {
        const real = clip.clip || clip;
        if(real && real.id){
          const found = window.TimelineUI ? TimelineUI.clips.find(c=>c.id===real.id) : null;
          this.showClip(found || real);
        }
      });
      EventBus.on(EventBus.EVENTS.CLIP_DESELECTED, ()=> this._hideTextOnly());
    }
  },
  showClip(clip){
    if(!clip) return;
    console.log('Renderer showClip FIXED', clip.type, clip.name, !!clip.src);
    if(this.emptyHint) this.emptyHint.style.display='none';
    document.getElementById('status').textContent = 'Selected: '+clip.name;
    
    if(clip.type==='video' || clip.type==='image' || clip.type==='overlay' || clip.type==='pip'){
      this.showVideo(clip);
    } else if(clip.type==='text'){
      this.showText(clip);
      // Also keep video visible underneath
      const videoClip = window.TimelineUI ? TimelineUI.clips.find(c=> (c.type==='video'||c.type==='image') && c.startTime <= clip.startTime && c.startTime+c.duration >= clip.startTime) : null;
      if(videoClip) this.showVideo(videoClip, true);
    } else if(clip.type==='audio'){
      this.showAudio(clip);
    }
  },
  showVideo(clip, isBackground=false){
    if(!this.videoEl) this.videoEl=document.getElementById('realVideo');
    if(!this.videoEl) return;
    if(clip.src){
      if(this.videoEl.src !== clip.src && !isBackground){
        this.videoEl.src = clip.src;
        this.videoEl.load();
        this.videoEl.play().catch(()=>{});
      } else if(!isBackground && this.videoEl.paused){
        this.videoEl.play().catch(()=>{});
      }
      this.videoEl.style.display='block';
      this.videoEl.style.opacity='1';
      // Apply transform
      if(clip.transform && !isBackground){
        const t=clip.transform;
        let tr=` translate(${t.x*3}px, ${t.y*3}px) rotate(${t.rotation||0}deg) scale(${t.scale||1})`;
        if(t.flipX) tr+=' scaleX(-1)';
        if(t.flipY) tr+=' scaleY(-1)';
        this.videoEl.style.transform = tr;
        this.videoEl.style.clipPath = (t.cropLeft||t.cropRight||t.cropTop||t.cropBottom) ? `inset(${t.cropTop||0}% ${t.cropRight||0}% ${t.cropBottom||0}% ${t.cropLeft||0}%)` : 'none';
      }
    } else {
      // No src - show black with name
      this.videoEl.style.display='block';
    }
  },
  showText(clip){
    if(!this.textEl) this.textEl=document.getElementById('textOverlay');
    if(!this.textEl) return;
    this.textEl.style.display='block';
    this.textEl.style.zIndex='9999';
    this.textEl.textContent = clip.text || clip.name || 'Text';
    this.textEl.style.fontSize = (clip.fontSize||32)+'px';
    this.textEl.style.color = clip.fontColor||'#FFF';
    this.textEl.style.fontFamily = clip.fontFamily||'Inter';
    this.textEl.style.fontWeight='600';
    this.textEl.style.background = clip.bgColor && clip.bgColor!=='transparent' ? clip.bgColor : 'transparent';
    this.textEl.style.padding = clip.bgColor && clip.bgColor!=='transparent' ? '6px 14px' : '0';
    this.textEl.style.borderRadius='8px';
    if(clip.transform){
      const t=clip.transform;
      let tr=`translate(-50%,-50%) translate(${t.x*3}px, ${t.y*3}px) rotate(${t.rotation||0}deg) scale(${t.scale||1})`;
      if(t.flipX) tr+=' scaleX(-1)';
      if(t.flipY) tr+=' scaleY(-1)';
      this.textEl.style.transform=tr;
      this.textEl.style.clipPath = (t.cropLeft||t.cropRight||t.cropTop||t.cropBottom) ? `inset(${t.cropTop||0}% ${t.cropRight||0}% ${t.cropBottom||0}% ${t.cropLeft||0}%)` : 'none';
    } else {
      this.textEl.style.transform='translate(-50%,-50%)';
    }
  },
  showAudio(clip){
    // For audio, keep video visible but show audio indicator
    if(this.textEl){
      this.textEl.style.display='block';
      this.textEl.textContent='🔊 '+ (clip.name||'Audio');
      this.textEl.style.fontSize='18px';
      this.textEl.style.color='#4CAF50';
      this.textEl.style.background='rgba(76,175,80,0.2)';
      this.textEl.style.padding='8px 16px';
      this.textEl.style.borderRadius='20px';
      this.textEl.style.transform='translate(-50%,-50%)';
    }
    // Keep video underneath
    const videoClip = window.TimelineUI ? TimelineUI.clips.find(c=> c.type==='video'||c.type==='image') : null;
    if(videoClip) this.showVideo(videoClip, true);
  },
  _hideTextOnly(){
    if(this.textEl) this.textEl.style.display='none';
  },
  _hide(){
    if(this.textEl) this.textEl.style.display='none';
    // Don't hide video - keep last frame
  }
};
window.Renderer=Renderer;
setTimeout(()=>Renderer.init(), 300);
