
/**
 * Folder: js/tools/ File: transform.js v3.7 - TransformEngine alias + CapCut handles
 */
const TransformTool = {
  init(){ console.log('TransformTool v3.7 - Hybrid Ready'); },
  showTransformPanel(clip){
    if(!clip) clip=window.Selection?.selectedClip;
    if(!clip) return;
    // Simple transform panel for now - professional 3.6 panel will be restored in Phase 4
    const panel=document.createElement('div');
    panel.style.cssText='position:fixed;bottom:140px;left:10px;right:10px;background:#1A1A1E;border:1px solid #2A2A2E;border-radius:16px;padding:14px;z-index:200;max-height:40vh;overflow:auto';
    panel.innerHTML=`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span style="font-weight:800;color:#FFF">Transform - ${clip.name}</span><button id="closeTransform" style="background:#242429;color:#FFF;border:none;width:28px;height:28px;border-radius:50%">✕</button></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <label style="font-size:10px;color:#8E8E93">Scale <input type="range" min="0.5" max="1.5" step="0.05" value="${clip.transform.scale}" id="trScale" style="width:100%"></label>
        <label style="font-size:10px;color:#8E8E93">Rotation <input type="range" min="-45" max="45" step="1" value="${clip.transform.rotation}" id="trRot" style="width:100%"></label>
        <label style="font-size:10px;color:#8E8E93">X <input type="range" min="-10" max="10" step="0.5" value="${clip.transform.x}" id="trX" style="width:100%"></label>
        <label style="font-size:10px;color:#8E8E93">Y <input type="range" min="-10" max="10" step="0.5" value="${clip.transform.y}" id="trY" style="width:100%"></label>
      </div>
      <div style="margin-top:12px;display:flex;gap:8px"><button id="applyTransform" style="flex:1;background:#FF9500;color:#FFF;border:none;padding:10px;border-radius:20px;font-weight:700">Apply</button><button id="resetTransform" style="background:#242429;color:#FFF;border:none;padding:10px 16px;border-radius:20px">Reset</button></div>
    `;
    document.body.appendChild(panel);
    const upd=()=>{
      clip.transform.scale=parseFloat(panel.querySelector('#trScale').value);
      clip.transform.rotation=parseFloat(panel.querySelector('#trRot').value);
      clip.transform.x=parseFloat(panel.querySelector('#trX').value);
      clip.transform.y=parseFloat(panel.querySelector('#trY').value);
      if(window.Renderer) Renderer.showClip(clip);
    };
    panel.querySelectorAll('input').forEach(i=>i.addEventListener('input', upd));
    panel.querySelector('#closeTransform').addEventListener('click', ()=> panel.remove());
    panel.querySelector('#applyTransform').addEventListener('click', ()=> panel.remove());
    panel.querySelector('#resetTransform').addEventListener('click', ()=>{ clip.transform={x:0,y:0,scale:1,rotation:0,flipX:false,flipY:false,cropLeft:0,cropRight:0,cropTop:0,cropBottom:0}; if(window.Renderer) Renderer.showClip(clip); panel.remove(); });
  }
};
window.TransformTool=TransformTool;
window.TransformEngine=TransformTool;
