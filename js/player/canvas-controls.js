
/**
 * Folder: js/player/ File: canvas-controls.js v2.0 FINAL - Universal 4-Corner Handles - Master Prompt
 * Bottom-Right Resize, Top-Right Rotate, Top-Left Close - No Emoji - SVG Only - For Text/Sticker/Video/PIP
 * Icon System: Material 3 Rounded, Floating Actions 28px
 */
const CanvasControls = {
  activeClip: null,
  box: null,
  init(){
    this.wrap = document.getElementById('playerWrap');
    if(!this.wrap) return;
    if(this.box) return;
    console.log('CanvasControls v2.0 - Universal Handles - No Emoji - Edit First Compliant');
    this.box = document.createElement('div');
    this.box.id = 'canvasControlBox';
    this.box.style.cssText = 'position:absolute;inset:0;border:2px dashed #8B5CF6;display:none;z-index:20;pointer-events:none;border-radius:4px';
    this.box.innerHTML = `
      <div data-handle="close" style="position:absolute;left:-14px;top:-14px;width:28px;height:28px;background:#FF3B30;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;pointer-events:auto;box-shadow:0 2px 8px rgba(0,0,0,0.4)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </div>
      <div data-handle="rotate" style="position:absolute;right:-14px;top:-14px;width:28px;height:28px;background:#FFF;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;pointer-events:auto;box-shadow:0 2px 8px rgba(0,0,0,0.4)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.7 1 6.3 2.7L21 8V3h-5l2.3 2.3A7 7 0 1 0 21 12z"/></svg>
      </div>
      <div data-handle="resize" style="position:absolute;right:-14px;bottom:-14px;width:28px;height:28px;background:#0A84FF;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:nwse-resize;pointer-events:auto;box-shadow:0 2px 8px rgba(0,0,0,0.4)">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="2.5"><path d="M21 21l-6-6m6 6v-4m0 4h-4M3 3l6 6M3 3v4m0-4h4"/></svg>
      </div>
      <div style="position:absolute;left:50%;top:-20px;transform:translateX(-50%);background:rgba(0,0,0,0.7);color:#FFF;padding:2px 6px;border-radius:6px;font-size:9px;white-space:nowrap" id="sizeLabel">100%, 0°</div>
    `;
    this.wrap.appendChild(this.box);
    this.box.querySelector('[data-handle="close"]').addEventListener('click', (e)=>{
      e.stopPropagation();
      if(this.activeClip && window.TimelineUI){
        TimelineUI.clips = TimelineUI.clips.filter(c=>c.id!==this.activeClip.id);
        TimelineUI.render();
        if(window.Selection) Selection.deselectAll();
        this.hide();
      }
    });
    this.initDrag();
    if(window.EventBus){
      EventBus.on(EventBus.EVENTS.CLIP_SELECTED, (c)=>{
        const real=c.clip||c;
        const found=window.TimelineUI? TimelineUI.clips.find(x=>x.id===real.id):null;
        this.show(found||real);
      });
      EventBus.on(EventBus.EVENTS.CLIP_DESELECTED, ()=> this.hide());
    }
  },
  show(clip){
    if(!clip) return;
    this.activeClip=clip;
    if(!this.box) return;
    this.box.style.display='block';
    this.updateLabel();
  },
  hide(){
    this.activeClip=null;
    if(this.box) this.box.style.display='none';
  },
  updateLabel(){
    if(!this.activeClip || !this.box) return;
    const t=this.activeClip.transform||{scale:1,rotation:0};
    const label=this.box.querySelector('#sizeLabel');
    if(label) label.textContent=`${Math.round((t.scale||1)*100)}%, ${Math.round(t.rotation||0)}°`;
  },
  initDrag(){
    let startX,startY,startScale;
    const resizeHandle=this.box.querySelector('[data-handle="resize"]');
    const rotateHandle=this.box.querySelector('[data-handle="rotate"]');
    const onResizeMove=(e)=>{
      if(!this.activeClip) return;
      const dx=e.clientX-startX;
      const dy=e.clientY-startY;
      const dist=Math.sqrt(dx*dx+dy*dy);
      const scaleChange=dist/200 * (dx<0?-1:1);
      const newScale=Math.max(0.3, Math.min(3, startScale+scaleChange));
      this.activeClip.transform.scale=newScale;
      if(window.Renderer) Renderer.showClip(this.activeClip);
      this.updateLabel();
    };
    const onRotateMove=(e)=>{
      if(!this.activeClip) return;
      const rect=this.wrap.getBoundingClientRect();
      const cx=rect.left+rect.width/2;
      const cy=rect.top+rect.height/2;
      const angle=Math.atan2(e.clientY-cy, e.clientX-cx)*180/Math.PI;
      this.activeClip.transform.rotation=angle-90;
      if(window.Renderer) Renderer.showClip(this.activeClip);
      this.updateLabel();
    };
    resizeHandle.addEventListener('pointerdown', (e)=>{
      e.preventDefault();
      startX=e.clientX; startY=e.clientY;
      startScale=this.activeClip.transform.scale||1;
      const move=(ev)=>onResizeMove(ev);
      const up=()=>{ document.removeEventListener('pointermove',move); document.removeEventListener('pointerup',up); };
      document.addEventListener('pointermove',move);
      document.addEventListener('pointerup',up);
    });
    rotateHandle.addEventListener('pointerdown', (e)=>{
      e.preventDefault();
      const move=(ev)=>onRotateMove(ev);
      const up=()=>{ document.removeEventListener('pointermove',move); document.removeEventListener('pointerup',up); };
      document.addEventListener('pointermove',move);
      document.addEventListener('pointerup',up);
    });
  }
};
window.CanvasControls = CanvasControls;
setTimeout(()=>CanvasControls.init(), 600);
