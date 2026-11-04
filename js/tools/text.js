
/**
 * TextTool v3.6.2 - Fixed Text Add + Display
 */
const TextTool = {
  templates:[
    {id:'default', name:'Default', style:'color:#FFF;font-weight:600'},
    {id:'bold', name:'Bold', style:'color:#FFF;font-weight:900;font-size:1.3em'},
    {id:'outline', name:'Outline', style:'color:transparent;-webkit-text-stroke:2px #FFF;font-weight:800'},
    {id:'shadow', name:'Shadow', style:'color:#FFF;text-shadow:4px 4px 0 #000;font-weight:700'},
    {id:'neon', name:'Neon', style:'color:#0FF;text-shadow:0 0 10px #0FF,0 0 20px #0FF;font-weight:800'},
  ],
  addTextClip(text='My Dear'){
    const clipData = {
      id:'text_'+Date.now(),
      name:text.substr(0,20),
      type:'text',
      track:3,
      startTime: window.TimelineUI ? TimelineUI.getNextStartTime(3) : 0,
      duration: 3,
      text: text,
      fontSize: 36,
      fontColor: '#FFFFFF',
      fontFamily: 'Inter',
      template: 'default',
      color:'#5856D6',
      transform:{x:0,y:0,scale:1,rotation:0,flipX:false,flipY:false,cropLeft:0,cropRight:0,cropTop:0,cropBottom:0}
    };
    const clip = new Clip(clipData);
    if(window.TimelineUI){
      TimelineUI.clips.push(clip);
      TimelineUI.render();
      if(window.Selection) Selection.selectClip(clip);
      if(window.Store) Store.dispatch({type:'SELECT_CLIP', payload:{id:clip.id, track:3, clipType:'text', name:clip.name}});
    }
    if(window.Renderer){
      Renderer.showClip(clip);
    }
    // Open editor after short delay
    setTimeout(()=> this.showEditor(clip, 'text'), 300);
    const btn=document.getElementById('importBtn');
    if(btn) btn.classList.add('hidden');
    if(navigator.vibrate) navigator.vibrate(50);
    return clip;
  },
  showEditor(clip, tab='text'){
    if(!clip) clip=window.Selection?.selectedClip;
    if(!clip) return;
    if(clip.type!=='text'){
      clip = this.addTextClip();
      return;
    }
    // Simple editor modal - translucent bottom sheet
    let modal=document.getElementById('textEditorModal');
    if(!modal){
      modal=document.createElement('div');
      modal.id='textEditorModal';
      modal.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;z-index:304;display:flex;flex-direction:column;pointer-events:none';
      modal.innerHTML='<div id="textBackdrop" style="flex:1;background:rgba(0,0,0,0.08);pointer-events:auto"></div><div id="textEditorContent" style="background:#1A1A1E;border-radius:22px 22px 0 0;max-height:46vh;min-height:38vh;display:flex;flex-direction:column;pointer-events:auto;border-top:1.5px solid #5856D6"></div>';
      document.body.appendChild(modal);
    }
    const content=modal.querySelector('#textEditorContent');
    content.innerHTML=`
      <div style="display:flex;justify-content:center;padding:8px 0 4px"><div style="width:36px;height:4px;background:#3A3A3E;border-radius:2px"></div></div>
      <div style="padding:0 14px 10px;height:44px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #2A2A2A;flex-shrink:0">
        <div style="display:flex;gap:8px;align-items:center"><span style="background:#5856D6;color:#FFF;padding:4px 8px;border-radius:7px;font-size:9px;font-weight:800">TEXT</span><span style="color:#FFF;font-size:13px;font-weight:600">${clip.text.substr(0,18)}</span></div>
        <button id="closeTextTop" style="background:#2A2A2A;border:none;color:#8E8E93;width:28px;height:28px;border-radius:50%;font-size:12px">✕</button>
      </div>
      <div style="display:flex;background:#121212;border-bottom:1px solid #2A2A2A;overflow-x:auto;flex-shrink:0">
        <button class="txtTabBtn active" data-tab="text" style="padding:12px 14px;background:transparent;color:#5856D6;border:none;border-bottom:2px solid #5856D6;font-size:13px;font-weight:700;white-space:nowrap">TEXT</button>
        <button class="txtTabBtn" data-tab="template" style="padding:12px 14px;background:transparent;color:#8E8E93;border:none;border-bottom:2px solid transparent;font-size:13px;white-space:nowrap">TEMPLATE</button>
        <button class="txtTabBtn" data-tab="font" style="padding:12px 14px;background:transparent;color:#8E8E93;border:none;border-bottom:2px solid transparent;font-size:13px;white-space:nowrap">FONT</button>
        <button class="txtTabBtn" data-tab="color" style="padding:12px 14px;background:transparent;color:#8E8E93;border:none;border-bottom:2px solid transparent;font-size:13px;white-space:nowrap">COLOR</button>
      </div>
      <div id="txtTabContent" style="overflow-y:auto;padding:14px;flex:1">
        <div id="txtTab-text" class="txtTab" style="display:block">
          <textarea id="txtInput" style="width:100%;background:#2A2A2A;border:1px solid #3A3A3E;color:#FFF;padding:12px;border-radius:12px;font-size:16px;min-height:80px;resize:none">${clip.text}</textarea>
          <div style="display:flex;gap:8px;margin-top:12px;align-items:center"><span style="color:#8E8E93;font-size:12px">SIZE</span><input id="txtSize" type="range" min="12" max="100" value="${clip.fontSize}" style="flex:1"><span id="txtSizeVal" style="color:#FFF;background:#2A2A2A;padding:4px 8px;border-radius:8px;font-size:12px">${clip.fontSize}px</span></div>
        </div>
        <div id="txtTab-template" class="txtTab" style="display:none"><div style="display:flex;gap:8px;flex-wrap:wrap">${this.templates.map(t=>`<button data-tmpl="${t.id}" style="padding:10px 14px;background:#2A2A2A;color:#FFF;border:1px solid #3A3A3E;border-radius:10px;font-size:13px">${t.name}</button>`).join('')}</div></div>
        <div id="txtTab-font" class="txtTab" style="display:none"><div style="display:flex;flex-direction:column;gap:6px">${['Inter','Poppins','Montserrat','Bebas Neue','Oswald','Lobster'].map(f=>`<button data-font="${f}" style="padding:12px;background:${clip.fontFamily===f?'#5856D6':'#2A2A2A'};color:#FFF;border:none;border-radius:10px;text-align:left;font-family:${f};font-size:15px">${f} ${clip.fontFamily===f?'✓':''}</button>`).join('')}</div></div>
        <div id="txtTab-color" class="txtTab" style="display:none"><div style="display:grid;grid-template-columns:repeat(6,1fr);gap:10px">${['#FFFFFF','#000000','#FF3B30','#FF9500','#FFCC02','#4CAF50','#5856D6','#0A84FF','#FF2D92','#AF52DE','#FFFFFF','linear-gradient(45deg,#FF3B30,#FF9500)'].slice(0,12).map(c=> c.startsWith('linear')?`<div data-color="${c}" style="width:44px;height:44px;border-radius:50%;background:${c};border:2px solid #3A3A3E;cursor:pointer"></div>` : `<div data-color="${c}" style="width:44px;height:44px;border-radius:50%;background:${c};border:2px solid ${clip.fontColor===c?'#FFF':'#3A3A3E'};cursor:pointer"></div>`).join('')}</div></div>
      </div>
      <div style="padding:12px 14px;border-top:1px solid #2A2A2A;display:flex;gap:10px;background:#121212;flex-shrink:0"><button id="saveTxt" style="flex:1;background:#5856D6;color:#FFF;border:none;padding:14px;border-radius:24px;font-weight:700;font-size:14px">Save</button><button id="deleteTxt" style="background:#2A2A2A;color:#FF3B30;border:1px solid #3A3A3E;padding:14px 20px;border-radius:24px;font-size:13px">Delete</button><button id="closeTxt" style="background:#2A2A2A;color:#8E8E93;border:none;padding:14px 20px;border-radius:24px;font-size:13px">Close</button></div>
    `;
    modal.style.display='flex';
    if(window.Renderer && Renderer.textEl) Renderer.textEl.style.top='30%';
    if(window.TransformTool) TransformTool.showHandles(clip);
    
    // Tab switch
    const switchTab=(t)=>{
      content.querySelectorAll('.txtTab').forEach(el=>el.style.display='none');
      const tar=content.querySelector('#txtTab-'+t);
      if(tar) tar.style.display='block';
      content.querySelectorAll('.txtTabBtn').forEach(b=>{ b.style.color='#8E8E93'; b.style.borderBottom='2px solid transparent'; if(b.dataset.tab===t){ b.style.color='#5856D6'; b.style.borderBottom='2px solid #5856D6'; }});
    };
    content.querySelectorAll('.txtTabBtn').forEach(b=> b.addEventListener('click', ()=>switchTab(b.dataset.tab)));
    
    // Inputs
    content.querySelector('#txtInput')?.addEventListener('input', (e)=>{
      clip.text=e.target.value;
      clip.name=e.target.value.substr(0,20);
      if(window.Renderer) Renderer.showText(clip);
    });
    content.querySelector('#txtSize')?.addEventListener('input', (e)=>{
      clip.fontSize=parseInt(e.target.value);
      content.querySelector('#txtSizeVal').textContent=e.target.value+'px';
      if(window.Renderer) Renderer.showText(clip);
    });
    content.querySelectorAll('[data-tmpl]').forEach(b=> b.addEventListener('click', ()=>{
      clip.template=b.dataset.tmpl;
      if(window.Renderer) Renderer.showText(clip);
    }));
    content.querySelectorAll('[data-font]').forEach(b=> b.addEventListener('click', ()=>{
      clip.fontFamily=b.dataset.font;
      if(window.Renderer) Renderer.showText(clip);
      this.showEditor(clip,'font');
    }));
    content.querySelectorAll('[data-color]').forEach(d=>{
      d.addEventListener('click', ()=>{
        if(!d.dataset.color.startsWith('linear')) clip.fontColor=d.dataset.color;
        if(window.Renderer) Renderer.showText(clip);
      });
    });
    
    const close=()=>{
      modal.style.display='none';
      if(window.Renderer && Renderer.textEl) Renderer.textEl.style.top='50%';
      if(window.TransformTool) TransformTool._removeBox();
      if(window.TimelineUI) TimelineUI.render();
    };
    content.querySelector('#saveTxt')?.addEventListener('click', close);
    content.querySelector('#closeTxt')?.addEventListener('click', close);
    content.querySelector('#closeTextTop')?.addEventListener('click', close);
    content.querySelector('#deleteTxt')?.addEventListener('click', ()=>{
      if(window.TimelineUI){ TimelineUI.clips=TimelineUI.clips.filter(c=>c.id!==clip.id); TimelineUI.render(); }
      if(window.Selection) Selection.deselectAll();
      close();
      if(window.Renderer) Renderer._hide();
      if(window.Toolbar) Toolbar.renderMain();
    });
    modal.querySelector('#textBackdrop')?.addEventListener('click', close);
  }
};
window.TextTool=TextTool;
