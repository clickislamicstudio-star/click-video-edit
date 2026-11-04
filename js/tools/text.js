
/**
 * Folder: js/tools/ File: text.js v3.9 FINAL - Text Selection Fix - No Emoji - Master Prompt
 */
window.TextTool = {
  addTextClip(){
    const clip = new Clip({
      id:'text_'+Date.now(),
      name:'Text '+(TimelineUI.clips.filter(c=>c.type==='text').length+1),
      type:'text',
      track:3,
      startTime: TimelineUI ? TimelineUI.getNextStartTime(3) : 0,
      duration:3,
      text:'Hello World',
      fontFamily:'Inter',
      fontSize:32,
      fontColor:'#FFFFFF',
      transform:{x:0,y:0,scale:1,rotation:0}
    });
    if(window.TimelineUI){ TimelineUI.clips.push(clip); TimelineUI.render(); }
    if(window.Selection) Selection.selectClip(clip);
    if(window.Renderer) Renderer.showClip(clip);
    if(window.CanvasControls) CanvasControls.show(clip);
    return clip;
  },
  showTextEditor(clip){
    if(!clip) clip=window.Selection?.selectedClip;
    if(!clip) return;
    const panel=document.createElement('div');
    panel.style.cssText='position:fixed;bottom:0;left:0;right:0;height:42vh;background:#1A1A1E;border-radius:20px 20px 0 0;z-index:300;padding:16px';
    panel.innerHTML=`<div style="display:flex;justify-content:space-between;margin-bottom:12px"><span style="font-weight:800">Text Edit - ${clip.name}</span><button id="closeText" style="background:#242429;color:#FFF;border:none;width:28px;height:28px;border-radius:50%"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button></div><input id="textInput" value="${clip.text||'Hello'}" style="width:100%;padding:10px;background:#242429;border:none;border-radius:8px;color:#FFF;margin-bottom:12px"/><button id="doneText" style="width:100%;background:#0A84FF;color:#FFF;border:none;padding:12px;border-radius:20px;font-weight:800">Done</button>`;
    document.body.appendChild(panel);
    panel.querySelector('#textInput').addEventListener('input', (e)=>{ clip.text=e.target.value; if(window.Renderer) Renderer.showClip(clip); TimelineUI.render(); });
    panel.querySelector('#closeText').addEventListener('click', ()=> panel.remove());
    panel.querySelector('#doneText').addEventListener('click', ()=> panel.remove());
  }
};
