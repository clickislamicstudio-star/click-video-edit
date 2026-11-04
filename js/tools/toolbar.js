/**
 * js/tools/toolbar.js - Phase 3.1 FIX - Sub-buttons actually working
 */
const Toolbar = {
  currentMode: 'main',
  currentClip: null,
  
  registry: {
    main: [
      {id:'media', label:'Media', icon:'media', action:'import'},
      {id:'text', label:'Text', icon:'text', action:'addText'},
      {id:'audio', label:'Audio', icon:'music', action:'importAudio'},
      {id:'zoomOut', label:'Zoom-', icon:'zoomOut', action:'zoomOut'},
      {id:'zoomIn', label:'Zoom+', icon:'zoomIn', action:'zoomIn'},
      {id:'export', label:'Export', icon:'export', action:'export', active:true}
    ],
    video: [
      {id:'trim', label:'Trim', icon:'trim', action:'trim'},
      {id:'split', label:'Split', icon:'split', action:'split'},
      {id:'crop', label:'Crop', icon:'crop', action:'crop'},
      {id:'speed', label:'Speed', icon:'speed', action:'speed'},
      {id:'volume', label:'Volume', icon:'volume', action:'volume'},
      {id:'filter', label:'Filter', icon:'filter', action:'filter'},
      {id:'delete', label:'Delete', icon:'delete', action:'delete', danger:true}
    ],
    text: [
      {id:'edit', label:'Edit', icon:'text', action:'editText'},
      {id:'font', label:'Font', icon:'font', action:'font'},
      {id:'color', label:'Color', icon:'color', action:'color'},
      {id:'template', label:'Template', icon:'style', action:'template'},
      {id:'anim', label:'Anim', icon:'animation', action:'anim'},
      {id:'bg', label:'BG', icon:'bg', action:'bg'},
      {id:'delete', label:'Delete', icon:'delete', action:'delete', danger:true}
    ],
    audio: [
      {id:'volume', label:'Volume', icon:'volume', action:'volume'},
      {id:'fade', label:'Fade', icon:'fade', action:'fade'},
      {id:'delete', label:'Delete', icon:'delete', action:'delete', danger:true}
    ]
  },

  init() {
    console.log('Toolbar Phase3.1 - Sub-buttons fixed');
    this.renderMain();
    if(window.EventBus) {
      EventBus.on(EventBus.EVENTS.CLIP_SELECTED, (clip) => this.showForClip(clip));
      EventBus.on(EventBus.EVENTS.CLIP_DESELECTED, () => this.renderMain());
    }
  },

  showForClip(clip) {
    if(!clip) return;
    this.currentClip = clip;
    this.currentMode = clip.type || 'video';
    const tools = this.registry[this.currentMode] || this.registry.video;
    this._renderContextual(tools, clip);
  },

  hide() {
    this.currentClip = null;
    this.currentMode = 'main';
    const bar = document.getElementById('contextualToolbar');
    if(bar) bar.classList.remove('visible');
    this.renderMain();
  },

  renderMain() {
    this.currentMode = 'main';
    const bar = document.getElementById('mainToolbar');
    const cBar = document.getElementById('contextualToolbar');
    if(cBar) cBar.classList.remove('visible');
    if(!bar || !window.IconSystem) return;
    const tools = this.registry.main;
    bar.innerHTML = tools.map(t => `<button class="tool-item ${t.active?'active':''}" id="main-${t.id}">${IconSystem.render(t.icon, !!t.active, 24)}<span>${t.label}</span></button>`).join('');
    tools.forEach(t => { const el=document.getElementById(`main-${t.id}`); if(el) el.addEventListener('click', ()=>this._handleAction(t, null)); });
  },

  _renderContextual(tools, clip) {
    const bar = document.getElementById('contextualToolbar');
    if(!bar || !window.IconSystem) return;
    bar.innerHTML = `<div style="display:flex;align-items:center;gap:2px;margin-right:8px;padding-right:8px;border-right:1px solid #333"><span style="font-size:10px;color:#FF3B30;font-weight:700">${(clip.type||'video').toUpperCase()}</span><span style="font-size:9px;color:#8E8E93;max-width:60px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${clip.name}</span></div>${tools.map(t=>`<button class="tool-item ${t.danger?'danger':''}" id="ctx-${t.id}" data-action="${t.action}">${IconSystem.render(t.icon, false, 20)}<span>${t.label}</span></button>`).join('')}`;
    bar.classList.add('visible');
    tools.forEach(t => { const el=document.getElementById(`ctx-${t.id}`); if(el) el.addEventListener('click', ()=>this._handleAction(t, clip)); });
  },

  _handleAction(toolDef, clip) {
    console.log('Toolbar Action:', toolDef.action, clip?.id);
    if(navigator.vibrate) navigator.vibrate(30);
    const targetClip = clip || this.currentClip || window.Selection?.selectedClip;
    
    switch(toolDef.action) {
      case 'import': if(window.MediaImportTool) MediaImportTool.importToTimeline(); break;
      case 'addText': if(window.TextTool) TextTool.addTextClip(); break;
      case 'editText': if(window.TextTool) TextTool.showEditor(targetClip, 'text'); break;
      case 'font': if(window.TextTool) TextTool.editFont(targetClip); break;
      case 'color': if(window.TextTool) TextTool.editColor(targetClip); break;
      case 'template': if(window.TextTool) TextTool.showEditor(targetClip, 'template'); break;
      case 'anim': if(window.TextTool) TextTool.showEditor(targetClip, 'anim'); else if(window.TextTool) TextTool.editAnim(targetClip); break;
      case 'bg': if(window.TextTool) TextTool.editBG(targetClip); break;
      case 'zoomIn': if(window.ZoomEngine) ZoomEngine.zoomIn(); break;
      case 'zoomOut': if(window.ZoomEngine) ZoomEngine.zoomOut(); break;
      case 'trim': if(window.TrimSplitTool) TrimSplitTool.showTrimUI(targetClip); break;
      case 'split': if(window.TrimSplitTool) TrimSplitTool.splitAtPlayhead(targetClip); break;
      case 'delete': if(window.Selection) Selection.deleteSelected(); break;
      case 'speed': if(window.SpeedTool) SpeedTool.showUI(targetClip); break;
      case 'volume': if(window.AudioTool) AudioTool.showVolumeUI(targetClip); break;
      case 'filter': if(window.FilterTool) FilterTool.showUI(targetClip); break;
      case 'fade': if(window.AudioTool) AudioTool.showVolumeUI(targetClip); break;
      case 'export': if(window.ExportEngine) ExportEngine.showExportDialog(); break;
      default: this._toast(toolDef.label);
    }
  },
  _toast(msg){ const info=document.getElementById('info'); if(info){ info.textContent=msg; setTimeout(()=>info.textContent='Phase 3.1: Text Fixed',2000); } }
};
window.Toolbar = Toolbar;
document.addEventListener('DOMContentLoaded', ()=> setTimeout(()=>Toolbar.init(), 800));
