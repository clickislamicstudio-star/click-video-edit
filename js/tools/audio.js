/**
 * js/tools/audio.js - Phase 3 - Audio Editing Real
 */
const AudioTool = {
  showVolumeUI(clip) {
    if(!clip) clip = window.Selection?.selectedClip;
    if(!clip) return;
    
    let modal = document.getElementById('audioEditorModal');
    if(!modal) {
      modal = document.createElement('div');
      modal.id='audioEditorModal';
      modal.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:200;display:flex;align-items:flex-end;justify-content:center';
      document.body.appendChild(modal);
    }
    
    const volume = clip.volume ?? 1;
    const fadeIn = clip.fadeIn ?? 0;
    const fadeOut = clip.fadeOut ?? 0;
    
    modal.innerHTML = `
      <div style="background:#1E1E1E;border-radius:20px 20px 0 0;width:100%;max-width:480px;padding:20px 20px 30px;border-top:2px solid #4CAF50">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
          <div><div style="color:#4CAF50;font-size:11px;font-weight:700">AUDIO</div><div style="color:#FFF;font-size:14px;font-weight:600">${clip.name}</div></div>
          <button id="closeAudio" style="background:#2A2A2A;border:none;color:#FFF;width:32px;height:32px;border-radius:50%">✕</button>
        </div>
        
        <div style="margin-bottom:20px">
          <div style="display:flex;justify-content:space-between;color:#8E8E93;font-size:11px;margin-bottom:8px"><span>VOLUME</span><span id="volVal">${Math.round(volume*100)}%</span></div>
          <input id="volSlider" type="range" min="0" max="2" step="0.05" value="${volume}" style="width:100%;accent-color:#4CAF50">
          <div style="display:flex;justify-content:space-between;color:#555;font-size:9px"><span>MUTE</span><span>100%</span><span>200%</span></div>
        </div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
          <div><div style="color:#8E8E93;font-size:11px;margin-bottom:6px">FADE IN</div><input id="fadeIn" type="range" min="0" max="3" step="0.1" value="${fadeIn}" style="width:100%;accent-color:#4CAF50"><div style="color:#FFF;font-size:11px;text-align:center" id="fadeInVal">${fadeIn}s</div></div>
          <div><div style="color:#8E8E93;font-size:11px;margin-bottom:6px">FADE OUT</div><input id="fadeOut" type="range" min="0" max="3" step="0.1" value="${fadeOut}" style="width:100%;accent-color:#4CAF50"><div style="color:#FFF;font-size:11px;text-align:center" id="fadeOutVal">${fadeOut}s</div></div>
        </div>
        
        <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:8px">
          <button class="audioPreset" data-preset="normal" style="background:#2A2A2A;color:#FFF;border:none;padding:10px 16px;border-radius:20px;font-size:11px">Normal</button>
          <button class="audioPreset" data-preset="bass" style="background:#2A2A2A;color:#FFF;border:none;padding:10px 16px;border-radius:20px;font-size:11px">Bass Boost</button>
          <button class="audioPreset" data-preset="voice" style="background:#2A2A2A;color:#FFF;border:none;padding:10px 16px;border-radius:20px;font-size:11px">Voice Enhance</button>
          <button class="audioPreset" data-preset="mute" style="background:#2A2A2A;color:#FF3B30;border:none;padding:10px 16px;border-radius:20px;font-size:11px">Mute</button>
        </div>
        
        <button id="applyAudio" style="width:100%;background:#4CAF50;color:#FFF;border:none;padding:14px;border-radius:30px;font-weight:600;margin-top:16px">Apply</button>
      </div>
    `;
    
    modal.style.display='flex';
    
    const volSlider = modal.querySelector('#volSlider');
    const volVal = modal.querySelector('#volVal');
    volSlider?.addEventListener('input', (e)=>{
      const v=parseFloat(e.target.value);
      clip.volume=v;
      volVal.textContent=Math.round(v*100)+'%';
      if(window.Player) Player.setVolume?.(v);
    });
    
    const fadeIn = modal.querySelector('#fadeIn');
    const fadeInVal = modal.querySelector('#fadeInVal');
    fadeIn?.addEventListener('input', (e)=>{ clip.fadeIn=parseFloat(e.target.value); fadeInVal.textContent=clip.fadeIn+'s'; });
    
    const fadeOut = modal.querySelector('#fadeOut');
    const fadeOutVal = modal.querySelector('#fadeOutVal');
    fadeOut?.addEventListener('input', (e)=>{ clip.fadeOut=parseFloat(e.target.value); fadeOutVal.textContent=clip.fadeOut+'s'; });
    
    modal.querySelectorAll('.audioPreset').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const p=btn.dataset.preset;
        if(p==='mute') { clip.volume=0; volSlider.value=0; volVal.textContent='0%'; }
        if(p==='normal') { clip.volume=1; volSlider.value=1; volVal.textContent='100%'; }
        if(p==='bass') { clip.bassBoost=true; btn.style.background='#4CAF50'; }
        if(p==='voice') { clip.voiceEnhance=true; btn.style.background='#4CAF50'; }
      });
    });
    
    const close = ()=> modal.style.display='none';
    modal.querySelector('#closeAudio')?.addEventListener('click', close);
    modal.querySelector('#applyAudio')?.addEventListener('click', close);
    modal.addEventListener('click', (e)=>{ if(e.target===modal) close(); });
  }
};
window.AudioTool = AudioTool;
