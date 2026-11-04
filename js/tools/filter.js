/**
 * js/tools/filter.js - Phase 3 - Real Filters with CSS
 */
const FilterTool = {
  filters: [
    {id:'none', name:'None', css:'none'},
    {id:'bw', name:'B&W', css:'grayscale(1)'},
    {id:'sepia', name:'Sepia', css:'sepia(1)'},
    {id:'vivid', name:'Vivid', css:'saturate(1.8) contrast(1.2)'},
    {id:'warm', name:'Warm', css:'sepia(0.3) saturate(1.4) hue-rotate(-10deg)'},
    {id:'cold', name:'Cold', css:'sepia(0.2) saturate(1.2) hue-rotate(180deg)'},
    {id:'vintage', name:'Vintage', css:'sepia(0.6) contrast(1.1) brightness(1.1)'},
    {id:'cinematic', name:'Cine', css:'contrast(1.3) brightness(0.9) saturate(0.8)'},
    {id:'bright', name:'Bright', css:'brightness(1.3) contrast(1.1)'},
    {id:'dark', name:'Dark', css:'brightness(0.7) contrast(1.2)'}
  ],

  showUI(clip) {
    if(!clip) clip = window.Selection?.selectedClip;
    if(!clip || clip.type!=='video') { this._toast('Select a video clip first'); return; }
    
    let modal = document.getElementById('filterEditorModal');
    if(!modal) {
      modal = document.createElement('div');
      modal.id='filterEditorModal';
      modal.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);z-index:200;display:flex;flex-direction:column';
      document.body.appendChild(modal);
    }
    
    const currentFilter = clip.filter || 'none';
    
    modal.innerHTML = `
      <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:20px;position:relative">
        <video id="filterPreview" src="${clip.src}" style="max-width:100%;max-height:60vh;border-radius:12px;filter:${this.filters.find(f=>f.id===currentFilter)?.css||'none'}" autoplay muted loop playsinline></video>
        <button id="closeFilter" style="position:absolute;top:20px;right:20px;background:rgba(0,0,0,0.6);border:none;color:#FFF;width:36px;height:36px;border-radius:50%;font-size:18px">✕</button>
        <div style="position:absolute;top:20px;left:20px;background:rgba(0,0,0,0.6);color:#FFF;padding:6px 12px;border-radius:20px;font-size:11px">${clip.name}</div>
      </div>
      <div style="background:#1E1E1E;border-radius:20px 20px 0 0;padding:20px;border-top:2px solid #FF3B30">
        <div style="color:#FF3B30;font-size:11px;font-weight:700;margin-bottom:12px">FILTERS - Tap to Apply</div>
        <div style="display:flex;gap:10px;overflow-x:auto;padding-bottom:12px">
          ${this.filters.map(f=>`
            <button class="filterBtn" data-filter="${f.id}" style="flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:6px;background:${currentFilter===f.id?'#FF3B30':'#2A2A2A'};border:none;padding:8px;border-radius:12px;min-width:64px">
              <div style="width:56px;height:56px;border-radius:8px;background:#000;overflow:hidden;filter:${f.css}"><div style="width:100%;height:100%;background:linear-gradient(45deg,#FF3B30,#FF9500)"></div></div>
              <span style="color:#FFF;font-size:10px;font-weight:${currentFilter===f.id?'700':'400'}">${f.name}</span>
            </button>
          `).join('')}
        </div>
        <div style="display:flex;gap:8px;margin-top:12px">
          <input id="filterIntensity" type="range" min="0" max="100" value="100" style="flex:1;accent-color:#FF3B30">
          <span id="intensityVal" style="color:#FFF;font-size:12px;min-width:36px">100%</span>
        </div>
        <button id="applyFilter" style="width:100%;background:#FF3B30;color:#FFF;border:none;padding:14px;border-radius:30px;font-weight:600;margin-top:16px">Apply Filter</button>
      </div>
    `;
    
    modal.style.display='flex';
    
    const preview = modal.querySelector('#filterPreview');
    let selectedFilter = currentFilter;
    
    modal.querySelectorAll('.filterBtn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const fid = btn.dataset.filter;
        selectedFilter = fid;
        const filter = this.filters.find(f=>f.id===fid);
        if(preview) preview.style.filter = filter.css;
        modal.querySelectorAll('.filterBtn').forEach(b=>b.style.background='#2A2A2A');
        btn.style.background='#FF3B30';
      });
    });
    
    const intensity = modal.querySelector('#filterIntensity');
    const intensityVal = modal.querySelector('#intensityVal');
    intensity?.addEventListener('input', (e)=>{
      const v = e.target.value;
      intensityVal.textContent = v+'%';
      if(preview) preview.style.opacity = v/100;
    });
    
    const apply = ()=>{
      clip.filter = selectedFilter;
      clip.filterIntensity = parseInt(intensity.value);
      clip.filterCss = this.filters.find(f=>f.id===selectedFilter)?.css || 'none';
      if(window.Renderer) Renderer.applyFilter?.(clip);
      if(window.Player) {
        const video=document.getElementById('realVideo');
        if(video) video.style.filter = clip.filterCss;
      }
      modal.style.display='none';
      console.log('Filter applied', selectedFilter);
    };
    
    const close = ()=> { modal.style.display='none'; };
    modal.querySelector('#closeFilter')?.addEventListener('click', close);
    modal.querySelector('#applyFilter')?.addEventListener('click', apply);
  },
  
  _toast(msg){
    const info=document.getElementById('info');
    if(info){ info.textContent=msg; setTimeout(()=>info.textContent='Phase 3: Filters Ready',2000); }
  }
};
window.FilterTool = FilterTool;
