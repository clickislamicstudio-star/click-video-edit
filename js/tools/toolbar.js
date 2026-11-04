
/**
 * Folder: js/tools/ File: toolbar.js v3.8 - Pro Order + Transform format
 */
const Toolbar = {
  init(){ this.bar=document.getElementById('contextualToolbar'); console.log('Toolbar v3.8 Pro Order'); },
  showForClip(clip){
    if(!this.bar) this.bar=document.getElementById('contextualToolbar');
    if(!this.bar || !clip) return;
    
    let tools=[];
    if(clip.type==='video' || clip.type==='image'){
      tools=[
        {id:'fromStart', label:'From the Start', icon:'trim'},
        {id:'fromNow', label:'From Now', icon:'split'},
        {id:'split', label:'Split', icon:'split', active:true},
        {id:'untilNow', label:'Until Now', icon:'trim'},
        {id:'untilEnd', label:'Until the End', icon:'trim'},
        {id:'delete', label:'Delete', icon:'delete', danger:true},
        {id:'transform', label:'Transform', icon:'transform'},
        {id:'layout', label:'Layout', icon:'filter'},
        {id:'background', label:'Background', icon:'filter'},
        {id:'borders', label:'Borders', icon:'filter'}
      ];
    } else if(clip.type==='pip' || clip.type==='overlay'){
      tools=[
        {id:'transform', label:'Transform', icon:'transform', active:true},
        {id:'layout', label:'Layout', icon:'filter'},
        {id:'background', label:'Background', icon:'filter'},
        {id:'borders', label:'Borders', icon:'filter'},
        {id:'delete', label:'Delete', icon:'delete', danger:true}
      ];
    } else if(clip.type==='text'){
      tools=[
        {id:'font', label:'Font', icon:'transform', active:true},
        {id:'color', label:'Color', icon:'filter'},
        {id:'bg', label:'BG', icon:'filter'},
        {id:'style', label:'Style', icon:'transform'},
        {id:'animation', label:'Anim', icon:'transform'},
        {id:'delete', label:'Delete', icon:'delete', danger:true}
      ];
    } else if(clip.type==='audio'){
      tools=[
        {id:'fromStart', label:'From the Start', icon:'trim'},
        {id:'fromNow', label:'From Now', icon:'split'},
        {id:'split', label:'Split', icon:'split', active:true},
        {id:'untilNow', label:'Until Now', icon:'trim'},
        {id:'untilEnd', label:'Until the End', icon:'trim'},
        {id:'delete', label:'Delete', icon:'delete', danger:true},
        {id:'mute', label:'Mute', icon:'volume'},
        {id:'volume', label:'Volume', icon:'volume'},
        {id:'noise', label:'Noise Reduction', icon:'filter'},
        {id:'fade', label:'Fade', icon:'filter'}
      ];
    }
    
    this.bar.innerHTML=tools.map(t=>`<button class="tool-item ${t.active?'active':''} ${t.danger?'danger':''}" data-tool="${t.id}">${IconSystem.render(t.icon, t.active, 16)}<span>${t.label}</span></button>`).join('') + `<button class="tool-item" id="btnCloseContext" style="margin-left:auto"><span style="font-size:14px">✕</span><span>Close</span></button>`;
    this.bar.classList.add('visible');
    
    tools.forEach(t=>{
      const btn=this.bar.querySelector(`[data-tool="${t.id}"]`);
      if(btn) btn.addEventListener('click', ()=> this.handleTool(t.id, clip));
    });
    document.getElementById('btnCloseContext')?.addEventListener('click', ()=> this.hide());
  },
  handleTool(id, clip){
    console.log('Toolbar tool v3.8', id, clip.type);
    if(id==='transform' && window.TransformTool) TransformTool.showTransformPanel(clip);
    else if(id==='split' && window.TrimSplitTool) TrimSplitTool.splitAtPlayhead(clip);
    else if(id==='font' || id==='color' || id==='bg' || id==='style' || id==='animation'){
      if(window.TextTool) TextTool.showTextEditor(clip);
    }
    else if(id==='volume' || id==='mute' || id==='noise' || id==='fade'){
      if(window.AudioTool) AudioTool.showVolumeUI(clip);
    }
    else if(id==='fromStart'){ if(window.TimelineUI){ clip.startTime=0; TimelineUI.render(); } }
    else if(id==='untilEnd'){ if(window.TimelineUI && window.Transport){ clip.duration=Transport.totalDuration-clip.startTime; TimelineUI.render(); } }
    else if(id==='delete'){
      if(window.TimelineUI){ TimelineUI.clips=TimelineUI.clips.filter(c=>c.id!==clip.id); TimelineUI.render(); }
      if(window.Selection) Selection.deselectAll();
      this.hide();
      if(window.Renderer){ Renderer._hide(); }
    }
  },
  hide(){
    if(!this.bar) this.bar=document.getElementById('contextualToolbar');
    if(this.bar) this.bar.classList.remove('visible');
  }
};
window.Toolbar=Toolbar;
