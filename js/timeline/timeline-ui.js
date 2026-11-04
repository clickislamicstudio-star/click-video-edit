
/**
 * TimelineUI v3.6.3 - Fixed Audio Track + Selection
 */
const TimelineUI = {
  clips:[],
  pixelsPerSecond:80,
  container:null,
  init(id){
    this.container=document.getElementById(id||'timelineArea');
    if(!this.container) return;
    console.log('TimelineUI v3.6.3 init - Audio fixed');
    this.render();
  },
  getNextStartTime(track){
    const cs=this.clips.filter(c=>c.track===track);
    if(cs.length===0) return 0;
    return Math.max(...cs.map(c=>c.startTime+c.duration));
  },
  render(){
    if(!this.container) this.container=document.getElementById('timelineArea');
    if(!this.container) return;
    const pps=this.pixelsPerSecond||80;
    let html='<div style="display:flex;flex-direction:column;width:100%;height:100%;overflow-y:auto;background:#1E1E1E">';
    html+='<div style="display:flex;height:28px;background:#121212;border-bottom:1px solid #2A2A2A;position:sticky;top:0;z-index:2"><div style="width:40px;flex-shrink:0;background:#121212;border-right:1px solid #2A2A2A"></div><div style="flex:1;position:relative">';
    for(let i=0;i<30;i++){ html+=`<div style="position:absolute;left:${i*pps}px;top:0;bottom:0;border-left:1px solid #2A2A2A;padding-left:4px;font-size:10px;color:#666;min-width:${pps}px;display:flex;align-items:center">00:${String(i).padStart(2,'0')}</div>`; }
    html+='</div></div>';
    
    const tracks=[
      {id:1,name:'V1',type:'video'},
      {id:2,name:'V2',type:'image'},
      {id:3,name:'Text',type:'text'},
      {id:5,name:'A1',type:'audio'}
    ];
    
    tracks.forEach(tr=>{
      let filtered=[];
      if(tr.name==='V1') filtered=this.clips.filter(c=> (c.type==='video' && c.track===1) );
      else if(tr.name==='V2') filtered=this.clips.filter(c=> (c.type==='image' || c.type==='overlay' || c.type==='pip' || (c.type==='video' && c.track===2)) );
      else if(tr.name==='Text') filtered=this.clips.filter(c=> c.type==='text' );
      else if(tr.name==='A1') filtered=this.clips.filter(c=> c.type==='audio' );
      
      html+=`<div class="track-row" data-track="${tr.id}" style="display:flex;height:58px;border-bottom:1px solid #2A2A2A;background:#1E1E1E;position:relative"><div style="width:40px;flex-shrink:0;background:#1A1A1A;border-right:1px solid #2A2A2A;display:flex;align-items:center;justify-content:center;font-size:11px;color:#8E8E93;font-weight:700;flex-direction:column"><span>${tr.name}</span><span style="font-size:8px;color:#555">${tr.type}</span></div><div style="flex:1;position:relative;overflow:hidden">`;
      filtered.forEach(c=>{
        const left=c.startTime*pps;
        const width=Math.max(40, c.duration*pps);
        const selected = window.Selection && Selection.selectedClip && Selection.selectedClip.id===c.id;
        const bg = c.type==='audio'?'#4CAF50':c.type==='text'?'#5856D6':c.type==='image'?'#FF9500':'#FF3B30';
        html+=`<div data-clip-id="${c.id}" style="position:absolute;left:${left}px;width:${width}px;top:8px;bottom:8px;background:${bg};border-radius:8px;display:flex;align-items:center;padding:0 8px;font-size:11px;color:#FFF;font-weight:600;overflow:hidden;white-space:nowrap;cursor:pointer;${selected?'border:2px solid #FFF;box-shadow:0 0 0 2px #FF3B30;z-index:5':''}"><span style="overflow:hidden;text-overflow:ellipsis">${c.type==='audio'?'🔊 ':''}${c.name||c.text||'Clip'}</span></div>`;
      });
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
          console.log('Clip clicked', clip.type, clip.name);
          if(window.Selection) Selection.selectClip(clip);
        }
      });
    });
    this.container.addEventListener('click', (e)=>{
      if(e.target===this.container || e.target.classList.contains('track-row')){
        if(window.Selection) Selection.deselectAll();
      }
    });
  }
};
window.TimelineUI=TimelineUI;
setTimeout(()=>{ if(!TimelineUI.container) TimelineUI.init('timelineArea'); }, 500);
