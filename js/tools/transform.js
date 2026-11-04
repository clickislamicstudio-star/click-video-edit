
/**
 * TransformTool v3.6 CAPCUT STYLE - Full Professional Transform
 * - First button in all layers (Video/Text/Overlay)
 * - Tabs: Position | Size | Rotation | Flip | Crop
 * - Sliders like reference images
 * - Smooth 4-corner handles + Multi-apply
 */
const TransformTool = {
  activeClip: null,
  boxEl: null,
  isDragging: false,
  isResizing: false,
  isRotating: false,
  startX:0, startY:0,
  startSize:0, startRot:0,
  startLeft:0, startTop:0,

  init() {
    console.log('TransformTool v3.6 CapCut Style');
  },

  // ===== HANDLES - Smooth 4 corners =====
  showHandles(clip) {
    if(!clip) return;
    this.activeClip = clip;
    this._removeBox();
    
    const textEl = window.Renderer?.textEl;
    const videoEl = document.getElementById('realVideo');
    let targetEl = null;
    let isText = clip.type==='text';
    
    if(isText) targetEl = textEl;
    else targetEl = videoEl; // For video/image
    
    if(!targetEl) return;
    if(isText && targetEl.style.display==='none') return;
    
    const wrap = document.getElementById('playerWrap');
    if(!wrap) return;
    
    // Get actual size from clip transform or default
    const scale = clip.transform?.scale || 1;
    const rot = clip.transform?.rotation || clip.rotation || 0;
    
    const box = document.createElement('div');
    box.id = 'textTransformBox';
    // Position based on textEl actual position
    if(isText) {
      const r = textEl.getBoundingClientRect();
      const wRect = wrap.getBoundingClientRect();
      box.style.cssText = `
        position:absolute;
        left:${textEl.offsetLeft - 20}px;
        top:${textEl.offsetTop - 20}px;
        width:${r.width + 40}px;
        height:${r.height + 40}px;
        border:2px dashed #8B5CF6;
        border-radius:8px;
        z-index:12;
        pointer-events:none;
        transform: rotate(${rot}deg);
        transform-origin: center;
        box-sizing:border-box;
      `;
    } else {
      // Video/Image - full player wrap box
      box.style.cssText = `
        position:absolute;
        left:2%;top:2%;width:96%;height:96%;
        border:2px dashed #8B5CF6;
        border-radius:8px;
        z-index:12;
        pointer-events:none;
        transform: rotate(${rot}deg) scale(${scale});
        transform-origin: center;
      `;
    }
    
    // Top-left: Delete ✕ (red)
    const del = document.createElement('div');
    del.innerHTML='✕';
    del.title='Delete';
    del.style.cssText='position:absolute;top:-14px;left:-14px;width:28px;height:28px;background:#FF3B30;color:#FFF;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;pointer-events:auto;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,0.5);border:2px solid #FFF;z-index:13';
    del.addEventListener('click', (e)=>{ e.stopPropagation(); this._deleteClip(); });
    box.appendChild(del);
    
    // Top-right: Rotate ↻ (purple)
    const rotEl = document.createElement('div');
    rotEl.innerHTML='↻';
    rotEl.title='Rotate';
    rotEl.style.cssText='position:absolute;top:-14px;right:-14px;width:28px;height:28px;background:#5856D6;color:#FFF;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;pointer-events:auto;cursor:grab;box-shadow:0 2px 10px rgba(0,0,0,0.5);border:2px solid #FFF;z-index:13';
    rotEl.addEventListener('pointerdown', (e)=>this._startRotate(e), {passive:false});
    box.appendChild(rotEl);
    
    // Bottom-right: Resize ↘ (white/purple) - smooth
    const res = document.createElement('div');
    res.innerHTML='⤡';
    res.title='Resize';
    res.style.cssText='position:absolute;bottom:-14px;right:-14px;width:30px;height:30px;background:#FFF;color:#5856D6;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;pointer-events:auto;cursor:nwse-resize;box-shadow:0 2px 10px rgba(0,0,0,0.5);border:2.5px solid #5856D6;z-index:13';
    res.addEventListener('pointerdown', (e)=>this._startResize(e), {passive:false});
    box.appendChild(res);
    
    // Bottom-left: Resize handle other side
    const res2 = document.createElement('div');
    res2.style.cssText='position:absolute;bottom:-6px;left:-6px;width:12px;height:12px;background:#FFF;border:2px solid #8B5CF6;border-radius:50%;pointer-events:auto;cursor:nesw-resize';
    res2.addEventListener('pointerdown', (e)=>this._startResize(e), {passive:false});
    box.appendChild(res2);
    
    // Top-left extra handle (besides delete) - for resize
    const res3 = document.createElement('div');
    res3.style.cssText='position:absolute;top:-6px;right:40px;width:12px;height:12px;background:#FFF;border:2px solid #8B5CF6;border-radius:50%;pointer-events:none';
    box.appendChild(res3);
    
    // Center drag area - smooth drag
    const drag = document.createElement('div');
    drag.style.cssText='position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:auto;cursor:move;touch-action:none';
    drag.addEventListener('pointerdown', (e)=>this._startDrag(e), {passive:false});
    box.appendChild(drag);
    
    wrap.appendChild(box);
    this.boxEl = box;
  },

  _removeBox() {
    const old=document.getElementById('textTransformBox');
    if(old) old.remove();
    this.boxEl=null;
  },

  _deleteClip() {
    if(!this.activeClip) return;
    if(window.TimelineUI){ TimelineUI.clips=TimelineUI.clips.filter(c=>c.id!==this.activeClip.id); TimelineUI.render(); }
    if(window.Selection) Selection.deselectAll();
    this._removeBox();
    if(window.Renderer) Renderer._hide();
    if(window.Toolbar) Toolbar.renderMain();
    ['textEditorModal','transformModal'].forEach(id=>{ const m=document.getElementById(id); if(m) m.style.display='none'; });
  },

  // Smooth drag using Pointer Events
  _startDrag(e){
    e.preventDefault();
    this.isDragging=true;
    this.startX=e.clientX; this.startY=e.clientY;
    const el=window.Renderer?.textEl;
    this._dragStartLeft=el?.offsetLeft||0;
    this._dragStartTop=el?.offsetTop||0;
    this._dragPointerId=e.pointerId;
    document.addEventListener('pointermove', this._onDragMoveBound = this._onDragMove.bind(this));
    document.addEventListener('pointerup', this._onDragEndBound = this._onDragEnd.bind(this));
    if(e.target.setPointerCapture) e.target.setPointerCapture(e.pointerId);
  },
  _onDragMove(e){
    if(!this.isDragging) return;
    if(this._dragPointerId!==undefined && e.pointerId!==this._dragPointerId) return;
    e.preventDefault();
    const dx=e.clientX-this.startX;
    const dy=e.clientY-this.startY;
    const clip=this.activeClip;
    if(!clip.transform) clip.transform={};
    clip.transform.x=(clip.transform.x||0)+dx*0.5;
    clip.transform.y=(clip.transform.y||0)+dy*0.5;
    
    // Update visual
    if(window.Renderer && window.Renderer.textEl){
      const el=window.Renderer.textEl;
      const newLeft=this._dragStartLeft+dx;
      const newTop=this._dragStartTop+dy;
      el.style.left=newLeft+'px';
      el.style.top=newTop+'px';
      el.style.transform=`translate(0,0) rotate(${clip.transform.rotation||clip.rotation||0}deg) scale(${clip.transform.scale||1})`;
    }
    if(this.boxEl){
      this.boxEl.style.left=(this._dragStartLeft+dx-20)+'px';
      this.boxEl.style.top=(this._dragStartTop+dy-20)+'px';
    }
    this.startX=e.clientX; this.startY=e.clientY;
    this._dragStartLeft+=dx; this._dragStartTop+=dy;
  },
  _onDragEnd(e){
    this.isDragging=false;
    document.removeEventListener('pointermove', this._onDragMoveBound);
    document.removeEventListener('pointerup', this._onDragEndBound);
  },

  _startResize(e){
    e.preventDefault(); e.stopPropagation();
    this.isResizing=true;
    this.startX=e.clientX; this.startY=e.clientY;
    this.startSize=this.activeClip.transform?.scale || this.activeClip.fontSize || 36;
    this._resizePointerId=e.pointerId;
    document.addEventListener('pointermove', this._onResizeMoveBound = this._onResizeMove.bind(this));
    document.addEventListener('pointerup', this._onResizeEndBound = this._onResizeEnd.bind(this));
    if(e.target.setPointerCapture) e.target.setPointerCapture(e.pointerId);
  },
  _onResizeMove(e){
    if(!this.isResizing) return;
    e.preventDefault();
    const dx=e.clientX-this.startX;
    const dy=e.clientY-this.startY;
    const dist=Math.sqrt(dx*dx+dy*dy) * (dx<0?-1:1);
    const clip=this.activeClip;
    if(!clip.transform) clip.transform={x:0,y:0,scale:1,rotation:0};
    
    if(clip.type==='text'){
      const newSize=Math.max(12, Math.min(150, this.startSize + dist*0.5));
      clip.fontSize=newSize;
      if(window.Renderer && window.Renderer.textEl) window.Renderer.textEl.style.fontSize=newSize+'px';
    } else {
      const newScale=Math.max(0.2, Math.min(3, this.startSize + dist*0.01));
      clip.transform.scale=newScale;
      if(window.Renderer && window.Renderer.textEl) window.Renderer.textEl.style.transform=`translate(-50%,-50%) rotate(${clip.transform.rotation||0}deg) scale(${newScale})`;
      const v=document.getElementById('transformScaleVal');
      if(v) v.textContent=newScale.toFixed(2)+'x';
      const v2=document.getElementById('sizeSliderVal');
      if(v2) v2.textContent=newScale.toFixed(2)+'x';
    }
    const sizeEl=document.getElementById('transformSizeVal');
    if(sizeEl && clip.type==='text') sizeEl.textContent=Math.round(clip.fontSize)+'px';
  },
  _onResizeEnd(e){
    this.isResizing=false;
    document.removeEventListener('pointermove', this._onResizeMoveBound);
    document.removeEventListener('pointerup', this._onResizeEndBound);
    if(window.TimelineUI) TimelineUI.render();
  },

  _startRotate(e){
    e.preventDefault(); e.stopPropagation();
    this.isRotating=true;
    this.startX=e.clientX;
    this.startRot=this.activeClip.transform?.rotation || this.activeClip.rotation || 0;
    this._rotatePointerId=e.pointerId;
    document.addEventListener('pointermove', this._onRotateMoveBound = this._onRotateMove.bind(this));
    document.addEventListener('pointerup', this._onRotateEndBound = this._onRotateEnd.bind(this));
    if(e.target.setPointerCapture) e.target.setPointerCapture(e.pointerId);
  },
  _onRotateMove(e){
    if(!this.isRotating) return;
    e.preventDefault();
    const dx=e.clientX-this.startX;
    const newRot=(this.startRot + dx*0.8) % 360;
    const clip=this.activeClip;
    if(!clip.transform) clip.transform={x:0,y:0,scale:1,rotation:0};
    clip.transform.rotation=newRot;
    clip.rotation=newRot;
    
    if(window.Renderer && window.Renderer.textEl){
      const s=clip.transform.scale||1;
      window.Renderer.textEl.style.transform=`translate(-50%,-50%) rotate(${newRot}deg) scale(${s})`;
    }
    if(this.boxEl) this.boxEl.style.transform=`rotate(${newRot}deg)`;
    
    const rotEl=document.getElementById('transformRotVal');
    if(rotEl) rotEl.textContent=Math.round(newRot)+'°';
    const rotSlider=document.getElementById('transformRot');
    if(rotSlider) rotSlider.value=newRot;
  },
  _onRotateEnd(){
    this.isRotating=false;
    document.removeEventListener('pointermove', this._onRotateMoveBound);
    document.removeEventListener('pointerup', this._onRotateEndBound);
  },

  // ===== CAPCUT STYLE TRANSFORM PANEL =====
  showTransformPanel(clip) {
    if(!clip) clip=this.activeClip||window.Selection?.selectedClip;
    if(!clip) return;
    this.activeClip=clip;
    if(!clip.transform) clip.transform={x:0,y:0,scale:1,rotation:0,flipX:false,flipY:false,cropLeft:0,cropRight:0,cropTop:0,cropBottom:0};
    
    let modal=document.getElementById('transformModal');
    if(!modal){
      modal=document.createElement('div'); modal.id='transformModal';
      modal.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;z-index:305;display:flex;flex-direction:column;pointer-events:none';
      modal.innerHTML='<div id="transformBackdrop" style="flex:1;background:transparent;pointer-events:auto"></div><div id="transformContent" style="background:#1E1E1E;border-radius:22px 22px 0 0;max-height:52vh;min-height:44vh;display:flex;flex-direction:column;pointer-events:auto;border-top:1.5px solid #FF9500;box-shadow:0 -8px 32px rgba(0,0,0,0.8)"></div>';
      document.body.appendChild(modal);
    }
    const content=modal.querySelector('#transformContent');
    
    // Build panel exactly like your screenshots
    content.innerHTML=`
      <div style="display:flex;justify-content:center;padding:8px 0 4px"><div style="width:36px;height:4px;background:#3A3A3E;border-radius:2px"></div></div>
      <div style="padding:0 14px 10px;height:44px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #2A2A2A;flex-shrink:0">
        <div style="display:flex;gap:8px;align-items:center"><span style="background:#FF9500;color:#FFF;padding:4px 8px;border-radius:7px;font-size:9px;font-weight:800">TRANSFORM</span><span style="color:#FFF;font-size:13px;font-weight:600;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${clip.name||clip.text?.substr(0,18)||'Clip'}</span></div>
        <button id="closeTransformTop" style="background:#2A2A2A;border:none;color:#8E8E93;width:28px;height:28px;border-radius:50%;font-size:12px">✕</button>
      </div>

      <div id="transformTabContent" style="overflow-y:auto;padding:14px;flex:1;background:#1E1E1E">
        <!-- Position Tab Content -->
        <div id="tTab-position" class="tTab" style="display:block">
          <div style="display:flex;flex-direction:column;gap:16px">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span style="color:#FFF;font-size:13px;font-weight:500">X</span><span id="xVal" style="color:#8E8E93;font-size:12px">${clip.transform.x||0}</span></div>
              <div style="position:relative;height:32px;display:flex;align-items:center"><span style="color:#666;font-size:10px;position:absolute;left:0">-10</span><span style="color:#666;font-size:10px;position:absolute;left:25%">-5</span><span style="color:#FFF;font-size:10px;position:absolute;left:50%;transform:translateX(-50%);font-weight:700">0</span><span style="color:#666;font-size:10px;position:absolute;left:75%">5</span><span style="color:#666;font-size:10px;position:absolute;right:0">10</span><div style="position:absolute;top:50%;left:0;right:0;height:2px;background:#333"></div><div style="position:absolute;top:50%;left:50%;width:2px;height:12px;background:#0A84FF;transform:translate(-50%,-50%)"></div><input id="xSlider" type="range" min="-10" max="10" step="0.1" value="${clip.transform.x||0}" style="width:100%;position:absolute;opacity:0;height:32px;cursor:pointer"></div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span style="color:#FFF;font-size:13px;font-weight:500">Y</span><span id="yVal" style="color:#8E8E93;font-size:12px">${clip.transform.y||0}</span></div>
              <div style="position:relative;height:32px;display:flex;align-items:center"><span style="color:#666;font-size:10px;position:absolute;left:0">-10</span><span style="color:#666;font-size:10px;position:absolute;left:25%">-5</span><span style="color:#FFF;font-size:10px;position:absolute;left:50%;transform:translateX(-50%);font-weight:700">0</span><span style="color:#666;font-size:10px;position:absolute;left:75%">5</span><span style="color:#666;font-size:10px;position:absolute;right:0">10</span><div style="position:absolute;top:50%;left:0;right:0;height:2px;background:#333"></div><div style="position:absolute;top:50%;left:50%;width:2px;height:12px;background:#0A84FF;transform:translate(-50%,-50%)"></div><input id="ySlider" type="range" min="-10" max="10" step="0.1" value="${clip.transform.y||0}" style="width:100%;position:absolute;opacity:0;height:32px;cursor:pointer"></div>
            </div>
          </div>
        </div>

        <!-- Size Tab -->
        <div id="tTab-size" class="tTab" style="display:none">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span style="color:#FFF;font-size:13px;font-weight:500">Size</span><span id="sizeSliderVal" style="color:#8E8E93;font-size:12px">${(clip.transform.scale||1).toFixed(2)}x</span></div>
            <div style="position:relative;height:32px;display:flex;align-items:center"><span style="color:#666;font-size:10px;position:absolute;left:0">0.5x</span><span style="color:#666;font-size:10px;position:absolute;left:20%">0.90x</span><span style="color:#666;font-size:10px;position:absolute;left:40%">0.95x</span><span style="color:#FFF;font-size:10px;position:absolute;left:60%;transform:translateX(-50%);font-weight:700">1.00x</span><span style="color:#666;font-size:10px;position:absolute;left:80%">1.05x</span><span style="color:#666;font-size:10px;position:absolute;right:0">1.10x</span><div style="position:absolute;top:50%;left:0;right:0;height:2px;background:#333"></div><div style="position:absolute;top:50%;left:60%;width:2px;height:12px;background:#0A84FF;transform:translate(-50%,-50%)"></div><input id="sizeSlider" type="range" min="0.2" max="3" step="0.05" value="${clip.transform.scale||1}" style="width:100%;position:absolute;opacity:0;height:32px;cursor:pointer"></div>
          </div>
        </div>

        <!-- Rotation Tab -->
        <div id="tTab-rotation" class="tTab" style="display:none">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <button id="rotMinus45" style="background:#2A2A2A;border:none;color:#FFF;width:56px;height:56px;border-radius:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px"><span style="font-size:18px">↺</span><span style="font-size:11px">-45°</span></button>
            <div style="flex:1"></div>
            <button id="rotPlus45" style="background:#2A2A2A;border:none;color:#FFF;width:56px;height:56px;border-radius:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px"><span style="font-size:18px">↻</span><span style="font-size:11px">+45°</span></button>
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span style="color:#FFF;font-size:13px">Rotation</span><span id="transformRotVal" style="color:#8E8E93;font-size:12px">${Math.round(clip.transform.rotation||0)}°</span></div>
            <div style="position:relative;height:32px;display:flex;align-items:center"><span style="color:#666;font-size:10px;position:absolute;left:0">-20</span><span style="color:#666;font-size:10px;position:absolute;left:20%">-10</span><span style="color:#666;font-size:10px;position:absolute;left:40%">-5</span><span style="color:#FFF;font-size:10px;position:absolute;left:50%;transform:translateX(-50%);font-weight:700">0</span><span style="color:#666;font-size:10px;position:absolute;left:60%">5</span><span style="color:#666;font-size:10px;position:absolute;left:80%">10</span><span style="color:#666;font-size:10px;position:absolute;right:0">20</span><div style="position:absolute;top:50%;left:0;right:0;height:2px;background:#333"></div><div style="position:absolute;top:50%;left:50%;width:2px;height:12px;background:#0A84FF;transform:translate(-50%,-50%)"></div><input id="transformRot" type="range" min="-180" max="180" step="1" value="${clip.transform.rotation||0}" style="width:100%;position:absolute;opacity:0;height:32px;cursor:pointer"></div>
          </div>
        </div>

        <!-- Flip Tab -->
        <div id="tTab-flip" class="tTab" style="display:none">
          <div style="display:flex;gap:60px;justify-content:center;padding:20px 0">
            <button id="flipXBtn" style="background:${clip.transform.flipX?'#0A84FF':'#2A2A2A'};border:none;color:#FFF;padding:16px 24px;border-radius:14px;display:flex;flex-direction:column;align-items:center;gap:8px;min-width:80px"><span style="font-size:28px">⇋</span><span style="font-size:12px">Flip X</span></button>
            <button id="flipYBtn" style="background:${clip.transform.flipY?'#0A84FF':'#2A2A2A'};border:none;color:#FFF;padding:16px 24px;border-radius:14px;display:flex;flex-direction:column;align-items:center;gap:8px;min-width:80px"><span style="font-size:28px">⇅</span><span style="font-size:12px">Flip Y</span></button>
          </div>
        </div>

        <!-- Crop Tab -->
        <div id="tTab-crop" class="tTab" style="display:none">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <div><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#FFF;font-size:13px">Left</span><span style="color:#8E8E93;font-size:12px">${clip.transform.cropLeft||0}</span></div><div style="position:relative;height:24px"><span style="color:#666;font-size:9px;position:absolute;left:0">0</span><span style="color:#666;font-size:9px;position:absolute;right:0">5</span><div style="position:absolute;top:50%;left:0;right:0;height:2px;background:#333"></div><div style="position:absolute;top:50%;left:0;width:2px;height:10px;background:#0A84FF"></div><input id="cropLeft" type="range" min="0" max="50" value="${clip.transform.cropLeft||0}" style="width:100%;position:absolute;opacity:0;height:24px"></div></div>
            <div><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#FFF;font-size:13px">Right</span><span style="color:#8E8E93;font-size:12px">${clip.transform.cropRight||0}</span></div><div style="position:relative;height:24px"><span style="color:#666;font-size:9px;position:absolute;left:0">0</span><span style="color:#666;font-size:9px;position:absolute;right:0">5</span><div style="position:absolute;top:50%;left:0;right:0;height:2px;background:#333"></div><div style="position:absolute;top:50%;left:0;width:2px;height:10px;background:#0A84FF"></div><input id="cropRight" type="range" min="0" max="50" value="${clip.transform.cropRight||0}" style="width:100%;position:absolute;opacity:0;height:24px"></div></div>
            <div><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#FFF;font-size:13px">Crop Top</span><span style="color:#8E8E93;font-size:12px">${clip.transform.cropTop||0}</span></div><div style="position:relative;height:24px"><span style="color:#666;font-size:9px;position:absolute;left:0">0</span><span style="color:#666;font-size:9px;position:absolute;right:0">5</span><div style="position:absolute;top:50%;left:0;right:0;height:2px;background:#333"></div><div style="position:absolute;top:50%;left:0;width:2px;height:10px;background:#0A84FF"></div><input id="cropTop" type="range" min="0" max="50" value="${clip.transform.cropTop||0}" style="width:100%;position:absolute;opacity:0;height:24px"></div></div>
            <div><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#FFF;font-size:13px">Crop Bottom</span><span style="color:#8E8E93;font-size:12px">${clip.transform.cropBottom||0}</span></div><div style="position:relative;height:24px"><span style="color:#666;font-size:9px;position:absolute;left:0">0</span><span style="color:#666;font-size:9px;position:absolute;right:0">5</span><div style="position:absolute;top:50%;left:0;right:0;height:2px;background:#333"></div><div style="position:absolute;top:50%;left:0;width:2px;height:10px;background:#0A84FF"></div><input id="cropBottom" type="range" min="0" max="50" value="${clip.transform.cropBottom||0}" style="width:100%;position:absolute;opacity:0;height:24px"></div></div>
          </div>
        </div>
      </div>

      <div style="display:flex;background:#121212;border-top:1px solid #2A2A2A;overflow-x:auto;flex-shrink:0">
        <button class="tTabBtn active" data-tab="position" style="flex:1;background:transparent;color:#0A84FF;border:none;padding:12px 8px;font-size:13px;font-weight:700;border-bottom:2px solid #0A84FF;white-space:nowrap">Position</button>
        <button class="tTabBtn" data-tab="size" style="flex:1;background:transparent;color:#8E8E93;border:none;padding:12px 8px;font-size:13px;font-weight:500;border-bottom:2px solid transparent;white-space:nowrap">Size</button>
        <button class="tTabBtn" data-tab="rotation" style="flex:1;background:transparent;color:#8E8E93;border:none;padding:12px 8px;font-size:13px;font-weight:500;border-bottom:2px solid transparent;white-space:nowrap">Rotation</button>
        <button class="tTabBtn" data-tab="flip" style="flex:1;background:transparent;color:#8E8E93;border:none;padding:12px 8px;font-size:13px;font-weight:500;border-bottom:2px solid transparent;white-space:nowrap">Flip</button>
        <button class="tTabBtn" data-tab="crop" style="flex:1;background:transparent;color:#8E8E93;border:none;padding:12px 8px;font-size:13px;font-weight:500;border-bottom:2px solid transparent;white-space:nowrap">Crop</button>
      </div>

      <div style="padding:12px 14px;border-top:1px solid #2A2A2A;display:flex;gap:10px;background:#121212;flex-shrink:0">
        <button id="multiApply" style="background:#2A2A2A;color:#FFF;border:1px solid #3A3A3A;padding:14px 20px;border-radius:24px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:6px"><span>✓</span> Multi-apply</button>
        <button id="doneTransform" style="flex:1;background:#0A84FF;color:#FFF;border:none;padding:14px;border-radius:24px;font-weight:800;font-size:15px">Done</button>
      </div>
    `;
    
    modal.style.display='flex';
    if(window.Renderer && window.Renderer.textEl) window.Renderer.textEl.style.top='28%';
    this.showHandles(clip);

    // Tab switching
    const switchT = (tab) => {
      content.querySelectorAll('.tTab').forEach(t=>t.style.display='none');
      const target=content.querySelector('#tTab-'+tab);
      if(target) target.style.display='block';
      content.querySelectorAll('.tTabBtn').forEach(b=>{
        b.style.color='#8E8E93'; b.style.borderBottom='2px solid transparent'; b.style.fontWeight='500';
        if(b.dataset.tab===tab){ b.style.color='#0A84FF'; b.style.borderBottom='2px solid #0A84FF'; b.style.fontWeight='700'; }
      });
    };
    content.querySelectorAll('.tTabBtn').forEach(btn=>{ btn.addEventListener('click', ()=>switchT(btn.dataset.tab)); });

    // Apply transform to element
    const applyTransform = () => {
      const el=window.Renderer?.textEl;
      const vEl=document.getElementById('realVideo');
      const t=clip.transform;
      if(!t) return;
      
      let transformStr='';
      transformStr+=` translate(${t.x*5}px, ${t.y*5}px)`;
      transformStr+=` rotate(${t.rotation||0}deg)`;
      transformStr+=` scale(${t.scale||1})`;
      if(t.flipX) transformStr+=` scaleX(-1)`;
      if(t.flipY) transformStr+=` scaleY(-1)`;
      
      if(clip.type==='text' && el){
        el.style.transform=`translate(-50%,-50%) ${transformStr}`;
        el.style.clipPath = (t.cropLeft||t.cropRight||t.cropTop||t.cropBottom) ? `inset(${t.cropTop||0}% ${t.cropRight||0}% ${t.cropBottom||0}% ${t.cropLeft||0}%)` : 'none';
      } else if(vEl){
        vEl.style.transform=transformStr;
        vEl.style.clipPath = (t.cropLeft||t.cropRight||t.cropTop||t.cropBottom) ? `inset(${t.cropTop||0}% ${t.cropRight||0}% ${t.cropBottom||0}% ${t.cropLeft||0}%)` : 'none';
      }
    };

    // Sliders
    content.querySelector('#xSlider')?.addEventListener('input', (e)=>{
      clip.transform.x=parseFloat(e.target.value);
      content.querySelector('#xVal').textContent=e.target.value;
      applyTransform();
    });
    content.querySelector('#ySlider')?.addEventListener('input', (e)=>{
      clip.transform.y=parseFloat(e.target.value);
      content.querySelector('#yVal').textContent=e.target.value;
      applyTransform();
    });
    content.querySelector('#sizeSlider')?.addEventListener('input', (e)=>{
      clip.transform.scale=parseFloat(e.target.value);
      content.querySelector('#sizeSliderVal').textContent=parseFloat(e.target.value).toFixed(2)+'x';
      applyTransform();
    });
    content.querySelector('#transformRot')?.addEventListener('input', (e)=>{
      const r=parseFloat(e.target.value);
      clip.transform.rotation=r; clip.rotation=r;
      content.querySelector('#transformRotVal').textContent=Math.round(r)+'°';
      applyTransform();
      if(this.boxEl) this.boxEl.style.transform=`rotate(${r}deg)`;
    });
    content.querySelector('#rotMinus45')?.addEventListener('click', ()=>{
      clip.transform.rotation=(clip.transform.rotation||0)-45;
      content.querySelector('#transformRot').value=clip.transform.rotation;
      content.querySelector('#transformRotVal').textContent=Math.round(clip.transform.rotation)+'°';
      applyTransform();
    });
    content.querySelector('#rotPlus45')?.addEventListener('click', ()=>{
      clip.transform.rotation=(clip.transform.rotation||0)+45;
      content.querySelector('#transformRot').value=clip.transform.rotation;
      content.querySelector('#transformRotVal').textContent=Math.round(clip.transform.rotation)+'°';
      applyTransform();
    });
    content.querySelector('#flipXBtn')?.addEventListener('click', (e)=>{
      clip.transform.flipX=!clip.transform.flipX;
      e.currentTarget.style.background=clip.transform.flipX?'#0A84FF':'#2A2A2A';
      applyTransform();
    });
    content.querySelector('#flipYBtn')?.addEventListener('click', (e)=>{
      clip.transform.flipY=!clip.transform.flipY;
      e.currentTarget.style.background=clip.transform.flipY?'#0A84FF':'#2A2A2A';
      applyTransform();
    });
    content.querySelector('#cropLeft')?.addEventListener('input', (e)=>{ clip.transform.cropLeft=parseInt(e.target.value); applyTransform(); });
    content.querySelector('#cropRight')?.addEventListener('input', (e)=>{ clip.transform.cropRight=parseInt(e.target.value); applyTransform(); });
    content.querySelector('#cropTop')?.addEventListener('input', (e)=>{ clip.transform.cropTop=parseInt(e.target.value); applyTransform(); });
    content.querySelector('#cropBottom')?.addEventListener('input', (e)=>{ clip.transform.cropBottom=parseInt(e.target.value); applyTransform(); });
    
    content.querySelector('#multiApply')?.addEventListener('click', ()=>{
      if(!window.TimelineUI) return;
      TimelineUI.clips.filter(c=>c.type===clip.type).forEach(c=>{
        if(!c.transform) c.transform={x:0,y:0,scale:1,rotation:0,flipX:false,flipY:false,cropLeft:0,cropRight:0,cropTop:0,cropBottom:0};
        Object.assign(c.transform, clip.transform);
        c.rotation=clip.transform.rotation;
      });
      TimelineUI.render();
      const info=document.getElementById('info'); if(info){ info.textContent='Applied to all '+clip.type+' clips'; setTimeout(()=>info.textContent='Phase 3.6 CapCut Transform',2000); }
    });

    const close=()=>{
      modal.style.display='none';
      this._removeBox();
      if(window.Renderer && window.Renderer.textEl){ window.Renderer.textEl.style.top='50%'; }
      if(window.TimelineUI) TimelineUI.render();
    };
    content.querySelector('#doneTransform')?.addEventListener('click', close);
    content.querySelector('#closeTransformTop')?.addEventListener('click', close);
    modal.querySelector('#transformBackdrop')?.addEventListener('click', close);
  }
};
window.TransformTool=TransformTool;
setTimeout(()=>TransformTool.init(), 1000);

window.TransformEngine = TransformTool;
window.TransformTool = TransformTool;

// Alias for checker compatibility
if(!window.TransformEngine) window.TransformEngine = window.TransformTool;
