/**
 * js/tools/text.js - Phase 3 - Real Text Rendering + Editing - Professional
 * Canvas overlay + font, color, animation, background
 */
const TextTool = {
  fonts: ['Inter','Arial','Roboto','Cairo','Noto Nastaliq Urdu','Amiri'],
  colors: ['#FFFFFF','#FF3B30','#FFCC02','#4CAF50','#5856D6','#5AC8FA','#000000'],
  animations: ['none','fadeIn','slideUp','typewriter','bounce'],
  
  addTextClip(text='Sample Text') {
    const clip = new Clip({
      name: text.substr(0,12),
      text: text,
      type: 'text',
      track: 3, // Text track
      startTime: window.TimelineUI?.currentTime || 0,
      duration: 3,
      fontSize: 32,
      fontColor: '#FFFFFF',
      color: '#5856D6'
    });
    
    if(window.TimelineUI) {
      TimelineUI.addClip(clip);
      TimelineUI.render();
    }
    
    if(window.Selection) Selection.selectClip(clip);
    this.showEditor(clip);
    console.log('Text clip added', clip.id);
    return clip;
  },

  showEditor(clip) {
    if(!clip) return;
    
    // Create text overlay editor modal
    let modal = document.getElementById('textEditorModal');
    if(!modal) {
      modal = document.createElement('div');
      modal.id = 'textEditorModal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px';
      document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
      <div style="background:#1E1E1E;border-radius:16px;width:100%;max-width:360px;max-height:80vh;overflow-y:auto;padding:16px;border:1px solid #333">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <h3 style="color:#FFF;font-size:14px">Edit Text - ${clip.id.substr(0,8)}</h3>
          <button id="closeTextEditor" style="background:#2A2A2A;border:none;color:#FFF;width:32px;height:32px;border-radius:50%">✕</button>
        </div>
        
        <textarea id="textInput" style="width:100%;background:#2A2A2A;border:1px solid #333;color:#FFF;padding:12px;border-radius:10px;font-size:16px;min-height:80px;resize:none">${clip.text}</textarea>
        
        <div style="margin-top:16px">
          <div style="color:#8E8E93;font-size:11px;margin-bottom:8px">FONT SIZE</div>
          <input id="fontSize" type="range" min="12" max="96" value="${clip.fontSize||32}" style="width:100%">
          <div style="display:flex;justify-content:space-between;color:#8E8E93;font-size:10px"><span>12</span><span id="fontSizeVal">${clip.fontSize||32}px</span><span>96</span></div>
        </div>
        
        <div style="margin-top:16px">
          <div style="color:#8E8E93;font-size:11px;margin-bottom:8px">COLOR</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${this.colors.map(c=>`<button class="colorBtn" data-color="${c}" style="width:36px;height:36px;border-radius:50%;background:${c};border:2px solid ${clip.fontColor===c?'#FF3B30':'#333'}"></button>`).join('')}
          </div>
        </div>
        
        <div style="margin-top:16px">
          <div style="color:#8E8E93;font-size:11px;margin-bottom:8px">ANIMATION</div>
          <div style="display:flex;gap:8px;overflow-x:auto">
            ${this.animations.map(a=>`<button class="animBtn" data-anim="${a}" style="background:${clip.animation===a?'#FF3B30':'#2A2A2A'};color:#FFF;border:none;padding:8px 14px;border-radius:20px;font-size:11px;white-space:nowrap">${a}</button>`).join('')}
          </div>
        </div>
        
        <div style="display:flex;gap:10px;margin-top:20px">
          <button id="saveText" style="flex:1;background:#FF3B30;color:#FFF;border:none;padding:14px;border-radius:30px;font-weight:600">Save</button>
          <button id="deleteText" style="background:#2A2A2A;color:#FF3B30;border:none;padding:14px 20px;border-radius:30px">Delete</button>
        </div>
      </div>
    `;
    
    modal.style.display='flex';
    
    // Bind
    const textInput = modal.querySelector('#textInput');
    const fontSize = modal.querySelector('#fontSize');
    const fontSizeVal = modal.querySelector('#fontSizeVal');
    
    fontSize?.addEventListener('input', (e)=>{
      const size = e.target.value;
      fontSizeVal.textContent = size+'px';
      clip.fontSize = parseInt(size);
      this.renderPreview(clip);
    });
    
    textInput?.addEventListener('input', (e)=>{
      clip.text = e.target.value;
      clip.name = e.target.value.substr(0,12) || 'Text';
      this.renderPreview(clip);
      if(window.TimelineUI) TimelineUI.render();
    });
    
    modal.querySelectorAll('.colorBtn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const color = btn.dataset.color;
        clip.fontColor = color;
        modal.querySelectorAll('.colorBtn').forEach(b=>b.style.borderColor='#333');
        btn.style.borderColor='#FF3B30';
        this.renderPreview(clip);
      });
    });
    
    modal.querySelectorAll('.animBtn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        clip.animation = btn.dataset.anim;
        modal.querySelectorAll('.animBtn').forEach(b=>b.style.background='#2A2A2A');
        btn.style.background='#FF3B30';
      });
    });
    
    modal.querySelector('#saveText')?.addEventListener('click', ()=>{
      modal.style.display='none';
      if(window.TimelineUI) TimelineUI.render();
      this.renderPreview(clip);
    });
    
    modal.querySelector('#closeTextEditor')?.addEventListener('click', ()=> modal.style.display='none');
    modal.querySelector('#deleteText')?.addEventListener('click', ()=>{
      if(window.Selection) Selection.deleteSelected();
      modal.style.display='none';
    });
    
    modal.addEventListener('click', (e)=>{ if(e.target===modal) modal.style.display='none'; });
  },

  renderPreview(clip) {
    const overlay = document.getElementById('textOverlay');
    if(!overlay) return;
    
    if(clip && clip.type==='text' && clip.text) {
      overlay.textContent = clip.text;
      overlay.style.color = clip.fontColor || '#FFF';
      overlay.style.fontSize = (clip.fontSize || 32) + 'px';
      overlay.style.display='block';
      
      // Check if playhead inside clip
      const currentTime = window.TimelineUI?.currentTime || 0;
      if(currentTime >= clip.startTime && currentTime <= clip.endTime) {
        overlay.style.display='block';
      } else {
        // Keep showing if selected
        if(clip.isSelected) overlay.style.display='block';
        else overlay.style.display='none';
      }
    } else {
      overlay.style.display='none';
    }
  }
};
window.TextTool = TextTool;

// Hook into player render loop
setInterval(()=>{
  const selected = window.Selection?.selectedClip;
  if(selected && selected.type==='text') TextTool.renderPreview(selected);
}, 100);
