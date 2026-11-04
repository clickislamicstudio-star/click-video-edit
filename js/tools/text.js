
/**
 * TextTool v3.4 FINAL - Bottom Sheet - Video Always Visible
 * - All functionality at bottom 40% of screen
 * - Video always visible on top 60%
 * - User can scroll bottom sheet up/down but video stays visible
 */
const TextTool = {
  popularFonts: [
    {id:'Inter', name:'Inter', family:'Inter', weight:'700'},
    {id:'Poppins', name:'Poppins', family:'Poppins', weight:'700'},
    {id:'Montserrat', name:'Montserrat', family:'Montserrat', weight:'700'},
    {id:'Bebas Neue', name:'Bebas', family:'Bebas Neue', weight:'400'},
    {id:'Oswald', name:'Oswald', family:'Oswald', weight:'700'},
    {id:'Anton', name:'Anton', family:'Anton', weight:'400'},
    {id:'Lobster', name:'Lobster', family:'Lobster', weight:'400'},
    {id:'Pacifico', name:'Pacifico', family:'Pacifico', weight:'400'},
    {id:'Bangers', name:'Bangers', family:'Bangers', weight:'400'},
    {id:'Righteous', name:'Righteous', family:'Righteous', weight:'400'}
  ],
  downloadableFonts: [
    {id:'Roboto', name:'Roboto', family:'Roboto'},
    {id:'Dancing Script', name:'Dancing', family:'Dancing Script'},
    {id:'Caveat', name:'Caveat', family:'Caveat'},
    {id:'Permanent Marker', name:'Marker', family:'Permanent Marker'},
    {id:'Bowlby One SC', name:'Bowlby', family:'Bowlby One SC'},
    {id:'Black Han Sans', name:'Black Han', family:'Black Han Sans'},
    {id:'Bungee', name:'Bungee', family:'Bungee'},
    {id:'Raleway', name:'Raleway', family:'Raleway'},
    {id:'Playfair Display', name:'Playfair', family:'Playfair Display'},
    {id:'Merriweather', name:'Merriweather', family:'Merriweather'},
    {id:'Abril Fatface', name:'Abril', family:'Abril Fatface'},
    {id:'Alfa Slab One', name:'Alfa Slab', family:'Alfa Slab One'},
    {id:'Fredoka One', name:'Fredoka', family:'Fredoka One'},
    {id:'Cairo', name:'Cairo', family:'Cairo'},
    {id:'Amiri', name:'Amiri', family:'Amiri'},
    {id:'Noto Nastaliq Urdu', name:'اردو', family:'Noto Nastaliq Urdu'},
    {id:'Amatic SC', name:'Amatic', family:'Amatic SC'},
    {id:'Great Vibes', name:'Great Vibes', family:'Great Vibes'},
    {id:'Orbitron', name:'Orbitron', family:'Orbitron'},
    {id:'Tajawal', name:'Tajawal', family:'Tajawal'}
  ],
  colors: ['#FFFFFF','#000000','#FF3B30','#FFCC02','#4CAF50','#5856D6','#5AC8FA','#FF2D55','#FF9500','#8E8E93','#FF6B6B','#4ECDC4','#45B7D1','#FFA07A','#98D8C8','#F7DC6F','#BB8FCE','#85C1E2','#F1948A','#82E0AA'],
  gradients: [
    {css:'linear-gradient(45deg, #FF3B30, #FF9500)', name:'Sunset'},
    {css:'linear-gradient(45deg, #5856D6, #5AC8FA)', name:'Ocean'},
    {css:'linear-gradient(45deg, #4CAF50, #8BC34A)', name:'Forest'},
    {css:'linear-gradient(45deg, #FF2D55, #FF6B6B)', name:'Rose'},
    {css:'linear-gradient(45deg, #9C27B0, #E91E63)', name:'Purple'},
    {css:'linear-gradient(45deg, #FFD700, #FF8C00)', name:'Gold'},
    {css:'linear-gradient(90deg, #00C9FF, #92FE9D)', name:'Neon'},
    {css:'linear-gradient(45deg, #000000, #434343)', name:'Metal'},
    {css:'linear-gradient(45deg, #667eea, #764ba2)', name:'Violet'},
    {css:'linear-gradient(45deg, #f093fb, #f5576c)', name:'Pink'},
    {css:'linear-gradient(45deg, #4facfe, #00f2fe)', name:'Sky'},
    {css:'linear-gradient(45deg, #43e97b, #38f9d7)', name:'Mint'},
    {css:'linear-gradient(45deg, #fa709a, #fee140)', name:'Peach'},
    {css:'linear-gradient(45deg, #a8edea, #fed6e3)', name:'Pastel'},
    {css:'linear-gradient(45deg, #ff9a9e, #fecfef)', name:'Blush'},
    {css:'linear-gradient(45deg, #ffecd2, #fcb69f)', name:'Warm'},
    {css:'linear-gradient(45deg, #ff8c00, #ff2d55)', name:'Fire'},
    {css:'linear-gradient(45deg, #00c6ff, #0072ff)', name:'Blue'},
    {css:'linear-gradient(45deg, #7f00ff, #e100ff)', name:'Magenta'},
    {css:'linear-gradient(45deg, #f83600, #f9d423)', name:'Sun'},
    {css:'linear-gradient(45deg, #30cfd0, #330867)', name:'Deep'},
    {css:'linear-gradient(45deg, #a1c4fd, #c2e9fb)', name:'Ice'},
    {css:'linear-gradient(45deg, #ff0844, #ffb199)', name:'Coral'},
    {css:'linear-gradient(45deg, #00b09b, #96c93d)', name:'Lime'}
  ],
  templates: [
    {id:'default', name:'Default', preview:'My Dear', desc:'Clean', style:'font-weight:700;color:#FFF'},
    {id:'bold', name:'Bold', preview:'My Dear', desc:'Strong', style:'font-weight:900;text-shadow:2px 2px 0 #000;color:#FFF'},
    {id:'outline', name:'Outline', preview:'My Dear', desc:'Stroke', style:'-webkit-text-stroke:2px #FFF;color:transparent;font-weight:900'},
    {id:'shadow', name:'Shadow', preview:'My Dear', desc:'Soft', style:'text-shadow:3px 3px 8px rgba(0,0,0,0.8);color:#FFF;font-weight:700'},
    {id:'neon', name:'Neon', preview:'My Dear', desc:'Glow', style:'text-shadow:0 0 10px currentColor,0 0 20px currentColor;color:#FFF'},
    {id:'retro', name:'Retro', preview:'MY DEAR', desc:'Vintage', style:'background:#FF3B30;color:#FFF;padding:6px 12px;font-weight:900'},
    {id:'3d', name:'3D', preview:'My Dear', desc:'Depth', style:'text-shadow:1px 1px 0 #000,2px 2px 0 #000,3px 3px 6px rgba(0,0,0,0.7);color:#FFF'},
    {id:'cinema', name:'Cinema', preview:'MY DEAR', desc:'Movie', style:'border:2px solid #FFF;color:#FFF;padding:6px 14px;letter-spacing:3px;font-weight:700'},
    {id:'bubble', name:'Bubble', preview:'My Dear', desc:'Rounded', style:'background:rgba(88,86,214,0.9);color:#FFF;padding:8px 18px;border-radius:20px;font-weight:700'},
    {id:'fire', name:'Fire', preview:'My Dear', desc:'Gradient', style:'background:linear-gradient(45deg,#FF3B30,#FF9500);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:900'},
    {id:'ice', name:'Ice', preview:'My Dear', desc:'Cold', style:'background:linear-gradient(45deg,#00C9FF,#92FE9D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:900'},
    {id:'elegant', name:'Elegant', preview:'My Dear', desc:'Serif', style:'font-family:Georgia,serif;font-style:italic;font-weight:300;color:#FFF'}
  ],
  animations: [
    {id:'none', name:'None', icon:'○'},
    {id:'fadeIn', name:'Fade', icon:'◐'},
    {id:'slideUp', name:'Slide', icon:'↑'},
    {id:'typewriter', name:'Type', icon:'⌨'},
    {id:'bounce', name:'Bounce', icon:'⌒'},
    {id:'scale', name:'Scale', icon:'◎'}
  ],
  _preloadPopularFonts(){
    if(document.getElementById('popular-fonts-link')) return;
    const link=document.createElement('link'); link.id='popular-fonts-link'; link.rel='stylesheet';
    link.href='https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Poppins:wght@400;700;900&family=Montserrat:wght@400;700;900&family=Bebas+Neue&family=Oswald:wght@400;700&family=Anton&family=Lobster&family=Pacifico&family=Bangers&family=Righteous&display=swap';
    document.head.appendChild(link);
  },
  addTextClip(text='My Dear'){
    this._preloadPopularFonts();
    const clip=new Clip({name:text.substr(0,15), text:text, type:'text', track:3, startTime:window.TimelineUI?.currentTime||0, duration:3, fontSize:36, fontColor:'#FFFFFF', fontFamily:'Inter', template:'default', animation:'none', bgColor:'transparent', color:'#5856D6'});
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

  showEditor(clip, focusTab='text'){
    if(!clip) return;
    this._preloadPopularFonts();
    let modal=document.getElementById('textEditorModal');
    if(!modal){
      modal=document.createElement('div');
      modal.id='textEditorModal';
      // BOTTOM SHEET FIX: Only 42% height, rest video visible, backdrop almost transparent
      modal.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;z-index:300;display:flex;flex-direction:column;pointer-events:none';
      modal.innerHTML=`
        <div id="textModalBackdrop" style="flex:1;background:rgba(0,0,0,0.08);pointer-events:auto;backdrop-filter:blur(1px)"></div>
        <div id="textModalContent" style="background:#1A1A1E;border-radius:22px 22px 0 0;max-height:44vh;min-height:38vh;display:flex;flex-direction:column;pointer-events:auto;border-top:1.5px solid rgba(88,86,214,0.6);box-shadow:0 -8px 32px rgba(0,0,0,0.7);transform:translateY(0);transition:transform 0.3s cubic-bezier(0.32,0.72,0,1)"></div>
      `;
      document.body.appendChild(modal);
    }
    const content=modal.querySelector('#textModalContent');
    if(window.Renderer && window.Renderer.textEl){
      window.Renderer.textEl.style.top='30%';
      window.Renderer.textEl.style.zIndex='2';
    }

    const popularHtml=this.popularFonts.map(f=>`
      <button class="fontBtn popularFont" data-font="${f.family}" style="background:${clip.fontFamily===f.family?'#5856D6':'#242429'};border:1.5px solid ${clip.fontFamily===f.family?'#FFF':'#2A2A2E'};border-radius:14px;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;width:100%;margin-bottom:8px">
        <div style="display:flex;flex-direction:column;align-items:flex-start"><span style="font-family:${f.family};color:#FFF;font-size:18px;font-weight:${f.weight};line-height:1.1">${f.name}</span><span style="color:#8E8E93;font-size:9px;letter-spacing:0.4px">PRE-INSTALLED</span></div>
        <span style="background:${clip.fontFamily===f.family?'#FFF':'#333'};color:${clip.fontFamily===f.family?'#5856D6':'#666'};width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800">${clip.fontFamily===f.family?'✓':''}</span>
      </button>
    `).join('');
    const downloadableHtml=this.downloadableFonts.map(f=>`
      <button class="fontBtn downloadFont" data-font="${f.family}" style="background:${clip.fontFamily===f.family?'#5856D6':'#242429'};border:1.5px solid ${clip.fontFamily===f.family?'#FFF':'#2A2A2E'};border-radius:12px;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;width:100%;margin-bottom:6px">
        <span style="font-family:${f.family};color:#FFF;font-size:16px">${f.name}</span>
        <span style="display:flex;gap:6px;align-items:center"><span style="background:#121212;color:#5AC8FA;font-size:9px;padding:4px 8px;border-radius:12px;border:1px solid #333" onclick="event.stopPropagation(); window.open('https://fonts.google.com/specimen/${f.family.replace(/ /g,'+')}','_blank')">↓</span><span style="color:${clip.fontFamily===f.family?'#FFF':'transparent'}">✓</span></span>
      </button>
    `).join('');

    content.innerHTML=`
      <div style="display:flex;justify-content:center;padding:8px 0 4px"><div style="width:36px;height:4px;background:#3A3A3E;border-radius:2px"></div></div>
      <div style="padding:0 14px 10px;height:44px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #242429;flex-shrink:0">
        <div style="display:flex;gap:8px;align-items:center"><span style="background:#5856D6;color:#FFF;padding:4px 8px;border-radius:7px;font-size:9px;font-weight:800">TEXT</span><span style="color:#FFF;font-size:13px;font-weight:600;max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${clip.text.substr(0,22)||'My Dear'}</span></div>
        <div style="display:flex;gap:6px;align-items:center"><span style="color:#8E8E93;font-size:10px">${clip.fontSize||36}px • ${clip.fontFamily||'Inter'}</span><button id="closeTopX" style="background:#242429;border:none;color:#8E8E93;width:28px;height:28px;border-radius:50%;font-size:12px">✕</button></div>
      </div>
      <div style="display:flex;background:#121214;border-bottom:1px solid #242429;overflow-x:auto;scrollbar-width:none;flex-shrink:0">
        ${['text','template','font','color','anim','bg'].map(tab=>`<button class="tabBtn ${focusTab===tab?'active':''}" data-tab="${tab}" style="flex:1;background:${focusTab===tab?'#5856D6':'transparent'};color:${focusTab===tab?'#FFF':'#8E8E93'};border:none;padding:11px 4px;font-size:10px;font-weight:800;min-width:56px;border-bottom:${focusTab===tab?'2px solid #FFF':'2px solid transparent'}">${tab.toUpperCase()}</button>`).join('')}
      </div>
      <div style="overflow-y:auto;padding:12px;flex:1;background:#1A1A1E;max-height:26vh">
        <div id="tab-text" style="display:${focusTab==='text'?'block':'none'}">
          <div style="background:#242429;border-radius:14px;padding:12px;border:1px solid #2A2A2E"><textarea id="textInput" placeholder="Type text..." style="width:100%;background:transparent;border:none;color:#FFF;padding:2px;font-size:18px;min-height:64px;resize:none;outline:none;font-family:inherit;line-height:1.4">${clip.text}</textarea></div>
          <div style="margin-top:10px;display:flex;justify-content:space-between;align-items:center"><span style="color:#8E8E93;font-size:10px;font-weight:700">SIZE</span><span id="fontSizeVal" style="color:#FFF;font-size:11px;font-weight:700;background:#121214;padding:3px 8px;border-radius:10px">${clip.fontSize||36}px</span></div>
          <input id="fontSize" type="range" min="12" max="120" value="${clip.fontSize||36}" style="width:100%;accent-color:#5856D6;margin-top:8px;height:4px">
        </div>
        <div id="tab-template" style="display:${focusTab==='template'?'block':'none'}">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            ${this.templates.map(t=>`<button class="templateBtn" data-template="${t.id}" style="background:${clip.template===t.id?'#5856D6':'#242429'};border:1.5px solid ${clip.template===t.id?'#FFF':'#2A2A2E'};border-radius:14px;padding:14px 8px;display:flex;flex-direction:column;align-items:center;gap:6px;min-height:82px;justify-content:center"><div style="font-size:22px;${t.style};line-height:1.1">${t.preview}</div><div style="display:flex;flex-direction:column;align-items:center"><span style="color:#FFF;font-size:10px;font-weight:700">${t.name}</span><span style="color:#666;font-size:8px">${t.desc}</span></div></button>`).join('')}
          </div>
        </div>
        <div id="tab-font" style="display:${focusTab==='font'?'block':'none'}">
          <div style="display:flex;gap:8px;margin-bottom:10px"><span style="background:#5856D6;color:#FFF;padding:3px 8px;border-radius:10px;font-size:9px;font-weight:800">10 PRE-INSTALLED</span><span style="color:#8E8E93;font-size:9px;padding:3px 0">No download needed</span></div>
          <div style="max-height:18vh;overflow-y:auto;margin-bottom:12px">${popularHtml}</div>
          <div style="display:flex;gap:8px;margin-bottom:8px"><span style="background:#242429;color:#8E8E93;padding:3px 8px;border-radius:10px;font-size:9px;border:1px dashed #333">MORE • Download</span><span style="color:#666;font-size:9px">${this.downloadableFonts.length} fonts</span></div>
          <div style="max-height:14vh;overflow-y:auto">${downloadableHtml}</div>
        </div>
        <div id="tab-color" style="display:${focusTab==='color'?'block':'none'}">
          <div style="color:#8E8E93;font-size:10px;font-weight:700;margin-bottom:8px">SOLID • Tap to apply</div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px">
            ${this.colors.map(c=>`<button class="colorBtn" data-color="${c}" style="width:40px;height:40px;border-radius:50%;background:${c};border:2.5px solid ${clip.fontColor===c?'#FFF':'#2A2A2E'};box-shadow:${clip.fontColor===c?'0 0 0 2.5px #5856D6':''}"></button>`).join('')}
          </div>
          <div style="color:#8E8E93;font-size:10px;font-weight:700;margin-bottom:8px">GRADIENT • Circular • CapCut Style</div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            ${this.gradients.map(g=>`<button class="gradBtn" data-grad="${g.css}" title="${g.name}" style="width:40px;height:40px;border-radius:50%;background:${g.css};border:2.5px solid ${clip.fontColor===g.css?'#FFF':'#2A2A2E'};box-shadow:${clip.fontColor===g.css?'0 0 0 2.5px #5856D6':''}"></button>`).join('')}
          </div>
          <div style="height:8px"></div>
        </div>
        <div id="tab-anim" style="display:${focusTab==='anim'?'block':'none'}">
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${this.animations.map(a=>`<button class="animBtn" data-anim="${a.id}" style="background:${clip.animation===a.id?'#5856D6':'#242429'};color:#FFF;border:1.5px solid ${clip.animation===a.id?'#FFF':'#2A2A2E'};padding:10px 16px;border-radius:20px;font-size:11px;font-weight:700"><span>${a.icon}</span> ${a.name}</button>`).join('')}
          </div>
        </div>
        <div id="tab-bg" style="display:${focusTab==='bg'?'block':'none'}">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px">
            <button class="posBtn" data-pos="top" style="background:${clip.position==='top'?'#5856D6':'#242429'};color:#FFF;border:1.5px solid ${clip.position==='top'?'#FFF':'#2A2A2E'};padding:14px 6px;border-radius:12px;font-size:10px;font-weight:700">↑ Top</button>
            <button class="posBtn" data-pos="center" style="background:${!clip.position||clip.position==='center'?'#5856D6':'#242429'};color:#FFF;border:1.5px solid ${!clip.position||clip.position==='center'?'#FFF':'#2A2A2E'};padding:14px 6px;border-radius:12px;font-size:10px;font-weight:700">⊕ Center</button>
            <button class="posBtn" data-pos="bottom" style="background:${clip.position==='bottom'?'#5856D6':'#242429'};color:#FFF;border:1.5px solid ${clip.position==='bottom'?'#FFF':'#2A2A2E'};padding:14px 6px;border-radius:12px;font-size:10px;font-weight:700">↓ Bottom</button>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="bgBtn" data-bg="transparent" style="width:40px;height:40px;border-radius:50%;background:repeating-conic-gradient(#444 0% 25%, #1A1A1A 0% 50%) 50% / 12px 12px;border:2.5px solid ${clip.bgColor==='transparent'?'#FFF':'#2A2A2E'}"></button>
            ${this.colors.map(c=>`<button class="bgBtn" data-bg="${c}" style="width:40px;height:40px;border-radius:50%;background:${c};border:2.5px solid ${clip.bgColor===c?'#FFF':'#2A2A2E'}"></button>`).join('')}
          </div>
        </div>
      </div>
      <div style="padding:10px 12px;border-top:1px solid #242429;display:flex;gap:8px;background:#121214;flex-shrink:0">
        <button id="saveText" style="flex:1;background:#5856D6;color:#FFF;border:none;padding:12px;border-radius:24px;font-weight:800;font-size:13px">Save</button>
        <button id="deleteText" style="background:#242429;color:#FF453A;border:1px solid #2A2A2E;padding:12px 16px;border-radius:24px;font-weight:700;font-size:12px">Delete</button>
        <button id="closeText" style="background:#242429;color:#8E8E93;border:1px solid #2A2A2E;padding:12px 16px;border-radius:24px;font-weight:700;font-size:12px">Close</button>
      </div>
    `;
    modal.style.display='flex';
    const switchTab=(tab)=>{
      content.querySelectorAll('.tabBtn').forEach(b=>{ b.style.background='transparent'; b.style.color='#8E8E93'; b.style.borderBottom='2px solid transparent'; });
      const active=content.querySelector(`.tabBtn[data-tab="${tab}"]`); if(active){ active.style.background='#5856D6'; active.style.color='#FFF'; active.style.borderBottom='2px solid #FFF'; }
      content.querySelectorAll('[id^="tab-"]').forEach(t=>t.style.display='none');
      const target=content.querySelector('#tab-'+tab); if(target) target.style.display='block';
    };
    content.querySelectorAll('.tabBtn').forEach(btn=>{ btn.addEventListener('click', ()=>switchTab(btn.dataset.tab)); });
    const update=()=>{ clip.text=content.querySelector('#textInput')?.value||clip.text; clip.name=(clip.text||'Text').substr(0,15); if(window.TimelineUI) TimelineUI.render(); if(window.Renderer) Renderer._forceShow(clip); };
    content.querySelector('#textInput')?.addEventListener('input', update);
    content.querySelector('#fontSize')?.addEventListener('input', (e)=>{ clip.fontSize=parseInt(e.target.value); const v=content.querySelector('#fontSizeVal'); if(v) v.textContent=clip.fontSize+'px'; update(); });
    content.querySelectorAll('.templateBtn').forEach(b=>{ b.addEventListener('click', ()=>{ clip.template=b.dataset.template; content.querySelectorAll('.templateBtn').forEach(x=>{x.style.background='#242429'; x.style.borderColor='#2A2A2E';}); b.style.background='#5856D6'; b.style.borderColor='#FFF'; update(); }); });
    content.querySelectorAll('.fontBtn').forEach(b=>{
      b.addEventListener('click', ()=>{
        const fam=b.dataset.font; clip.fontFamily=fam;
        const id='gf-'+fam.replace(/\s+/g,'-');
        if(!document.getElementById(id)){ const link=document.createElement('link'); link.id=id; link.rel='stylesheet'; link.href=`https://fonts.googleapis.com/css2?family=${fam.replace(/ /g,'+')}:wght@400;700;900&display=swap`; document.head.appendChild(link); }
        content.querySelectorAll('.fontBtn').forEach(x=>{ x.style.background='#242429'; x.style.borderColor='#2A2A2E'; }); b.style.background='#5856D6'; b.style.borderColor='#FFF'; update();
      });
    });
    content.querySelectorAll('.colorBtn').forEach(b=>{ b.addEventListener('click', ()=>{ clip.fontColor=b.dataset.color; content.querySelectorAll('.colorBtn').forEach(x=>x.style.borderColor='#2A2A2E'); b.style.borderColor='#FFF'; update(); }); });
    content.querySelectorAll('.gradBtn').forEach(b=>{ b.addEventListener('click', ()=>{ clip.fontColor=b.dataset.grad; content.querySelectorAll('.gradBtn').forEach(x=>x.style.borderColor='#2A2A2E'); b.style.borderColor='#FFF'; update(); }); });
    content.querySelectorAll('.animBtn').forEach(b=>{ b.addEventListener('click', ()=>{ clip.animation=b.dataset.anim; content.querySelectorAll('.animBtn').forEach(x=>{x.style.background='#242429';}); b.style.background='#5856D6'; update(); }); });
    content.querySelectorAll('.posBtn').forEach(b=>{ b.addEventListener('click', ()=>{ clip.position=b.dataset.pos; content.querySelectorAll('.posBtn').forEach(x=>{x.style.background='#242429';}); b.style.background='#5856D6'; update(); }); });
    content.querySelectorAll('.bgBtn').forEach(b=>{ b.addEventListener('click', ()=>{ clip.bgColor=b.dataset.bg; content.querySelectorAll('.bgBtn').forEach(x=>x.style.borderColor='#2A2A2E'); b.style.borderColor='#FFF'; update(); }); });
    const closeModal=()=>{ modal.style.display='none'; if(window.Renderer && window.Renderer.textEl){ window.Renderer.textEl.style.top='50%'; window.Renderer._forceShow(clip); } };
    const deleteClip=()=>{ if(window.TimelineUI){ TimelineUI.clips=TimelineUI.clips.filter(c=>c.id!==clip.id); TimelineUI.render(); } if(window.Selection) Selection.deselectAll(); modal.style.display='none'; if(window.Renderer){ Renderer._hide(); Renderer.textEl.style.top='50%'; } if(window.Toolbar) Toolbar.renderMain(); };
    content.querySelector('#saveText')?.addEventListener('click', closeModal);
    content.querySelector('#closeText')?.addEventListener('click', closeModal);
    content.querySelector('#closeTopX')?.addEventListener('click', closeModal);
    content.querySelector('#deleteText')?.addEventListener('click', deleteClip);
    modal.querySelector('#textModalBackdrop')?.addEventListener('click', closeModal);
  }
};
window.TextTool=TextTool;
