/**
 * js/tools/toolbar.js - NEW - Professional Contextual Toolbar
 * Logic: Main Toolbar always bottom, Contextual slides from right to left on clip select
 * Like InShot/【entity-CapCut¦canonical_name=CapCut】: Select V1 → Trim/Split/Crop, Select Text → Font/Color/Animation
 */
const Toolbar = {
  mainToolbar: null,
  contextualToolbar: null,
  currentClip: null,
  isContextualVisible: false,

  // Professional SVG Icons - Lucide Style
  icons: {
    trim: [STRIPPED 186 bytes],
    split: [STRIPPED 175 bytes],
    crop: [STRIPPED 167 bytes],
    speed: [STRIPPED 165 bytes],
    volume: [STRIPPED 231 bytes],
    filter: [STRIPPED 170 bytes],
    delete: [STRIPPED 230 bytes],
    font: [STRIPPED 221 bytes],
    color: [STRIPPED 444 bytes],
    animation: [STRIPPED 202 bytes]
  },

  init() {
    this.mainToolbar = document.getElementById('mainToolbar');
    this.contextualToolbar = document.getElementById('contextualToolbar');
    
    if(!this.contextualToolbar) {
      // Create contextual toolbar container
      this.contextualToolbar = document.createElement('div');
      this.contextualToolbar.id = 'contextualToolbar';
      this.contextualToolbar.style.cssText = `
        position: fixed;
        bottom: 70px;
        left: 0;
        right: 0;
        height: 56px;
        background: #1E1E1E;
        border-top: 1px solid #333;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 12px;
        overflow-x: auto;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 100;
        scrollbar-width: none;
      `;
      document.body.appendChild(this.contextualToolbar);
    }

    console.log('Toolbar v2.0 - Contextual System Ready');
  },

  showForClip(clip) {
    if(!clip) return;
    
    this.currentClip = clip;
    this.isContextualVisible = true;
    
    this.contextualToolbar.innerHTML = '';
    
    // Generate buttons based on track type
    let tools = [];
    
    if(clip.track === 'V1' || clip.track === 'V2') {
      tools = [
        {id: 'trim', label: 'Trim', icon: this.icons.trim, action: ()=>window.TrimSplitTool?.showTrimUI()},
        {id: 'split', label: 'Split', icon: this.icons.split, action: ()=>window.TrimSplitTool?.splitAtPlayhead()},
        {id: 'crop', label: 'Crop', icon: this.icons.crop, action: ()=>window.FilterTool?.showCrop()},
        {id: 'speed', label: 'Speed', icon: this.icons.speed, action: ()=>window.SpeedTool?.showSpeedUI()},
        {id: 'volume', label: 'Volume', icon: this.icons.volume, action: ()=>window.AudioTool?.showVolume()},
        {id: 'filter', label: 'Filter', icon: this.icons.filter, action: ()=>window.FilterTool?.showFilters()},
        {id: 'delete', label: 'Delete', icon: this.icons.delete, action: ()=>this.deleteClip()}
      ];
    } else if(clip.track === 'Text') {
      tools = [
        {id: 'font', label: 'Font', icon: this.icons.font, action: ()=>window.TextTool?.showFontPicker()},
        {id: 'color', label: 'Color', icon: this.icons.color, action: ()=>window.TextTool?.showColorPicker()},
        {id: 'animation', label: 'Animation', icon: this.icons.animation, action: ()=>window.TextTool?.showAnimation()},
        {id: 'delete', label: 'Delete', icon: this.icons.delete, action: ()=>this.deleteClip()}
      ];
    } else if(clip.track === 'A1' || clip.track === 'A2') {
      tools = [
        {id: 'volume', label: 'Volume', icon: this.icons.volume, action: ()=>window.AudioTool?.showVolume()},
        {id: 'delete', label: 'Delete', icon: this.icons.delete, action: ()=>this.deleteClip()}
      ];
    }

    tools.forEach(tool => {
      const btn = document.createElement('button');
      btn.innerHTML = `${tool.icon}<span style="font-size:10px;margin-top:2px;">${tool.label}</span>`;
      btn.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-width: 56px;
        height: 48px;
        background: #2A2A2A;
        border: none;
        border-radius: 8px;
        color: #FFF;
        cursor: pointer;
        flex-shrink: 0;
      `;
      btn.onclick = tool.action;
      this.contextualToolbar.appendChild(btn);
    });

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
      margin-left: auto;
      width: 36px;
      height: 36px;
      background: #333;
      border: none;
      border-radius: 50%;
      color: #FFF;
      cursor: pointer;
      flex-shrink: 0;
    `;
    closeBtn.onclick = ()=>this.hide();
    this.contextualToolbar.appendChild(closeBtn);

    // Slide in
    requestAnimationFrame(()=>{
      this.contextualToolbar.style.transform = 'translateX(0)';
    });

    if(navigator.vibrate) navigator.vibrate(20);
  },

  hide() {
    if(!this.isContextualVisible) return;
    
    this.isContextualVisible = false;
    this.contextualToolbar.style.transform = 'translateX(100%)';
    this.currentClip = null;
    
    if(window.TimelineUI) {
      TimelineUI.selectedClip = null;
      TimelineUI.render();
    }
  },

  deleteClip() {
    if(!this.currentClip) return;
    
    if(window.TimelineUI) {
      TimelineUI.clips = TimelineUI.clips.filter(c => c.id !== this.currentClip.id);
      TimelineUI.render();
    }
    
    this.hide();
    
    if(window.Player) {
      const v = document.getElementById('realVideo');
      if(v) v.pause();
    }
  }
};
window.Toolbar = Toolbar;

if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ()=>Toolbar.init());
} else {
  setTimeout(()=>Toolbar.init(), 300);
}