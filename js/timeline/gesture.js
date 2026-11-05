
/**
 * Folder: js/timeline/ File: gesture.js v2.2 FINAL - Pinch Fix - Document Level Binding - One Function Fix
 * Master Prompt Compliant - No Emoji - Base File Logic Preserved
 */
const GestureTool = {
  startDist:0, startPps:80, isPinching:false, lastScale:1,
  init(){
    const els=[document.getElementById('timelineArea'), document.getElementById('rulerCanvasWrap'), document.body, document, window];
    els.forEach(el=>{
      if(!el || el._pinchBoundV22) return;
      el.addEventListener('touchstart', (e)=>this.onTouchStart(e), {passive:false});
      el.addEventListener('touchmove', (e)=>this.onTouchMove(e), {passive:false});
      el.addEventListener('touchend', (e)=>this.onTouchEnd(e), {passive:false});
      el._pinchBoundV22=true;
    });
  },
  onTouchStart(e){
    if(e.touches.length===2){
      this.isPinching=true;
      this.startDist=Math.hypot(e.touches[0].pageX-e.touches[1].pageX, e.touches[0].pageY-e.touches[1].pageY);
      this.startPps=window.ZoomEngine?ZoomEngine.currentPps:80;
      this.lastScale=1;
      console.log('PINCH START', this.startDist, this.startPps);
      e.preventDefault();
    }
  },
  onTouchMove(e){
    if(e.touches.length===2 && this.isPinching){
      const curDist=Math.hypot(e.touches[0].pageX-e.touches[1].pageX, e.touches[0].pageY-e.touches[1].pageY);
      const scale=curDist/this.startDist;
      if(Math.abs(scale-this.lastScale)<0.01) return;
      this.lastScale=scale;
      console.log('PINCH MOVE', scale.toFixed(2));
      if(window.ZoomEngine) ZoomEngine.handlePinch(this.startDist, curDist);
      e.preventDefault();
    }
  },
  onTouchEnd(e){ if(e.touches.length<2) this.isPinching=false; }
};
window.GestureTool=GestureTool;
window.Gesture=GestureTool;
setTimeout(()=>GestureTool.init(), 600);
