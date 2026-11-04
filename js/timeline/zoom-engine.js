
window.ZoomEngine={
  init(){},
  zoomIn(){ if(window.TimelineUI){ TimelineUI.pixelsPerSecond=Math.min(300, TimelineUI.pixelsPerSecond*1.25); if(window.Transport) Transport.pps=TimelineUI.pixelsPerSecond; Transport.renderRuler(); Transport.syncPlayhead(); TimelineUI.render(); } },
  zoomOut(){ if(window.TimelineUI){ TimelineUI.pixelsPerSecond=Math.max(15, TimelineUI.pixelsPerSecond/1.25); if(window.Transport) Transport.pps=TimelineUI.pixelsPerSecond; Transport.renderRuler(); Transport.syncPlayhead(); TimelineUI.render(); } }
};
