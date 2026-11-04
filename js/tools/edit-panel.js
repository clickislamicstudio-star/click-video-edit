
/**
 * Folder: js/tools/ File: edit-panel.js v2.0 FINAL - Edit First Button - No Emoji - SVG Only - Master Prompt
 * Contains Delete + Advanced - Transform First after Edit - Future addable
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
      <div style="padding:0 16px 8px;display:flex;justify-content:space-between;align-items:center"><span style="font-size:14px;font-weight:800;color:#FFF">Edit - ${clip.type} - ${clip.name.substr(0,20)}</span><button id="closeEdit" style="width:28px;height:28px;background:#242429;border:none;border-radius:50%;color:#FFF"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button></div>
      <div style="flex:1;overflow:auto;padding:12px 16px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;align-content:start" id="editGrid"></div>
      <div style="padding:12px 16px 20px"><button id="doneEdit" style="width:100%;background:#0A84FF;color:#FFF;border:none;padding:14px;border-radius:20px;font-weight:800">Done</button></div>
    `;
    document.body.appendChild(panel);
    const grid=panel.querySelector('#editGrid');
    const items=[
      {id:'transform', label:'Transform', svg:'<path d="M15 3h4v4M9 21H5v-4M21 3L3 21M21 21L3 3"/>'},
      {id:'split', label:'Split', svg:'<path d="M16 3v18M8 7h2M8 17h2M3 12h6M15 12h6"/>'},
      {id:'layout', label:'Layout', svg:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>'},
      {id:'background', label:'Background', svg:'<rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor"/>'},
      {id:'borders', label:'Borders', svg:'<rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="10" height="10" rx="1"/>'},
      {id:'speed', label:'Speed', svg:'<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>'},
      {id:'volume', label:'Volume', svg:'<path d="M11 5L6 9H2v6h4l5 4V5z"/>'},
      {id:'filter', label:'Filter', svg:'<path d="M3 6h18M7 12h10M10 18h4"/>'},
    ];
    items.forEach(it=>{
      const btn=document.createElement('button');
      btn.className='editItem';
      btn.dataset.action=it.id;
      btn.style.cssText='display:flex;flex-direction:column;align-items:center;background:transparent;border:none;cursor:pointer';
      btn.innerHTML=`<div style="width:48px;height:48px;background:#242429;border-radius:12px;display:flex;align-items:center;justify-content:center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A0A0A0" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${it.svg}</svg></div><span style="font-size:9px;color:#A0A0A0;margin-top:4px">${it.label}</span>`;
      grid.appendChild(btn);
    });
    const delBtn=document.createElement('button');
    delBtn.dataset.action='delete';
    delBtn.style.cssText='grid-column: span 4; background:#FF3B30;border-radius:12px;padding:12px;display:flex;align-items:center;justify-content:center;gap:8px;color:#FFF;font-weight:800;margin-top:12px;border:none';
    delBtn.innerHTML=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="1.8"><path d="M3 6h18M8 6V4h8v2M10 11v6M14 11v6M5 6l1 14h12l1-14"/></svg> Delete Clip`;
    grid.appendChild(delBtn);

    panel.querySelector('#closeEdit').addEventListener('click', ()=> panel.remove());
    panel.querySelector('#doneEdit').addEventListener('click', ()=> panel.remove());
    panel.querySelectorAll('.editItem, button[data-action="delete"]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const act=btn.dataset.action;
        if(act==='delete'){
          if(window.TimelineUI){ TimelineUI.clips=TimelineUI.clips.filter(c=>c.id!==clip.id); TimelineUI.render(); }
          if(window.Selection) Selection.deselectAll();
          panel.remove();
          if(window.CanvasControls) CanvasControls.hide();
        } else if(act==='transform' && window.TransformTool){ TransformTool.showTransformPanel(clip); }
        else if(act==='split' && window.TrimSplitTool){ TrimSplitTool.splitAtPlayhead(clip); panel.remove(); }
        else if(act==='volume' && window.AudioTool){ AudioTool.showVolumeUI(clip); }
        else { /* Future: will add inside Edit */ }
      });
    });
  }
};
window.EditPanel = EditPanel;
