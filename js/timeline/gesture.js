const Gesture = {
  isDragging: false, dragType: null, startX:0, startY:0, startTime:0, startDuration:0, startOffset:0, longPressTimer:null, currentClip:null, hasLongPressed:false,
  onTouchStart(e, clip) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    this.startX=clientX; this.startTime=clip.startTime; this.startDuration=clip.duration; this.startOffset=clip.sourceOffset||0; this.currentClip=clip; this.isDragging=false; this.hasLongPressed=false;
    const handle=this._hitTestHandles(e,clip);
    if(handle){ this.dragType=handle; this.isDragging=true; this.hasLongPressed=true; return; }
    clearTimeout(this.longPressTimer);
    this.longPressTimer=setTimeout(()=>{ this.hasLongPressed=true; this.isDragging=true; this.dragType='move'; if(navigator.vibrate) navigator.vibrate(50); },300);
  },
  onTouchMove(e, clip){
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX=clientX-this.startX;
    if(!this.hasLongPressed && Math.abs(deltaX)>10){ clearTimeout(this.longPressTimer); return; }
    if(!this.isDragging||!this.hasLongPressed) return;
    e.preventDefault();
    const deltaTime=deltaX/TimelineMath.getPps();
    if(this.dragType==='move'){
      let newStart=this.startTime+deltaTime;
      if(window.SnapEngine && window.TimelineUI){ const snap=SnapEngine.check({...clip,startTime:newStart},TimelineUI.clips,TimelineUI.currentTime||0); if(snap){ newStart=snap.snapTime; TimelineUI.snapLine=snap; } else TimelineUI.snapLine=null; }
      if(newStart<0) newStart=0; clip.startTime=newStart; if(window.TimelineUI) TimelineUI.render();
    } else if(this.dragType==='trim-start'){
      let newOffset=this.startOffset+deltaTime; let newStart=this.startTime+deltaTime; let newDuration=this.startDuration-deltaTime;
      if(newOffset<0){ newDuration+=newOffset; newOffset=0; } if(newDuration<0.3) newDuration=0.3; clip.sourceOffset=newOffset; clip.startTime=newStart; clip.duration=newDuration; if(window.TimelineUI) TimelineUI.render();
    } else if(this.dragType==='trim-end'){
      let newDuration=this.startDuration+deltaTime; if(newDuration<0.3) newDuration=0.3; if(clip.originalDuration && (clip.sourceOffset+newDuration)>clip.originalDuration) newDuration=clip.originalDuration-clip.sourceOffset; clip.duration=newDuration; if(window.TimelineUI) TimelineUI.render();
    }
  },
  onTouchEnd(e,clip){
    clearTimeout(this.longPressTimer);
    if(this.isDragging){ if(window.TimelineUI){ TimelineUI.snapLine=null; TimelineUI.render(); } if(window.Store) Store.dispatch({type:'MOVE_CLIP',payload:{id:clip.id,startTime:clip.startTime,duration:clip.duration}}); }
    else { if(window.Selection) Selection.selectClip(clip); }
    this.isDragging=false; this.dragType=null; this.currentClip=null; this.hasLongPressed=false;
  },
  _hitTestHandles(e,clip){
    if(!window.TimelineUI||!window.TimelineMath) return null;
    const rect=e.target?.getBoundingClientRect?.()||{left:0}; const clientX=e.touches?e.touches[0].clientX:e.clientX;
    const scroll=TimelineUI.scrollOffset||0; const clipStartPx=TimelineMath.timeToPixel(clip.startTime,scroll); const clipEndPx=TimelineMath.timeToPixel(clip.endTime,scroll); const x=clientX-rect.left;
    const handleWidth=16; if(Math.abs(x-clipStartPx)<handleWidth) return 'trim-start'; if(Math.abs(x-clipEndPx)<handleWidth) return 'trim-end'; return null;
  }
};
window.Gesture = Gesture;
