
/**
 * Folder: js/player/ File: renderer.js v3.7
 * Fix: Video always visible, No Audio icon on canvas (professional)
 */
const Renderer = {
  videoEl:null, textEl:null, wrapEl:null, emptyHint:null,
  currentClip:null,
  init(){
    this.videoEl=document.getElementById('realVideo');
    this.textEl=document.getElementById('textOverlay');
    this.wrapEl=document.getElementById('playerWrap');
    this.emptyHint=document.getElementById('emptyHint');
    console.log('Renderer v3.7 - No Audio Icon - Video Fixed');
    if(this.videoEl){
      this.videoEl.style.display='block';
      this.videoEl.muted=true;
      this.videoEl.loop=true;
      this.videoEl.playsInline=true;
      this.videoEl.autoplay=false;
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
      EventBus.on(EventBus.EVENTS.PLAYHEAD, (data)=>{ if(this.currentClip) this._syncVideoTime(data.time); });
    }
  },
  showClip(clip){
    if(!clip) return;
    this.currentClip = clip;
    console.log('Renderer showClip v3.7', clip.type, clip.name);
    if(this.emptyHint) this.emptyHint.style.display='none';
    const st=document.getElementById('status');
    if(st) st.textContent = 'Selected: '+clip.name+' ('+clip.type+')';

    if(clip.type==='video' || clip.type==='image' || clip.type==='overlay'){
      this.showVideo(clip);
    } else if(clip.type==='text'){
      this.showText(clip);
      // Keep underlying video visible
      const underlying = window.TimelineUI ? TimelineUI.clips.find(c=> (c.type==='video'||c.type==='image') && c.startTime <= clip.startTime && c.startTime+c.duration >= clip.startTime) : null;
      if(underlying && underlying.id!==clip.id) this.showVideo(underlying, true);
    } else if(clip.type==='audio'){
      // FIX: No audio icon on canvas - professional behavior
      this._hideTextOnly();
      // Keep video underneath if exists
      const videoClip = window.TimelineUI ? TimelineUI.clips.find(c=> c.type==='video'||c.type==='image') : null;
      if(videoClip) this.showVideo(videoClip, true);
      else {
        if(this.videoEl) this.videoEl.style.display='none';
        if(this.emptyHint){ this.emptyHint.style.display='flex'; this.emptyHint.innerHTML='<div style="font-size:18px;color:#4CAF50">🔊 '+clip.name+'</div><span style="font-size:10px;color:#666">Audio in timeline</span>'; }
      }
    }
  },
  showVideo(clip, isBackground=false){
    if(!this.videoEl) this.videoEl=document.getElementById('realVideo');
    if(!this.videoEl) return;
    if(clip.src){
      const isSame = this.videoEl.src === clip.src;
      if(!isSame && !isBackground){
        this.videoEl.src = clip.src;
        this.videoEl.load();
        // Don't autoplay - wait for transport play button
        if(window.Player && Player.isPlaying) this.videoEl.play().catch(()=>{});
      }
      this.videoEl.style.display='block';
      this.videoEl.style.opacity='1';
      if(clip.transform && !isBackground){
        const t=clip.transform;
        let tr=`translate(${t.x*3}px, ${t.y*3}px) rotate(${t.rotation||0}deg) scale(${t.scale||1})`;
        if(t.flipX) tr+=' scaleX(-1)';
        if(t.flipY) tr+=' scaleY(-1)';
        this.videoEl.style.transform = tr;
        this.videoEl.style.clipPath = (t.cropLeft||t.cropRight||t.cropTop||t.cropBottom) ? `inset(${t.cropTop||0}% ${t.cropRight||0}% ${t.cropBottom||0}% ${t.cropLeft||0}%)` : 'none';
      }
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
    this.textEl.style.fontWeight='700';
    this.textEl.style.background = clip.bgColor && clip.bgColor!=='transparent' ? clip.bgColor : 'transparent';
    this.textEl.style.padding = clip.bgColor && clip.bgColor!=='transparent' ? '6px 14px' : '0';
    this.textEl.style.borderRadius='8px';
    // Template styles
    if(clip.template){
      const templates = window.TextTool ? TextTool.templates : [];
      const tmpl = templates.find(t=>t.id===clip.template);
      if(tmpl && tmpl.style){
        // Apply template CSS via style attribute parsing is complex - simplified
      }
    }
    if(clip.fontColor && clip.fontColor.includes('gradient')){
      this.textEl.style.background = clip.fontColor;
      this.textEl.style.webkitBackgroundClip='text';
      this.textEl.style.backgroundClip='text';
      this.textEl.style.webkitTextFillColor='transparent';
      this.textEl.style.color='transparent';
    } else {
      this.textEl.style.backgroundClip='initial';
      this.textEl.style.webkitBackgroundClip='initial';
      this.textEl.style.webkitTextFillColor='initial';
    }
    if(clip.transform){
      const t=clip.transform;
      let tr=`translate(-50%,-50%) translate(${t.x*3}px, ${t.y*3}px) rotate(${t.rotation||0}deg) scale(${t.scale||1})`;
      if(t.flipX) tr+=' scaleX(-1)';
      if(t.flipY) tr+=' scaleY(-1)';
      this.textEl.style.transform=tr;
    } else {
      this.textEl.style.transform='translate(-50%,-50%)';
    }
  },
  _syncVideoTime(time){
    // Sync video to timeline playhead if needed
  },
  _hideTextOnly(){
    if(this.textEl) this.textEl.style.display='none';
  },
  _hide(){
    this._hideTextOnly();
  },
  _forceShow(clip){
    this.showClip(clip);
  }
};
window.Renderer=Renderer;
setTimeout(()=>Renderer.init(), 200);
