const TimelineUI = {
  container:null, canvas:null, ctx:null, pixelsPerSecond:80, scrollOffset:-1.5, currentTime:0, trackHeight:48, rulerHeight:28,
  tracks:[{id:0,name:'V1',type:'video'},{id:1,name:'V2',type:'video'},{id:3,name:'Text',type:'text'},{id:5,name:'A1',type:'audio'},{id:6,name:'A2',type:'audio'}],
  clips:[], selectedClip:null, snapLine:null,
  init(containerId='timelineArea'){
    this.container=document.getElementById(containerId); if(!this.container) return;
    this.container.innerHTML=''; this.canvas=document.createElement('canvas'); this.canvas.style.width='100%'; this.canvas.style.height='100%'; this.canvas.style.touchAction='none'; this.container.appendChild(this.canvas);
    this.ctx=this.canvas.getContext('2d'); this._resize();
    if(window.TimelineMath) this.pixelsPerSecond=TimelineMath.getPps();
    this._bindEvents();
    if(window.EventBus){ EventBus.on(EventBus.EVENTS.TIMELINE_ZOOM,(data)=>{ this.pixelsPerSecond=data.pps; this.render(); }); }
    window.addEventListener('resize',()=>this._resize());
    this.render();
  },
  _resize(){ const dpr=window.devicePixelRatio||1; const rect=this.container.getBoundingClientRect(); this.canvas.width=rect.width*dpr; this.canvas.height=rect.height*dpr; this.ctx.setTransform(dpr,0,0,dpr,0,0); this.width=rect.width; this.height=rect.height; this.render(); },
  _bindEvents(){
    let startX=0,startScroll=0,isPanning=false;
    const getX=(e)=> (e.touches?e.touches[0].clientX:e.clientX);
    this.canvas.addEventListener('touchstart',(e)=>{ const clip=this._hitTestClip(getX(e),e.touches[0].clientY); if(clip){ if(window.Gesture) Gesture.onTouchStart(e,clip); } else { isPanning=true; startX=getX(e); startScroll=this.scrollOffset; } }, {passive:false});
    this.canvas.addEventListener('touchmove',(e)=>{ const clip=window.Gesture?.currentClip; if(clip&&Gesture.isDragging){ Gesture.onTouchMove(e,clip); } else if(isPanning){ const deltaX=getX(e)-startX; this.scrollOffset=startScroll - deltaX/this.pixelsPerSecond; this.render(); e.preventDefault(); } }, {passive:false});
    this.canvas.addEventListener('touchend',(e)=>{ const clip=window.Gesture?.currentClip; if(clip) Gesture.onTouchEnd(e,clip); isPanning=false; this.snapLine=null; });
    this.canvas.addEventListener('mousedown',(e)=>{ const clip=this._hitTestClip(e.clientX,e.clientY); if(clip){ Gesture.onTouchStart(e,clip); } else { isPanning=true; startX=e.clientX; startScroll=this.scrollOffset; if(window.Selection) Selection.deselectAll(); } });
    this.canvas.addEventListener('mousemove',(e)=>{ const clip=window.Gesture?.currentClip; if(clip&&Gesture.isDragging) Gesture.onTouchMove(e,clip); else if(isPanning){ const dx=e.clientX-startX; this.scrollOffset=startScroll - dx/this.pixelsPerSecond; this.render(); } });
    this.canvas.addEventListener('mouseup',(e)=>{ const clip=window.Gesture?.currentClip; if(clip) Gesture.onTouchEnd(e,clip); isPanning=false; });
  },
  _hitTestClip(clientX,clientY){
    const rect=this.canvas.getBoundingClientRect(); const x=clientX-rect.left; const y=clientY-rect.top;
    const trackIndex=Math.floor((y-this.rulerHeight)/this.trackHeight); if(trackIndex<0||trackIndex>=this.tracks.length) return null;
    const track=this.tracks[trackIndex]; const time=this.scrollOffset + x/this.pixelsPerSecond;
    for(const clip of this.clips){ if(clip.track!==track.id) continue; if(time>=clip.startTime && time<=clip.endTime) return clip; } return null;
  },
  setZoom(pps){ this.pixelsPerSecond=pps; if(window.TimelineMath) TimelineMath.setPps(pps); this.render(); },
  addClip(clipData){ const clip=clipData instanceof Clip ? clipData : new Clip(clipData); this.clips.push(clip); if(window.Timeline) Timeline.clips.push(clip); this.render(); return clip; },
  render(){
    if(!this.ctx) return; const ctx=this.ctx,w=this.width,h=this.height;
    ctx.clearRect(0,0,w,h); ctx.fillStyle='#1E1E1E'; ctx.fillRect(0,0,w,h);
    this._drawRuler();
    this.tracks.forEach((track,idx)=>{ const y=this.rulerHeight+idx*this.trackHeight; this._drawTrack(track,y); });
    this.clips.forEach(clip=> this._drawClip(clip));
    if(this.snapLine) this._drawSnapLine(this.snapLine);
    this._drawPlayhead();
  },
  _drawRuler(){
    const ctx=this.ctx; ctx.fillStyle='#121212'; ctx.fillRect(0,0,this.width,this.rulerHeight); ctx.strokeStyle='#2A2A2A'; ctx.beginPath(); ctx.moveTo(0,this.rulerHeight); ctx.lineTo(this.width,this.rulerHeight); ctx.stroke();
    const startTime=Math.floor(this.scrollOffset); const endTime=Math.ceil(this.scrollOffset+this.width/this.pixelsPerSecond);
    ctx.fillStyle='#8E8E93'; ctx.font='10px monospace'; ctx.textAlign='left';
    for(let t=startTime;t<=endTime;t++){ const x=(t-this.scrollOffset)*this.pixelsPerSecond; if(x<0||x>this.width) continue; ctx.strokeStyle=t%5===0?'#3A3A3C':'#2A2A2A'; ctx.beginPath(); ctx.moveTo(x,t%5===0?4:10); ctx.lineTo(x,this.rulerHeight); ctx.stroke(); if(t%1===0){ const m=Math.floor(t/60); const s=t%60; const label=`${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`; ctx.fillText(label,x+4,18); } }
    ctx.fillStyle='#FF3B30'; ctx.font='9px monospace'; ctx.textAlign='right'; ctx.fillText(`${Math.round(this.pixelsPerSecond)}px/s`,this.width-8,18);
  },
  _drawTrack(track,y){
    const ctx=this.ctx; ctx.fillStyle=track.id%2===0?'#1E1E1E':'#1C1C1E'; ctx.fillRect(0,y,this.width,this.trackHeight);
    ctx.fillStyle='#8E8E93'; ctx.font='11px Inter'; ctx.textAlign='left'; ctx.fillText(track.name,8,y+this.trackHeight/2+4);
    ctx.strokeStyle='#2A2A2A'; ctx.beginPath(); ctx.moveTo(0,y+this.trackHeight); ctx.lineTo(this.width,y+this.trackHeight); ctx.stroke();
  },
  _drawClip(clip){
    const ctx=this.ctx; const trackIndex=this.tracks.findIndex(t=>t.id===clip.track); if(trackIndex<0) return;
    const y=this.rulerHeight+trackIndex*this.trackHeight+4; const h=this.trackHeight-8;
    const x=(clip.startTime-this.scrollOffset)*this.pixelsPerSecond; const w=clip.duration*this.pixelsPerSecond;
    if(x+w<0||x>this.width) return;
    ctx.shadowColor='rgba(0,0,0,0.3)'; ctx.shadowBlur=6; ctx.shadowOffsetY=2;
    ctx.fillStyle=clip.isSelected?clip.color:clip.color+'DD';
    const r=6; ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r); ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath(); ctx.fill();
    ctx.shadowColor='transparent';
    if(clip.isSelected){
      ctx.strokeStyle='#FF3B30'; ctx.lineWidth=2; ctx.stroke();
      ctx.fillStyle='#FFFFFF'; const handleW=10; ctx.beginPath(); ctx.roundRect(x-2,y,handleW,h,[6,0,0,6]); ctx.fill(); ctx.beginPath(); ctx.roundRect(x+w-handleW+2,y,handleW,h,[0,6,6,0]); ctx.fill();
      ctx.fillStyle='#8E8E93'; ctx.fillRect(x+3,y+h/2-6,2,12); ctx.fillRect(x+6,y+h/2-6,2,12); ctx.fillRect(x+w-8,y+h/2-6,2,12); ctx.fillRect(x+w-5,y+h/2-6,2,12);
    }
    ctx.fillStyle='#FFFFFF'; ctx.font=`${clip.isSelected?'700':'500'} 11px Inter`; ctx.textAlign='left'; ctx.fillText(clip.getDisplayName(), x+(clip.isSelected?14:8), y+16);
    ctx.font='9px monospace'; ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.fillText(clip.duration.toFixed(1)+'s', x+8, y+h-6);
    if(clip.type==='audio'){
      ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=1; ctx.beginPath();
      for(let i=0;i<w;i+=4){ const amp=Math.sin(i*0.2)*(h*0.3)+Math.random()*4; ctx.moveTo(x+i,y+h/2-amp/2); ctx.lineTo(x+i,y+h/2+amp/2); }
      ctx.stroke();
    }
  },
  _drawSnapLine(snap){
    const ctx=this.ctx; const x=(snap.snapTime-this.scrollOffset)*this.pixelsPerSecond;
    ctx.strokeStyle='#FF3B30'; ctx.lineWidth=1; ctx.setLineDash([4,4]); ctx.beginPath(); ctx.moveTo(x,this.rulerHeight); ctx.lineTo(x,this.height); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='#FF3B30'; ctx.fillRect(x-24,this.rulerHeight,48,14); ctx.fillStyle='#FFF'; ctx.font='8px monospace'; ctx.textAlign='center'; ctx.fillText('SNAP',x,this.rulerHeight+10);
  },
  _drawPlayhead(){
    const ctx=this.ctx; const centerX=this.width/2; const timeAtCenter=this.scrollOffset+centerX/this.pixelsPerSecond; this.currentTime=timeAtCenter;
    ctx.strokeStyle='#FF3B30'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(centerX,0); ctx.lineTo(centerX,this.height); ctx.stroke();
    ctx.fillStyle='#FF3B30'; ctx.beginPath(); ctx.moveTo(centerX-8,0); ctx.lineTo(centerX+8,0); ctx.lineTo(centerX,12); ctx.closePath(); ctx.fill();
    const m=Math.floor(timeAtCenter/60); const s=Math.floor(timeAtCenter%60); const ms=Math.floor((timeAtCenter%1)*10);
    ctx.fillStyle='#FF3B30'; ctx.font='10px monospace'; ctx.textAlign='center'; ctx.fillText(`${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}.${ms}`,centerX,this.rulerHeight-8);
  }
};
window.TimelineUI = TimelineUI;
