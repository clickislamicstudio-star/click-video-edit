/**
 * Folder: js/timeline/ File: transport.js v3.9.3 FINAL - Play Button Dead Fix - Master Prompt Compliant
 * FIX: Play button not working because old index.html inline Transport overriding + EventBus null + videoEl null
 * SOLUTION: Standalone logic, no dependency, direct DOM, fallback if EventBus missing, realVideo play with muted=false
 * Icon System: SVG Only, Material 3 Rounded, 20px Timeline Tools, No Emoji
 */

const Transport = {
  currentTime: 0,
  totalDuration: 10.4,
  isPlaying: false,
  fps: 30,
  pps: 80,
  tickInterval: null,
  playheadLine: null,
  rulerWrap: null,
  rulerCanvas: null,
  curTimeEl: null,
  totalTimeEl: null,
  btnPlayPause: null,

  ICONS: {
    play: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>',
    pause: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/></svg>',
    fullscreen: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>',
    undo: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 8L4 12l5 4"/><path d="M4 12h10.5A2.5 2.5 0 0 1 17 14.5v2.5"/></svg>',
    redo: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M15 8l5 4-5 4"/><path d="M20 12H9.5A2.5 2.5 0 0 0 7 14.5v2.5"/></svg>',
    jump_start: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 19L4 12l7-7v-6M20 19L13 12l7-7v-6" transform="translate(0 1)"/></svg>',
    jump_end: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 5l7 7-7 7M4 5l7 7-7 7"/></svg>',
    frame_back: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 18l-7-7 7-7"/></svg>',
    frame_forward: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 6l7 7-7 7"/></svg>'
  },

  init(){
    console.log('Transport v3.9.3 FINAL - Play Dead Fix - Standalone - No Emoji');
    this.playheadLine = document.getElementById('playheadLine');
    this.rulerWrap = document.getElementById('rulerCanvasWrap');
    this.rulerCanvas = document.getElementById('rulerCanvas');
    this.curTimeEl = document.getElementById('curTime');
    this.totalTimeEl = document.getElementById('totalTime');
    this.btnPlayPause = document.getElementById('btnPlayPause');

    if(!this.btnPlayPause){
      console.error('btnPlayPause not found - check index.html id');
      return;
    }

    if(this.playheadLine){
      this.playheadLine.style.height='calc(100vh - 48px - 42vh + 72px + 84px)';
      this.playheadLine.style.background='#0A84FF';
      this.playheadLine.style.width='2px';
      this.playheadLine.style.zIndex='80';
      this.playheadLine.style.pointerEvents='none';
    }

    this.injectIcons();
    this.renderPlayIcon(false);

    // Re-bind with clean listeners - remove old to avoid double
    const clonePlay = this.btnPlayPause.cloneNode(true);
    this.btnPlayPause.parentNode.replaceChild(clonePlay, this.btnPlayPause);
    this.btnPlayPause = document.getElementById('btnPlayPause');

    this.btnPlayPause.addEventListener('click', (e)=>{
      e.preventDefault();
      e.stopPropagation();
      console.log('Play clicked - isPlaying before', this.isPlaying);
      this.togglePlay();
    }, {passive:false});

    ['btnFullscreen','btnUndo','btnRedo','btnJumpStart','btnJumpEnd','btnFrameBack','btnFrameForward'].forEach(id=>{
      const el=document.getElementById(id);
      if(el){
        const c=el.cloneNode(true);
        el.parentNode.replaceChild(c, el);
      }
    });

    document.getElementById('btnFullscreen')?.addEventListener('click', ()=> this.toggleFullscreen());
    document.getElementById('btnUndo')?.addEventListener('click', ()=> this.undo());
    document.getElementById('btnRedo')?.addEventListener('click', ()=> this.redo());
    document.getElementById('btnJumpStart')?.addEventListener('click', ()=> this.jumpStart());
    document.getElementById('btnJumpEnd')?.addEventListener('click', ()=> this.jumpEnd());
    document.getElementById('btnFrameBack')?.addEventListener('click', ()=> this.frameBack());
    document.getElementById('btnFrameForward')?.addEventListener('click', ()=> this.frameForward());

    this.rulerWrap?.addEventListener('scroll', ()=> this.syncPlayhead());
    this.rulerWrap?.addEventListener('click', (e)=> this.seekFromClick(e));

    this.renderRuler();
    this.updateTime();
    this.syncPlayhead();

    // Listen to zoom if exists
    if(window.EventBus){
      try{ EventBus.on(EventBus.EVENTS.TIMELINE_ZOOM, (d)=>{ this.pps=d.pps; this.renderRuler(); this.syncPlayhead(); }); }catch(e){}
    }
    
    console.log('Transport v3.9.3 ready - Play button bound');
  },

  injectIcons(){
    const mapping = {
      'btnFullscreen': this.ICONS.fullscreen,
      'btnUndo': this.ICONS.undo,
      'btnRedo': this.ICONS.redo,
      'btnJumpStart': this.ICONS.jump_start,
      'btnJumpEnd': this.ICONS.jump_end,
      'btnFrameBack': this.ICONS.frame_back,
      'btnFrameForward': this.ICONS.frame_forward
    };
    Object.keys(mapping).forEach(id=>{
      const el = document.getElementById(id);
      if(el){
        el.innerHTML = mapping[id];
        el.style.color='#A0A0A0';
        el.style.display='flex';
        el.style.alignItems='center';
        el.style.justifyContent='center';
      }
    });
  },

  renderPlayIcon(isPlaying){
    if(!this.btnPlayPause) this.btnPlayPause=document.getElementById('btnPlayPause');
    if(!this.btnPlayPause) return;
    this.btnPlayPause.innerHTML = isPlaying ? this.ICONS.pause : this.ICONS.play;
    this.btnPlayPause.style.color = isPlaying ? '#FF3B30' : '#A0A0A0';
    this.btnPlayPause.style.display='flex';
    this.btnPlayPause.style.alignItems='center';
    this.btnPlayPause.style.justifyContent='center';
  },

  togglePlay(){
    this.isPlaying = !this.isPlaying;
    console.log('togglePlay ->', this.isPlaying);
    this.renderPlayIcon(this.isPlaying);
    
    if(this.isPlaying){
      this.startTick();
      try{
        if(window.AudioEngine && AudioEngine.play) AudioEngine.play();
      }catch(e){}
      const v = document.getElementById('realVideo');
      if(v){
        v.muted=false;
        v.volume=1;
        if(v.src) v.play().catch(err=>console.log('video play err', err));
      }
      const pip = document.getElementById('pipVideo');
      if(pip && pip.src) pip.play().catch(()=>{});
    } else {
      this.stopTick();
      try{ if(window.AudioEngine && AudioEngine.pause) AudioEngine.pause(); }catch(e){}
      const v=document.getElementById('realVideo');
      if(v) v.pause();
      const pip=document.getElementById('pipVideo');
      if(pip) pip.pause();
    }
    
    try{
      if(window.EventBus && EventBus.emit) EventBus.emit(EventBus.EVENTS.PLAY_PAUSE, {playing:this.isPlaying});
    }catch(e){}
    
    try{ if(window.AndroidBridge && AndroidBridge.vibrate) AndroidBridge.vibrate(30); }catch(e){}
  },

  startTick(){
    this.stopTick();
    console.log('startTick - fps', this.fps, 'duration', this.totalDuration);
    this.tickInterval = setInterval(()=>{
      this.currentTime += 1/this.fps;
      if(this.currentTime >= this.totalDuration){
        this.currentTime = this.totalDuration;
        this.isPlaying=false;
        this.renderPlayIcon(false);
        this.stopTick();
        try{ if(window.EventBus) EventBus.emit(EventBus.EVENTS.PLAY_PAUSE, {playing:false}); }catch(e){}
        return;
      }
      this.updateTime();
      this.syncPlayhead();
      try{ if(window.EventBus) EventBus.emit(EventBus.EVENTS.PLAYHEAD, {time:this.currentTime}); }catch(e){}
      // Direct video sync even without EventBus - Video Static Blue Moves
      const time=this.currentTime;
      if(window.TimelineUI && TimelineUI.clips){
        const main = TimelineUI.clips.find(c=> (c.type==='video'||c.type==='image') && c.track!==4 && time>=c.startTime && time<=c.startTime+c.duration);
        if(main && main.type==='video'){
          const v=document.getElementById('realVideo');
          if(v && v.src!==main.src){
            v.src=main.src;
            v.load();
          }
        }
      }
    }, 1000/this.fps);
  },

  stopTick(){ if(this.tickInterval){ clearInterval(this.tickInterval); this.tickInterval=null; console.log('stopTick'); } },
  toggleFullscreen(){ const area=document.getElementById('playerArea'); if(!document.fullscreenElement){ area?.requestFullscreen().catch(()=>{});} else { document.exitFullscreen().catch(()=>{});} },
  undo(){ try{ if(window.Store && Store.undo) Store.undo(); }catch(e){} },
  redo(){ try{ if(window.Store && Store.redo) Store.redo(); }catch(e){} },
  jumpStart(){ this.currentTime=0; this.updateTime(); this.syncPlayhead(); try{ if(window.EventBus) EventBus.emit(EventBus.EVENTS.PLAYHEAD,{time:this.currentTime}); }catch(e){} },
  jumpEnd(){ this.currentTime=this.totalDuration; this.updateTime(); this.syncPlayhead(); try{ if(window.EventBus) EventBus.emit(EventBus.EVENTS.PLAYHEAD,{time:this.currentTime}); }catch(e){} },
  frameBack(){ this.currentTime=Math.max(0, this.currentTime-1/this.fps); this.updateTime(); this.syncPlayhead(); try{ if(window.EventBus) EventBus.emit(EventBus.EVENTS.PLAYHEAD,{time:this.currentTime}); }catch(e){} },
  frameForward(){ this.currentTime=Math.min(this.totalDuration, this.currentTime+1/this.fps); this.updateTime(); this.syncPlayhead(); try{ if(window.EventBus) EventBus.emit(EventBus.EVENTS.PLAYHEAD,{time:this.currentTime}); }catch(e){} },
  seekFromClick(e){
    const rect=this.rulerWrap.getBoundingClientRect();
    const x=e.clientX-rect.left+this.rulerWrap.scrollLeft;
    this.currentTime = x/this.pps;
    this.updateTime();
    this.syncPlayhead();
    try{ if(window.EventBus) EventBus.emit(EventBus.EVENTS.PLAYHEAD,{time:this.currentTime}); }catch(e){}
  },
  renderRuler(){
    if(!this.rulerCanvas) return;
    const pps=this.pps||80;
    let html='';
    const totalSecs = Math.max(this.totalDuration, 60);
    for(let i=0;i<totalSecs;i++){
      html+=`<div style="position:absolute;left:${i*pps}px;top:0;bottom:0;border-left:1px solid ${i%5===0?'#3A3A3A':'#2A2A2A'};padding-left:4px;font-size:9px;color:${i%5===0?'#AAA':'#555'};min-width:${pps}px;display:flex;align-items:center">${i%5===0?'00:'+String(i).padStart(2,'0'):''}</div>`;
    }
    this.rulerCanvas.innerHTML=html;
    this.rulerCanvas.style.minWidth=(totalSecs*pps)+'px';
  },
  updateTime(){
    if(!this.curTimeEl) return;
    const secs=Math.floor(this.currentTime);
    const frames=Math.floor((this.currentTime-secs)*this.fps);
    const mm=String(Math.floor(secs/60)).padStart(2,'0');
    const ss=String(secs%60).padStart(2,'0');
    this.curTimeEl.innerHTML=`${mm}:${ss}<sup style="color:#FF3B30;font-size:9px">${String(frames).padStart(2,'0')}</sup>`;
    if(this.totalTimeEl){
      const totalM=Math.floor(this.totalDuration/60);
      const totalS=Math.floor(this.totalDuration%60);
      this.totalTimeEl.textContent=`${String(totalM).padStart(2,'0')}:${String(totalS).padStart(2,'0')}`;
    }
  },
  syncPlayhead(){
    if(!this.playheadLine) return;
    const baseOffset=44+44+64+64;
    const pps=this.pps||80;
    const scroll=this.rulerWrap?this.rulerWrap.scrollLeft:0;
    const x=baseOffset+(this.currentTime*pps)-scroll;
    this.playheadLine.style.left=x+'px';
  }
};

window.Transport=Transport;
// Force init even if previous inline Transport exists - overwrite
setTimeout(()=>{
  console.log('Transport v3.9.3 force init - overriding old');
  if(document.getElementById('transportBar')){
    Transport.init();
  }
}, 600);
setTimeout(()=>{
  if(document.getElementById('transportBar') && (!window.Transport || !Transport.btnPlayPause)){
    Transport.init();
  }
}, 1500);
