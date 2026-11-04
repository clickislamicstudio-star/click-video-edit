/**
 * js/tools/speed.js - Phase 3 - Speed Control Real
 */
const SpeedTool = {
  presets: [0.25, 0.5, 1, 1.5, 2, 3, 4],
  
  showUI(clip) {
    if(!clip) clip = window.Selection?.selectedClip;
    if(!clip) return;
    
    let modal = document.getElementById('speedEditorModal');
    if(!modal) {
      modal = document.createElement('div');
      modal.id='speedEditorModal';
      modal.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:200;display:flex;align-items:flex-end;justify-content:center';
      document.body.appendChild(modal);
    }
    
    const speed = clip.speed || 1;
    
    modal.innerHTML = `
      <div style="background:#1E1E1E;border-radius:20px 20px 0 0;width:100%;max-width:480px;padding:20px;border-top:2px solid #FF9500">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <div><div style="color:#FF9500;font-size:11px;font-weight:700">SPEED</div><div style="color:#FFF;font-size:13px">${clip.name} - Original ${clip.originalDuration?.toFixed(1)||clip.duration.toFixed(1)}s</div></div>
          <button id="closeSpeed" style="background:#2A2A2A;border:none;color:#FFF;width:32px;height:32px;border-radius:50%">✕</button>
        </div>
        
        <div style="display:flex;gap:8px;overflow-x:auto;padding:8px 0 16px">
          ${this.presets.map(s=>`<button class="speedPreset" data-speed="${s}" style="background:${speed===s?'#FF9500':'#2A2A2A'};color:#FFF;border:none;min-width:56px;padding:12px 0;border-radius:12px;font-size:13px;font-weight:${speed===s?'700':'500'}">${s}x</button>`).join('')}
        </div>
        
        <div style="margin-bottom:16px">
          <div style="display:flex;justify-content:space-between;color:#8E8E93;font-size:11px;margin-bottom:8px"><span>CUSTOM SPEED</span><span id="speedVal" style="color:#FF9500;font-weight:700">${speed}x</span></div>
          <input id="speedSlider" type="range" min="0.25" max="4" step="0.05" value="${speed}" style="width:100%;accent-color:#FF9500">
          <div style="display:flex;justify-content:space-between;color:#555;font-size:9px"><span>0.25x Slow</span><span>1x Normal</span><span>4x Fast</span></div>
        </div>
        
        <div style="background:#2A2A2A;border-radius:12px;padding:12px;display:flex;justify-content:space-between;font-size:11px;color:#8E8E93">
          <span>New Duration:</span><span id="newDuration" style="color:#FFF;font-weight:600">${(clip.originalDuration/speed).toFixed(2)}s</span>
        </div>
        
        <button id="applySpeed" style="width:100%;background:#FF9500;color:#FFF;border:none;padding:14px;border-radius:30px;font-weight:600;margin-top:16px">Apply Speed</button>
      </div>
    `;
    
    modal.style.display='flex';
    
    const slider = modal.querySelector('#speedSlider');
    const speedVal = modal.querySelector('#speedVal');
    const newDuration = modal.querySelector('#newDuration');
    
    const updateSpeed = (s)=>{
      clip.speed = s;
      speedVal.textContent = s.toFixed(2)+'x';
      newDuration.textContent = (clip.originalDuration/s).toFixed(2)+'s';
      modal.querySelectorAll('.speedPreset').forEach(b=>{
        b.style.background = parseFloat(b.dataset.speed)===s ? '#FF9500' : '#2A2A2A';
        b.style.fontWeight = parseFloat(b.dataset.speed)===s ? '700' : '500';
      });
    };
    
    slider?.addEventListener('input', (e)=> updateSpeed(parseFloat(e.target.value)));
    
    modal.querySelectorAll('.speedPreset').forEach(btn=>{
      btn.addEventListener('click', ()=>{ const s=parseFloat(btn.dataset.speed); slider.value=s; updateSpeed(s); });
    });
    
    const apply = ()=>{
      const newDur = clip.originalDuration / clip.speed;
      clip.duration = newDur;
      if(window.TimelineUI) TimelineUI.render();
      if(window.Player) Player.updateDuration?.();
      modal.style.display='none';
      console.log('Speed applied', clip.speed, 'new duration', newDur);
    };
    
    const close = ()=> modal.style.display='none';
    modal.querySelector('#closeSpeed')?.addEventListener('click', close);
    modal.querySelector('#applySpeed')?.addEventListener('click', apply);
    modal.addEventListener('click', (e)=>{ if(e.target===modal) close(); });
  }
};
window.SpeedTool = SpeedTool;
