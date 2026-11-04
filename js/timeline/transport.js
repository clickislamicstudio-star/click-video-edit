
/**
 * Folder: js/timeline/ File: transport.js v3.7 NEW
 * Transport Bar - Screenshot Order: Play/Pause + Fullscreen | Undo/Redo
 * Second Row: Jump Start | Frame Back | Cur Time 00:01^23 | Total 10:24 | Frame Forward | Jump End | Ruler + Blue Line
 */
const Transport = {
  currentTime:0,
  totalDuration:10.4,
  isPlaying:false,
  fps:30,
  pps:80,
  init(){
    console.log('Transport v3.7 init - Screenshot order');
    this.playheadLine=document.getElementById('playheadLine');
    this.rulerWrap=document.getElementById('rulerCanvasWrap');
    this.rulerCanvas=document.getElementById('rulerCanvas');
    this.curTimeEl=document.getElementById('curTime');
    this.totalTimeEl=document.getElementById('totalTime');
    
    // Bind buttons - Screenshot order
    document.getElementById('btnPlayPause')?.addEventListener('click', ()=> this.togglePlay());
    document.getElementById('btnFullscreen')?.addEventListener('click', ()=> this.toggleFullscreen());
    document.getElementById('btnUndo')?.addEventListener('click', ()=> this.undo());
    document.getElementById('btnRedo')?.addEventListener('click', ()=> this.redo());
    document.getElementById('btnJumpStart')?.addEventListener('click', ()=> this.jumpStart());
    document.getElementById('btnJumpEnd')?.addEventListener('click', ()=> this.jumpEnd());
    document.getElementById('btnFrameBack')?.addEventListener('click', ()=> this.frameBack());
    document.getElementById('btnFrameForward')?.addEventListener('click', ()=> this.frameForward());
    
    // Ruler drag
    this.rulerWrap?.addEventListener('scroll', ()=> this.syncPlayhead());
    this.rulerWrap?.addEventListener('click', (e)=> this.seekFromClick(e));
    
    this.renderRuler();
    this.updateTime();
    this.syncPlayhead();
    
    if(window.EventBus){
      EventBus.on(EventBus.EVENTS.TIMELINE_ZOOM, (d)=>{ this.pps=d.pps; this.renderRuler(); this.syncPlayhead(); });
    }
    
    // Keyboard
    document.addEventListener('keydown', (e)=>{
      if(e.code==='Space'){ e.preventDefault(); this.togglePlay(); }
    });
  },
  togglePlay(){
    this.isPlaying=!this.isPlaying;
    const btn=document.getElementById('btnPlayPause');
    if(btn) btn.textContent = this.isPlaying ? '⏸' : '▶';
    const video=document.getElementById('realVideo');
    if(video){
      if(this.isPlaying){ video.play().catch(()=>{}); this.startTick(); }
      else { video.pause(); this.stopTick(); }
    }
    EventBus.emit(EventBus.EVENTS.PLAY_PAUSE,{playing:this.isPlaying});
  },
  startTick(){
    this.stopTick();
    this.tickInterval=setInterval(()=>{
      this.currentTime+=1/this.fps;
      if(this.currentTime>=this.totalDuration) this.currentTime=0;
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
  undo(){ console.log('Undo - Coming soon'); },
  redo(){ console.log('Redo - Coming soon'); },
  jumpStart(){ this.currentTime=0; this.updateTime(); this.syncPlayhead(); },
  jumpEnd(){ this.currentTime=this.totalDuration; this.updateTime(); this.syncPlayhead(); },
  frameBack(){ this.currentTime=Math.max(0, this.currentTime-1/this.fps); this.updateTime(); this.syncPlayhead(); },
  frameForward(){ this.currentTime=Math.min(this.totalDuration, this.currentTime+1/this.fps); this.updateTime(); this.syncPlayhead(); },
  seekFromClick(e){
    const rect=this.rulerWrap.getBoundingClientRect();
    const x=e.clientX-rect.left+this.rulerWrap.scrollLeft;
    this.currentTime = x/this.pps;
    this.updateTime();
    this.syncPlayhead();
  },
  renderRuler(){
    if(!this.rulerCanvas) return;
    const pps=this.pps||80;
    let html='';
    const totalSecs = Math.max(this.totalDuration, 30);
    for(let i=0;i<totalSecs;i++){
      html+=`<div class="rulerMark" style="left:${i*pps}px;width:${pps}px">${i===0?0:''}${i%5===0?'00:'+String(i).padStart(2,'0'):''}</div>`;
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
    // Playhead position: left offset = Jump buttons width (44*2 + 64*2) + currentTime*pps - scrollLeft
    const baseOffset = 44+44+64+64; // 216px approx for buttons
    const pps=this.pps||80;
    const scroll = this.rulerWrap ? this.rulerWrap.scrollLeft : 0;
    const x = baseOffset + (this.currentTime*pps) - scroll;
    this.playheadLine.style.left = x+'px';
    // Sync timeline scroll
    if(window.TimelineUI && TimelineUI.container){
      // Optional: sync horizontal scroll
    }
  }
};
window.Transport=Transport;
