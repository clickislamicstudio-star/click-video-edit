
/**
 * MediaImportTool v3.6.3 - Fixed - No Canvas Button
 */
const MediaImportTool = {
  async importToTimeline(file){
    let f=file;
    if(!f){
      f = await new Promise(res=>{
        const inp=document.createElement('input');
        inp.type='file';
        inp.accept='video/*,image/*,audio/*';
        inp.onchange=e=>{ const file=e.target.files[0]; res(file); };
        inp.click();
      });
    }
    if(!f) return [];
    
    const url = URL.createObjectURL(f);
    const isVideo = f.type.startsWith('video');
    const isImage = f.type.startsWith('image');
    const isAudio = f.type.startsWith('audio');
    
    let duration = 3;
    if(isVideo){
      duration = await new Promise(r=>{
        const v=document.createElement('video');
        v.preload='metadata';
        v.onloadedmetadata=()=>{ const d=v.duration||3; r(d); };
        v.onerror=()=>r(3);
        v.src=url;
      });
      duration = Math.min(duration, 20);
    } else if(isAudio){
      duration = await new Promise(r=>{
        const a=document.createElement('audio');
        a.preload='metadata';
        a.onloadedmetadata=()=>r(a.duration||5);
        a.onerror=()=>r(5);
        a.src=url;
      });
    }
    
    let track = 1;
    let type = 'video';
    let color = '#FF3B30';
    if(isImage){ track=2; type='image'; color='#FF9500'; }
    if(isAudio){ track=5; type='audio'; color='#4CAF50'; }
    
    const clipData = {
      id: (type+'_'+Date.now()),
      name: f.name || (type+'_'+Date.now()),
      type: type,
      track: track,
      startTime: window.TimelineUI ? TimelineUI.getNextStartTime(track) : 0,
      duration: duration,
      src: url,
      color: color,
      transform:{x:0,y:0,scale:1,rotation:0,flipX:false,flipY:false,cropLeft:0,cropRight:0,cropTop:0,cropBottom:0}
    };
    
    const clip = new Clip(clipData);
    
    if(window.TimelineUI){
      TimelineUI.clips.push(clip);
      TimelineUI.render();
      if(window.Selection) Selection.selectClip(clip);
      if(window.Store) Store.dispatch({type:'SELECT_CLIP', payload:{id:clip.id, track:clip.track, clipType:clip.type, name:clip.name, clip:clip}});
    }
    
    if(window.Renderer){
      Renderer.showClip(clip);
    }
    
    const hint=document.getElementById('emptyHint');
    if(hint) hint.style.display='none';
    const status=document.getElementById('status');
    if(status) status.textContent='Imported: '+f.name;
    
    if(window.AndroidBridge && AndroidBridge.vibrate) AndroidBridge.vibrate(50);
    
    return [clip];
  }
};
window.MediaImportTool=MediaImportTool;
