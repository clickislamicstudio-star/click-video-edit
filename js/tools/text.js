
/**
 * TextTool v3.3 PROFESSIONAL - InShot/CapCut Style
 * - 10 Popular Fonts Pre-installed (No Download)
 * - Rest fonts Download option
 * - Circular Gradient swatches (20 gradients)
 * - Close button at END after Delete
 * - Separate tab functionality + side-by-side buttons visible
 * - UI fixed: text not overlapping tabs
 */
const TextTool = {
  // 10 POPULAR PRE-INSTALLED - No download needed
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

  // Downloadable fonts - rest
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
    {id:'Cairo', name:'عربي Cairo', family:'Cairo'},
    {id:'Amiri', name:'Amiri عربي', family:'Amiri'},
    {id:'Noto Nastaliq Urdu', name:'اردو', family:'Noto Nastaliq Urdu'},
    {id:'Noto Naskh Arabic', name:'Naskh', family:'Noto Naskh Arabic'},
    {id:'Amatic SC', name:'Amatic', family:'Amatic SC'},
    {id:'Great Vibes', name:'Great Vibes', family:'Great Vibes'},
    {id:'Orbitron', name:'Orbitron', family:'Orbitron'}
  ],

  colors: [
    '#FFFFFF','#000000','#FF3B30','#FFCC02','#4CAF50','#5856D6',
    '#5AC8FA','#FF2D55','#FF9500','#8E8E93','#FF6B6B','#4ECDC4',
    '#45B7D1','#FFA07A','#98D8C8','#F7DC6F','#BB8FCE','#85C1E2',
    '#F1948A','#82E0AA'
  ],

  // 24 Gradient templates - circular like solid colors - CapCut/InShot style
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
    {id:'shadow', name:'Shadow', preview:'My Dear', desc:'Soft shadow', style:'text-shadow:3px 3px 8px rgba(0,0,0,0.8);color:#FFF;font-weight:700'},
    {id:'neon', name:'Neon', preview:'My Dear', desc:'Glow', style:'text-shadow:0 0 10px currentColor,0 0 20px currentColor;color:#FFF'},
    {id:'retro', name:'Retro', preview:'MY DEAR', desc:'Vintage box', style:'background:#FF3B30;color:#FFF;padding:6px 12px;font-weight:900;letter-spacing:1px'},
    {id:'3d', name:'3D', preview:'My Dear', desc:'Depth', style:'text-shadow:1px 1px 0 #000,2px 2px 0 #000,3px 3px 6px rgba(0,0,0,0.7);color:#FFF'},
    {id:'cinema', name:'Cinema', preview:'MY DEAR', desc:'Movie', style:'border:2px solid #FFF;color:#FFF;padding:6px 14px;letter-spacing:3px;font-weight:700'},
    {id:'elegant', name:'Elegant', preview:'My Dear', desc:'Serif italic', style:'font-family:Georgia,serif;font-style:italic;font-weight:300;color:#FFF'},
    {id:'bubble', name:'Bubble', preview:'My Dear', desc:'Rounded bg', style:'background:rgba(88,86,214,0.9);color:#FFF;padding:8px 18px;border-radius:20px;font-weight:700'},
    {id:'fire', name:'Fire', preview:'My Dear', desc:'Gradient', style:'background:linear-gradient(45deg,#FF3B30,#FF9500);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:900'},
    {id:'ice', name:'Ice', preview:'My Dear', desc:'Cold gradient', style:'background:linear-gradient(45deg,#00C9FF,#92FE9D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:900'}
  ],

  animations: [
    {id:'none', name:'None', icon:'○'},
    {id:'fadeIn', name:'Fade', icon:'◐'},
    {id:'slideUp', name:'Slide', icon:'↑'},
    {id:'typewriter', name:'Type', icon:'⌨'},
    {id:'bounce', name:'Bounce', icon:'⌒'},
    {id:'scale', name:'Scale', icon:'◎'}
  ],

  _preloadPopularFonts() {
    const fontsToLoad = this.popularFonts.map(f=>f.family.replace(/ /g,'+')+':wght@400;700;900').join('&family=');
    if(document.getElementById('popular-fonts-link')) return;
    const link = document.createElement('link');
    link.id='popular-fonts-link';
    link.rel='stylesheet';
    link.href=`https://fonts.googleapis.com/css2?family=${fontsToLoad}&display=swap`;
    document.head.appendChild(link);
    console.log('Preloaded 10 popular fonts');
  },

  addTextClip(text='My Dear') {
    this._preloadPopularFonts();
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
    this._preloadPopularFonts();
    
    let modal = document.getElementById('textEditorModal');
    if(!modal) {
      modal=document.createElement('div');
      modal.id='textEditorModal';
      modal.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;z-index:300;display:flex;flex-direction:column;pointer-events:none';
      modal.innerHTML='<div id="textModalBackdrop" style="flex:1;background:rgba(0,0,0,0.2);pointer-events:auto"></div><div id="textModalContent" style="background:#1A1A1E;border-radius:22px 22px 0 0;max-height:80vh;display:flex;flex-direction:column;pointer-events:auto;border-top:1.5px solid rgba(88,86,214,0.5);box-shadow:0 -8px 32px rgba(0,0,0,0.6)"></div>';
      document.body.appendChild(modal);
    }
    const content=modal.querySelector('#textModalContent');
    
    // When editor opens, move text overlay to top so it doesn't overlap tabs
    if(window.Renderer && window.Renderer.textEl) {
      window.Renderer.textEl.style.top='32%';
    }

    const popularHtml = this.popularFonts.map(f=>`
      <button class="fontBtn popularFont" data-font="${f.family}" style="background:${clip.fontFamily===f.family?'#5856D6':'#242429'};border:1.5px solid ${clip.fontFamily===f.family?'#FFF':'#2A2A2E'};border-radius:14px;padding:16px;display:flex;justify-content:space-between;align-items:center;width:100%;margin-bottom:10px;transition:all 0.2s">
        <div style="display:flex;flex-direction:column;align-items:flex-start;gap:2px">
          <span style="font-family:${f.family};color:#FFF;font-size:19px;font-weight:${f.weight};line-height:1">${f.name}</span>
          <span style="color:#8E8E93;font-size:10px;letter-spacing:0.5px">PRE-INSTALLED • No download</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="background:${clip.fontFamily===f.family?'#FFF':'#333'};color:${clip.fontFamily===f.family?'#5856D6':'#666'};width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800">${clip.fontFamily===f.family?'✓':''}</span>
        </div>
      </button>
    `).join('');

    const downloadableHtml = this.downloadableFonts.map(f=>`
      <button class="fontBtn downloadFont" data-font="${f.family}" style="background:${clip.fontFamily===f.family?'#5856D6':'#242429'};border:1.5px solid ${clip.fontFamily===f.family?'#FFF':'#2A2A2E'};border-radius:14px;padding:14px;display:flex;justify-content:space-between;align-items:center;width:100%;margin-bottom:8px">
        <span style="font-family:${f.family};color:#FFF;font-size:17px">${f.name}</span>
        <span style="display:flex;gap:8px;align-items:center">
          <span style="background:#121212;color:#5AC8FA;font-size:10px;padding:5px 10px;border-radius:20px;border:1px solid #333" onclick="event.stopPropagation(); window.open('https://fonts.google.com/specimen/${f.family.replace(/ /g,'+')}','_blank')">↓ Download</span>
          <span style="color:${clip.fontFamily===f.family?'#FFF':'transparent'};font-size:10px">✓</span>
        </span>
      </button>
    `).join('');

    content.innerHTML=`
      <div style="padding:0 16px;height:52px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #242429;flex-shrink:0">
        <div style="display:flex;gap:10px;align-items:center"><span style="background:#5856D6;color:#FFF;padding:5px 10px;border-radius:8px;font-size:10px;font-weight:800;letter-spacing:0.5px">TEXT</span><span style="color:#FFF;font-size:14px;font-weight:600;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${clip.text.substr(0,20)||'My Dear'}</span></div>
        <button id="closeTopX" style="background:#242429;border:none;color:#8E8E93;width:32px;height:32px;border-radius:50%;font-size:14px;display:flex;align-items:center;justify-content:center">✕</button>
      </div>

      <div style="display:flex;background:#121214;border-bottom:1px solid #242429;overflow-x:auto;scrollbar-width:none;flex-shrink:0">
        ${['text','template','font','color','anim','bg'].map(tab=>`
          <button class="tabBtn ${focusTab===tab?'active':''}" data-tab="${tab}" style="flex:1;background:${focusTab===tab?'#5856D6':'transparent'};color:${focusTab===tab?'#FFF':'#8E8E93'};border:none;padding:13px 6px;font-size:11px;font-weight:800;min-width:62px;letter-spacing:0.3px;position:relative;border-bottom:${focusTab===tab?'2px solid #FFF':'2px solid transparent'}">${tab.toUpperCase()}</button>
        `).join('')}
      </div>

      <div style="overflow-y:auto;padding:16px;flex:1;background:#1A1A1E">
        <div id="tab-text" style="display:${focusTab==='text'?'block':'none'}">
          <div style="background:#242429;border-radius:16px;padding:14px;border:1px solid #2A2A2E">
            <textarea id="textInput" placeholder="Type your text..." style="width:100%;background:transparent;border:none;color:#FFF;padding:4px;font-size:20px;min-height:90px;resize:none;outline:none;font-family:inherit;line-height:1.4">${clip.text}</textarea>
          </div>
          <div style="margin-top:16px;background:#242429;border-radius:14px;padding:14px;border:1px solid #2A2A2E">
            <div style="display:flex;justify-content:space-between;align-items:center"><span style="color:#8E8E93;font-size:11px;font-weight:700;letter-spacing:0.5px">FONT SIZE</span><span id="fontSizeVal" style="color:#FFF;font-size:13px;font-weight:800;background:#121214;padding:4px 10px;border-radius:20px">${clip.fontSize||36}px</span></div>
            <input id="fontSize" type="range" min="12" max="120" value="${clip.fontSize||36}" style="width:100%;accent-color:#5856D6;margin-top:12px;height:4px">
            <div style="display:flex;justify-content:space-between;color:#555;font-size:9px;margin-top:6px"><span>12</span><span>36</span><span>72</span><span>120</span></div>
          </div>
        </div>

        <div id="tab-template" style="display:${focusTab==='template'?'block':'none'}">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><span style="color:#8E8E93;font-size:11px;font-weight:700;letter-spacing:0.5px">TEMPLATES • ${this.templates.length} STYLES</span><span style="color:#5856D6;font-size:10px;background:#242429;padding:4px 8px;border-radius:10px">InShot Style</span></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            ${this.templates.map(t=>`
              <button class="templateBtn" data-template="${t.id}" style="background:${clip.template===t.id?'#5856D6':'#242429'};border:2px solid ${clip.template===t.id?'#FFF':'#2A2A2E'};border-radius:16px;padding:20px 12px;display:flex;flex-direction:column;align-items:center;gap:8px;min-height:100px;justify-content:center;transition:all 0.2s">
                <div style="font-size:26px;${t.style};line-height:1.2;text-align:center">${t.preview}</div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:2px"><span style="color:${clip.template===t.id?'#FFF':'#FFF'};font-size:11px;font-weight:700">${t.name}</span><span style="color:${clip.template===t.id?'#D0D0FF':'#666'};font-size:9px">${t.desc}</span></div>
              </button>
            `).join('')}
          </div>
        </div>

        <div id="tab-font" style="display:${focusTab==='font'?'block':'none'}">
          <div style="background:linear-gradient(135deg,#5856D6,#8B5CF6);border-radius:12px;padding:12px 14px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
            <div><div style="color:#FFF;font-size:12px;font-weight:800">POPULAR FONTS</div><div style="color:rgba(255,255,255,0.8);font-size:10px">10 fonts pre-installed • Ready to use</div></div>
            <span style="background:#FFF;color:#5856D6;padding:4px 10px;border-radius:20px;font-size:10px;font-weight:800">10</span>
          </div>
          <div style="margin-bottom:20px">${popularHtml}</div>
          
          <div style="background:#242429;border-radius:12px;padding:12px 14px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;border:1px dashed #333">
            <div><div style="color:#FFF;font-size:11px;font-weight:700">MORE FONTS</div><div style="color:#8E8E93;font-size:10px">Download from Google Fonts</div></div>
            <span style="color:#8E8E93;font-size:10px;background:#121214;padding:4px 8px;border-radius:10px">${this.downloadableFonts.length} fonts</span>
          </div>
          <div style="max-height:38vh;overflow-y:auto;padding-right:4px">${downloadableHtml}</div>
        </div>

        <div id="tab-color" style="display:${focusTab==='color'?'block':'none'}">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span style="color:#8E8E93;font-size:11px;font-weight:700;letter-spacing:0.5px">SOLID COLORS</span><span style="color:#555;font-size:10px">${this.colors.length} colors</span></div>
          <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px;padding:4px">
            ${this.colors.map(c=>`<button class="colorBtn" data-color="${c}" style="width:48px;height:48px;border-radius:50%;background:${c};border:3px solid ${clip.fontColor===c?'#FFF':'#2A2A2E'};box-shadow:${clip.fontColor===c?'0 0 0 3px #5856D6, 0 4px 12px rgba(0,0,0,0.4)':'0 2px 8px rgba(0,0,0,0.3)'};transition:all 0.2s;flex-shrink:0"></button>`).join('')}
          </div>
          
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span style="color:#8E8E93;font-size:11px;font-weight:700;letter-spacing:0.5px">GRADIENT COLORS • Circular like solid</span><span style="color:#5856D6;font-size:10px;background:#242429;padding:4px 8px;border-radius:10px">CapCut Style</span></div>
          <div style="display:flex;gap:12px;flex-wrap:wrap;padding:4px">
            ${this.gradients.map(g=>`<button class="gradBtn" data-grad="${g.css}" title="${g.name}" style="width:48px;height:48px;border-radius:50%;background:${g.css};border:3px solid ${clip.fontColor===g.css?'#FFF':'#2A2A2E'};box-shadow:${clip.fontColor===g.css?'0 0 0 3px #5856D6, 0 4px 12px rgba(0,0,0,0.4)':'0 2px 8px rgba(0,0,0,0.3)'};transition:all 0.2s;flex-shrink:0;position:relative"><span style="position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);font-size:7px;color:#666;white-space:nowrap;font-weight:600">${g.name}</span></button>`).join('')}
          </div>
          <div style="height:24px"></div>
        </div>

        <div id="tab-anim" style="display:${focusTab==='anim'?'block':'none'}">
          <div style="color:#8E8E93;font-size:11px;font-weight:700;letter-spacing:0.5px;margin-bottom:12px">ANIMATION</div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px">
            ${this.animations.map(a=>`<button class="animBtn" data-anim="${a.id}" style="background:${clip.animation===a.id?'#5856D6':'#242429'};color:#FFF;border:1.5px solid ${clip.animation===a.id?'#FFF':'#2A2A2E'};padding:14px 20px;border-radius:24px;font-size:12px;font-weight:700;display:flex;align-items:center;gap:6px;min-width:90px;justify-content:center"><span style="font-size:14px">${a.icon}</span>${a.name}</button>`).join('')}
          </div>
          <div style="background:#121214;border-radius:16px;padding:4px;border:1px solid #242429">
            <div style="color:#8E8E93;font-size:10px;font-weight:700;letter-spacing:0.5px;padding:10px 14px 6px">LIVE PREVIEW</div>
            <div style="background:#000;border-radius:12px;padding:30px 20px;text-align:center;margin:0 4px 4px 4px;min-height:100px;display:flex;align-items:center;justify-content:center"><div id="animPreview" style="color:${clip.fontColor};font-size:${Math.min(clip.fontSize,32)}px;font-family:${clip.fontFamily}">${clip.text}</div></div>
          </div>
        </div>

        <div id="tab-bg" style="display:${focusTab==='bg'?'block':'none'}">
          <div style="color:#8E8E93;font-size:11px;font-weight:700;letter-spacing:0.5px;margin-bottom:12px">POSITION</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:20px">
            <button class="posBtn" data-pos="top" style="background:${clip.position==='top'?'#5856D6':'#242429'};color:#FFF;border:1.5px solid ${clip.position==='top'?'#FFF':'#2A2A2E'};padding:18px 8px;border-radius:14px;font-size:11px;font-weight:700;display:flex;flex-direction:column;align-items:center;gap:6px"><span style="font-size:16px">↑</span>Top</button>
            <button class="posBtn" data-pos="center" style="background:${!clip.position||clip.position==='center'?'#5856D6':'#242429'};color:#FFF;border:1.5px solid ${!clip.position||clip.position==='center'?'#FFF':'#2A2A2E'};padding:18px 8px;border-radius:14px;font-size:11px;font-weight:700;display:flex;flex-direction:column;align-items:center;gap:6px"><span style="font-size:16px">⊕</span>Center</button>
            <button class="posBtn" data-pos="bottom" style="background:${clip.position==='bottom'?'#5856D6':'#242429'};color:#FFF;border:1.5px solid ${clip.position==='bottom'?'#FFF':'#2A2A2E'};padding:18px 8px;border-radius:14px;font-size:11px;font-weight:700;display:flex;flex-direction:column;align-items:center;gap:6px"><span style="font-size:16px">↓</span>Bottom</button>
          </div>
          <div style="color:#8E8E93;font-size:11px;font-weight:700;letter-spacing:0.5px;margin-bottom:12px">BACKGROUND</div>
          <div style="display:flex;gap:12px;flex-wrap:wrap;padding:4px">
            <button class="bgBtn" data-bg="transparent" style="width:48px;height:48px;border-radius:50%;background:repeating-conic-gradient(#444 0% 25%, #1A1A1A 0% 50%) 50% / 14px 14px;border:3px solid ${clip.bgColor==='transparent'?'#FFF':'#2A2A2E'};position:relative"><span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#666;font-size:14px">⊘</span></button>
            ${this.colors.map(c=>`<button class="bgBtn" data-bg="${c}" style="width:48px;height:48px;border-radius:50%;background:${c};border:3px solid ${clip.bgColor===c?'#FFF':'#2A2A2E'};box-shadow:${clip.bgColor===c?'0 0 0 3px #5856D6':''}"></button>`).join('')}
          </div>
        </div>
      </div>

      <div style="padding:12px 14px;border-top:1px solid #242429;display:flex;gap:10px;background:#121214;flex-shrink:0">
        <button id="saveText" style="flex:1;background:#5856D6;color:#FFF;border:none;padding:15px;border-radius:28px;font-weight:800;font-size:14px;letter-spacing:0.3px;box-shadow:0 4px 16px rgba(88,86,214,0.3)">Save</button>
        <button id="deleteText" style="background:#242429;color:#FF453A;border:1.5px solid #2A2A2E;padding:15px 20px;border-radius:28px;font-weight:700;font-size:13px;min-width:80px">Delete</button>
        <button id="closeText" style="background:#242429;color:#8E8E93;border:1.5px solid #2A2A2E;padding:15px 20px;border-radius:28px;font-weight:700;font-size:13px;min-width:80px">Close</button>
      </div>
    `;
    
    modal.style.display='flex';
    
    const switchTab=(tab)=>{
      content.querySelectorAll('.tabBtn').forEach(b=>{ b.style.background='transparent'; b.style.color='#8E8E93'; b.style.borderBottom='2px solid transparent'; });
      const active=content.querySelector(`.tabBtn[data-tab="${tab}"]`);
      if(active){ active.style.background='#5856D6'; active.style.color='#FFF'; active.style.borderBottom='2px solid #FFF'; }
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
      const preview=content.querySelector('#animPreview');
      if(preview) { preview.textContent=clip.text; preview.style.fontFamily=clip.fontFamily; }
    };
    
    content.querySelector('#textInput')?.addEventListener('input', update);
    content.querySelector('#fontSize')?.addEventListener('input', (e)=>{
      clip.fontSize=parseInt(e.target.value);
      const v=content.querySelector('#fontSizeVal');
      if(v) v.textContent=clip.fontSize+'px';
      update();
    });
    
    content.querySelectorAll('.templateBtn').forEach(b=>{
      b.addEventListener('click', ()=>{ clip.template=b.dataset.template; content.querySelectorAll('.templateBtn').forEach(x=>{x.style.background='#242429'; x.style.borderColor='#2A2A2E';}); b.style.background='#5856D6'; b.style.borderColor='#FFF'; update(); });
    });
    
    content.querySelectorAll('.fontBtn').forEach(b=>{
      b.addEventListener('click', ()=>{
        const fam=b.dataset.font;
        clip.fontFamily=fam;
        // Load font
        const id='gf-'+fam.replace(/\s+/g,'-');
        if(!document.getElementById(id)){
          const link=document.createElement('link');
          link.id=id; link.rel='stylesheet';
          link.href=`https://fonts.googleapis.com/css2?family=${fam.replace(/ /g,'+')}:wght@400;700;900&display=swap`;
          document.head.appendChild(link);
        }
        content.querySelectorAll('.fontBtn').forEach(x=>{ x.style.background='#242429'; x.style.borderColor='#2A2A2E'; });
        b.style.background='#5856D6'; b.style.borderColor='#FFF';
        update();
      });
    });
    
    content.querySelectorAll('.colorBtn').forEach(b=>{
      b.addEventListener('click', ()=>{ clip.fontColor=b.dataset.color; content.querySelectorAll('.colorBtn').forEach(x=>{x.style.borderColor='#2A2A2E'; x.style.boxShadow='0 2px 8px rgba(0,0,0,0.3)'}); b.style.borderColor='#FFF'; b.style.boxShadow='0 0 0 3px #5856D6, 0 4px 12px rgba(0,0,0,0.4)'; update(); });
    });
    
    content.querySelectorAll('.gradBtn').forEach(b=>{
      b.addEventListener('click', ()=>{ clip.fontColor=b.dataset.grad; content.querySelectorAll('.gradBtn').forEach(x=>{x.style.borderColor='#2A2A2E'; x.style.boxShadow='0 2px 8px rgba(0,0,0,0.3)'}); b.style.borderColor='#FFF'; b.style.boxShadow='0 0 0 3px #5856D6, 0 4px 12px rgba(0,0,0,0.4)'; update(); });
    });
    
    content.querySelectorAll('.animBtn').forEach(b=>{
      b.addEventListener('click', ()=>{ clip.animation=b.dataset.anim; content.querySelectorAll('.animBtn').forEach(x=>{x.style.background='#242429'; x.style.borderColor='#2A2A2E';}); b.style.background='#5856D6'; b.style.borderColor='#FFF'; update(); });
    });
    
    content.querySelectorAll('.posBtn').forEach(b=>{
      b.addEventListener('click', ()=>{ clip.position=b.dataset.pos; content.querySelectorAll('.posBtn').forEach(x=>{x.style.background='#242429'; x.style.borderColor='#2A2A2E';}); b.style.background='#5856D6'; b.style.borderColor='#FFF'; update(); });
    });
    
    content.querySelectorAll('.bgBtn').forEach(b=>{
      b.addEventListener('click', ()=>{ clip.bgColor=b.dataset.bg; content.querySelectorAll('.bgBtn').forEach(x=>x.style.borderColor='#2A2A2E'); b.style.borderColor='#FFF'; update(); });
    });
    
    const closeModal=()=>{
      modal.style.display='none';
      if(window.Renderer && window.Renderer.textEl) {
        window.Renderer.textEl.style.top='50%';
        window.Renderer._forceShow(clip);
      }
    };
    
    const deleteClip=()=>{
      if(window.TimelineUI){ TimelineUI.clips=TimelineUI.clips.filter(c=>c.id!==clip.id); TimelineUI.render(); }
      if(window.Selection) Selection.deselectAll();
      modal.style.display='none';
      if(window.Renderer){ Renderer._hide(); Renderer.textEl.style.top='50%'; }
      if(window.Toolbar) Toolbar.renderMain();
    };
    
    content.querySelector('#saveText')?.addEventListener('click', closeModal);
    content.querySelector('#closeText')?.addEventListener('click', closeModal);
    content.querySelector('#closeTopX')?.addEventListener('click', closeModal);
    content.querySelector('#deleteText')?.addEventListener('click', deleteClip);
    modal.querySelector('#textModalBackdrop')?.addEventListener('click', closeModal);
  }
};
window.TextTool = TextTool;
