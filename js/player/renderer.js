/**
 * js/player/renderer.js - Phase 3.1 FIX - Real Compositing Engine
 * Video + Text Layers + Filters + InShot Style Preview
 * This is the RENDERING LAYER - composits all layers on player
 */
const Renderer = {
  canvas: null,
  ctx: null,
  videoEl: null,
  textOverlayEl: null,
  animationFrame: null,

  init() {
    this.videoEl = document.getElementById('realVideo');
    this.textOverlayEl = document.getElementById('textOverlay');
    
    // Ensure textOverlay is positioned over video
    if(this.textOverlayEl) {
      this.textOverlayEl.style.cssText = `
        position:absolute;
        top:50%;left:50%;
        transform:translate(-50%,-50%);
        color:white;
        font-size:32px;
        font-weight:bold;
        text-align:center;
        text-shadow:2px 2px 8px rgba(0,0,0,0.8);
        pointer-events:none;
        z-index:20;
        max-width:85%;
        word-wrap:break-word;
        line-height:1.2;
        display:none;
        font-family:Inter,Arial,sans-serif;
      `;
      // Move textOverlay inside playerWrap for correct positioning
      const wrap = document.getElementById('playerWrap');
      if(wrap && this.textOverlayEl.parentElement !== wrap) {
        wrap.appendChild(this.textOverlayEl);
      }
    }
    
    this._startRenderLoop();
    console.log('Renderer Phase3.1 - Compositing Engine Ready');
  },

  _startRenderLoop() {
    const loop = () => {
      this.render();
      this.animationFrame = requestAnimationFrame(loop);
    };
    loop();
  },

  render() {
    const currentTime = window.TimelineUI?.currentTime || 0;
    const clips = window.TimelineUI?.clips || [];
    
    // Find active text clips at currentTime
    const activeTextClips = clips.filter(c => 
      c.type==='text' && 
      currentTime >= c.startTime && 
      currentTime <= c.endTime
    );
    
    // Also show selected text clip even if slightly outside (for editing)
    const selected = window.Selection?.selectedClip;
    let clipToShow = activeTextClips[0] || null;
    
    if(!clipToShow && selected && selected.type==='text') {
      // Show selected clip for 2 sec after selection even if playhead outside
      clipToShow = selected;
    }
    
    if(clipToShow) {
      this._renderTextClip(clipToShow, currentTime);
    } else {
      this._hideText();
    }
    
    // Apply filters to video
    if(this.videoEl && selected && selected.type==='video' && selected.filterCss) {
      this.videoEl.style.filter = selected.filterCss;
    }
  },

  _renderTextClip(clip, currentTime) {
    if(!this.textOverlayEl) return;
    
    const el = this.textOverlayEl;
    el.textContent = clip.text || 'Sample Text';
    el.style.display = 'block';
    
    // Font size - responsive
    const fontSize = clip.fontSize || 32;
    el.style.fontSize = fontSize + 'px';
    
    // Color
    el.style.color = clip.fontColor || '#FFFFFF';
    
    // Font family
    el.style.fontFamily = (clip.fontFamily || 'Inter') + ', Arial, sans-serif';
    
    // Background
    if(clip.bgColor && clip.bgColor !== 'transparent') {
      el.style.background = clip.bgColor;
      el.style.padding = '8px 16px';
      el.style.borderRadius = '8px';
    } else {
      el.style.background = 'rgba(0,0,0,0.0)';
      el.style.padding = '0';
    }
    
    // Template styles
    this._applyTemplate(el, clip);
    
    // Animation
    if(clip.animation && clip.animation !== 'none') {
      const progress = Math.min(1, (currentTime - clip.startTime) / 0.5); // 0.5s animation
      this._applyAnimation(el, clip.animation, progress);
    } else {
      el.style.opacity = '1';
      el.style.transform = 'translate(-50%,-50%)';
    }
    
    // Position
    if(clip.position) {
      if(clip.position === 'top') el.style.top = '20%';
      else if(clip.position === 'bottom') el.style.top = '80%';
      else el.style.top = '50%';
    }
  },

  _applyTemplate(el, clip) {
    const template = clip.template || 'default';
    
    switch(template) {
      case 'bold':
        el.style.fontWeight = '900';
        el.style.textShadow = '3px 3px 0px rgba(0,0,0,0.8)';
        break;
      case 'outline':
        el.style.fontWeight = '800';
        el.style.WebkitTextStroke = '2px black';
        el.style.textShadow = 'none';
        break;
      case 'shadow':
        el.style.textShadow = '4px 4px 12px rgba(0,0,0,0.9)';
        break;
      case 'neon':
        el.style.textShadow = `0 0 10px ${clip.fontColor}, 0 0 20px ${clip.fontColor}`;
        el.style.fontWeight = '700';
        break;
      case 'retro':
        el.style.fontFamily = 'Courier New, monospace';
        el.style.textTransform = 'uppercase';
        el.style.letterSpacing = '3px';
        el.style.background = '#FF3B30';
        el.style.padding = '8px 16px';
        break;
      case 'elegant':
        el.style.fontFamily = 'serif';
        el.style.fontStyle = 'italic';
        el.style.fontWeight = '300';
        break;
      default:
        el.style.fontWeight = '700';
        el.style.WebkitTextStroke = '0';
        el.style.letterSpacing = 'normal';
        el.style.textTransform = 'none';
    }
  },

  _applyAnimation(el, anim, progress) {
    switch(anim) {
      case 'fadeIn':
        el.style.opacity = progress;
        break;
      case 'slideUp':
        el.style.opacity = progress;
        el.style.transform = `translate(-50%, calc(-50% + ${(1-progress)*30}px))`;
        break;
      case 'typewriter':
        const text = el.textContent;
        const chars = Math.floor(text.length * progress);
        el.textContent = text.substr(0, chars);
        el.style.opacity = '1';
        break;
      case 'bounce':
        const bounce = Math.sin(progress * Math.PI * 2) * 10;
        el.style.transform = `translate(-50%, calc(-50% + ${bounce}px))`;
        el.style.opacity = '1';
        break;
      case 'scale':
        el.style.transform = `translate(-50%,-50%) scale(${0.5 + progress*0.5})`;
        el.style.opacity = progress;
        break;
      default:
        el.style.opacity = '1';
    }
  },

  _hideText() {
    if(this.textOverlayEl) {
      // Don't hide if text clip is selected (for editing)
      const selected = window.Selection?.selectedClip;
      if(selected && selected.type==='text') return;
      this.textOverlayEl.style.display = 'none';
    }
  },

  applyFilter(clip) {
    if(this.videoEl && clip.filterCss) {
      this.videoEl.style.filter = clip.filterCss;
    }
  }
};

window.Renderer = Renderer;
document.addEventListener('DOMContentLoaded', ()=> setTimeout(()=>Renderer.init(), 800));
