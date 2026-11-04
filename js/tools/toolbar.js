
/**
 * Folder: js/tools/ File: toolbar.js v3.7 - Contextual Toolbar Dynamic + EN/AR
 */
const Toolbar = {
  init(){ this.bar=document.getElementById('contextualToolbar'); console.log('Toolbar v3.7 init'); },
  showForClip(clip){
    if(!this.bar) this.bar=document.getElementById('contextualToolbar');
    if(!this.bar || !clip) return;
    
    let tools=[];
    if(clip.type==='video' || clip.type==='image' || clip.type==='overlay'){
      tools=[
        {id:'transform', label:'Transform', icon:'transform', active:true},
        {id:'trim', label:'Trim', icon:'trim'},
        {id:'split', label:'Split', icon:'split'},
        {id:'crop', label:'Crop', icon:'crop'},
        {id:'speed', label:'Speed', icon:'speed'},
        {id:'volume', label:'Volume', icon:'volume'},
        {id:'filter', label:'Filter', icon:'filter'},
        {id:'delete', label:'Delete', icon:'delete', danger:true}
      ];
    } else if(clip.type==='text'){
      tools=[
        {id:'font', label:'Font', icon:'font', active:true},
        {id:'color', label:'Color', icon:'color'},
        {id:'bg', label:'BG', icon:'bg'},
        {id:'style', label:'Style', icon:'transform'},
        {id:'animation', label:'Anim', icon:'animation'},
        {id:'delete', label:'Delete', icon:'delete', danger:true}
      ];
    } else if(clip.type==='audio'){
      tools=[
        {id:'volume', label:'Volume', icon:'volume', active:true},
        {id:'speed', label:'Speed', icon:'speed'},
        {id:'fade', label:'Fade', icon:'filter'},
        {id:'delete', label:'Delete', icon:'delete', danger:true}
      ];
    }
    
    this.bar.innerHTML=tools.map(t=>`<button class="tool-item ${t.active?'active':''} ${t.danger?'danger':''}" data-tool="${t.id}">${IconSystem.render(t.icon, t.active, 18)}<span>${t.label}</span></button><div style="width:1px;height:24px;background:#2A2A2E"></div>`).join('') + `<button class="tool-item" id="btnCloseContext" style="margin-left:auto"><span style="font-size:14px">✕</span><span>Close</span></button>`;
    this.bar.classList.add('visible');
    
    tools.forEach(t=>{
      const btn=this.bar.querySelector(`[data-tool="${t.id}"]`);
      if(btn) btn.addEventListener('click', ()=> this.handleTool(t.id, clip));
    });
    document.getElementById('btnCloseContext')?.addEventListener('click', ()=> this.hide());
    
    // Auto-hide on backdrop tap
    this.bar.addEventListener('click', (e)=>{ if(e.target===this.bar) this.hide(); });
  },
  handleTool(id, clip){
    console.log('Toolbar tool', id, clip.type);
    if(id==='transform' && window.TransformTool) TransformTool.showTransformPanel(clip);
    else if(id==='trim' && window.TrimSplitTool) TrimSplitTool.showTrimUI(clip);
    else if(id==='split' && window.TrimSplitTool) TrimSplitTool.splitAtPlayhead(clip);
    else if(id==='font' || id==='color' || id==='bg' || id==='style' || id==='animation'){
      if(window.TextTool) TextTool.showTextEditor(clip);
    }
    else if(id==='speed' && window.SpeedTool) SpeedTool.showUI(clip);
    else if(id==='filter' && window.FilterTool) FilterTool.showUI(clip);
    else if(id==='volume' && window.AudioTool) AudioTool.showVolumeUI(clip);
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
  },
  renderMain(){ this.hide(); }
};
window.Toolbar=Toolbar;
