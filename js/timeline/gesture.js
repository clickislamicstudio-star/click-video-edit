
/**
 * Folder: js/timeline/ File: gesture.js v3.9 FINAL - Pinch Zoom 5-300 - No Emoji
 */
const GestureTool={
  init(){
    console.log('GestureTool v3.9 FINAL - Pinch Zoom 5-300px/s - No Emoji');
    this.container=document.getElementById('timelineArea');
    if(!this.container) return;
    let startDist=0;
    let startPps=80;
    let isPinching=false;
    
    this.container.addEventListener('touchstart', (e)=>{
      if(e.touches.length===2){
        isPinching=true;
        startDist=Math.hypot(e.touches[0].pageX-e.touches[1].pageX, e.touches[0].pageY-e.touches[1].pageY);
        startPps=window.ZoomEngine ? ZoomEngine.currentPps : (window.TimelineUI? TimelineUI.pixelsPerSecond:80);
        e.preventDefault();
      }
    }, {passive:false});
    
    this.container.addEventListener('touchmove', (e)=>{
      if(e.touches.length===2 && isPinching){
        const curDist=Math.hypot(e.touches[0].pageX-e.touches[1].pageX, e.touches[0].pageY-e.touches[1].pageY);
        const scale=curDist/startDist;
        if(window.ZoomEngine){
          ZoomEngine.setZoom(startPps*scale);
        }
        e.preventDefault();
      }
    }, {passive:false});
    
    this.container.addEventListener('touchend', (e)=>{
      if(e.touches.length<2) isPinching=false;
    });
  }
};
window.GestureTool=GestureTool;
window.Gesture=GestureTool;
setTimeout(()=>GestureTool.init(), 800);
