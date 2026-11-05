/**
 * Folder: js/timeline/ File: transport.js v3.9.2 FINAL - Master Prompt Compliant - No Emoji - SVG Material 3 Rounded Fixed
 * FIX 1: □ Empty squares removed -> Real M3 Rounded SVG inline - No dependency on wrong IconSystem names
 * FIX 2: Play/Pause functionality restored - tick loop fixed - video static, blue moves
 * FIX 3: Permission once compatible, PIP no black compatible
 * Icon System: SVG Only, Material 3 Rounded, 24x24 default, Timeline Tools 20px, Active #FF3B30 Inactive #A0A0A0, No PNG, No Emoji
 * Master Prompt: Separate UI/Timeline/Selection/Toolbar/Rendering/Export - Decoupled for Kotlin WebView
 */

const Transport = {
  currentTime: 0,
  totalDuration: 10.4,
  isPlaying: false,
  fps: 30,
  pps: 80,
  tickInterval: null,

  // Material 3 Rounded SVG Icons - Inline - No Emoji - 20px Timeline Tools
  ICONS: {
    play: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z" rx="2"/></svg>',
    pause: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/></svg>',
    fullscreen: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>',
    undo: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 8L4 12l5 4"/><path d="M4 12h10.5A2.5 2.5 0 0 1 17 14.5v2.5"/></svg>',
    redo: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 8l5 4-5 4"/><path d="M20 12H9.5A2.5 2.5 0 0 0 7 14.5v2.5"/></svg>',
    jump_start: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 17L11 12l7-5v10zM11 17L4 12l7-5v10z"/></svg>',
    jump_end: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 7l7 5-7 5V7zM13 7l7 5-7 5V7z"/></svg>',
    frame_back: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>',
    frame_forward: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>'
  },

  init(){
    console.log('Transport v3.9.2 FINAL - No Emoji - Real SVG M3 Rounded - Play/Pause Fixed');
    this.playheadLine = document.getElementById('playheadLine');
    this.rulerWrap = document.getElementById('rulerCanvasWrap');
    this.rulerCanvas = document.getElementById('rulerCanvas');
    this.curTimeEl = document.getElementById('curTime');
    this.totalTimeEl = document.getElementById('totalTime');
    this.btnPlayPause = document.getElementById('btnPlayPause');

    if(this.playheadLine){
      this.playheadLine.style.height='calc(100vh - 48px - 42vh + 72px + 84px)';
      this.playheadLine.style.top='0';
      this.playheadLine.style.background='#0A84FF';
      this.playheadLine.style.width='2px';
      this.playheadLine.style.zIndex='80';
      this.playheadLine.style.pointerEvents='none';
      this.playheadLine.style.boxShadow='0 0 6px rgba(10,132,255,0.6)';
    }

    // Force inject SVG icons - overwrite any □ squares
    this.injectIcons();

    document.getElementById('btnPlayPause')?.addEventListener('click', ()=> this.togglePlay());
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
    this.renderPlayIcon(false);

    if(window.EventBus){
      EventBus.on(EventBus.EVENTS.TIMELINE_ZOOM, (d)=>{ this.pps=d.pps; this.renderRuler(); this.syncPlayhead(); });
    }
  },

  injectIcons(){
    const mapping = {
      'btnPlayPause': this.ICONS.play,
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
      if(!el) return;
      // Always overwrite to remove □ squares
      if(id==='btnPlayPause'){
        // will be handled by renderPlayIcon
        return;
      }
      el.innerHTML = mapping[id];
      el.style.color = '#A0A0A0';
      el.style.display='flex';
      el.style.alignItems='center';
      el.style.justifyContent='center';
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
    console.log('Transport togglePlay', this.isPlaying);
    this.renderPlayIcon(this.isPlaying);
    if(this.isPlaying){
      this.startTick();
      if(window.AudioEngine) AudioEngine.play();
      const v = document.getElementById('realVideo');
      if(v && v.src) { v.muted=false; v.play().catch(()=>{}); }
    } else {
      this.stopTick();
      if(window.AudioEngine) AudioEngine.pause();
      const v = document.getElementById('realVideo');
      if(v) v.pause();
    }
    if(window.EventBus) EventBus.emit(EventBus.EVENTS.PLAY_PAUSE, {playing:this.isPlaying});
  },

  startTick(){
    this.stopTick();
    this.tickInterval = setInterval(()=>{
      this.currentTime += 1/this.fps;
      if(this.currentTime >= this.totalDuration){
        this.currentTime = this.totalDuration;
        this.isPlaying=false;
        this.renderPlayIcon(false);
        this.stopTick();
        if(window.EventBus) EventBus.emit(EventBus.EVENTS.PLAY_PAUSE, {playing:false});
        return;
      }
      this.updateTime();
      this.syncPlayhead();
      if(window.EventBus) EventBus.emit(EventBus.EVENTS.PLAYHEAD, {time:this.currentTime});
    }, 1000/this.fps);
  },

  stopTick(){ if(this.tickInterval){ clearInterval(this.tickInterval); this.tickInterval=null; } },
  toggleFullscreen(){ const area=document.getElementById('playerArea'); if(!document.fullscreenElement){ area?.requestFullscreen().catch(()=>{});} else { document.exitFullscreen().catch(()=>{});} },
  undo(){ if(window.Store && Store.undo) Store.undo(); else if(window.Store && Store.dispatch) Store.dispatch({type:'UNDO'}); },
  redo(){ if(window.Store && Store.redo) Store.redo(); else if(window.Store && Store.dispatch) Store.dispatch({type:'REDO'}); },
  jumpStart(){ this.currentTime=0; this.updateTime(); this.syncPlayhead(); if(window.EventBus) EventBus.emit(EventBus.EVENTS.PLAYHEAD,{time:this.currentTime}); },
  jumpEnd(){ this.currentTime=this.totalDuration; this.updateTime(); this.syncPlayhead(); if(window.EventBus) EventBus.emit(EventBus.EVENTS.PLAYHEAD,{time:this.currentTime}); },
  frameBack(){ this.currentTime=Math.max(0, this.currentTime-1/this.fps); this.updateTime(); this.syncPlayhead(); if(window.EventBus) EventBus.emit(EventBus.EVENTS.PLAYHEAD,{time:this.currentTime}); },
  frameForward(){ this.currentTime=Math.min(this.totalDuration, this.currentTime+1/this.fps); this.updateTime(); this.syncPlayhead(); if(window.EventBus) EventBus.emit(EventBus.EVENTS.PLAYHEAD,{time:this.currentTime}); },
  seekFromClick(e){
    const rect=this.rulerWrap.getBoundingClientRect();
    const x=e.clientX-rect.left+this.rulerWrap.scrollLeft;
    this.currentTime = x/this.pps;
    this.updateTime();
    this.syncPlayhead();
    if(window.EventBus) EventBus.emit(EventBus.EVENTS.PLAYHEAD,{time:this.currentTime});
  },
  renderRuler(){
    if(!this.rulerCanvas) return;
    const pps=this.pps||80;
    let html='';
    const totalSecs = Math.max(this.totalDuration, 60);
    for(let i=0;i<totalSecs;i++){
      html+=`<div style="position:absolute;left:${i*pps}px;top:0;bottom:0;border-left:1px solid ${i%5===0?'#3A3A3A':'#2A2A2A'};padding-left:4px;font-size:9px;color:${i%5===0?'#AAA':'#555'};min-width:${pps}px;display:flex;align-items:center;font-family:monospace">${i%5===0?'00:'+String(i).padStart(2,'0'):''}</div>`;
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
    const baseOffset = 44+44+64+64;
    const pps=this.pps||80;
    const scroll = this.rulerWrap ? this.rulerWrap.scrollLeft : 0;
    const x = baseOffset + (this.currentTime*pps) - scroll;
    this.playheadLine.style.left = x+'px';
  }
};
window.Transport=Transport;
setTimeout(()=>{ if(document.getElementById('transportBar')) Transport.init(); }, 400);
