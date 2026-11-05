/**
 * Folder: js/timeline/ File: gesture.js v2.2 FINAL - Pinch Not Working Fix - Document Level Binding - Master Prompt Compliant
 * ISSUE: Screenshot shows badge v1.8.7 HOTFIX - All Inline - meaning external zoom-engine.js v2.1 and gesture.js v2.1 not loaded, old inline code overriding
 * FIX: This file self-patches ZoomEngine if old, binds pinch to document + timelineArea + rulerWrap + window, forces 5-300px/s single source
 * Base File Reference: js/timeline/gesture.js + js/timeline/zoom-engine.js from base file7048266801042578919.txt
 * Current Code Preservation: Keeps Play v3.9.3, Transport SVG, Blue Line to Toolbar, No Emoji, Outside Handles, Permission Once
 * Master Prompt: Timeline Layer Single Source - TimelineMath.config.pixelsPerSecond - Decoupled - Kotlin WebView ready
 */

const GestureTool = {
  startDist: 0,
  startPps: 80,
  isPinching: false,
  lastScale: 1,

  init(){
    console.log('GestureTool v2.2 FINAL - Pinch Fix - Document Level - No Emoji - Master Prompt');
    
    // SELF-PATCH ZoomEngine if old inline version - ensure single source 5-300
    if(window.ZoomEngine){
      // Patch missing methods if old inline
      if(!ZoomEngine.handlePinch){
        ZoomEngine.handlePinch = function(s, c){ if(s===0) return; const scale=c/s; if(this.zoomBy) this.zoomBy(scale); else if(this.setZoom) this.setZoom(this.currentPps*scale); };
        console.log('ZoomEngine.handlePinch patched - Base file method restored');
      }
      if(!ZoomEngine.zoomBy){
        ZoomEngine.zoomBy = function(scale){ if(!scale) return; this.setZoom(this.currentPps*scale); };
        console.log('ZoomEngine.zoomBy patched');
      }
      if(!ZoomEngine.setZoom){
        ZoomEngine.setZoom = function(pps){
          pps=Math.max(5, Math.min(300, pps));
          this.currentPps=pps;
          if(window.TimelineMath) TimelineMath.config.pixelsPerSecond=pps;
          if(window.TimelineUI){ TimelineUI.pixelsPerSecond=pps; if(TimelineUI.render) TimelineUI.render(); }
          if(window.Transport){ Transport.pps=pps; if(Transport.renderRuler) Transport.renderRuler(); if(Transport.syncPlayhead) Transport.syncPlayhead(); }
          if(window.EventBus) try{ EventBus.emit(EventBus.EVENTS.TIMELINE_ZOOM,{pps}); }catch(e){}
        };
        console.log('ZoomEngine.setZoom patched - Single source 5-300');
      }
    } else {
      // Create minimal ZoomEngine if completely missing (old index inline failed)
      window.ZoomEngine = {
        minPps:5, maxPps:300, defaultPps:80, currentPps:80,
        setZoom(pps){
          pps=Math.max(5, Math.min(300, pps));
          this.currentPps=pps;
          if(window.TimelineMath) TimelineMath.config.pixelsPerSecond=pps;
          if(window.TimelineUI){ TimelineUI.pixelsPerSecond=pps; TimelineUI.render(); }
          if(window.Transport){ Transport.pps=pps; Transport.renderRuler(); Transport.syncPlayhead(); }
          if(window.EventBus) try{ EventBus.emit(EventBus.EVENTS.TIMELINE_ZOOM,{pps}); }catch(e){}
          console.log('ZoomEngine fallback setZoom', pps);
        },
        zoomBy(scale){ this.setZoom(this.currentPps*scale); },
        handlePinch(s,c){ if(s===0) return; this.zoomBy(c/s); },
        getPps(){ return this.currentPps; }
      };
      console.log('ZoomEngine created fallback - Base file logic');
    }

    // Ensure TimelineMath exists - Base file single source
    if(!window.TimelineMath){
      window.TimelineMath = {
        config:{pixelsPerSecond:80, screenWidth:360},
        timeToPixel(time, scroll){ return (time-scroll)*this.config.pixelsPerSecond; },
        pixelToTime(px, scroll){ return (px/this.config.pixelsPerSecond)+scroll; }
      };
      console.log('TimelineMath created fallback');
    }

    // Bind pinch to MULTIPLE elements - document level to ensure capture
    this.bindAll();

    console.log('GestureTool v2.2 - Ready - Pinch should work now - Try pinch on timelineArea - 5 to 300px/s');
    // Show hint badge
    const info = document.getElementById('status') || document.getElementById('info');
    if(info){
      info.textContent = 'Pinch Fix v2.2 - Try 2 fingers on timeline - 5 to 300px/s';
      setTimeout(()=>{ if(info) info.textContent='Ready - Pinch Fixed - No Emoji'; }, 3000);
    }
  },

  bindAll(){
    // Bind to timelineArea
    const areas = [
      document.getElementById('timelineArea'),
      document.getElementById('rulerCanvasWrap'),
      document.getElementById('transportBar'),
      document.getElementById('playerArea'),
      document.body,
      document.documentElement,
      window,
      document
    ];
    
    areas.forEach((el, idx)=>{
      if(!el || el._pinchBound) return;
      try{
        el.addEventListener('touchstart', (e)=>this.onTouchStart(e), {passive:false, capture:true});
        el.addEventListener('touchmove', (e)=>this.onTouchMove(e), {passive:false, capture:true});
        el.addEventListener('touchend', (e)=>this.onTouchEnd(e), {passive:false, capture:true});
        el.addEventListener('touchcancel', (e)=>this.onTouchEnd(e), {passive:false, capture:true});
        el._pinchBound = true;
        console.log('Pinch bound to', el.id || el.tagName || 'window', idx);
      }catch(err){ console.log('Bind failed for', idx, err); }
    });

    // Wheel zoom for desktop testing - ctrl+wheel
    const timeline = document.getElementById('timelineArea');
    if(timeline && !timeline._wheelBound){
      timeline.addEventListener('wheel', (e)=>{
        if(e.ctrlKey || e.metaKey){
          e.preventDefault();
          const delta = e.deltaY > 0 ? 0.85 : 1.15;
          if(window.ZoomEngine) ZoomEngine.zoomBy(delta);
        }
      }, {passive:false});
      timeline._wheelBound = true;
      console.log('Wheel zoom bound - Ctrl+Wheel to zoom');
    }
  },

  onTouchStart(e){
    if(e.touches && e.touches.length === 2){
      this.isPinching = true;
      this.startDist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      
      if(window.ZoomEngine){
        this.startPps = ZoomEngine.currentPps || ZoomEngine.getPps() || 80;
      } else {
        this.startPps = (window.TimelineUI && TimelineUI.pixelsPerSecond) || 80;
      }
      
      this.lastScale = 1;
      
      console.log('PINCH START - dist', Math.round(this.startDist), 'pps', this.startPps);
      
      // Prevent page zoom/scroll
      try{ e.preventDefault(); }catch(err){}
      e.stopPropagation();
    }
  },

  onTouchMove(e){
    if(e.touches && e.touches.length === 2 && this.isPinching){
      const curDist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      
      if(this.startDist === 0) return;
      
      const scale = curDist / this.startDist;
      
      // Only if changed >1%
      if(Math.abs(scale - this.lastScale) < 0.01) {
        try{ e.preventDefault(); }catch(err){}
        return;
      }
      
      this.lastScale = scale;
      
      const newPps = this.startPps * scale;
      
      console.log('PINCH MOVE - scale', scale.toFixed(3), 'newPps', Math.round(newPps));
      
      // Call ZoomEngine single source
      if(window.ZoomEngine){
        if(ZoomEngine.handlePinch){
          ZoomEngine.handlePinch(this.startDist, curDist);
        } else if(ZoomEngine.zoomBy){
          ZoomEngine.zoomBy(scale);
        } else {
          ZoomEngine.setZoom(newPps);
        }
      }
      
      // Force update UI
      if(window.Transport && Transport.syncPlayhead) Transport.syncPlayhead();
      
      try{ e.preventDefault(); }catch(err){}
      e.stopPropagation();
    }
  },

  onTouchEnd(e){
    if(!e.touches || e.touches.length < 2){
      if(this.isPinching){
        const finalPps = window.ZoomEngine ? ZoomEngine.currentPps : 'unknown';
        console.log('PINCH END - finalPps', finalPps);
        // Show feedback
        const badge = document.getElementById('zoomLevel') || document.getElementById('status');
        if(badge){
          const old = badge.textContent;
          badge.textContent = 'Zoom: ' + Math.round(finalPps) + 'px/s - Pinch OK!';
          setTimeout(()=>{ badge.textContent = old; }, 1500);
        }
      }
      this.isPinching = false;
      this.startDist = 0;
      this.lastScale = 1;
    }
  }
};

window.GestureTool = GestureTool;
window.Gesture = GestureTool;
window.GestureEngine = GestureTool;

// Force init - override old inline Gesture if exists
setTimeout(()=>{
  console.log('GestureTool v2.2 FORCE INIT - Overriding old inline Gesture');
  GestureTool.init();
}, 500);

setTimeout(()=>{
  // Second attempt if first failed
  if(!GestureTool.isPinching && window.ZoomEngine){
    console.log('GestureTool v2.2 Second init - Ensure bound');
    GestureTool.bindAll();
  }
}, 1500);

console.log('GestureTool v2.2 FINAL loaded - Document Level Pinch - ZoomEngine Patched - Play Preserved - No Emoji - Master Prompt');
