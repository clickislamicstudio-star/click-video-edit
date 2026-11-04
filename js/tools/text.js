/**
 * js/tools/text.js - Phase 3.1 FIX - InShot Style Text with Templates + Live Preview
 * FIXES: Text not showing, sub-buttons not working, background video not visible
 */
const TextTool = {
  fonts: [
    {id:'Inter', name:'Inter', family:'Inter,sans-serif'},
    {id:'Arial', name:'Arial', family:'Arial,sans-serif'},
    {id:'Roboto', name:'Roboto', family:'Roboto,sans-serif'},
    {id:'Serif', name:'Serif', family:'Georgia,serif'},
    {id:'Mono', name:'Mono', family:'Courier New,monospace'},
    {id:'Urdu', name:'اردو', family:'Noto Nastaliq Urdu,serif'},
    {id:'Cairo', name:'عربي', family:'Cairo,sans-serif'}
  ],
  
  colors: ['#FFFFFF','#000000','#FF3B30','#FFCC02','#4CAF50','#5856D6','#5AC8FA','#FF2D55','#FF9500','#8E8E93'],
  
  templates: [
    {id:'default', name:'Default', preview:'Ab', style:'font-weight:700'},
    {id:'bold', name:'Bold', preview:'Ab', style:'font-weight:900;text-shadow:3px 3px 0 #000'},
    {id:'outline', name:'Outline', preview:'Ab', style:'-webkit-text-stroke:2px #000;color:transparent'},
    {id:'shadow', name:'Shadow', preview:'Ab', style:'text-shadow:4px 4px 12px #000'},
    {id:'neon', name:'Neon', preview:'Ab', style:'text-shadow:0 0 10px currentColor'},
    {id:'retro', name:'Retro', preview:'AB', style:'background:#FF3B30;padding:4px 8px;letter-spacing:2px'},
    {id:'elegant', name:'Elegant', preview:'Ab', style:'font-style:italic;font-weight:300;font-family:serif'},
    {id:'cinema', name:'Cinema', preview:'AB', style:'text-transform:uppercase;letter-spacing:4px;border:2px solid currentColor;padding:6px 12px'}
  ],
  
  animations: [
    {id:'none', name:'None'},
    {id:'fadeIn', name:'Fade'},
    {id:'slideUp', name:'Slide'},
    {id:'typewriter', name:'Type'},
    {id:'bounce', name:'Bounce'},
    {id:'scale', name:'Scale'}
  ],

  addTextClip(text='My Dear') {
    const clip = new Clip({
      name: text.substr(0,15),
      text: text,
      type: 'text',
      track: 3,
      startTime: window.TimelineUI?.currentTime || 0,
      duration: 3,
      fontSize: 32,
      fontColor: '#FFFFFF',
      fontFamily: 'Inter',
      template: 'default',
      animation: 'none',
      bgColor: 'transparent',
      color: '#5856D6'
    });
    
    if(window.TimelineUI) {
      TimelineUI.addClip(clip);
      TimelineUI.render();
    }
    
    if(window.Selection) Selection.selectClip(clip);
    
    // Force renderer to show
    if(window.Renderer) {
      setTimeout(()=> Renderer._renderTextClip(clip, clip.startTime), 100);
    }
    
    this.showEditor(clip, 'text');
    return clip;
  },

  // Called from Toolbar sub-buttons
  editFont(clip) {
    if(!clip) clip = window.Selection?.selectedClip;
    if(!clip || clip.type!=='text') { this._toast('Select a text clip first'); return; }
    this.showEditor(clip, 'font');
  },
  
  editColor(clip) {
    if(!clip) clip = window.Selection?.selectedClip;
    if(!clip || clip.type!=='text') { this._toast('Select a text clip first'); return; }
    this.showEditor(clip, 'color');
  },
  
  editAnim(clip) {
    if(!clip) clip = window.Selection?.selectedClip;
    if(!clip || clip.type!=='text') { this._toast('Select a text clip first'); return; }
    this.showEditor(clip, 'anim');
  },
  
  editBG(clip) {
    if(!clip) clip = window.Selection?.selectedClip;
    if(!clip || clip.type!=='text') { this._toast('Select a text clip first'); return; }
    this.showEditor(clip, 'bg');
  },

  showEditor(clip, focusTab='text') {
    if(!clip) return;
    
    let modal = document.getElementById('textEditorModal');
    if(!modal) {
      modal = document.createElement('div');
      modal.id='textEditorModal';
      // InShot style: 70% bottom sheet with video visible behind (translucent)
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:200;display:flex;flex-direction:column;pointer-events:none;';
      modal.innerHTML = `
        <div id="textModalBackdrop" style="flex:1;background:rgba(0,0,0,0.3);pointer-events:auto"></div>
        <div id="textModalContent" style="background:#1E1E1E;border-radius:20px 20px 0 0;max-height:75vh;display:flex;flex-direction:column;pointer-events:auto;border-top:2px solid #5856D6;box-shadow:0 -4px 20px rgba(0,0,0,0.5)"></div>
      `;
      document.body.appendChild(modal);
    }
    
    const content = modal.querySelector('#textModalContent');
    content.innerHTML = `
      <div style="padding:16px;border-bottom:1px solid #2A2A2A;display:flex;justify-content:space-between;align-items:center">
        <div style="display:flex;gap:8px;align-items:center">
          <span style="background:#5856D6;color:#FFF;padding:4px 8px;border-radius:6px;font-size:10px;font-weight:700">TEXT</span>
          <span style="color:#FFF;font-size:13px;font-weight:600">${clip.name}</span>
        </div>
        <button id="closeTextEditor" style="background:#2A2A2A;border:none;color:#FFF;width:32px;height:32px;border-radius:50%">✕</button>
      </div>
      
      <div style="display:flex;gap:0;background:#121212;border-bottom:1px solid #2A2A2A;overflow-x:auto">
        <button class="tabBtn ${focusTab==='text'?'active':''}" data-tab="text" style="flex:1;background:${focusTab==='text'?'#5856D6':'transparent'};color:${focusTab==='text'?'#FFF':'#8E8E93'};border:none;padding:12px 8px;font-size:11px;font-weight:600;white-space:nowrap">TEXT</button>
        <button class="tabBtn ${focusTab==='template'?'active':''}" data-tab="template" style="flex:1;background:${focusTab==='template'?'#5856D6':'transparent'};color:${focusTab==='template'?'#FFF':'#8E8E93'};border:none;padding:12px 8px;font-size:11px;font-weight:600;white-space:nowrap">TEMPLATE</button>
        <button class="tabBtn ${focusTab==='font'?'active':''}" data-tab="font" style="flex:1;background:${focusTab==='font'?'#5856D6':'transparent'};color:${focusTab==='font'?'#FFF':'#8E8E93'};border:none;padding:12px 8px;font-size:11px;font-weight:600;white-space:nowrap">FONT</button>
        <button class="tabBtn ${focusTab==='color'?'active':''}" data-tab="color" style="flex:1;background:${focusTab==='color'?'#5856D6':'transparent'};color:${focusTab==='color'?'#FFF':'#8E8E93'};border:none;padding:12px 8px;font-size:11px;font-weight:600;white-space:nowrap">COLOR</button>
        <button class="tabBtn ${focusTab==='anim'?'active':''}" data-tab="anim" style="flex:1;background:${focusTab==='anim'?'#5856D6':'transparent'};color:${focusTab==='anim'?'#FFF':'#8E8E93'};border:none;padding:12px 8px;font-size:11px;font-weight:600;white-space:nowrap">ANIM</button>
        <button class="tabBtn ${focusTab==='bg'?'active':''}" data-tab="bg" style="flex:1;background:${focusTab==='bg'?'#5856D6':'transparent'};color:${focusTab==='bg'?'#FFF':'#8E8E93'};border:none;padding:12px 8px;font-size:11px;font-weight:600;white-space:nowrap">BG</button>
      </div>
      
      <div style="overflow-y:auto;padding:16px;max-height:50vh">
        <div id="tab-text" style="display:${focusTab==='text'?'block':'none'}">
          <textarea id="textInput" style="width:100%;background:#2A2A2A;border:1px solid #333;color:#FFF;padding:14px;border-radius:12px;font-size:18px;min-height:100px;resize:none;font-family:inherit">${clip.text}</textarea>
          <div style="margin-top:12px;display:flex;justify-content:space-between;align-items:center">
            <span style="color:#8E8E93;font-size:11px">FONT SIZE</span><span id="fontSizeVal" style="color:#FFF;font-size:12px;font-weight:600">${clip.fontSize||32}px</span>
          </div>
          <input id="fontSize" type="range" min="12" max="96" value="${clip.fontSize||32}" style="width:100%;accent-color:#5856D6;margin-top:8px">
        </div>
        
        <div id="tab-template" style="display:${focusTab==='template'?'block':'none'}">
          <div style="color:#8E8E93;font-size:11px;margin-bottom:12px">TEXT TEMPLATES - InShot Style</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            ${this.templates.map(t=>`
              <button class="templateBtn" data-template="${t.id}" style="background:${clip.template===t.id?'#5856D6':'#2A2A2A'};border:2px solid ${clip.template===t.id?'#5856D6':'#333'};border-radius:12px;padding:16px;display:flex;flex-direction:column;align-items:center;gap:8px">
                <div style="font-size:28px;color:#FFF;${t.style}">${t.preview}</div>
                <span style="color:${clip.template===t.id?'#FFF':'#8E8E93'};font-size:10px;font-weight:600">${t.name}</span>
              </button>
            `).join('')}
          </div>
        </div>
        
        <div id="tab-font" style="display:${focusTab==='font'?'block':'none'}">
          <div style="color:#8E8E93;font-size:11px;margin-bottom:12px">CHOOSE FONT</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${this.fonts.map(f=>`
              <button class="fontBtn" data-font="${f.id}" style="background:${clip.fontFamily===f.id?'#5856D6':'#2A2A2A'};border:none;border-radius:10px;padding:14px;text-align:left;display:flex;justify-content:space-between;align-items:center">
                <span style="font-family:${f.family};color:#FFF;font-size:18px">${f.name} - My Dear</span>
                <span style="color:${clip.fontFamily===f.id?'#FFF':'#555'};font-size:10px">${clip.fontFamily===f.id?'✓':''}</span>
              </button>
            `).join('')}
          </div>
        </div>
        
        <div id="tab-color" style="display:${focusTab==='color'?'block':'none'}">
          <div style="color:#8E8E93;font-size:11px;margin-bottom:12px">TEXT COLOR</div>
          <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px">
            ${this.colors.map(c=>`<button class="colorBtn" data-color="${c}" style="width:44px;height:44px;border-radius:50%;background:${c};border:3px solid ${clip.fontColor===c?'#5856D6':'#333'};box-shadow:${clip.fontColor===c?'0 0 0 2px #5856D6':''}"></button>`).join('')}
          </div>
          <div style="color:#8E8E93;font-size:11px;margin-bottom:12px">BACKGROUND COLOR</div>
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <button class="bgBtn" data-bg="transparent" style="width:44px;height:44px;border-radius:50%;background:repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px;border:3px solid ${clip.bgColor==='transparent'?'#5856D6':'#333'}"></button>
            ${this.colors.map(c=>`<button class="bgBtn" data-bg="${c}" style="width:44px;height:44px;border-radius:50%;background:${c};border:3px solid ${clip.bgColor===c?'#5856D6':'#333'}"></button>`).join('')}
          </div>
        </div>
        
        <div id="tab-anim" style="display:${focusTab==='anim'?'block':'none'}">
          <div style="color:#8E8E93;font-size:11px;margin-bottom:12px">ANIMATION</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${this.animations.map(a=>`<button class="animBtn" data-anim="${a.id}" style="background:${clip.animation===a.id?'#5856D6':'#2A2A2A'};color:#FFF;border:none;padding:10px 18px;border-radius:20px;font-size:12px;font-weight:600">${a.name}</button>`).join('')}
          </div>
          <div style="margin-top:16px;background:#121212;border-radius:10px;padding:12px">
            <div style="color:#8E8E93;font-size:10px;margin-bottom:6px">PREVIEW</div>
            <div id="animPreview" style="color:${clip.fontColor};font-size:${clip.fontSize}px;text-align:center;padding:20px 0">${clip.text}</div>
          </div>
        </div>
        
        <div id="tab-bg" style="display:${focusTab==='bg'?'block':'none'}">
          <div style="color:#8E8E93;font-size:11px;margin-bottom:12px">BACKGROUND STYLE</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            <button class="posBtn" data-pos="top" style="background:${clip.position==='top'?'#5856D6':'#2A2A2A'};color:#FFF;border:none;padding:20px;border-radius:12px;font-size:12px">Top</button>
            <button class="posBtn" data-pos="center" style="background:${!clip.position||clip.position==='center'?'#5856D6':'#2A2A2A'};color:#FFF;border:none;padding:20px;border-radius:12px;font-size:12px">Center</button>
            <button class="posBtn" data-pos="bottom" style="background:${clip.position==='bottom'?'#5856D6':'#2A2A2A'};color:#FFF;border:none;padding:20px;border-radius:12px;font-size:12px">Bottom</button>
            <button class="bgStyleBtn" data-style="transparent" style="background:#2A2A2A;color:#FFF;border:none;padding:20px;border-radius:12px;font-size:12px">No BG</button>
          </div>
        </div>
      </div>
      
      <div style="padding:12px 16px;border-top:1px solid #2A2A2A;display:flex;gap:10px;background:#121212">
        <button id="saveText" style="flex:1;background:#5856D6;color:#FFF;border:none;padding:14px;border-radius:30px;font-weight:700">Save</button>
        <button id="deleteText" style="background:#2A2A2A;color:#FF3B30;border:none;padding:14px 20px;border-radius:30px;font-weight:600">Delete</button>
      </div>
    `;
    
    modal.style.display='flex';
    
    // Tabs
    content.querySelectorAll('.tabBtn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const tab=btn.dataset.tab;
        content.querySelectorAll('.tabBtn').forEach(b=>{ b.style.background='transparent'; b.style.color='#8E8E93'; b.classList.remove('active'); });
        btn.style.background='#5856D6'; btn.style.color='#FFF'; btn.classList.add('active');
        content.querySelectorAll('[id^="tab-"]').forEach(t=>t.style.display='none');
        const target=content.querySelector('#tab-'+tab);
        if(target) target.style.display='block';
      });
    });
    
    // Text input live update
    const textInput=content.querySelector('#textInput');
    const fontSize=content.querySelector('#fontSize');
    const fontSizeVal=content.querySelector('#fontSizeVal');
    
    const updatePreview = ()=>{
      clip.text = textInput?.value || clip.text;
      clip.name = (clip.text||'Text').substr(0,15);
      if(window.TimelineUI) TimelineUI.render();
      if(window.Renderer) Renderer._renderTextClip(clip, window.TimelineUI?.currentTime||0);
    };
    
    textInput?.addEventListener('input', updatePreview);
    fontSize?.addEventListener('input', (e)=>{
      clip.fontSize=parseInt(e.target.value);
      if(fontSizeVal) fontSizeVal.textContent=clip.fontSize+'px';
      updatePreview();
    });
    
    // Templates
    content.querySelectorAll('.templateBtn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        clip.template=btn.dataset.template;
        content.querySelectorAll('.templateBtn').forEach(b=>{ b.style.background='#2A2A2A'; b.style.borderColor='#333'; });
        btn.style.background='#5856D6'; btn.style.borderColor='#5856D6';
        updatePreview();
      });
    });
    
    // Fonts
    content.querySelectorAll('.fontBtn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        clip.fontFamily=btn.dataset.font;
        content.querySelectorAll('.fontBtn').forEach(b=>b.style.background='#2A2A2A');
        btn.style.background='#5856D6';
        updatePreview();
      });
    });
    
    // Colors
    content.querySelectorAll('.colorBtn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        clip.fontColor=btn.dataset.color;
        content.querySelectorAll('.colorBtn').forEach(b=>{ b.style.borderColor='#333'; b.style.boxShadow='none'; });
        btn.style.borderColor='#5856D6'; btn.style.boxShadow='0 0 0 2px #5856D6';
        updatePreview();
      });
    });
    
    // BG colors
    content.querySelectorAll('.bgBtn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        clip.bgColor=btn.dataset.bg;
        content.querySelectorAll('.bgBtn').forEach(b=>b.style.borderColor='#333');
        btn.style.borderColor='#5856D6';
        updatePreview();
      });
    });
    
    // Anim
    content.querySelectorAll('.animBtn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        clip.animation=btn.dataset.anim;
        content.querySelectorAll('.animBtn').forEach(b=>b.style.background='#2A2A2A');
        btn.style.background='#5856D6';
        updatePreview();
      });
    });
    
    // Position
    content.querySelectorAll('.posBtn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        clip.position=btn.dataset.pos;
        content.querySelectorAll('.posBtn').forEach(b=>b.style.background='#2A2A2A');
        btn.style.background='#5856D6';
        updatePreview();
      });
    });
    
    // Save / Delete / Close
    const close = ()=>{ modal.style.display='none'; if(window.Renderer) Renderer._renderTextClip(clip, window.TimelineUI?.currentTime||clip.startTime); };
    content.querySelector('#saveText')?.addEventListener('click', close);
    content.querySelector('#closeTextEditor')?.addEventListener('click', close);
    content.querySelector('#deleteText')?.addEventListener('click', ()=>{
      if(window.Selection) Selection.deleteSelected();
      modal.style.display='none';
    });
    modal.querySelector('#textModalBackdrop')?.addEventListener('click', close);
  },

  _toast(msg){
    const info=document.getElementById('info');
    if(info){ info.textContent=msg; info.style.color='#FFF'; setTimeout(()=>{ info.textContent='Phase 3.1: Text Fixed - InShot Style'; info.style.color='#5856D6'; },2000); }
  }
};
window.TextTool = TextTool;
