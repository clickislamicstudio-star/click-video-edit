
/**
 * Renderer v3.6.2 - Fixed Video + Text Display - CapCut Style
 * - Video always visible when clip selected
 * - Text overlay forced visible
 * - Transform applied
 */
const Renderer = {
  videoEl: null,
  textEl: null,
  wrapEl: null,
  init(){
    this.videoEl = document.getElementById('realVideo');
    this.textEl = document.getElementById('textOverlay');
    this.wrapEl = document.getElementById('playerWrap');
    console.log('Renderer v3.6.2 init', !!this.videoEl, !!this.textEl);
    if(this.textEl){
      this.textEl.style.display='none';
      this.textEl.style.position='absolute';
      this.textEl.style.left='50%';
      this.textEl.style.top='50%';
      this.textEl.style.transform='translate(-50%,-50%)';
      this.textEl.style.zIndex='9999';
      this.textEl.style.pointerEvents='none';
      this.textEl.style.textAlign='center';
      this.textEl.style.maxWidth='90%';
    }
    // Listen for clip selection
    if(window.EventBus){
      EventBus.on(EventBus.EVENTS.CLIP_SELECTED, (clip)=> this.showClip(clip));
      EventBus.on(EventBus.EVENTS.CLIP_DESELECTED, ()=> this._hide());
    }
  },
  showClip(clip){
    if(!clip) return;
    console.log('Renderer showClip', clip.type, clip.name);
    if(clip.type==='video' || clip.type==='image' || !clip.type){
      this.showVideo(clip);
    } else if(clip.type==='text'){
      this.showText(clip);
    }
    // Hide import btn when any clip exists
    const btn=document.getElementById('importBtn');
    if(btn) btn.classList.add('hidden');
  },
  showVideo(clip){
    if(!this.videoEl) this.videoEl=document.getElementById('realVideo');
    if(!this.videoEl) return;
    if(clip.src){
      if(this.videoEl.src !== clip.src){
        this.videoEl.src = clip.src;
        this.videoEl.load();
      }
      this.videoEl.style.display='block';
      this.videoEl.style.width='100%';
      this.videoEl.style.height='100%';
      this.videoEl.style.objectFit='contain';
      // Auto play preview
      this.videoEl.currentTime = 0;
      this.videoEl.play().catch(()=>{});
      // Apply transform if any
      if(clip.transform){
        const t=clip.transform;
        let tr=` translate(${t.x*5}px, ${t.y*5}px) rotate(${t.rotation||0}deg) scale(${t.scale||1})`;
        if(t.flipX) tr+=' scaleX(-1)';
        if(t.flipY) tr+=' scaleY(-1)';
        this.videoEl.style.transform = tr;
        this.videoEl.style.clipPath = (t.cropLeft||t.cropRight||t.cropTop||t.cropBottom) ? `inset(${t.cropTop||0}% ${t.cropRight||0}% ${t.cropBottom||0}% ${t.cropLeft||0}%)` : 'none';
      }
    } else {
      // No src but clip exists - show placeholder color
      this.videoEl.style.display='block';
      this.videoEl.style.background='#111';
    }
    // Hide text if showing video
    if(clip.type!=='text' && this.textEl){
      // Keep text hidden if not text clip, unless other text clips overlap? For now hide
      // Don't hide if there's a text clip at same time - but simple logic: hide
      if(window.TimelineUI){
        const hasTextAtPlayhead = TimelineUI.clips.some(c=>c.type==='text' && c.startTime <= (window.Player?.currentTime||0) && c.startTime+c.duration >= (window.Player?.currentTime||0));
        if(!hasTextAtPlayhead) this.textEl.style.display='none';
      }
    }
  },
  showText(clip){
    if(!this.textEl) this.textEl=document.getElementById('textOverlay');
    if(!this.textEl) return;
    this.textEl.style.display='block';
    this.textEl.style.zIndex='9999';
    this.textEl.textContent = clip.text || clip.name || 'Text';
    this.textEl.style.fontSize = (clip.fontSize||36)+'px';
    this.textEl.style.color = clip.fontColor||'#FFFFFF';
    this.textEl.style.fontFamily = clip.fontFamily||'Inter';
    this.textEl.style.left='50%';
    this.textEl.style.top= clip.transform ? '50%' : '50%';
    // Handle background
    if(clip.bgColor && clip.bgColor!=='transparent'){
      this.textEl.style.background=clip.bgColor;
      this.textEl.style.padding='6px 14px';
      this.textEl.style.borderRadius='8px';
    } else {
      this.textEl.style.background='transparent';
      this.textEl.style.padding='0';
    }
    // Transform
    if(clip.transform){
      const t=clip.transform;
      let tr=`translate(-50%,-50%) translate(${t.x*5}px, ${t.y*5}px) rotate(${t.rotation||0}deg) scale(${t.scale||1})`;
      if(t.flipX) tr+=' scaleX(-1)';
      if(t.flipY) tr+=' scaleY(-1)';
      this.textEl.style.transform=tr;
      this.textEl.style.clipPath = (t.cropLeft||t.cropRight||t.cropTop||t.cropBottom) ? `inset(${t.cropTop||0}% ${t.cropRight||0}% ${t.cropBottom||0}% ${t.cropLeft||0}%)` : 'none';
    } else {
      this.textEl.style.transform='translate(-50%,-50%)';
    }
    // Show video underneath if exists
    if(this.videoEl && this.videoEl.src){
      this.videoEl.style.display='block';
    }
    // Force visible even when editor open
    this.textEl.style.opacity='1';
    this.textEl.style.visibility='visible';
  },
  _hide(){
    // Don't hide video completely, keep last frame
    if(this.textEl) this.textEl.style.display='none';
  },
  _hideAll(){
    if(this.videoEl) this.videoEl.style.display='none';
    if(this.textEl) this.textEl.style.display='none';
  }
};
window.Renderer=Renderer;
setTimeout(()=>Renderer.init(), 500);
