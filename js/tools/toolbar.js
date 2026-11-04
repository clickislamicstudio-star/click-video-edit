/**
 * js/tools/toolbar.js - Phase 2 - Contextual Toolbar Dynamic - Professional
 * Video / Text / Audio / Image alag tools - InShot / CapCut Style
 * Uses EventBus + IconSystem M3 + Store
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
      {id:'animation', label:'Anim', icon:'animation', action:'anim'},
      {id:'delete', label:'Delete', icon:'delete', action:'delete', danger:true}
    ],
    text: [
      {id:'font', label:'Font', icon:'font', action:'font'},
      {id:'color', label:'Color', icon:'color', action:'color'},
      {id:'animation', label:'Anim', icon:'animation', action:'anim'},
      {id:'bg', label:'BG', icon:'bg', action:'bg'},
      {id:'style', label:'Style', icon:'style', action:'style'},
      {id:'delete', label:'Delete', icon:'delete', action:'delete', danger:true}
    ],
    audio: [
      {id:'volume', label:'Volume', icon:'volume', action:'volume'},
      {id:'speed', label:'Speed', icon:'speed', action:'speed'},
      {id:'fade', label:'Fade', icon:'fade', action:'fade'},
      {id:'noise', label:'Noise', icon:'noise', action:'noise'},
      {id:'music', label:'Music', icon:'music', action:'music'},
      {id:'delete', label:'Delete', icon:'delete', action:'delete', danger:true}
    ],
    image: [
      {id:'crop', label:'Crop', icon:'crop', action:'crop'},
      {id:'filter', label:'Filter', icon:'filter', action:'filter'},
      {id:'animation', label:'Anim', icon:'animation', action:'anim'},
      {id:'duration', label:'Time', icon:'timer', action:'duration'},
      {id:'delete', label:'Delete', icon:'delete', action:'delete', danger:true}
    ]
  },

  init() {
    console.log('Toolbar Phase2 - Contextual Dynamic Ready');
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
    
    if(window.Store) {
      Store.dispatch({type:'TOOLBAR_CHANGE', payload:{mode:this.currentMode, tools:tools.map(t=>t.id)}});
    }
    if(window.EventBus) {
      EventBus.emit(EventBus.EVENTS.TOOLBAR_CHANGE, {mode:this.currentMode, clipId:clip.id});
    }
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
    bar.innerHTML = tools.map(t => `
      <button class="tool-item ${t.active?'active':''} ${t.danger?'danger':''}" id="main-${t.id}">
        ${IconSystem.render(t.icon, !!t.active, 24)}
        <span>${t.label}</span>
      </button>
    `).join('');
    
    tools.forEach(t => {
      const el = document.getElementById(`main-${t.id}`);
      if(el) el.addEventListener('click', () => this._handleAction(t, null));
    });
  },

  _renderContextual(tools, clip) {
    const bar = document.getElementById('contextualToolbar');
    const mainBar = document.getElementById('mainToolbar');
    if(!bar || !window.IconSystem) return;
    
    // Slide in animation
    bar.innerHTML = `
      <div style="display:flex;align-items:center;gap:2px;margin-right:8px;padding-right:8px;border-right:1px solid #333">
        <span style="font-size:10px;color:#FF3B30;font-weight:700">${(clip.type||'video').toUpperCase()}</span>
        <span style="font-size:9px;color:#8E8E93;max-width:60px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${clip.getDisplayName ? clip.getDisplayName() : clip.name}</span>
      </div>
      ${tools.map(t => `
        <button class="tool-item ${t.danger?'danger':''}" id="ctx-${t.id}" data-action="${t.action}">
          ${IconSystem.render(t.icon, false, 20)}
          <span>${t.label}</span>
        </button>
      `).join('')}
    `;
    
    bar.classList.add('visible');
    
    // Bind
    tools.forEach(t => {
      const el = document.getElementById(`ctx-${t.id}`);
      if(el) el.addEventListener('click', () => this._handleAction(t, clip));
    });
    
    // Hide main toolbar label to save space? Keep main visible as secondary
  },

  _handleAction(toolDef, clip) {
    console.log('Toolbar Action:', toolDef.action, 'Clip:', clip?.id);
    if(navigator.vibrate) navigator.vibrate(30);
    if(window.AndroidBridge) AndroidBridge.vibrate(30);
    
    switch(toolDef.action) {
      case 'import':
        if(window.MediaImportTool) MediaImportTool.importToTimeline();
        break;
      case 'addText':
        if(window.TextTool) TextTool.addTextClip();
        break;
      case 'zoomIn':
        if(window.ZoomEngine) ZoomEngine.zoomIn();
        break;
      case 'zoomOut':
        if(window.ZoomEngine) ZoomEngine.zoomOut();
        break;
      case 'trim':
        if(window.TrimSplitTool) TrimSplitTool.showTrimUI(clip || this.currentClip);
        else this._toast('Trim: Use white handles to drag');
        break;
      case 'split':
        if(window.TrimSplitTool) TrimSplitTool.splitAtPlayhead(clip || this.currentClip);
        else this._toast('Split at playhead');
        break;
      case 'delete':
        if(window.Selection) Selection.deleteSelected();
        else if(clip && window.TimelineUI) {
          TimelineUI.clips = TimelineUI.clips.filter(c=>c.id!==clip.id);
          TimelineUI.render();
          this.hide();
        }
        break;
      case 'speed':
        if(window.SpeedTool) SpeedTool.showUI(clip);
        else this._toast('Speed: 0.25x - 4x');
        break;
      case 'volume':
        if(window.AudioTool) AudioTool.showVolumeUI(clip);
        else this._toast('Volume control');
        break;
      case 'filter':
        if(window.FilterTool) FilterTool.showUI(clip);
        else this._toast('Filters: Coming Phase 3');
        break;
      case 'export':
        if(window.ExportEngine) ExportEngine.showExportDialog();
        else this._toast('Export');
        break;
      default:
        this._toast(toolDef.label + ' - Coming Soon');
    }
  },

  _toast(msg) {
    const info=document.getElementById('info');
    if(info){ info.textContent=msg; info.style.color='#FFF'; setTimeout(()=>{ info.textContent='Phase 2: Contextual Toolbar Ready'; info.style.color='#FF3B30'; },2000); }
    console.log(msg);
  }
};

window.Toolbar = Toolbar;
document.addEventListener('DOMContentLoaded', ()=> { setTimeout(()=>Toolbar.init(), 800); });
