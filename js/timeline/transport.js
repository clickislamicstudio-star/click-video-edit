
/**
 * Folder: js/timeline/ File: transport.js v3.8 - Fixed Play/Pause + No Autoplay
 */
const Transport = {
  currentTime:0,
  totalDuration:10.4,
  isPlaying:false,
  fps:30,
  pps:80,
  init(){
    console.log('Transport v3.8 - Fixed - No Autoplay - Screenshot Order');
    this.playheadLine=document.getElementById('playheadLine');
    this.rulerWrap=document.getElementById('rulerCanvasWrap');
    this.rulerCanvas=document.getElementById('rulerCanvas');
    this.curTimeEl=document.getElementById('curTime');
    this.totalTimeEl=document.getElementById('totalTime');
    
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
  },
  togglePlay(){
    this.isPlaying=!this.isPlaying;
    const btn=document.getElementById('btnPlayPause');
    if(btn) btn.textContent = this.isPlaying ? '⏸' : '▶';
    const video=document.getElementById('realVideo');
    const status=document.getElementById('status');
    if(video){
      if(this.isPlaying){ 
        video.play().catch(()=>{}); 
        this.startTick(); 
        if(status) status.textContent='Playing - '+ (window.Selection?.selectedClip?.name||'Video');
      } else { 
        video.pause(); 
        this.stopTick(); 
        if(status) status.textContent='Paused - Tap Play to continue';
      }
    }
    EventBus.emit(EventBus.EVENTS.PLAY_PAUSE,{playing:this.isPlaying});
    if(window.AndroidBridge) AndroidBridge.vibrate(30);
  },
  startTick(){
    this.stopTick();
    this.tickInterval=setInterval(()=>{
      this.currentTime+=1/this.fps;
      if(this.currentTime>=this.totalDuration){ this.currentTime=this.totalDuration; this.isPlaying=false; const btn=document.getElementById('btnPlayPause'); if(btn) btn.textContent='▶'; this.stopTick(); return; }
      this.updateTime();
      this.syncPlayhead();
      EventBus.emit(EventBus.EVENTS.PLAYHEAD,{time:this.currentTime});
    }, 1000/this.fps);
  },
  stopTick(){ if(this.tickInterval){ clearInterval(this.tickInterval); this.tickInterval=null; } },
  toggleFullscreen(){
    const area=document.getElementById('playerArea');
    if(!document.fullscreenElement){ area?.requestFullscreen().catch(()=>{}); }
    else { document.exitFullscreen().catch(()=>{}); }
  },
  undo(){ if(window.Store && Store.undo) Store.undo(); console.log('Undo'); },
  redo(){ if(window.Store && Store.redo) Store.redo(); console.log('Redo'); },
  jumpStart(){ this.currentTime=0; this.updateTime(); this.syncPlayhead(); EventBus.emit(EventBus.EVENTS.PLAYHEAD,{time:this.currentTime}); },
  jumpEnd(){ this.currentTime=this.totalDuration; this.updateTime(); this.syncPlayhead(); EventBus.emit(EventBus.EVENTS.PLAYHEAD,{time:this.currentTime}); },
  frameBack(){ this.currentTime=Math.max(0, this.currentTime-1/this.fps); this.updateTime(); this.syncPlayhead(); EventBus.emit(EventBus.EVENTS.PLAYHEAD,{time:this.currentTime}); },
  frameForward(){ this.currentTime=Math.min(this.totalDuration, this.currentTime+1/this.fps); this.updateTime(); this.syncPlayhead(); EventBus.emit(EventBus.EVENTS.PLAYHEAD,{time:this.currentTime}); },
  seekFromClick(e){
    const rect=this.rulerWrap.getBoundingClientRect();
    const x=e.clientX-rect.left+this.rulerWrap.scrollLeft;
    this.currentTime = x/this.pps;
    this.updateTime();
    this.syncPlayhead();
    EventBus.emit(EventBus.EVENTS.PLAYHEAD,{time:this.currentTime});
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
