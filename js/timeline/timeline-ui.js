
/**
 * TimelineUI v3.6.2 - Fixed Render + Selection + Player Sync
 */
const TimelineUI = {
  clips:[],
  pixelsPerSecond:80,
  container:null,
  init(id){
    this.container=document.getElementById(id);
    if(!this.container) return;
    console.log('TimelineUI v3.6.2 init');
    this.render();
    // Click to deselect
    this.container.addEventListener('click', (e)=>{
      if(e.target===this.container || e.target.classList.contains('track-row')){
        if(window.Selection) Selection.deselectAll();
      }
    });
  },
  getNextStartTime(track){
    const trackClips=this.clips.filter(c=>c.track===track);
    if(trackClips.length===0) return 0;
    return Math.max(...trackClips.map(c=>c.startTime+c.duration));
  },
  render(){
    if(!this.container) this.container=document.getElementById('timelineArea');
    if(!this.container) return;
    const tracks=[{id:1,name:'V1'},{id:2,name:'V2'},{id:3,name:'Text'},{id:5,name:'A1'}];
    const pps=this.pixelsPerSecond||80;
    let html='<div style="display:flex;flex-direction:column;width:100%;height:100%;overflow-y:auto;background:#1E1E1E">';
    // Ruler
    html+='<div style="display:flex;height:28px;background:#121212;border-bottom:1px solid #2A2A2A;position:sticky;top:0;z-index:2;overflow:hidden"><div style="width:40px;flex-shrink:0;background:#121212;border-right:1px solid #2A2A2A"></div><div style="flex:1;position:relative;display:flex;align-items:center">';
    for(let i=0;i<20;i++){
      const t=i;
      html+=`<div style="position:absolute;left:${t*pps}px;top:0;bottom:0;border-left:1px solid #2A2A2A;display:flex;align-items:center;padding-left:4px;font-size:10px;color:#666;min-width:${pps}px">00:0${i}</div>`;
    }
    html+='</div></div>';
    // Tracks
    tracks.forEach(tr=>{
      const tClips=this.clips.filter(c=>c.track===tr.id || (tr.name==='Text'&&c.type==='text') || (tr.id===1&&c.type==='video') || (tr.id===2&&c.type==='image'));
      // Actually filter more accurately
      let filtered=this.clips.filter(c=>{
        if(tr.name==='V1') return c.type==='video' && c.track===1;
        if(tr.name==='V2') return c.type==='image' || c.type==='video' && c.track===2 || c.type==='overlay';
        if(tr.name==='Text') return c.type==='text';
        if(tr.name==='A1') return c.type==='audio';
        return c.track===tr.id;
      });
      html+=`<div class="track-row" style="display:flex;height:54px;border-bottom:1px solid #2A2A2A;background:#1E1E1E;position:relative"><div style="width:40px;flex-shrink:0;background:#1A1A1A;border-right:1px solid #2A2A2A;display:flex;align-items:center;justify-content:center;font-size:12px;color:#8E8E93;font-weight:700">${tr.name}</div><div style="flex:1;position:relative;overflow:hidden">`;
      filtered.forEach(c=>{
        const left=c.startTime*pps;
        const width=c.duration*pps;
        const selected = window.Selection && Selection.selectedClip && Selection.selectedClip.id===c.id;
        html+=`<div data-clip-id="${c.id}" style="position:absolute;left:${left}px;width:${width}px;top:6px;bottom:6px;background:${c.color||'#FF3B30'};border-radius:8px;display:flex;align-items:center;padding:0 8px;font-size:11px;color:#FFF;font-weight:600;overflow:hidden;white-space:nowrap;cursor:pointer;${selected?'border:2px solid #FF3B30;box-shadow:0 0 0 2px rgba(255,59,48,0.3);z-index:5':''}"><span style="overflow:hidden;text-overflow:ellipsis">${c.name||c.text||'Clip'}</span><div style="position:absolute;left:0;top:0;bottom:0;width:8px;background:rgba(255,255,255,0.9);border-radius:8px 0 0 8px;cursor:ew-resize"></div><div style="position:absolute;right:0;top:0;bottom:0;width:8px;background:rgba(255,255,255,0.9);border-radius:0 8px 8px 0;cursor:ew-resize"></div></div>`;
      });
      html+='</div></div>';
    });
    html+='</div>';
    this.container.innerHTML=html;
    // Bind click on clips
    this.container.querySelectorAll('[data-clip-id]').forEach(el=>{
      el.addEventListener('click', (e)=>{
        e.stopPropagation();
        const id=el.dataset.clipId;
        const clip=this.clips.find(c=>c.id===id);
        if(clip && window.Selection) Selection.selectClip(clip);
        if(clip && window.Toolbar) Toolbar.showForClip(clip);
        if(clip && window.Renderer) Renderer.showClip(clip);
      });
    });
  }
};
window.TimelineUI=TimelineUI;
setTimeout(()=>{ if(!TimelineUI.container) TimelineUI.init('timelineArea'); }, 800);
