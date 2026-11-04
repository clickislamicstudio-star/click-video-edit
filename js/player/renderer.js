
/**
 * Folder: js/player/ File: renderer.js v3.9 FINAL - PIP No Black + Audio Unmute + No Emoji - Master Prompt
 */
const Renderer = {
  videoEl:null, pipEl:null, textEl:null, emptyHint:null, currentClip:null,
  init(){
    this.videoEl=document.getElementById('realVideo');
    this.pipEl=document.getElementById('pipVideo');
    this.textEl=document.getElementById('textOverlay');
    this.emptyHint=document.getElementById('emptyHint');
    console.log('Renderer v3.9 FINAL - PIP No Black + Audio Unmute - No Emoji');
    if(this.videoEl){
      this.videoEl.style.display='block';
      this.videoEl.muted=false;
      this.videoEl.loop=false;
      this.videoEl.autoplay=false;
      this.videoEl.playsInline=true;
      this.videoEl.pause();
    }
    if(this.pipEl){
      this.pipEl.style.display='none';
      this.pipEl.muted=true;
      this.pipEl.loop=false;
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
      EventBus.on(EventBus.EVENTS.PLAY_PAUSE, (d)=>{
        if(d.playing){ this.videoEl?.play().catch(()=>{}); this.pipEl?.play().catch(()=>{}); }
        else { this.videoEl?.pause(); this.pipEl?.pause(); }
      });
      EventBus.on(EventBus.EVENTS.PLAYHEAD, (d)=>{
        if(!window.TimelineUI) return;
        const time=d.time;
        const mainVideo = TimelineUI.clips.find(c=> (c.type==='video'||c.type==='image') && c.track!==4 && time>=c.startTime && time<=c.startTime+c.duration);
        if(mainVideo && this.videoEl && mainVideo.type==='video'){
          if(this.videoEl.src!==mainVideo.src){ this.videoEl.src=mainVideo.src; this.videoEl.load(); }
          const rel=time-mainVideo.startTime;
          if(Math.abs(this.videoEl.currentTime-rel)>0.3) this.videoEl.currentTime=rel;
        }
        const pipClip = TimelineUI.clips.find(c=> (c.type==='pip'||c.type==='overlay'||c.track===4) && time>=c.startTime && time<=c.startTime+c.duration);
        if(pipClip && this.pipEl){
          if(pipClip.type==='video' || pipClip.type==='pip'){
            if(this.pipEl.src!==pipClip.src){ this.pipEl.src=pipClip.src; this.pipEl.load(); }
            this.pipEl.style.display='block';
          }
        } else if(this.pipEl){
          this.pipEl.style.display='none';
        }
      });
    }
  },
  showClip(clip){
    if(!clip) return;
    this.currentClip=clip;
    if(this.emptyHint) this.emptyHint.style.display='none';
    const st=document.getElementById('status');
    if(st) st.textContent = 'Selected: '+clip.name+' ('+clip.type+') - '+(clip.type==='pip'?'PIP Overlay - No Black':'Paused - Audio Ready');
    
    if(clip.type==='video' || clip.type==='image'){
      this.showVideo(clip);
      if(this.pipEl) this.pipEl.style.display='none';
    } else if(clip.type==='pip' || clip.type==='overlay'){
      const mainVideo = window.TimelineUI ? TimelineUI.clips.find(c=> (c.type==='video'||c.type==='image') && c.track!==4) : null;
      if(mainVideo){
        this.showVideo(mainVideo, true);
        if(st) st.textContent='Main: '+mainVideo.name+' + PIP: '+clip.name+' - No Black';
      }
      if(clip.type==='image' || (clip.src && clip.src.includes('image'))){
        this.showPIPImage(clip);
      } else {
        this.showPIPVideo(clip);
      }
    } else if(clip.type==='text'){
      this.showText(clip);
      const under = window.TimelineUI ? TimelineUI.clips.find(c=> (c.type==='video'||c.type==='image') && c.track!==4) : null;
      if(under) this.showVideo(under, true);
      else { if(this.videoEl) this.videoEl.style.display='none'; }
    } else if(clip.type==='audio'){
      this._hideTextOnly();
      const videoClip = window.TimelineUI ? TimelineUI.clips.find(c=> c.type==='video'||c.type==='image') : null;
      if(videoClip) this.showVideo(videoClip, true);
      else if(this.videoEl) this.videoEl.style.display='none';
      if(window.AudioEngine) AudioEngine.loadClip(clip);
    }
  },
  showVideo(clip, isBackground=false){
    if(!this.videoEl) this.videoEl=document.getElementById('realVideo');
    if(!this.videoEl) return;
    if(clip.src){
      if(this.videoEl.src !== clip.src){
        this.videoEl.src = clip.src;
        this.videoEl.load();
        this.videoEl.pause();
      }
      this.videoEl.style.display='block';
      this.videoEl.style.opacity='1';
      this.videoEl.muted=false;
      if(clip.transform && !isBackground){
        const t=clip.transform;
        let tr=`translate(${t.x*3}px, ${t.y*3}px) rotate(${t.rotation||0}deg) scale(${t.scale||1})`;
        if(t.flipX) tr+=' scaleX(-1)';
        this.videoEl.style.transform = tr;
      }
    }
  },
  showPIPVideo(clip){
    if(!this.pipEl) this.pipEl=document.getElementById('pipVideo');
    if(!this.pipEl) return;
    if(clip.src){
      if(this.pipEl.src!==clip.src){
        this.pipEl.src=clip.src;
        this.pipEl.load();
        this.pipEl.pause();
      }
      this.pipEl.style.display='block';
    }
  },
  showPIPImage(clip){
    let img=document.getElementById('pipImageOverlay');
    if(!img){
      img=document.createElement('img');
      img.id='pipImageOverlay';
      img.style.cssText='position:absolute;right:10px;bottom:10px;width:40%;aspect-ratio:9/16;object-fit:cover;border-radius:8px;border:2px solid #FFF;z-index:12';
      document.getElementById('playerWrap')?.appendChild(img);
    }
    img.src=clip.src;
    img.style.display='block';
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
    if(clip.transform){
      const t=clip.transform;
      this.textEl.style.transform=`translate(-50%,-50%) translate(${t.x*3}px, ${t.y*3}px) rotate(${t.rotation||0}deg) scale(${t.scale||1})`;
    } else {
      this.textEl.style.transform='translate(-50%,-50%)';
    }
  },
  _hideTextOnly(){ if(this.textEl) this.textEl.style.display='none'; const img=document.getElementById('pipImageOverlay'); if(img) img.style.display='none'; },
};
window.Renderer=Renderer;
setTimeout(()=>Renderer.init(), 200);
