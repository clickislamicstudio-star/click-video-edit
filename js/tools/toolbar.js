
/**
 * Toolbar v3.5 - Added Transform button
 */
const Toolbar = {
  currentMode:'main', currentClip:null,
  registry:{
    main:[
      {id:'media', label:'Media', icon:'media', action:'import'},
      {id:'text', label:'Text', icon:'text', action:'addText'},
      {id:'audio', label:'Audio', icon:'music', action:'importAudio'},
      {id:'zoomOut', label:'Zoom-', icon:'zoomOut', action:'zoomOut'},
      {id:'zoomIn', label:'Zoom+', icon:'zoomIn', action:'zoomIn'},
      {id:'export', label:'Export', icon:'export', action:'export', active:true}
    ],
    video:[
      {id:'trim', label:'Trim', icon:'trim', action:'trim'},
      {id:'split', label:'Split', icon:'split', action:'split'},
      {id:'crop', label:'Crop', icon:'crop', action:'crop'},
      {id:'speed', label:'Speed', icon:'speed', action:'speed'},
      {id:'volume', label:'Volume', icon:'volume', action:'volume'},
      {id:'filter', label:'Filter', icon:'filter', action:'filter'},
      {id:'transform', label:'Transform', icon:'crop', action:'transform'},
      {id:'delete', label:'Delete', icon:'delete', action:'delete', danger:true},
      {id:'close', label:'Close', icon:'close', action:'closeBar'}
    ],
    text:[
      {id:'edit', label:'Edit', icon:'text', action:'editText'},
      {id:'font', label:'Font', icon:'font', action:'font'},
      {id:'color', label:'Color', icon:'color', action:'color'},
      {id:'template', label:'Template', icon:'style', action:'template'},
      {id:'anim', label:'Anim', icon:'animation', action:'anim'},
      {id:'bg', label:'BG', icon:'bg', action:'bg'},
      {id:'transform', label:'Transform', icon:'crop', action:'transform'},
      {id:'delete', label:'Delete', icon:'delete', action:'delete', danger:true},
      {id:'close', label:'Close', icon:'close', action:'closeBar'}
    ],
    audio:[
      {id:'volume', label:'Volume', icon:'volume', action:'volume'},
      {id:'fade', label:'Fade', icon:'fade', action:'fade'},
      {id:'delete', label:'Delete', icon:'delete', action:'delete', danger:true},
      {id:'close', label:'Close', icon:'close', action:'closeBar'}
    ]
  },
  init(){ this.renderMain(); if(window.EventBus){ EventBus.on(EventBus.EVENTS.CLIP_SELECTED, (clip)=>this.showForClip(clip)); EventBus.on(EventBus.EVENTS.CLIP_DESELECTED, ()=>this.renderMain()); } },
  showForClip(clip){ if(!clip) return; this.currentClip=clip; this.currentMode=clip.type||'video'; const tools=this.registry[this.currentMode]||this.registry.video; this._renderContextual(tools, clip); if(clip.type==='text' && window.TransformTool){ setTimeout(()=>TransformTool.showHandles(clip), 200); } },
  hide(){ this.currentClip=null; this.currentMode='main'; const bar=document.getElementById('contextualToolbar'); if(bar) bar.classList.remove('visible'); this.renderMain(); if(window.TransformTool) TransformTool._removeBox(); },
  renderMain(){
    this.currentMode='main'; const bar=document.getElementById('mainToolbar'); const cBar=document.getElementById('contextualToolbar'); if(cBar) cBar.classList.remove('visible'); if(!bar||!window.IconSystem) return; const tools=this.registry.main; bar.innerHTML=tools.map(t=>`<button class="tool-item ${t.active?'active':''}" id="main-${t.id}">${IconSystem.render(t.icon, !!t.active, 24)}<span>${t.label}</span></button>`).join(''); tools.forEach(t=>{ const el=document.getElementById(`main-${t.id}`); if(el) el.addEventListener('click', ()=>this._handleAction(t, null)); });
  },
  _renderContextual(tools, clip){
    const bar=document.getElementById('contextualToolbar'); if(!bar||!window.IconSystem) return;
    bar.innerHTML=`<div style="display:flex;align-items:center;gap:4px;margin-right:10px;padding-right:10px;border-right:1.5px solid #2A2A2E;flex-shrink:0"><span style="background:${clip.type==='text'?'#5856D6':'#FF3B30'};color:#FFF;padding:3px 7px;border-radius:6px;font-size:9px;font-weight:800">${(clip.type||'video').toUpperCase()}</span><span style="font-size:10px;color:#AAA;max-width:70px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${clip.name}</span></div><div style="display:flex;gap:4px;overflow-x:auto;flex:1;scrollbar-width:none">${tools.map(t=>`<button class="tool-item ${t.danger?'danger':''}" id="ctx-${t.id}" data-action="${t.action}" style="${t.id==='close'?'background:#242429;border:1px solid #2A2A2E;border-radius:20px;min-width:64px':''}${t.id==='delete'?'background:rgba(255,59,48,0.15);border:1px solid rgba(255,59,48,0.3)':''}">${t.id==='close'?'<span>✕</span><span>Close</span>':`${IconSystem.render(t.icon, false, 18)}<span>${t.label}</span>`}</button>`).join('')}</div>`;
    bar.classList.add('visible'); tools.forEach(t=>{ const el=document.getElementById(`ctx-${t.id}`); if(el) el.addEventListener('click', ()=>this._handleAction(t, clip)); });
  },
  _handleAction(toolDef, clip){
    const targetClip=clip||this.currentClip||window.Selection?.selectedClip; if(navigator.vibrate) navigator.vibrate(20);
    switch(toolDef.action){
      case 'import': if(window.MediaImportTool) MediaImportTool.importToTimeline(); break;
      case 'addText': if(window.TextTool) TextTool.addTextClip(); break;
      case 'editText': if(window.TextTool) TextTool.showEditor(targetClip, 'text'); break;
      case 'font': if(window.TextTool) TextTool.showEditor(targetClip, 'font'); break;
      case 'color': if(window.TextTool) TextTool.showEditor(targetClip, 'color'); break;
      case 'template': if(window.TextTool) TextTool.showEditor(targetClip, 'template'); break;
      case 'anim': if(window.TextTool) TextTool.showEditor(targetClip, 'anim'); break;
      case 'bg': if(window.TextTool) TextTool.showEditor(targetClip, 'bg'); break;
      case 'transform': if(window.TransformTool) TransformTool.showTransformPanel(targetClip); break;
      case 'zoomIn': if(window.ZoomEngine) ZoomEngine.zoomIn(); break;
      case 'zoomOut': if(window.ZoomEngine) ZoomEngine.zoomOut(); break;
      case 'trim': if(window.TrimSplitTool) TrimSplitTool.showTrimUI(targetClip); break;
      case 'split': if(window.TrimSplitTool) TrimSplitTool.splitAtPlayhead(targetClip); break;
      case 'speed': if(window.SpeedTool) SpeedTool.showUI(targetClip); break;
      case 'volume': if(window.AudioTool) AudioTool.showVolumeUI(targetClip); break;
      case 'filter': if(window.FilterTool) FilterTool.showUI(targetClip); break;
      case 'closeBar': this.hide(); if(window.Selection) Selection.deselectAll(); if(window.Renderer){ Renderer._hide(); if(Renderer.textEl) Renderer.textEl.style.top='50%'; } ['textEditorModal','speedEditorModal','filterEditorModal','audioEditorModal','transformModal'].forEach(id=>{ const m=document.getElementById(id); if(m) m.style.display='none'; }); break;
      case 'delete': if(!targetClip) break; if(window.TimelineUI){ TimelineUI.clips=TimelineUI.clips.filter(c=>c.id!==targetClip.id); TimelineUI.render(); } if(window.Selection) Selection.deselectAll(); this.hide(); if(window.Renderer) Renderer._hide(); ['textEditorModal','speedEditorModal','filterEditorModal','audioEditorModal','transformModal'].forEach(id=>{ const m=document.getElementById(id); if(m) m.style.display='none'; }); break;
      case 'export': if(window.ExportEngine) ExportEngine.showExportDialog(); break;
    }
  }
};
window.Toolbar=Toolbar; setTimeout(()=>Toolbar.init(), 800);
