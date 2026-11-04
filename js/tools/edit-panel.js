
/**
 * Folder: js/tools/ File: edit-panel.js v1.0 NEW - Edit First Button - Contains Delete + Advanced
 */
const EditPanel = {
  show(clip){
    if(!clip) clip=window.Selection?.selectedClip;
    if(!clip) return;
    const existing=document.getElementById('editPanel');
    if(existing) existing.remove();
    
    const panel=document.createElement('div');
    panel.id='editPanel';
    panel.style.cssText='position:fixed;bottom:0;left:0;right:0;height:52vh;background:#1A1A1E;border-radius:20px 20px 0 0;z-index:300;display:flex;flex-direction:column;border-top:1px solid #2A2A2E;box-shadow:0 -8px 32px rgba(0,0,0,0.6)';
    panel.innerHTML=`
      <div style="height:32px;display:flex;align-items:center;justify-content:center;flex-shrink:0"><div style="width:36px;height:4px;background:#3A3A3E;border-radius:2px"></div></div>
      <div style="padding:0 16px 8px;display:flex;justify-content:space-between;align-items:center"><span style="font-size:14px;font-weight:800;color:#FFF">Edit - ${clip.type} - ${clip.name.substr(0,20)}</span><button id="closeEdit" style="width:28px;height:28px;background:#242429;border:none;border-radius:50%;color:#FFF">✕</button></div>
      <div style="flex:1;overflow:auto;padding:12px 16px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;align-content:start">
        <button class="editItem" data-action="transform"><div style="width:48px;height:48px;background:#242429;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px">⤧</div><span style="font-size:9px;color:#A0A0A0;margin-top:4px">Transform</span></button>
        <button class="editItem" data-action="split"><div style="width:48px;height:48px;background:#242429;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px">✂</div><span style="font-size:9px;color:#A0A0A0;margin-top:4px">Split</span></button>
        <button class="editItem" data-action="layout"><div style="width:48px;height:48px;background:#242429;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px">⊞</div><span style="font-size:9px;color:#A0A0A0;margin-top:4px">Layout</span></button>
        <button class="editItem" data-action="background"><div style="width:48px;height:48px;background:#242429;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px">⬛</div><span style="font-size:9px;color:#A0A0A0;margin-top:4px">Background</span></button>
        <button class="editItem" data-action="borders"><div style="width:48px;height:48px;background:#242429;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px">⬜</div><span style="font-size:9px;color:#A0A0A0;margin-top:4px">Borders</span></button>
        <button class="editItem" data-action="speed"><div style="width:48px;height:48px;background:#242429;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px">⚡</div><span style="font-size:9px;color:#A0A0A0;margin-top:4px">Speed</span></button>
        <button class="editItem" data-action="volume"><div style="width:48px;height:48px;background:#242429;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px">🔊</div><span style="font-size:9px;color:#A0A0A0;margin-top:4px">Volume</span></button>
        <button class="editItem" data-action="filter"><div style="width:48px;height:48px;background:#242429;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px">🎨</div><span style="font-size:9px;color:#A0A0A0;margin-top:4px">Filter</span></button>
        <button class="editItem" data-action="delete" style="grid-column: span 4; background:#FF3B30;border-radius:12px;padding:12px;display:flex;align-items:center;justify-content:center;gap:8px;color:#FFF;font-weight:800;margin-top:12px;border:none"><span>🗑</span> Delete Clip</button>
      </div>
      <div style="padding:12px 16px 20px"><button id="doneEdit" style="width:100%;background:#0A84FF;color:#FFF;border:none;padding:14px;border-radius:20px;font-weight:800">Done</button></div>
    `;
    document.body.appendChild(panel);
    panel.querySelector('#closeEdit').addEventListener('click', ()=> panel.remove());
    panel.querySelector('#doneEdit').addEventListener('click', ()=> panel.remove());
    panel.querySelectorAll('.editItem').forEach(btn=>{
      btn.style.cssText+=';display:flex;flex-direction:column;align-items:center;background:transparent;border:none;cursor:pointer';
      btn.addEventListener('click', ()=>{
        const act=btn.dataset.action;
        if(act==='delete'){
          if(window.TimelineUI){ TimelineUI.clips=TimelineUI.clips.filter(c=>c.id!==clip.id); TimelineUI.render(); }
          if(window.Selection) Selection.deselectAll();
          panel.remove();
          if(window.CanvasControls) CanvasControls.hide();
        } else if(act==='transform' && window.TransformTool){ TransformTool.showTransformPanel(clip); }
        else if(act==='split' && window.TrimSplitTool){ TrimSplitTool.splitAtPlayhead(clip); }
        else if(act==='volume' && window.AudioTool){ AudioTool.showVolumeUI(clip); }
        else { alert(act+' - Coming soon in Phase 4'); }
      });
    });
  }
};
window.EditPanel=EditPanel;
