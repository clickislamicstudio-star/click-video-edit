/**
 * Folder: js/timeline/ File: transport.js v3.9.1 FINAL - No Emoji - SVG Only - Master Prompt Compliant
 * FIX: Pause ⏸ emoji removed -> SVG Material 3 Rounded
 * Icon System: SVG Only, Material 3 Rounded, 24x24 default, Timeline Tools 20px, Active #FF3B30 Inactive #A0A0A0, RTL Mirroring
 * Architecture: Timeline Layer -> EventBus -> Rendering Layer -> Export Layer Ready for Kotlin WebView
 * Blueprint: Transport 72px - Row1 Play/Pause + Fullscreen + Undo/Redo, Row2 Jump Start, Frame Back, Time, Total, Frame Forward, Jump End + Ruler + Blue Line to Toolbar #0A84FF 2px
 * UX: Video Static, Blue Moves - No Emoji
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

  init(){
    console.log('Transport v3.9.1 FINAL - No Emoji - SVG Only - Master Prompt Compliant - Edit First Compatible');
    
    this.playheadLine = document.getElementById('playheadLine');
    this.rulerWrap = document.getElementById('rulerCanvasWrap');
    this.rulerCanvas = document.getElementById('rulerCanvas');
    this.curTimeEl = document.getElementById('curTime');
    this.totalTimeEl = document.getElementById('totalTime');
    this.btnPlayPause = document.getElementById('btnPlayPause');

    // Blue line to toolbar - thin #0A84FF 2px - from ruler to main toolbar - Master Prompt compliant
    if(this.playheadLine){
      this.playheadLine.style.height = 'calc(100vh - 48px - 42vh + 72px + 84px)';
      this.playheadLine.style.top = '0';
      this.playheadLine.style.bottom = 'auto';
      this.playheadLine.style.zIndex = '80';
      this.playheadLine.style.background = '#0A84FF';
      this.playheadLine.style.width = '2px';
      this.playheadLine.style.boxShadow = '0 0 6px rgba(10,132,255,0.6)';
      this.playheadLine.style.pointerEvents = 'none';
    }

    // Ensure SVG icons - No Emoji - Material 3 Rounded
    this.renderPlayIcon(false);

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

    if(window.EventBus){
      EventBus.on(EventBus.EVENTS.TIMELINE_ZOOM, (d)=>{ this.pps=d.pps; this.renderRuler(); this.syncPlayhead(); });
    }

    document.addEventListener('keydown', (e)=>{
      if(e.code==='Space'){ e.preventDefault(); this.togglePlay(); }
      if(e.code==='ArrowLeft'){ e.preventDefault(); this.frameBack(); }
      if(e.code==='ArrowRight'){ e.preventDefault(); this.frameForward(); }
    });

    // Render other transport icons to SVG if they are emoji - Master Prompt fix
    this.ensureAllIconsSVG();
  },

  ensureAllIconsSVG(){
    // Fix all transport buttons to use IconSystem SVG - No Emoji - Material 3 Rounded
    const map = {
      'btnFullscreen': 'fullscreen',
      'btnUndo': 'undo',
      'btnRedo': 'redo',
      'btnJumpStart': 'jump_start',
      'btnJumpEnd': 'jump_end',
      'btnFrameBack': 'frame_back',
      'btnFrameForward': 'frame_forward'
    };
    Object.keys(map).forEach(id=>{
      const el = document.getElementById(id);
      if(!el) return;
      const text = el.textContent.trim();
      // If emoji or single char, replace with SVG
      if(text.length<=2 || /[⏸▶⏮⏭◀▶↩↪⛶]/.test(text)){
        const iconName = map[id];
        // Use IconSystem if available, else inline SVG fallback Material 3 Rounded
        if(window.IconSystem && IconSystem.render){
          el.innerHTML = IconSystem.render(iconName, false, 20);
        } else {
          // Fallback inline SVG - Material 3 Rounded style
          const svgMap = {
            'fullscreen': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>',
            'undo': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 8L4 12l5 4"/><path d="M4 12h10.5A2.5 2.5 0 0 1 17 14.5v3"/></svg>',
            'redo': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 8l5 4-5 4"/><path d="M20 12H9.5A2.5 2.5 0 0 0 7 14.5v3"/></svg>',
            'jump_start': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 19l-7-7 7-7"/><path d="M20 19l-7-7 7-7"/><path d="M20 5v14"/></svg>',
            'jump_end': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 5l7 7-7 7"/><path d="M4 5l7 7-7 7"/><path d="M4 19V5"/></svg>',
            'frame_back': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 19l-7-7 7-7"/><path d="M20 12H4"/></svg>',
            'frame_forward': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 5l7 7-7 7"/><path d="M4 12h16"/></svg>'
          };
          if(svgMap[iconName]) el.innerHTML = svgMap[iconName];
        }
        el.style.color = '#A0A0A0';
      }
    });
  },

  renderPlayIcon(isPlaying){
    if(!this.btnPlayPause) this.btnPlayPause = document.getElementById('btnPlayPause');
    if(!this.btnPlayPause) return;
    
    // SVG Only - Material 3 Rounded - 20px - No Emoji - Master Prompt
    if(isPlaying){
      // Pause Icon SVG Material 3 Rounded
      if(window.IconSystem && IconSystem.render){
        this.btnPlayPause.innerHTML = IconSystem.render('pause', false, 20);
      } else {
        this.btnPlayPause.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
      }
    } else {
      // Play Icon SVG Material 3 Rounded
      if(window.IconSystem && IconSystem.render){
        this.btnPlayPause.innerHTML = IconSystem.render('play', false, 20);
      } else {
        this.btnPlayPause.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5.14v14l11-7-11-7z"/></svg>';
      }
    }
    this.btnPlayPause.style.color = '#A0A0A0';
  },

  togglePlay(){
    this.isPlaying = !this.isPlaying;
    this.renderPlayIcon(this.isPlaying);
    
    if(window.AudioEngine){
      if(this.isPlaying) AudioEngine.play();
      else AudioEngine.pause();
    }
    
    if(this.isPlaying){ this.startTick(); }
    else { this.stopTick(); }
    
    if(window.EventBus) EventBus.emit(EventBus.EVENTS.PLAY_PAUSE, {playing:this.isPlaying});
    if(window.AndroidBridge) AndroidBridge.vibrate(30);
  },

  startTick(){
    this.stopTick();
    this.tickInterval = setInterval(()=>{
      this.currentTime += 1/this.fps;
      if(this.currentTime >= this.totalDuration){
        this.currentTime = this.totalDuration;
        this.isPlaying = false;
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

  toggleFullscreen(){
    const area=document.getElementById('playerArea');
    if(!document.fullscreenElement){ area?.requestFullscreen().catch(()=>{}); }
    else { document.exitFullscreen().catch(()=>{}); }
  },

  undo(){ if(window.Store && Store.undo) Store.undo(); },
  redo(){ if(window.Store && Store.redo) Store.redo(); },
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
      html+=`<div style="position:absolute;left:${i*pps}px;top:0;bottom:0;border-left:1px solid ${i%5===0?'#444':'#2A2A2A'};padding-left:3px;font-size:9px;color:${i%5===0?'#AAA':'#555'};min-width:${pps}px;display:flex;align-items:center">${i%5===0?'00:'+String(i).padStart(2,'0'):''}</div>`;
    }
    this.rulerCanvas.innerHTML=html;
    this.rulerCanvas.style.minWidth = (totalSecs*pps)+'px';
  },

  updateTime(){
    if(!this.curTimeEl) return;
    const secs=Math.floor(this.currentTime);
    const frames=Math.floor((this.currentTime-secs)*this.fps);
    const mm=String(Math.floor(secs/60)).padStart(2,'0');
    const ss=String(secs%60).padStart(2,'0');
    this.curTimeEl.innerHTML=`${mm}:${ss}<sup>${String(frames).padStart(2,'0')}</sup>`;
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
// Auto init after DOM
setTimeout(()=>{ if(document.getElementById('transportBar')) Transport.init(); }, 500);
