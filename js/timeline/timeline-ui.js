/**
 * Folder: js/timeline/ File: timeline-ui.js v3.9.1 FINAL - Pinch Visual Zoom Fix - Base + Current Merged - One Function Fix - Master Prompt Compliant
 * Base File Reference: js/timeline/timeline-ui.js v2.0 FINAL Professional CapCut Style from file7048266801042578919.txt
 *   Formula: screenX = (time - scrollOffset) * pps, formatTime MM:SS, drawRuler majorStep/minorStep/labelStep based on pps
 * Current Code Preservation: Keeps Play v3.9.3, Transport SVG, Blue Line to Toolbar, Outside Bottom Handles < >, Permission Once, Audio Fix, No Emoji
 * Master Prompt Compliance: Timeline Layer - Single Source pps via ZoomEngine - Decoupled - Kotlin WebView ready
 * Fixes:
 * 1. Pinch detected (76px/s - Pinch OK!) but red clip not visually zooming because track-content min-width not set to totalDuration*pps
 * 2. Base file had canvas rendering with width/height, current uses div track-content with absolute positioned clips - needs min-width
 * 3. Ensures left = startTime * pps, width = duration * pps, and parent track-content expands
 * 4. Keeps outside bottom handles < > white box as per 4th reference image
 */

const TimelineUI = {
  clips:[],
  pixelsPerSecond:80,
  container:null,
  scrollOffset: -2,
  trackHeight:45,
  tracks:['V1','V2','Text','A1','A2'],

  init(id){
    this.container=document.getElementById(id||'timelineArea');
    if(!this.container) return;
    console.log('TimelineUI v3.9.1 FINAL - Pinch Visual Zoom Fix - Outside Bottom Handles - No Emoji - Master Prompt');
    if(window.ZoomEngine) this.pixelsPerSecond=ZoomEngine.currentPps;
    if(window.Transport) this.pixelsPerSecond=Transport.pps;
    if(window.TimelineMath) this.pixelsPerSecond=TimelineMath.config.pixelsPerSecond;
    this.render();
  },

  getNextStartTime(track){
    let relevant;
    if(track===1) relevant=this.clips.filter(c=> (c.type==='video'||c.type==='image') && c.track!==4);
    else if(track===2) relevant=this.clips.filter(c=> c.type==='audio');
    else if(track===3) relevant=this.clips.filter(c=> c.type==='text');
    else if(track===4) relevant=this.clips.filter(c=> c.type==='pip'||c.type==='overlay'||c.track===4);
    else relevant=this.clips.filter(c=>c.track===track);
    if(!relevant||relevant.length===0) return 0;
    return Math.max(...relevant.map(c=>c.startTime+c.duration));
  },

  setZoom(pps){
    // Called by ZoomEngine - Base file compatibility
    this.pixelsPerSecond = pps;
    this.render();
  },

  timeToPixel(time){
    return (time - this.scrollOffset) * this.pixelsPerSecond;
  },

  pixelToTime(pixel){
    return (pixel / this.pixelsPerSecond) + this.scrollOffset;
  },

  formatTime(seconds){
    if(seconds < 0) seconds = 0;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    const mm = mins.toString().padStart(2,'0');
    const ss = secs.toString().padStart(2,'0');
    if(this.pixelsPerSecond > 150){
      const msStr = ms.toString().padStart(2,'0');
      return `${mm}:${ss}^${msStr}`;
    }
    return `${mm}:${ss}`;
  },

  addClip(clip){
    this.clips.push(clip);
    this.render();
  },

  clearAll(){
    this.clips=[];
    this.render();
  },

  render(){
    if(!this.container) this.container=document.getElementById('timelineArea');
    if(!this.container) return;
    const pps=this.pixelsPerSecond||80;
    const maxTime = this.clips.length ? Math.max(...this.clips.map(c=>c.startTime+c.duration)) : 10.4;
    if(window.Transport){
      Transport.totalDuration=Math.max(maxTime,10.4);
      if(Transport.renderRuler) Transport.renderRuler();
      if(Transport.syncPlayhead) Transport.syncPlayhead();
    }
    
    // CRITICAL FIX: track-content min-width = total duration * pps - this was missing causing pinch not visually zooming
    const totalWidth = Math.max(maxTime * pps + 200, (window.innerWidth||360) * 1.5);
    
    const tracks=[
      {id:1,name:'Media',cls:'Media',desc:'video+photo',icon:'M'},
      {id:2,name:'Audio',cls:'Audio',desc:'BGM',icon:'A'},
      {id:3,name:'Text',cls:'Text',desc:'auto',icon:'T'},
      {id:4,name:'PIP',cls:'PIP',desc:'overlay',icon:'P'}
    ];
    
    let html='<div style="display:flex;flex-direction:column;width:100%;">';
    
    tracks.forEach(tr=>{
      let filtered=[];
      if(tr.name==='Media'){
        filtered=this.clips.filter(c=> (c.type==='video'||c.type==='image') && c.track!==4);
      } else if(tr.name==='Audio'){
        filtered=this.clips.filter(c=> c.type==='audio');
      } else if(tr.name==='Text'){
        filtered=this.clips.filter(c=> c.type==='text');
      } else if(tr.name==='PIP'){
        const hasVideo = this.clips.some(c=> c.type==='video'||c.type==='image');
        if(!hasVideo) filtered=[];
        else filtered=this.clips.filter(c=> c.type==='pip'||c.type==='overlay'||c.track===4);
      }
      
      // FIX: set min-width on track-content so clips can expand when pps increases - this was root cause of pinch not showing
      html+=`<div class="track-row ${tr.cls}" data-track="${tr.id}"><div class="track-label"><span style="font-size:10px;font-weight:800">${tr.icon}</span><span>${tr.name}</span><span class="type">${tr.desc}</span></div><div class="track-content" data-content-track="${tr.id}" style="min-width:${totalWidth}px;position:relative;height:100%;">`;
      
      filtered.forEach(c=>{
        const left=c.startTime*pps;
        const width=Math.max(40, c.duration*pps);
        const selected = window.Selection && Selection.selectedClip && Selection.selectedClip.id===c.id;
        let bg='#FF3B30';
        if(c.type==='image') bg='#FF9500';
        if(c.type==='pip'||c.type==='overlay') bg='#5AC8FA';
        if(c.type==='text') bg='#5856D6';
        if(c.type==='audio') bg='#2C2C2E';
        
        let inner='';
        if(c.type==='audio'){
          const bars = c.waveform ? c.waveform.map(h=>`<div style="width:2px;height:${h}%;background:${selected?'#FFF':'#0A84FF'};border-radius:1px;opacity:${selected?1:0.9}"></div>`).join('') : Array.from({length: Math.floor(width/4)}).map(()=>`<div style="width:2px;height:${8+Math.random()*80}%;background:${selected?'#FFF':'#0A84FF'};border-radius:1px"></div>`).join('');
          inner=`<div style="display:flex;align-items:center;gap:3px;height:100%;width:100%"><div style="flex:1;display:flex;align-items:center;gap:1.5px;height:18px;overflow:hidden">${bars}</div><span style="font-size:8px;background:rgba(0,0,0,0.5);padding:1px 4px;border-radius:6px;margin-left:auto">${Math.floor(c.duration)}s</span></div>`;
        } else {
          inner=`<div style="display:flex;align-items:center;height:100%;width:100%;position:relative"><div style="width:100%;height:80%;background:linear-gradient(90deg, ${bg}22, ${bg}44);border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:8px;color:#FFF;font-weight:600">${c.type==='image'?'IMG':c.type==='pip'?'PIP':c.type==='text'?'TXT':'VID'}</div><span style="position:absolute;top:2px;right:4px;font-size:7px;background:rgba(0,0,0,0.6);padding:1px 3px;border-radius:4px">00:${String(Math.floor(c.duration)).padStart(2,'0')}</span></div>`;
        }
        
        // Outside bottom handles < > white box - as per 4th reference image - Master Prompt
        const cornerHandle = selected ? `
          <div data-trim="left" style="position:absolute;left:-10px;top:50%;transform:translateY(-50%);width:20px;height:28px;background:#FFF;border-radius:8px 0 0 8px;display:flex;align-items:center;justify-content:center;color:#000;font-size:14px;font-weight:800;box-shadow:0 2px 8px rgba(0,0,0,0.5);cursor:ew-resize;z-index:10;border:1px solid #E5E5EA"><</div>
          <div data-trim="right" style="position:absolute;right:-10px;top:50%;transform:translateY(-50%);width:20px;height:28px;background:#FFF;border-radius:0 8px 8px 0;display:flex;align-items:center;justify-content:center;color:#000;font-size:14px;font-weight:800;box-shadow:0 2px 8px rgba(0,0,0,0.5);cursor:ew-resize;z-index:10;border:1px solid #E5E5EA">></div>
        ` : '';
        
        html+=`<div data-clip-id="${c.id}" title="${c.name} - Outside bottom handle - Trim drag" style="position:absolute;left:${left}px;width:${width}px;top:4px;bottom:4px;background:${bg};border-radius:6px;display:flex;align-items:center;padding:0 6px;color:#FFF;cursor:pointer;overflow:visible;${selected?'border:2px solid #0A84FF;box-shadow:0 0 0 2px rgba(10,132,255,0.3);z-index:5':''}">${inner}${cornerHandle}</div>`;
      });
      
      if(tr.name==='PIP' && filtered.length===0){
        const hasVideo = this.clips.some(c=> c.type==='video'||c.type==='image');
        if(!hasVideo){
          html+=`<div style="position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:9px;color:#555">Add video to enable PIP</div>`;
        }
      }
      
      html+='</div></div>';
    });
    
    html+='</div>';
    this.container.innerHTML=html;
    
    // Bind clip selection and trim handles
    this.container.querySelectorAll('[data-clip-id]').forEach(el=>{
      el.addEventListener('click', (e)=>{
        e.stopPropagation();
        const id=el.dataset.clipId;
        const clip=this.clips.find(c=>c.id===id);
        if(clip){
          if(window.Selection) Selection.selectClip(clip);
          if(window.AndroidBridge) AndroidBridge.vibrate(30);
        }
      });
      const leftHandle=el.querySelector('[data-trim="left"]');
      const rightHandle=el.querySelector('[data-trim="right"]');
      if(leftHandle){
        leftHandle.addEventListener('pointerdown', (e)=>{
          e.stopPropagation(); e.preventDefault();
          const startX=e.clientX;
          const clipId=el.dataset.clipId;
          const clip=TimelineUI.clips.find(c=>c.id===clipId);
          if(!clip) return;
          const startTime=clip.startTime;
          const startDuration=clip.duration;
          const onMove=(ev)=>{
            const dx=(ev.clientX-startX)/TimelineUI.pixelsPerSecond;
            const newStart=Math.max(0, startTime+dx);
            const newDuration=Math.max(0.5, startDuration-dx);
            if(newDuration>=0.5){ clip.startTime=newStart; clip.duration=newDuration; TimelineUI.render(); }
          };
          const onUp=()=>{ document.removeEventListener('pointermove',onMove); document.removeEventListener('pointerup',onUp); };
          document.addEventListener('pointermove',onMove);
          document.addEventListener('pointerup',onUp);
        });
      }
      if(rightHandle){
        rightHandle.addEventListener('pointerdown', (e)=>{
          e.stopPropagation(); e.preventDefault();
          const startX=e.clientX;
          const clipId=el.dataset.clipId;
          const clip=TimelineUI.clips.find(c=>c.id===clipId);
          if(!clip) return;
          const startDuration=clip.duration;
          const onMove=(ev)=>{
            const dx=(ev.clientX-startX)/TimelineUI.pixelsPerSecond;
            const newDuration=Math.max(0.5, startDuration+dx);
            clip.duration=newDuration; TimelineUI.render();
          };
          const onUp=()=>{ document.removeEventListener('pointermove',onMove); document.removeEventListener('pointerup',onUp); };
          document.addEventListener('pointermove',onMove);
          document.addEventListener('pointerup',onUp);
        });
      }
    });
  }
};

window.TimelineUI = TimelineUI;

console.log('TimelineUI v3.9.1 FINAL - Pinch Visual Zoom Fix - track-content min-width set - Outside Bottom Handles - No Emoji - Master Prompt');
