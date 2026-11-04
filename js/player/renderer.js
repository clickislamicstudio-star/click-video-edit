/**
 * Renderer v3.2 FULL FIX - Text Overlay 100% Visible - Debug + Force Render
 * ROOT CAUSE: textOverlay was inside playerWrap but z-index and video covering it
 * FIX: Move textOverlay to fixed overlay layer above video with high z-index
 */
const Renderer = {
  textEl: null,
  videoEl: null,
  _loopId: null,

  init() {
    this.videoEl = document.getElementById('realVideo');
    
    // FIX 1: Create NEW text overlay if not exists or recreate for proper positioning
    let oldEl = document.getElementById('textOverlay');
    if(oldEl) oldEl.remove();
    
    const wrap = document.getElementById('playerWrap');
    if(!wrap) { console.error('playerWrap not found'); return; }
    
    // Create fresh overlay with guaranteed visibility
    this.textEl = document.createElement('div');
    this.textEl.id = 'textOverlay';
    this.textEl.style.cssText = `
      position:absolute !important;
      top:50% !important;
      left:50% !important;
      transform:translate(-50%,-50%) !important;
      z-index:9999 !important;
      color:white;
      font-size:32px;
      font-weight:800;
      text-align:center;
      text-shadow:0 2px 10px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5);
      pointer-events:none;
      max-width:85%;
      word-break:break-word;
      line-height:1.3;
      display:none;
      font-family:Inter, sans-serif;
      padding:4px 8px;
      border-radius:8px;
      white-space:pre-wrap;
    `;
    wrap.appendChild(this.textEl);
    wrap.style.position = 'relative';
    wrap.style.overflow = 'hidden';
    
    console.log('Renderer v3.2 - NEW textOverlay created in playerWrap, z-index 9999');
    
    // Force render loop 10fps
    this._startLoop();
    
    // Listen to timeline scroll
    if(window.EventBus) {
      EventBus.on('clip:selected', (clip)=> {
        if(clip && clip.type==='text') {
          console.log('Renderer: Selected text clip', clip.text);
          this._forceShow(clip);
        }
      });
    }
  },

  _startLoop() {
    if(this._loopId) cancelAnimationFrame(this._loopId);
    const loop = () => {
      this.render();
      this._loopId = requestAnimationFrame(loop);
    };
    loop();
  },

  render() {
    const currentTime = window.TimelineUI?.currentTime ?? 0;
    const clips = window.TimelineUI?.clips || [];
    
    // Find text clips at current time
    const active = clips.filter(c => c.type==='text' && currentTime >= c.startTime && currentTime <= c.endTime);
    
    if(active.length > 0) {
      this._renderClip(active[0], currentTime);
      return;
    }
    
    // If no active but selected text clip exists, SHOW IT (editing mode)
    const selected = window.Selection?.selectedClip;
    if(selected && selected.type==='text') {
      this._forceShow(selected);
      return;
    }
    
    // Hide if nothing
    this._hide();
  },

  _forceShow(clip) {
    if(!clip || !this.textEl) return;
    console.log('Force show text:', clip.text, 'size', clip.fontSize, 'color', clip.fontColor);
    this._renderClip(clip, clip.startTime || 0);
  },

  _renderClip(clip, currentTime) {
    if(!this.textEl) return;
    
    const el = this.textEl;
    el.style.display = 'block';
    el.textContent = clip.text || 'Sample Text';
    
    // Size
    el.style.fontSize = (clip.fontSize || 32) + 'px';
    
    // Color - support gradient
    if(clip.fontColor && clip.fontColor.includes('gradient')) {
      el.style.background = clip.fontColor;
      el.style.webkitBackgroundClip = 'text';
      el.style.webkitTextFillColor = 'transparent';
      el.style.backgroundClip = 'text';
      el.style.color = 'transparent';
    } else {
      el.style.background = 'none';
      el.style.webkitBackgroundClip = 'unset';
      el.style.webkitTextFillColor = 'unset';
      el.style.backgroundClip = 'unset';
      el.style.color = clip.fontColor || '#FFFFFF';
    }
    
    // Font
    if(clip.fontFamily) {
      el.style.fontFamily = clip.fontFamily + ', Inter, sans-serif';
      // Load Google Font if needed
      this._loadGoogleFont(clip.fontFamily);
    }
    
    // Background
    if(clip.bgColor && clip.bgColor !== 'transparent') {
      el.style.backgroundColor = clip.bgColor;
      el.style.padding = '8px 16px';
    } else {
      el.style.backgroundColor = 'transparent';
    }
    
    // Position
    if(clip.position === 'top') el.style.top = '25%';
    else if(clip.position === 'bottom') el.style.top = '75%';
    else el.style.top = '50%';
    
    // Template
    this._applyTemplate(el, clip);
    
    // Animation
    if(clip.animation && clip.animation !== 'none') {
      const prog = Math.min(1, (currentTime - clip.startTime) / 0.6);
      this._applyAnim(el, clip.animation, prog);
    }
  },

  _loadGoogleFont(fontName) {
    if(!fontName || fontName==='Inter' || fontName==='Arial') return;
    const id = 'gf-'+fontName.replace(/\s+/g,'-');
    if(document.getElementById(id)) return;
    
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g,'+')}:wght@400;700;900&display=swap`;
    document.head.appendChild(link);
    console.log('Loading Google Font:', fontName);
  },

  _applyTemplate(el, clip) {
    const t = clip.template || 'default';
    el.style.fontWeight = '700';
    el.style.webkitTextStroke = '0';
    el.style.letterSpacing = 'normal';
    el.style.textTransform = 'none';
    el.style.fontStyle = 'normal';
    el.style.border = 'none';
    
    switch(t) {
      case 'bold': el.style.fontWeight='900'; el.style.textShadow='3px 3px 0 #000'; break;
      case 'outline': el.style.webkitTextStroke='2px #000'; el.style.textShadow='none'; break;
      case 'shadow': el.style.textShadow='4px 4px 16px rgba(0,0,0,0.9)'; break;
      case 'neon': el.style.textShadow=`0 0 10px ${clip.fontColor}, 0 0 20px ${clip.fontColor}, 0 0 30px ${clip.fontColor}`; break;
      case 'retro': el.style.background='#FF3B30'; el.style.padding='8px 16px'; el.style.letterSpacing='2px'; el.style.textTransform='uppercase'; break;
      case 'elegant': el.style.fontFamily='Georgia, serif'; el.style.fontStyle='italic'; el.style.fontWeight='300'; break;
      case 'cinema': el.style.textTransform='uppercase'; el.style.letterSpacing='4px'; el.style.border=`2px solid ${clip.fontColor||'#FFF'}`; el.style.padding='8px 16px'; break;
      case '3d': el.style.textShadow='1px 1px 0 #000, 2px 2px 0 #000, 3px 3px 0 #000, 4px 4px 6px rgba(0,0,0,0.6)'; break;
    }
  },

  _applyAnim(el, anim, p) {
    switch(anim) {
      case 'fadeIn': el.style.opacity=p; break;
      case 'slideUp': el.style.opacity=p; el.style.transform=`translate(-50%, calc(-50% + ${(1-p)*40}px))`; break;
      case 'bounce': const b=Math.sin(p*Math.PI*2)*12; el.style.transform=`translate(-50%, calc(-50% + ${b}px))`; break;
      case 'scale': el.style.transform=`translate(-50%,-50%) scale(${0.5+p*0.5})`; el.style.opacity=p; break;
      default: el.style.opacity='1'; el.style.transform='translate(-50%,-50%)';
    }
  },

  _hide() {
    const sel = window.Selection?.selectedClip;
    if(sel && sel.type==='text') return; // Keep showing selected
    if(this.textEl) this.textEl.style.display='none';
  },

  applyFilter(clip) {
    if(this.videoEl && clip.filterCss) this.videoEl.style.filter = clip.filterCss;
  }
};

window.Renderer = Renderer;
setTimeout(()=>Renderer.init(), 1000);
