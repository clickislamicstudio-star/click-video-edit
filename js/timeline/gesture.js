/**
 * Folder: js/timeline/ File: gesture.js v2.3 FINAL - Pinch Chain Backup - Base + Current Merged
 */
const GestureTool = {
  startDist:0, startPps:80, isPinching:false, lastScale:1,
  init(){
    const els=[document.getElementById('timelineArea'), document.getElementById('rulerCanvasWrap'), document.body, document];
    els.forEach(el=>{
      if(!el || el._pinchBackup) return;
      el.addEventListener('touchstart', (e)=>this.onTouchStart(e), {passive:false});
      el.addEventListener('touchmove', (e)=>this.onTouchMove(e), {passive:false});
      el.addEventListener('touchend', (e)=>this.onTouchEnd(e), {passive:false});
      el._pinchBackup=true;
    });
    console.log('GestureTool v2.3 - Document Level Backup Pinch - Ready');
  },
  onTouchStart(e){
    if(e.touches.length===2){
      this.isPinching=true;
      this.startDist=Math.hypot(e.touches[0].pageX-e.touches[1].pageX, e.touches[0].pageY-e.touches[1].pageY);
      this.startPps=window.ZoomEngine?ZoomEngine.currentPps:80;
      this.lastScale=1;
      console.log('PINCH START Backup', this.startDist);
      e.preventDefault();
    }
  },
  onTouchMove(e){
    if(e.touches.length===2 && this.isPinching){
      const curDist=Math.hypot(e.touches[0].pageX-e.touches[1].pageX, e.touches[0].pageY-e.touches[1].pageY);
      const scale=curDist/this.startDist;
      if(Math.abs(scale-this.lastScale)<0.01) return;
      this.lastScale=scale;
      if(window.ZoomEngine) ZoomEngine.handlePinch(this.startDist, curDist);
      e.preventDefault();
    }
  },
  onTouchEnd(e){ if(e.touches.length<2) this.isPinching=false; }
};
window.GestureTool=GestureTool;
window.Gesture=GestureTool;
