
/**
 * Folder: js/timeline/ File: timeline-ui.js v3.7
 * Hybrid Method 3: Thin Timeline - V1 46px, V2 36px, Text 30px, A1 40px - Scrollable between Roller and Toolbar
 * Fix: V1 = Video+Image same track, Audio no longer selects Image
 */
const TimelineUI = {
  clips:[],
  pixelsPerSecond:80,
  container:null,
  init(id){
    this.container=document.getElementById(id||'timelineArea');
    if(!this.container) return;
    console.log('TimelineUI v3.7 - Thin Hybrid - V1 Video+Image Same');
    // Sync pps from Transport
    if(window.Transport) this.pixelsPerSecond=Transport.pps;
    this.render();
  },
  getNextStartTime(track){
    // V1 track=1 gets both video and image
    let relevant;
    if(track===1) relevant=this.clips.filter(c=> c.track===1 || (c.type==='video'||c.type==='image') && c.track!==5 && c.track!==3);
    else relevant=this.clips.filter(c=>c.track===track);
    if(relevant.length===0) return 0;
    return Math.max(...relevant.map(c=>c.startTime+c.duration));
  },
  render(){
    if(!this.container) this.container=document.getElementById('timelineArea');
    if(!this.container) return;
    const pps=this.pixelsPerSecond||80;
    // Update total duration for transport
    const maxTime = this.clips.length ? Math.max(...this.clips.map(c=>c.startTime+c.duration)) : 10.4;
    if(window.Transport){ Transport.totalDuration=Math.max(maxTime,10.4); Transport.renderRuler(); }
    
    const tracks=[
      {id:1,name:'V1',type:'media',cls:'V1',desc:'Video+Photo'},
      {id:2,name:'V2',type:'overlay',cls:'V2',desc:'Overlay'},
      {id:3,name:'Text',type:'text',cls:'Text',desc:'Text'},
      {id:5,name:'A1',type:'audio',cls:'A1',desc:'Audio'}
    ];
    
    let html='<div style="display:flex;flex-direction:column;width:100%;">';
    
    tracks.forEach(tr=>{
      let filtered=[];
      if(tr.name==='V1'){
        // V1 = Video + Image (professional - user request)
        filtered=this.clips.filter(c=> (c.type==='video'||c.type==='image') && c.track!==2 && c.track!==3 && c.track!==5);
      } else if(tr.name==='V2'){
        filtered=this.clips.filter(c=> c.type==='overlay' || c.type==='pip' || (c.type==='video'&&c.track===2) || (c.type==='image'&&c.track===2));
      } else if(tr.name==='Text'){
        filtered=this.clips.filter(c=> c.type==='text');
      } else if(tr.name==='A1'){
        filtered=this.clips.filter(c=> c.type==='audio');
      }
      
      html+=`<div class="track-row ${tr.cls}" data-track="${tr.id}"><div class="track-label"><span>${tr.name}</span><span class="type">${tr.desc}</span></div><div class="track-content" data-content-track="${tr.id}">`;
      
      filtered.forEach(c=>{
        const left=c.startTime*pps;
        const width=Math.max(36, c.duration*pps);
        const selected = window.Selection && Selection.selectedClip && Selection.selectedClip.id===c.id;
        let bg='#FF3B30';
        if(c.type==='image') bg='#FF9500';
        if(c.type==='overlay'||c.type==='pip') bg='#FF9500';
        if(c.type==='text') bg='#5856D6';
        if(c.type==='audio') bg='#4CAF50';
        
        // Audio waveform fake
        let inner='';
        if(c.type==='audio'){
          inner=`<div style="display:flex;align-items:center;gap:2px;height:100%"><span style="font-size:10px">🔊</span><div style="display:flex;align-items:center;gap:1px;height:14px">${Array.from({length:12}).map(()=>`<div style="width:2px;height:${6+Math.random()*10}px;background:rgba(255,255,255,0.8);border-radius:1px"></div>`).join('')}</div><span style="font-size:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:80px">${c.name}</span></div>`;
        } else {
          inner=`<span style="font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600">${c.type==='text'? (c.text||c.name||'Text') : c.name}</span>`;
        }
        
        html+=`<div data-clip-id="${c.id}" title="${c.name} - ${c.type}" style="position:absolute;left:${left}px;width:${width}px;top:4px;bottom:4px;background:${bg};border-radius:6px;display:flex;align-items:center;padding:0 6px;color:#FFF;cursor:pointer;overflow:hidden;${selected?'border:2px solid #FFF;box-shadow:0 0 0 2px #FF3B30;z-index:5':''}">${inner}</div>`;
      });
      
      html+='</div></div>';
    });
    
    html+='</div>';
    this.container.innerHTML=html;
    
    // Bind clip click - FIXED: Audio won't select Image
    this.container.querySelectorAll('[data-clip-id]').forEach(el=>{
      el.addEventListener('click', (e)=>{
        e.stopPropagation();
        const id=el.dataset.clipId;
        const clip=this.clips.find(c=>c.id===id);
        if(clip){
          console.log('Clip clicked FIXED', clip.type, clip.name, 'Track:', clip.track);
          if(window.Selection) Selection.selectClip(clip);
        }
      });
    });
    
    this.container.addEventListener('click', (e)=>{
      if(e.target===this.container || e.target.classList.contains('track-content') || e.target.classList.contains('track-row')){
        if(window.Selection) Selection.deselectAll();
      }
    });
    
    // Sync horizontal scroll with ruler
    const rulerWrap=document.getElementById('rulerCanvasWrap');
    if(rulerWrap){
      this.container.addEventListener('scroll', ()=>{
        // Horizontal sync not needed as we use absolute positioning, but keep playhead sync
        if(window.Transport) Transport.syncPlayhead();
      });
    }
  }
};
window.TimelineUI=TimelineUI;
setTimeout(()=>{ if(!TimelineUI.container) TimelineUI.init('timelineArea'); }, 400);
