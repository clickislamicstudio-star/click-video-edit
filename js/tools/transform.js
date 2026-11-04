
/**
 * Transform Tool v3.5 - Professional Text Handles + Transform Panel
 * Features: Resize (bottom-right), Rotate (top-right), Delete (top-left), Transform panel (Position, Rotation, Size)
 */
const TransformTool = {
  activeClip: null,
  boxEl: null,
  isDragging: false,
  isResizing: false,
  isRotating: false,
  startX:0, startY:0, startSize:0, startRot:0,

  init() {
    console.log('TransformTool v3.5 - Handles + Transform panel');
  },

  showHandles(clip) {
    if(!clip || clip.type!=='text') return;
    this.activeClip = clip;
    this._removeBox();
    
    const textEl = window.Renderer?.textEl;
    if(!textEl || textEl.style.display==='none') return;
    
    const rect = textEl.getBoundingClientRect();
    const wrap = document.getElementById('playerWrap');
    if(!wrap) return;
    
    const box = document.createElement('div');
    box.id = 'textTransformBox';
    box.style.cssText = `
      position:absolute;
      left:${textEl.offsetLeft - 16}px;
      top:${textEl.offsetTop - 16}px;
      width:${rect.width + 32}px;
      height:${rect.height + 32}px;
      border:1.5px dashed #5856D6;
      border-radius:8px;
      z-index:10;
      pointer-events:none;
      transform: rotate(${clip.rotation||0}deg);
      transform-origin: center;
    `;
    
    // Top-left: Delete ✕
    const del = document.createElement('div');
    del.innerHTML='✕';
    del.style.cssText='position:absolute;top:-12px;left:-12px;width:28px;height:28px;background:#FF3B30;color:#FFF;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;pointer-events:auto;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.4);border:2px solid #FFF';
    del.addEventListener('click', (e)=>{ e.stopPropagation(); this._deleteClip(); });
    box.appendChild(del);
    
    // Top-right: Rotate 🔄
    const rot = document.createElement('div');
    rot.innerHTML='↻';
    rot.style.cssText='position:absolute;top:-12px;right:-12px;width:28px;height:28px;background:#5856D6;color:#FFF;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;pointer-events:auto;cursor:grab;box-shadow:0 2px 8px rgba(0,0,0,0.4);border:2px solid #FFF';
    rot.addEventListener('touchstart', (e)=>this._startRotate(e), {passive:false});
    rot.addEventListener('mousedown', (e)=>this._startRotate(e));
    box.appendChild(rot);
    
    // Bottom-right: Resize ↘
    const res = document.createElement('div');
    res.innerHTML='⤡';
    res.style.cssText='position:absolute;bottom:-12px;right:-12px;width:28px;height:28px;background:#FFF;color:#5856D6;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;pointer-events:auto;cursor:nwse-resize;box-shadow:0 2px 8px rgba(0,0,0,0.4);border:2px solid #5856D6';
    res.addEventListener('touchstart', (e)=>this._startResize(e), {passive:false});
    res.addEventListener('mousedown', (e)=>this._startResize(e));
    box.appendChild(res);
    
    // Center drag area
    const drag = document.createElement('div');
    drag.style.cssText='position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:auto;cursor:move';
    drag.addEventListener('touchstart', (e)=>this._startDrag(e), {passive:false});
    drag.addEventListener('mousedown', (e)=>this._startDrag(e));
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
    const m=document.getElementById('textEditorModal'); if(m) m.style.display='none';
  },

  _startDrag(e) {
    e.preventDefault();
    this.isDragging=true;
    const t=e.touches?e.touches[0]:e;
    this.startX=t.clientX; this.startY=t.clientY;
    const clip=this.activeClip;
    this._dragStartLeft = window.Renderer?.textEl?.offsetLeft || 0;
    this._dragStartTop = window.Renderer?.textEl?.offsetTop || 0;
    document.addEventListener('mousemove', this._onDragMove.bind(this));
    document.addEventListener('mouseup', this._onDragEnd.bind(this));
    document.addEventListener('touchmove', this._onDragMove.bind(this), {passive:false});
    document.addEventListener('touchend', this._onDragEnd.bind(this));
  },
  _onDragMove(e){
    if(!this.isDragging) return;
    e.preventDefault();
    const t=e.touches?e.touches[0]:e;
    const dx=t.clientX-this.startX;
    const dy=t.clientY-this.startY;
    if(window.Renderer && window.Renderer.textEl){
      const el=window.Renderer.textEl;
      el.style.left = (this._dragStartLeft + dx) + 'px';
      el.style.top = (this._dragStartTop + dy) + 'px';
      el.style.transform='translate(0,0)';
    }
    if(this.boxEl){
      this.boxEl.style.left = (this._dragStartLeft + dx -16) + 'px';
      this.boxEl.style.top = (this._dragStartTop + dy -16) + 'px';
      this.boxEl.style.transform=`rotate(${this.activeClip.rotation||0}deg)`;
      this.boxEl.style.transformOrigin='center';
    }
  },
  _onDragEnd(){
    this.isDragging=false;
    document.removeEventListener('mousemove', this._onDragMove);
    document.removeEventListener('mouseup', this._onDragEnd);
    document.removeEventListener('touchmove', this._onDragMove);
    document.removeEventListener('touchend', this._onDragEnd);
  },

  _startResize(e){
    e.preventDefault(); e.stopPropagation();
    this.isResizing=true;
    const t=e.touches?e.touches[0]:e;
    this.startX=t.clientX; this.startSize=this.activeClip.fontSize||36;
    document.addEventListener('mousemove', this._onResizeMove.bind(this));
    document.addEventListener('mouseup', this._onResizeEnd.bind(this));
    document.addEventListener('touchmove', this._onResizeMove.bind(this), {passive:false});
    document.addEventListener('touchend', this._onResizeEnd.bind(this));
  },
  _onResizeMove(e){
    if(!this.isResizing) return;
    e.preventDefault();
    const t=e.touches?e.touches[0]:e;
    const dx=t.clientX-this.startX;
    const newSize=Math.max(12, Math.min(120, this.startSize + dx*0.4));
    this.activeClip.fontSize=newSize;
    if(window.Renderer && window.Renderer.textEl){
      window.Renderer.textEl.style.fontSize=newSize+'px';
    }
    const sizeEl=document.getElementById('transformSizeVal');
    if(sizeEl) sizeEl.textContent=Math.round(newSize)+'px';
  },
  _onResizeEnd(){
    this.isResizing=false;
    document.removeEventListener('mousemove', this._onResizeMove);
    document.removeEventListener('mouseup', this._onResizeEnd);
    document.removeEventListener('touchmove', this._onResizeMove);
    document.removeEventListener('touchend', this._onResizeEnd);
    if(window.TimelineUI) TimelineUI.render();
  },

  _startRotate(e){
    e.preventDefault(); e.stopPropagation();
    this.isRotating=true;
    const t=e.touches?e.touches[0]:e;
    this.startX=t.clientX; this.startRot=this.activeClip.rotation||0;
    document.addEventListener('mousemove', this._onRotateMove.bind(this));
    document.addEventListener('mouseup', this._onRotateEnd.bind(this));
    document.addEventListener('touchmove', this._onRotateMove.bind(this), {passive:false});
    document.addEventListener('touchend', this._onRotateEnd.bind(this));
  },
  _onRotateMove(e){
    if(!this.isRotating) return;
    e.preventDefault();
    const t=e.touches?e.touches[0]:e;
    const dx=t.clientX-this.startX;
    const newRot=(this.startRot + dx*0.5) % 360;
    this.activeClip.rotation=newRot;
    if(window.Renderer && window.Renderer.textEl){
      window.Renderer.textEl.style.transform=`translate(-50%,-50%) rotate(${newRot}deg)`;
    }
    if(this.boxEl){
      this.boxEl.style.transform=`rotate(${newRot}deg)`;
    }
    const rotEl=document.getElementById('transformRotVal');
    if(rotEl) rotEl.textContent=Math.round(newRot)+'°';
  },
  _onRotateEnd(){
    this.isRotating=false;
    document.removeEventListener('mousemove', this._onRotateMove);
    document.removeEventListener('mouseup', this._onRotateEnd);
    document.removeEventListener('touchmove', this._onRotateMove);
    document.removeEventListener('touchend', this._onRotateEnd);
  },

  showTransformPanel(clip) {
    if(!clip) clip=this.activeClip||window.Selection?.selectedClip;
    if(!clip) return;
    this.activeClip=clip;
    let modal=document.getElementById('transformModal');
    if(!modal){
      modal=document.createElement('div'); modal.id='transformModal';
      modal.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;z-index:301;display:flex;flex-direction:column;pointer-events:none';
      modal.innerHTML='<div id="transformBackdrop" style="flex:1;background:transparent;pointer-events:auto"></div><div id="transformContent" style="background:#1A1A1E;border-radius:22px 22px 0 0;max-height:46vh;display:flex;flex-direction:column;pointer-events:auto;border-top:1.5px solid #FF9500;box-shadow:0 -8px 32px rgba(0,0,0,0.7)"></div>';
      document.body.appendChild(modal);
    }
    const content=modal.querySelector('#transformContent');
    content.innerHTML=`
      <div style="display:flex;justify-content:center;padding:8px 0 4px"><div style="width:36px;height:4px;background:#3A3A3E;border-radius:2px"></div></div>
      <div style="padding:0 14px 10px;height:44px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #242429;flex-shrink:0">
        <div style="display:flex;gap:8px;align-items:center"><span style="background:#FF9500;color:#FFF;padding:4px 8px;border-radius:7px;font-size:9px;font-weight:800">TRANSFORM</span><span style="color:#FFF;font-size:13px;font-weight:600">${clip.text.substr(0,18)}</span></div>
        <button id="closeTransformTop" style="background:#242429;border:none;color:#8E8E93;width:28px;height:28px;border-radius:50%;font-size:12px">✕</button>
      </div>
      <div style="overflow-y:auto;padding:14px;flex:1;background:#1A1A1E">
        <div style="margin-bottom:16px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#8E8E93;font-size:10px;font-weight:700">SIZE</span><span id="transformSizeVal" style="color:#FFF;font-size:11px;background:#121214;padding:3px 8px;border-radius:10px">${Math.round(clip.fontSize||36)}px</span></div>
          <input id="transformSize" type="range" min="12" max="120" value="${clip.fontSize||36}" style="width:100%;accent-color:#FF9500;height:4px">
        </div>
        <div style="margin-bottom:16px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#8E8E93;font-size:10px;font-weight:700">ROTATION</span><span id="transformRotVal" style="color:#FFF;font-size:11px;background:#121214;padding:3px 8px;border-radius:10px">${Math.round(clip.rotation||0)}°</span></div>
          <input id="transformRot" type="range" min="-180" max="180" value="${clip.rotation||0}" style="width:100%;accent-color:#FF9500;height:4px">
          <div style="display:flex;gap:8px;margin-top:10px">
            <button class="rotPreset" data-rot="0" style="flex:1;background:${(clip.rotation||0)===0?'#FF9500':'#242429'};color:#FFF;border:none;padding:8px;border-radius:10px;font-size:11px;font-weight:700">0°</button>
            <button class="rotPreset" data-rot="90" style="flex:1;background:${clip.rotation===90?'#FF9500':'#242429'};color:#FFF;border:none;padding:8px;border-radius:10px;font-size:11px">90°</button>
            <button class="rotPreset" data-rot="180" style="flex:1;background:${Math.abs(clip.rotation)===180?'#FF9500':'#242429'};color:#FFF;border:none;padding:8px;border-radius:10px;font-size:11px">180°</button>
            <button class="rotPreset" data-rot="-90" style="flex:1;background:${clip.rotation===-90?'#FF9500':'#242429'};color:#FFF;border:none;padding:8px;border-radius:10px;font-size:11px">-90°</button>
          </div>
        </div>
        <div style="margin-bottom:16px">
          <div style="color:#8E8E93;font-size:10px;font-weight:700;margin-bottom:8px">POSITION</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
            <button class="posPreset" data-pos="top" style="background:${clip.position==='top'?'#FF9500':'#242429'};color:#FFF;border:none;padding:12px;border-radius:12px;font-size:11px;font-weight:700">↑ Top</button>
            <button class="posPreset" data-pos="center" style="background:${!clip.position||clip.position==='center'?'#FF9500':'#242429'};color:#FFF;border:none;padding:12px;border-radius:12px;font-size:11px;font-weight:700">⊕ Center</button>
            <button class="posPreset" data-pos="bottom" style="background:${clip.position==='bottom'?'#FF9500':'#242429'};color:#FFF;border:none;padding:12px;border-radius:12px;font-size:11px;font-weight:700">↓ Bottom</button>
          </div>
        </div>
        <div style="background:#242429;border-radius:12px;padding:12px;display:flex;justify-content:space-between;align-items:center;border:1px solid #2A2A2E">
          <div><div style="color:#FFF;font-size:11px;font-weight:700">Apply to All Text</div><div style="color:#8E8E93;font-size:9px">Same style for all text clips</div></div>
          <button id="applyToAll" style="background:#5856D6;color:#FFF;border:none;padding:8px 14px;border-radius:20px;font-size:11px;font-weight:700">Apply</button>
        </div>
      </div>
      <div style="padding:10px 12px;border-top:1px solid #242429;display:flex;gap:8px;background:#121214;flex-shrink:0">
        <button id="saveTransform" style="flex:1;background:#FF9500;color:#FFF;border:none;padding:12px;border-radius:24px;font-weight:800;font-size:13px">Save</button>
        <button id="resetTransform" style="background:#242429;color:#8E8E93;border:1px solid #2A2A2E;padding:12px 16px;border-radius:24px;font-weight:700;font-size:12px">Reset</button>
        <button id="closeTransform" style="background:#242429;color:#8E8E93;border:1px solid #2A2A2E;padding:12px 16px;border-radius:24px;font-weight:700;font-size:12px">Close</button>
      </div>
    `;
    modal.style.display='flex';
    if(window.Renderer && window.Renderer.textEl) window.Renderer.textEl.style.top='28%';
    this.showHandles(clip);

    content.querySelector('#transformSize')?.addEventListener('input', (e)=>{
      const s=parseInt(e.target.value); clip.fontSize=s; const v=content.querySelector('#transformSizeVal'); if(v) v.textContent=s+'px'; if(window.Renderer && window.Renderer.textEl) window.Renderer.textEl.style.fontSize=s+'px'; if(window.TimelineUI) TimelineUI.render();
    });
    content.querySelector('#transformRot')?.addEventListener('input', (e)=>{
      const r=parseInt(e.target.value); clip.rotation=r; const v=content.querySelector('#transformRotVal'); if(v) v.textContent=r+'°'; if(window.Renderer && window.Renderer.textEl) window.Renderer.textEl.style.transform=`translate(-50%,-50%) rotate(${r}deg)`; if(this.boxEl) this.boxEl.style.transform=`rotate(${r}deg)`;
    });
    content.querySelectorAll('.rotPreset').forEach(b=>{ b.addEventListener('click', ()=>{ const r=parseInt(b.dataset.rot); clip.rotation=r; content.querySelector('#transformRot').value=r; content.querySelector('#transformRotVal').textContent=r+'°'; if(window.Renderer && window.Renderer.textEl) window.Renderer.textEl.style.transform=`translate(-50%,-50%) rotate(${r}deg)`; if(this.boxEl) this.boxEl.style.transform=`rotate(${r}deg)`; content.querySelectorAll('.rotPreset').forEach(x=>x.style.background='#242429'); b.style.background='#FF9500'; }); });
    content.querySelectorAll('.posPreset').forEach(b=>{ b.addEventListener('click', ()=>{ clip.position=b.dataset.pos; content.querySelectorAll('.posPreset').forEach(x=>x.style.background='#242429'); b.style.background='#FF9500'; if(window.Renderer) Renderer._forceShow(clip); }); });
    content.querySelector('#applyToAll')?.addEventListener('click', ()=>{
      if(!window.TimelineUI) return; TimelineUI.clips.filter(c=>c.type==='text').forEach(c=>{ c.fontSize=clip.fontSize; c.fontFamily=clip.fontFamily; c.fontColor=clip.fontColor; c.template=clip.template; }); TimelineUI.render(); if(window.Renderer) Renderer._forceShow(clip);
      const info=document.getElementById('info'); if(info){ info.textContent='Applied to all text clips'; setTimeout(()=>info.textContent='Phase 3.5 - Transform',2000); }
    });
    const close=()=>{ modal.style.display='none'; this._removeBox(); if(window.Renderer && window.Renderer.textEl){ window.Renderer.textEl.style.top='50%'; Renderer._forceShow(clip); } };
    const reset=()=>{ clip.rotation=0; clip.fontSize=36; clip.position='center'; content.querySelector('#transformRot').value=0; content.querySelector('#transformSize').value=36; content.querySelector('#transformRotVal').textContent='0°'; content.querySelector('#transformSizeVal').textContent='36px'; if(window.Renderer && window.Renderer.textEl){ window.Renderer.textEl.style.fontSize='36px'; window.Renderer.textEl.style.transform='translate(-50%,-50%) rotate(0deg)'; window.Renderer.textEl.style.top='50%'; } };
    content.querySelector('#saveTransform')?.addEventListener('click', close);
    content.querySelector('#closeTransform')?.addEventListener('click', close);
    content.querySelector('#closeTransformTop')?.addEventListener('click', close);
    content.querySelector('#resetTransform')?.addEventListener('click', reset);
    modal.querySelector('#transformBackdrop')?.addEventListener('click', close);
  }
};
window.TransformTool = TransformTool;
setTimeout(()=>TransformTool.init(), 1000);
