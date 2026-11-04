
/**
 * Folder: js/timeline/ File: timeline-ui.js v3.8 - Pro Order Media|Audio|Text|PIP + Waveform + Corner Handles
 */
const TimelineUI = {
  clips:[],
  pixelsPerSecond:80,
  container:null,
  init(id){
    this.container=document.getElementById(id||'timelineArea');
    if(!this.container) return;
    console.log('TimelineUI v3.8 - Pro Order Media|Audio|Text|PIP - Waveform + Corner Handles');
    if(window.ZoomEngine) this.pixelsPerSecond=ZoomEngine.currentPps;
    if(window.Transport) this.pixelsPerSecond=Transport.pps;
    this.render();
  },
  getNextStartTime(track){
    let relevant;
    if(track===1) relevant=this.clips.filter(c=> (c.type==='video'||c.type==='image') && c.track!==4);
    else if(track===2) relevant=this.clips.filter(c=> c.type==='audio');
    else if(track===3) relevant=this.clips.filter(c=> c.type==='text');
    else if(track===4) relevant=this.clips.filter(c=> c.type==='pip'||c.type==='overlay');
    else relevant=this.clips.filter(c=>c.track===track);
    if(!relevant||relevant.length===0) return 0;
    return Math.max(...relevant.map(c=>c.startTime+c.duration));
  },
  render(){
    if(!this.container) this.container=document.getElementById('timelineArea');
    if(!this.container) return;
    const pps=this.pixelsPerSecond||80;
    const maxTime = this.clips.length ? Math.max(...this.clips.map(c=>c.startTime+c.duration)) : 10.4;
    if(window.Transport){ Transport.totalDuration=Math.max(maxTime,10.4); Transport.renderRuler(); }
    
    // Pro Order: Media, Audio, Text, PIP (as per user screenshots)
    const tracks=[
      {id:1,name:'Media',type:'media',cls:'Media',desc:'video+photo',icon:'🎬'},
      {id:2,name:'Audio',type:'audio',cls:'Audio',desc:'BGM',icon:'🎵'},
      {id:3,name:'Text',type:'text',cls:'Text',desc:'auto caption',icon:'T'},
      {id:4,name:'PIP',type:'pip',cls:'PIP',desc:'overlay',icon:'PIP'}
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
        // Only show when video exists - as per user requirement
        const hasVideo = this.clips.some(c=> c.type==='video'||c.type==='image');
        if(!hasVideo) filtered=[];
        else filtered=this.clips.filter(c=> c.type==='pip'||c.type==='overlay'|| (c.type==='video'&&c.track===4) || (c.type==='image'&&c.track===4));
      }
      
      html+=`<div class="track-row ${tr.cls}" data-track="${tr.id}"><div class="track-label"><span>${tr.icon}</span><span>${tr.name}</span><span class="type">${tr.desc}</span></div><div class="track-content" data-content-track="${tr.id}">`;
      
      filtered.forEach(c=>{
        const left=c.startTime*pps;
        const width=Math.max(40, c.duration*pps);
        const selected = window.Selection && Selection.selectedClip && Selection.selectedClip.id===c.id;
        let bg='#FF3B30';
        if(c.type==='image') bg='#FF9500';
        if(c.type==='pip'||c.type==='overlay') bg='#5AC8FA';
        if(c.type==='text') bg='#5856D6';
        if(c.type==='audio') bg='#4A4A4E';
        
        let inner='';
        if(c.type==='audio'){
          // Waveform like screenshot - white waveform on dark
          const bars = c.waveform ? c.waveform.map(h=>`<div style="width:2px;height:${h}%;background:${selected?'#FFF':'#0A84FF'};border-radius:1px;opacity:${selected?1:0.9}"></div>`).join('') : Array.from({length: Math.floor(width/4)}).map(()=>`<div style="width:2px;height:${8+Math.random()*80}%;background:${selected?'#FFF':'#0A84FF'};border-radius:1px"></div>`).join('');
          inner=`<div style="display:flex;align-items:center;gap:3px;height:100%;width:100%"><span style="font-size:9px">♪</span><div style="flex:1;display:flex;align-items:center;gap:1.5px;height:18px;overflow:hidden">${bars}</div><span style="font-size:8px;background:rgba(0,0,0,0.4);padding:1px 4px;border-radius:6px;margin-left:auto">${Math.floor(c.duration)}s</span></div>`;
        } else if(c.type==='video' || c.type==='image'){
          // Video with thumbnail strip + waveform (like screenshot red circle)
          const thumbBg = c.type==='image' ? '#FF9500' : '#333';
          inner=`<div style="display:flex;align-items:center;height:100%;width:100%;position:relative"><div style="display:flex;gap:1px;height:100%;align-items:center;flex:1"><div style="width:100%;height:80%;background:linear-gradient(90deg, ${bg}22, ${bg}44);border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:8px">🎬</div></div><div style="position:absolute;bottom:2px;left:2px;right:2px;height:6px;display:flex;gap:1px">${Array.from({length:10}).map(()=>`<div style="flex:1;height:100%;background:rgba(255,255,255,0.6);border-radius:1px"></div>`).join('')}</div><span style="position:absolute;top:2px;right:4px;font-size:7px;background:rgba(0,0,0,0.6);padding:1px 3px;border-radius:4px">00:${String(Math.floor(c.duration)).padStart(2,'0')}</span></div>`;
        } else {
          inner=`<span style="font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600">${c.type==='text'? (c.text||c.name||'Text').substr(0,12) : c.name.substr(0,14)}</span>`;
        }
        
        // Corner handles like screenshot: white < > when selected
        const cornerHandle = selected ? `<div style="position:absolute;left:-6px;top:50%;transform:translateY(-50%);width:14px;height:20px;background:#FFF;border-radius:4px;display:flex;align-items:center;justify-content:center;color:#000;font-size:10px;font-weight:800;box-shadow:0 2px 6px rgba(0,0,0,0.4)">‹</div><div style="position:absolute;right:-6px;top:50%;transform:translateY(-50%);width:14px;height:20px;background:#FFF;border-radius:4px;display:flex;align-items:center;justify-content:center;color:#000;font-size:10px;font-weight:800;box-shadow:0 2px 6px rgba(0,0,0,0.4)">›</div>` : '';
        
        html+=`<div data-clip-id="${c.id}" title="${c.name} - ${c.type} - Click corner to trim" style="position:absolute;left:${left}px;width:${width}px;top:4px;bottom:4px;background:${bg};border-radius:6px;display:flex;align-items:center;padding:0 6px;color:#FFF;cursor:pointer;overflow:visible;${selected?'border:2px solid #FFF;box-shadow:0 0 0 2px #0A84FF;z-index:5':''}">${inner}${cornerHandle}</div>`;
      });
      
      // Empty state hint for PIP
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
    
    this.container.querySelectorAll('[data-clip-id]').forEach(el=>{
      el.addEventListener('click', (e)=>{
        e.stopPropagation();
        const id=el.dataset.clipId;
        const clip=this.clips.find(c=>c.id===id);
        if(clip){
          console.log('Clip clicked v3.8', clip.type, clip.name, 'Track:', clip.track);
          if(window.Selection) Selection.selectClip(clip);
        }
      });
    });
    
    this.container.addEventListener('click', (e)=>{
      if(e.target===this.container || e.target.classList.contains('track-content') || e.target.classList.contains('track-row')){
        if(window.Selection) Selection.deselectAll();
      }
    });
  }
};
window.TimelineUI=TimelineUI;
setTimeout(()=>{ if(!TimelineUI.container) TimelineUI.init('timelineArea'); }, 400);
