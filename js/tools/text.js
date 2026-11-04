/**
 * TextTool v3.2 - Google Fonts + Gradients + Close Fix + Delete Fix + Separate Tabs (InShot Style)
 */
const TextTool = {
  // 30+ Google Fonts free - professional editor style
  fonts: [
    {id:'Inter', name:'Inter', family:'Inter', google:true},
    {id:'Roboto', name:'Roboto', family:'Roboto', google:true},
    {id:'Poppins', name:'Poppins', family:'Poppins', google:true},
    {id:'Montserrat', name:'Montserrat', family:'Montserrat', google:true},
    {id:'Bebas Neue', name:'Bebas Neue', family:'Bebas Neue', google:true},
    {id:'Oswald', name:'Oswald', family:'Oswald', google:true},
    {id:'Anton', name:'Anton', family:'Anton', google:true},
    {id:'Lobster', name:'Lobster', family:'Lobster', google:true},
    {id:'Pacifico', name:'Pacifico', family:'Pacifico', google:true},
    {id:'Dancing Script', name:'Dancing', family:'Dancing Script', google:true},
    {id:'Caveat', name:'Caveat', family:'Caveat', google:true},
    {id:'Righteous', name:'Righteous', family:'Righteous', google:true},
    {id:'Bangers', name:'Bangers', family:'Bangers', google:true},
    {id:'Fredoka One', name:'Fredoka', family:'Fredoka One', google:true},
    {id:'Bowlby One', name:'Bowlby', family:'Bowlby One SC', google:true},
    {id:'Black Han Sans', name:'Black Han', family:'Black Han Sans', google:true},
    {id:'Permanent Marker', name:'Marker', family:'Permanent Marker', google:true},
    {id:'Bungee', name:'Bungee', family:'Bungee', google:true},
    {id:'Raleway', name:'Raleway', family:'Raleway', google:true},
    {id:'Playfair Display', name:'Playfair', family:'Playfair Display', google:true},
    {id:'Merriweather', name:'Merriweather', family:'Merriweather', google:true},
    {id:'Abril Fatface', name:'Abril', family:'Abril Fatface', google:true},
    {id:'Alfa Slab One', name:'Alfa Slab', family:'Alfa Slab One', google:true},
    {id:'Cairo', name:'عربي Cairo', family:'Cairo', google:true},
    {id:'Amiri', name:'Amiri عربي', family:'Amiri', google:true},
    {id:'Noto Nastaliq Urdu', name:'اردو نستعلیق', family:'Noto Nastaliq Urdu', google:true},
    {id:'Noto Naskh Arabic', name:'Naskh عربي', family:'Noto Naskh Arabic', google:true},
    {id:'Arial', name:'Arial (System)', family:'Arial', google:false},
    {id:'Courier New', name:'Mono', family:'Courier New', google:false}
  ],

  colors: [
    '#FFFFFF','#000000','#FF3B30','#FFCC02','#4CAF50','#5856D6','#5AC8FA','#FF2D55','#FF9500','#8E8E93',
    '#FF6B6B','#4ECDC4','#45B7D1','#FFA07A','#98D8C8','#F7DC6F','#BB8FCE','#85C1E2'
  ],

  gradients: [
    {id:'grad1', css:'linear-gradient(45deg, #FF3B30, #FF9500)', name:'Sunset'},
    {id:'grad2', css:'linear-gradient(45deg, #5856D6, #5AC8FA)', name:'Ocean'},
    {id:'grad3', css:'linear-gradient(45deg, #4CAF50, #8BC34A)', name:'Forest'},
    {id:'grad4', css:'linear-gradient(45deg, #FF2D55, #FF6B6B)', name:'Rose'},
    {id:'grad5', css:'linear-gradient(45deg, #9C27B0, #E91E63)', name:'Purple'},
    {id:'grad6', css:'linear-gradient(45deg, #FFD700, #FF8C00)', name:'Gold'},
    {id:'grad7', css:'linear-gradient(90deg, #00C9FF, #92FE9D)', name:'Neon'},
    {id:'grad8', css:'linear-gradient(45deg, #000000, #434343)', name:'Metal'}
  ],

  templates: [
    {id:'default', name:'Default', preview:'Ab', style:'font-weight:700'},
    {id:'bold', name:'Bold', preview:'Ab', style:'font-weight:900;text-shadow:3px 3px 0 #000'},
    {id:'outline', name:'Outline', preview:'Ab', style:'-webkit-text-stroke:2px #000;color:transparent'},
    {id:'shadow', name:'Shadow', preview:'Ab', style:'text-shadow:4px 4px 12px #000'},
    {id:'neon', name:'Neon', preview:'Ab', style:'text-shadow:0 0 15px currentColor'},
    {id:'retro', name:'Retro', preview:'AB', style:'background:#FF3B30;padding:4px 8px;letter-spacing:2px'},
    {id:'3d', name:'3D', preview:'Ab', style:'text-shadow:1px 1px 0 #000,2px 2px 0 #000,3px 3px 6px rgba(0,0,0,0.6)'},
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
      name: text.substr(0,15), text: text, type:'text', track:3,
      startTime: window.TimelineUI?.currentTime || 0, duration:3,
      fontSize:36, fontColor:'#FFFFFF', fontFamily:'Inter', template:'default',
      animation:'none', bgColor:'transparent', color:'#5856D6'
    });
    if(window.TimelineUI){ TimelineUI.addClip(clip); TimelineUI.render(); }
    if(window.Selection) Selection.selectClip(clip);
    if(window.Renderer) setTimeout(()=>Renderer._forceShow(clip), 150);
    this.showEditor(clip, 'text');
    return clip;
  },

  editFont(c){ this.showEditor(c||Selection?.selectedClip, 'font'); },
  editColor(c){ this.showEditor(c||Selection?.selectedClip, 'color'); },
  editAnim(c){ this.showEditor(c||Selection?.selectedClip, 'anim'); },
  editBG(c){ this.showEditor(c||Selection?.selectedClip, 'bg'); },

  showEditor(clip, focusTab='text') {
    if(!clip) return;
    let modal = document.getElementById('textEditorModal');
    if(!modal) {
      modal=document.createElement('div');
      modal.id='textEditorModal';
      modal.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;z-index:300;display:flex;flex-direction:column;pointer-events:none';
      modal.innerHTML='<div id="textModalBackdrop" style="flex:1;background:rgba(0,0,0,0.25);pointer-events:auto"></div><div id="textModalContent" style="background:#1E1E1E;border-radius:20px 20px 0 0;max-height:78vh;display:flex;flex-direction:column;pointer-events:auto;border-top:2px solid #5856D6"></div>';
      document.body.appendChild(modal);
    }
    const content=modal.querySelector('#textModalContent');
    
    // Build Google Fonts options with download links
    const fontOptions = this.fonts.map(f=>`
      <button class="fontBtn" data-font="${f.family}" data-google="${f.google}" style="background:${clip.fontFamily===f.family?'#5856D6':'#2A2A2A'};border:none;border-radius:10px;padding:14px;display:flex;justify-content:space-between;align-items:center;width:100%;margin-bottom:8px">
        <span style="font-family:${f.family};color:#FFF;font-size:18px">${f.name}</span>
        <span style="display:flex;gap:8px;align-items:center">
          ${f.google?`<a href="https://fonts.google.com/specimen/${f.family.replace(/\s+/g,'+')}" target="_blank" style="color:#5AC8FA;font-size:10px;text-decoration:none;background:#000;padding:4px 8px;border-radius:12px" onclick="event.stopPropagation()">Download</a>`:''}
          <span style="color:${clip.fontFamily===f.family?'#FFF':'#555'}">${clip.fontFamily===f.family?'✓':''}</span>
        </span>
      </button>
    `).join('');

    content.innerHTML=`
      <div style="padding:14px;border-bottom:1px solid #2A2A2A;display:flex;justify-content:space-between;align-items:center">
        <div style="display:flex;gap:8px;align-items:center"><span style="background:#5856D6;color:#FFF;padding:4px 8px;border-radius:6px;font-size:10px;font-weight:700">TEXT</span><span style="color:#FFF;font-size:13px;font-weight:600">${clip.name}</span></div>
        <div style="display:flex;gap:8px"><button id="closeTextEditor" style="background:#2A2A2A;border:none;color:#FFF;width:36px;height:36px;border-radius:50%;font-size:18px">✕</button></div>
      </div>
      <div style="display:flex;background:#121212;border-bottom:1px solid #2A2A2A;overflow-x:auto;scrollbar-width:none">
        ${['text','template','font','color','anim','bg'].map(tab=>`<button class="tabBtn ${focusTab===tab?'active':''}" data-tab="${tab}" style="flex:1;background:${focusTab===tab?'#5856D6':'transparent'};color:${focusTab===tab?'#FFF':'#8E8E93'};border:none;padding:12px 8px;font-size:11px;font-weight:700;min-width:60px">${tab.toUpperCase()}</button>`).join('')}
      </div>
      <div style="overflow-y:auto;padding:16px;max-height:50vh">
        <div id="tab-text" style="display:${focusTab==='text'?'block':'none'}">
          <textarea id="textInput" placeholder="Type your text..." style="width:100%;background:#2A2A2A;border:1px solid #444;color:#FFF;padding:14px;border-radius:12px;font-size:20px;min-height:100px;resize:none">${clip.text}</textarea>
          <div style="margin-top:12px;display:flex;justify-content:space-between"><span style="color:#8E8E93;font-size:11px">SIZE</span><span id="fontSizeVal" style="color:#FFF;font-size:12px;font-weight:700">${clip.fontSize||36}px</span></div>
          <input id="fontSize" type="range" min="12" max="120" value="${clip.fontSize||36}" style="width:100%;accent-color:#5856D6;margin-top:8px">
        </div>
        <div id="tab-template" style="display:${focusTab==='template'?'block':'none'}">
          <div style="color:#8E8E93;font-size:11px;margin-bottom:12px">TEMPLATES - Tap to Apply</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            ${this.templates.map(t=>`<button class="templateBtn" data-template="${t.id}" style="background:${clip.template===t.id?'#5856D6':'#2A2A2A'};border:2px solid ${clip.template===t.id?'#FFF':'#333'};border-radius:12px;padding:18px;display:flex;flex-direction:column;align-items:center;gap:8px"><div style="font-size:30px;color:#FFF;${t.style}">${t.preview}</div><span style="color:#FFF;font-size:10px;font-weight:600">${t.name}</span></button>`).join('')}
          </div>
        </div>
        <div id="tab-font" style="display:${focusTab==='font'?'block':'none'}">
          <div style="color:#8E8E93;font-size:11px;margin-bottom:12px">GOOGLE FONTS - Free, Tap Download to get more</div>
          <div style="max-height:40vh;overflow-y:auto">${fontOptions}</div>
          <div style="margin-top:12px;background:#121212;border-radius:10px;padding:10px;color:#8E8E93;font-size:10px">All Google Fonts are free for commercial use. Tap Download to open Google Fonts page and download.</div>
        </div>
        <div id="tab-color" style="display:${focusTab==='color'?'block':'none'}">
          <div style="color:#8E8E93;font-size:11px;margin-bottom:12px">SOLID COLORS</div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px">
            ${this.colors.map(c=>`<button class="colorBtn" data-color="${c}" style="width:46px;height:46px;border-radius:50%;background:${c};border:3px solid ${clip.fontColor===c?'#FFF':'#333'};box-shadow:${clip.fontColor===c?'0 0 0 2px #5856D6':''}"></button>`).join('')}
          </div>
          <div style="color:#8E8E93;font-size:11px;margin-bottom:12px">GRADIENT COLORS - InShot Style</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            ${this.gradients.map(g=>`<button class="gradBtn" data-grad="${g.css}" style="background:${g.css};border:2px solid ${clip.fontColor===g.css?'#FFF':'#333'};border-radius:12px;padding:20px;color:#FFF;font-size:12px;font-weight:700;text-shadow:0 1px 4px rgba(0,0,0,0.6)">${g.name}</button>`).join('')}
          </div>
        </div>
        <div id="tab-anim" style="display:${focusTab==='anim'?'block':'none'}">
          <div style="color:#8E8E93;font-size:11px;margin-bottom:12px">ANIMATION</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${this.animations.map(a=>`<button class="animBtn" data-anim="${a.id}" style="background:${clip.animation===a.id?'#5856D6':'#2A2A2A'};color:#FFF;border:none;padding:12px 20px;border-radius:20px;font-size:12px;font-weight:600">${a.name}</button>`).join('')}
          </div>
          <div style="margin-top:16px;background:#000;border-radius:12px;padding:20px;text-align:center"><div id="animPreview" style="color:${clip.fontColor};font-size:${clip.fontSize}px">${clip.text}</div></div>
        </div>
        <div id="tab-bg" style="display:${focusTab==='bg'?'block':'none'}">
          <div style="color:#8E8E93;font-size:11px;margin-bottom:12px">POSITION & BACKGROUND</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px">
            <button class="posBtn" data-pos="top" style="background:${clip.position==='top'?'#5856D6':'#2A2A2A'};color:#FFF;border:none;padding:16px;border-radius:10px">Top</button>
            <button class="posBtn" data-pos="center" style="background:${!clip.position||clip.position==='center'?'#5856D6':'#2A2A2A'};color:#FFF;border:none;padding:16px;border-radius:10px">Center</button>
            <button class="posBtn" data-pos="bottom" style="background:${clip.position==='bottom'?'#5856D6':'#2A2A2A'};color:#FFF;border:none;padding:16px;border-radius:10px">Bottom</button>
          </div>
          <div style="color:#8E8E93;font-size:11px;margin-bottom:8px">BACKGROUND COLOR</div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button class="bgBtn" data-bg="transparent" style="width:44px;height:44px;border-radius:50%;background:repeating-conic-gradient(#666 0% 25%, #000 0% 50%) 50% / 16px 16px;border:2px solid ${clip.bgColor==='transparent'?'#FFF':'#333'}"></button>
            ${this.colors.map(c=>`<button class="bgBtn" data-bg="${c}" style="width:44px;height:44px;border-radius:50%;background:${c};border:2px solid ${clip.bgColor===c?'#FFF':'#333'}"></button>`).join('')}
          </div>
        </div>
      </div>
      <div style="padding:12px 16px;border-top:1px solid #2A2A2A;display:flex;gap:10px;background:#121212">
        <button id="saveText" style="flex:1;background:#5856D6;color:#FFF;border:none;padding:14px;border-radius:30px;font-weight:700">Save & Close</button>
        <button id="deleteText" style="background:#2A2A2A;color:#FF3B30;border:none;padding:14px 22px;border-radius:30px;font-weight:700">Delete</button>
      </div>
    `;
    
    modal.style.display='flex';
    
    // Tab switching
    const switchTab=(tab)=>{
      content.querySelectorAll('.tabBtn').forEach(b=>{ b.style.background='transparent'; b.style.color='#8E8E93'; });
      const active=content.querySelector(`.tabBtn[data-tab="${tab}"]`);
      if(active){ active.style.background='#5856D6'; active.style.color='#FFF'; }
      content.querySelectorAll('[id^="tab-"]').forEach(t=>t.style.display='none');
      const target=content.querySelector('#tab-'+tab);
      if(target) target.style.display='block';
    };
    
    content.querySelectorAll('.tabBtn').forEach(btn=>{
      btn.addEventListener('click', ()=>switchTab(btn.dataset.tab));
    });
    
    const update=()=>{
      clip.text=content.querySelector('#textInput')?.value||clip.text;
      clip.name=(clip.text||'Text').substr(0,15);
      if(window.TimelineUI) TimelineUI.render();
      if(window.Renderer) Renderer._forceShow(clip);
    };
    
    content.querySelector('#textInput')?.addEventListener('input', update);
    content.querySelector('#fontSize')?.addEventListener('input', (e)=>{
      clip.fontSize=parseInt(e.target.value);
      const v=content.querySelector('#fontSizeVal');
      if(v) v.textContent=clip.fontSize+'px';
      update();
    });
    
    content.querySelectorAll('.templateBtn').forEach(b=>{
      b.addEventListener('click', ()=>{ clip.template=b.dataset.template; content.querySelectorAll('.templateBtn').forEach(x=>{x.style.background='#2A2A2A'; x.style.borderColor='#333';}); b.style.background='#5856D6'; b.style.borderColor='#FFF'; update(); });
    });
    
    content.querySelectorAll('.fontBtn').forEach(b=>{
      b.addEventListener('click', ()=>{
        const fam=b.dataset.font;
        clip.fontFamily=fam;
        // Load Google Font
        if(b.dataset.google==='true'){
          const id='gf-'+fam.replace(/\s+/g,'-');
          if(!document.getElementById(id)){
            const link=document.createElement('link');
            link.id=id; link.rel='stylesheet';
            link.href=`https://fonts.googleapis.com/css2?family=${fam.replace(/\s+/g,'+')}:wght@400;700;900&display=swap`;
            document.head.appendChild(link);
          }
        }
        content.querySelectorAll('.fontBtn').forEach(x=>x.style.background='#2A2A2A');
        b.style.background='#5856D6';
        update();
      });
    });
    
    content.querySelectorAll('.colorBtn').forEach(b=>{
      b.addEventListener('click', ()=>{ clip.fontColor=b.dataset.color; content.querySelectorAll('.colorBtn').forEach(x=>x.style.borderColor='#333'); b.style.borderColor='#FFF'; update(); });
    });
    
    content.querySelectorAll('.gradBtn').forEach(b=>{
      b.addEventListener('click', ()=>{ clip.fontColor=b.dataset.grad; content.querySelectorAll('.gradBtn').forEach(x=>x.style.borderColor='#333'); b.style.borderColor='#FFF'; update(); });
    });
    
    content.querySelectorAll('.animBtn').forEach(b=>{
      b.addEventListener('click', ()=>{ clip.animation=b.dataset.anim; content.querySelectorAll('.animBtn').forEach(x=>x.style.background='#2A2A2A'); b.style.background='#5856D6'; update(); });
    });
    
    content.querySelectorAll('.posBtn').forEach(b=>{
      b.addEventListener('click', ()=>{ clip.position=b.dataset.pos; content.querySelectorAll('.posBtn').forEach(x=>x.style.background='#2A2A2A'); b.style.background='#5856D6'; update(); });
    });
    
    content.querySelectorAll('.bgBtn').forEach(b=>{
      b.addEventListener('click', ()=>{ clip.bgColor=b.dataset.bg; content.querySelectorAll('.bgBtn').forEach(x=>x.style.borderColor='#333'); b.style.borderColor='#FFF'; update(); });
    });
    
    // FIX: Close functionality
    const closeModal=()=>{
      modal.style.display='none';
      // Also close contextual toolbar if needed
      // Don't hide contextual toolbar completely, just close editor
      console.log('Text editor closed');
      // Force renderer to keep showing selected clip
      if(window.Renderer) Renderer._forceShow(clip);
    };
    
    const deleteClip=()=>{
      console.log('Delete text clip', clip.id);
      if(window.Selection) {
        // Delete directly
        if(window.TimelineUI) {
          TimelineUI.clips = TimelineUI.clips.filter(c=>c.id!==clip.id);
          TimelineUI.render();
        }
        Selection.deselectAll();
      }
      modal.style.display='none';
      if(window.Renderer) Renderer._hide();
      if(window.Toolbar) Toolbar.renderMain();
    };
    
    content.querySelector('#saveText')?.addEventListener('click', closeModal);
    content.querySelector('#closeTextEditor')?.addEventListener('click', closeModal);
    content.querySelector('#deleteText')?.addEventListener('click', deleteClip);
    modal.querySelector('#textModalBackdrop')?.addEventListener('click', closeModal);
  }
};
window.TextTool = TextTool;
