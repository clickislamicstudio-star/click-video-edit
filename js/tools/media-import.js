
/**
 * MediaImportTool v3.6.2 - Fixed Import + Player Display
 */
const MediaImportTool = {
  async importToTimeline(file){
    let f=file;
    if(!f){
      // Create input
      f = await new Promise(res=>{
        const inp=document.createElement('input');
        inp.type='file';
        inp.accept='video/*,image/*';
        inp.onchange=e=>{
          const file=e.target.files[0];
          res(file);
        };
        inp.click();
      });
    }
    if(!f) return [];
    
    const url = URL.createObjectURL(f);
    const isVideo = f.type.startsWith('video');
    const isImage = f.type.startsWith('image');
    
    // Get duration
    let duration = 3;
    if(isVideo){
      duration = await new Promise(r=>{
        const v=document.createElement('video');
        v.preload='metadata';
        v.onloadedmetadata=()=>{ r(v.duration||3); URL.revokeObjectURL(v.src); };
        v.onerror=()=>r(3);
        v.src=url;
      });
      duration = Math.min(duration, 15);
    }
    
    const clipData = {
      id:'clip_'+Date.now(),
      name: f.name || 'VID-'+Date.now(),
      type: isImage ? 'image' : 'video',
      track: 1,
      startTime: window.TimelineUI ? TimelineUI.getNextStartTime(1) : 0,
      duration: duration,
      src: url,
      color: '#FF3B30',
      transform:{x:0,y:0,scale:1,rotation:0,flipX:false,flipY:false,cropLeft:0,cropRight:0,cropTop:0,cropBottom:0}
    };
    
    const clip = new Clip(clipData);
    
    if(window.TimelineUI){
      TimelineUI.clips.push(clip);
      TimelineUI.render();
      // Auto select new clip
      if(window.Selection) Selection.selectClip(clip);
      if(window.Store) Store.dispatch({type:'SELECT_CLIP', payload:{id:clip.id, track:clip.track, clipType:clip.type, name:clip.name}});
    }
    
    // Show in player immediately
    if(window.Renderer){
      Renderer.showClip(clip);
    } else {
      const v=document.getElementById('realVideo');
      if(v){ v.src=url; v.style.display='block'; v.play().catch(()=>{}); }
    }
    
    const btn=document.getElementById('importBtn');
    if(btn) btn.classList.add('hidden');
    const status=document.getElementById('status');
    if(status) status.textContent='Imported: '+f.name;
    
    if(window.AndroidBridge && AndroidBridge.vibrate) AndroidBridge.vibrate(50);
    
    return [clip];
  }
};
window.MediaImportTool=MediaImportTool;
