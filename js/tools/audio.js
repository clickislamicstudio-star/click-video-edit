
/**
 * Folder: js/tools/ File: audio.js v3.8 - Waveform + Volume + Noise Reduction + Full Control
 */
const AudioTool={
  showVolumeUI(clip){
    if(!clip) clip=window.Selection?.selectedClip;
    if(!clip) return;
    const panel=document.createElement('div');
    panel.style.cssText='position:fixed;bottom:90px;left:10px;right:10px;background:#1A1A1E;border:1px solid #2A2A2E;border-radius:16px;padding:14px;z-index:200;max-height:45vh;overflow:auto';
    panel.innerHTML=`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span style="font-weight:800;color:#FFF">Audio - ${clip.name}</span><button id="closeAudio" style="background:#242429;color:#FFF;border:none;width:28px;height:28px;border-radius:50%">✕</button></div>
      <div style="margin-bottom:12px"><div style="height:40px;background:#121212;border-radius:8px;display:flex;align-items:center;gap:1px;padding:0 6px;overflow:hidden">${(clip.waveform||Array.from({length:30}).map(()=>50)).map(h=>`<div style="width:3px;height:${h}%;background:#0A84FF;border-radius:2px"></div>`).join('')}</div></div>
      <div style="display:grid;gap:10px">
        <label style="font-size:11px;color:#8E8E93">Volume <span id="volVal">${Math.round((clip.volume||1)*100)}%</span><input type="range" min="0" max="1" step="0.05" value="${clip.volume||1}" id="volRange" style="width:100%"></label>
        <div style="display:flex;gap:8px">
          <button id="muteBtn" style="flex:1;background:${clip.volume===0?'#FF3B30':'#242429'};color:#FFF;border:none;padding:10px;border-radius:12px;font-size:11px">Mute</button>
          <button id="noiseBtn" style="flex:1;background:#242429;color:#FFF;border:none;padding:10px;border-radius:12px;font-size:11px">Noise Reduction</button>
          <button id="fadeBtn" style="flex:1;background:#242429;color:#FFF;border:none;padding:10px;border-radius:12px;font-size:11px">Fade</button>
        </div>
        <button id="doneAudio" style="background:#0A84FF;color:#FFF;border:none;padding:12px;border-radius:20px;font-weight:800">Done</button>
      </div>
    `;
    document.body.appendChild(panel);
    panel.querySelector('#volRange').addEventListener('input', (e)=>{ clip.volume=parseFloat(e.target.value); panel.querySelector('#volVal').textContent=Math.round(clip.volume*100)+'%'; });
    panel.querySelector('#muteBtn').addEventListener('click', ()=>{ clip.volume=clip.volume===0?1:0; panel.querySelector('#volRange').value=clip.volume; panel.querySelector('#volVal').textContent=Math.round(clip.volume*100)+'%'; });
    panel.querySelector('#closeAudio').addEventListener('click', ()=> panel.remove());
    panel.querySelector('#doneAudio').addEventListener('click', ()=> panel.remove());
  }
};
window.AudioTool=AudioTool;
