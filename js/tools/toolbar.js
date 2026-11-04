
/**
 * Folder: js/tools/ File: toolbar.js v3.9 FINAL - Edit First + Transform First + No Emoji + Master Prompt
 * Icon System: SVG Only - Material 3 Rounded - 20px Timeline Tools - No Emoji
 */
const Toolbar = {
  init(){ this.bar=document.getElementById('contextualToolbar'); console.log('Toolbar v3.9 FINAL - Edit First, No Emoji, Master Prompt'); },
  showForClip(clip){
    if(!this.bar) this.bar=document.getElementById('contextualToolbar');
    if(!this.bar || !clip) return;
    
    let tools=[];
    if(clip.type==='video' || clip.type==='image'){
      tools=[
        {id:'edit', label:'Edit', icon:'edit', active:true},
        {id:'transform', label:'Transform', icon:'transform'},
        {id:'split', label:'Split', icon:'split'},
        {id:'fromStart', label:'From the Start', icon:'trim'},
        {id:'fromNow', label:'From Now', icon:'trim'},
        {id:'untilNow', label:'Until Now', icon:'trim'},
        {id:'untilEnd', label:'Until the End', icon:'trim'},
        {id:'layout', label:'Layout', icon:'filter'},
        {id:'background', label:'Background', icon:'filter'},
        {id:'borders', label:'Borders', icon:'filter'},
        {id:'delete', label:'Delete', icon:'delete', danger:true},
        {id:'close', label:'Close', icon:'close'}
      ];
    } else if(clip.type==='pip' || clip.type==='overlay'){
      tools=[
        {id:'edit', label:'Edit', icon:'edit', active:true},
        {id:'transform', label:'Transform', icon:'transform'},
        {id:'layout', label:'Layout', icon:'filter'},
        {id:'background', label:'Background', icon:'filter'},
        {id:'borders', label:'Borders', icon:'filter'},
        {id:'delete', label:'Delete', icon:'delete', danger:true},
        {id:'close', label:'Close', icon:'close'}
      ];
    } else if(clip.type==='text'){
      tools=[
        {id:'edit', label:'Edit', icon:'edit', active:true},
        {id:'transform', label:'Transform', icon:'transform'},
        {id:'font', label:'Font', icon:'edit'},
        {id:'color', label:'Color', icon:'filter'},
        {id:'bg', label:'BG', icon:'filter'},
        {id:'style', label:'Style', icon:'transform'},
        {id:'animation', label:'Anim', icon:'transform'},
        {id:'delete', label:'Delete', icon:'delete', danger:true},
        {id:'close', label:'Close', icon:'close'}
      ];
    } else if(clip.type==='audio'){
      tools=[
        {id:'edit', label:'Edit', icon:'edit', active:true},
        {id:'split', label:'Split', icon:'split'},
        {id:'fromStart', label:'From the Start', icon:'trim'},
        {id:'fromNow', label:'From Now', icon:'trim'},
        {id:'untilNow', label:'Until Now', icon:'trim'},
        {id:'untilEnd', label:'Until the End', icon:'trim'},
        {id:'mute', label:'Mute', icon:'volume'},
        {id:'volume', label:'Volume', icon:'volume'},
        {id:'noise', label:'Noise', icon:'filter'},
        {id:'fade', label:'Fade', icon:'filter'},
        {id:'delete', label:'Delete', icon:'delete', danger:true},
        {id:'close', label:'Close', icon:'close'}
      ];
    }
    
    this.bar.innerHTML=tools.map(t=>`<button class="tool-item ${t.active?'active':''} ${t.danger?'danger':''}" data-tool="${t.id}">${IconSystem.render(t.icon, t.active, 16)}<span>${t.label}</span></button>`).join('');
    this.bar.classList.add('visible');
    
    tools.forEach(t=>{
      const btn=this.bar.querySelector(`[data-tool="${t.id}"]`);
      if(btn) btn.addEventListener('click', ()=> this.handleTool(t.id, clip));
    });
  },
  handleTool(id, clip){
    console.log('Toolbar v3.9 FINAL', id, clip.type);
    if(id==='edit' && window.EditPanel) EditPanel.show(clip);
    else if(id==='transform' && window.TransformTool) TransformTool.showTransformPanel(clip);
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
      if(window.CanvasControls) CanvasControls.hide();
    }
    else if(id==='close'){
      if(window.Selection) Selection.deselectAll();
      this.hide();
    }
  },
  hide(){
    if(!this.bar) this.bar=document.getElementById('contextualToolbar');
    if(this.bar) this.bar.classList.remove('visible');
  }
};
window.Toolbar=Toolbar;
