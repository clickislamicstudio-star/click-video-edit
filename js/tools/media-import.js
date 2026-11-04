
/**
 * Folder: js/tools/ File: media-import.js v3.9 - Permission Once + Audio Fix + Outside Handles + PIP No Black
 */
const MediaImportTool = {
  async generateWaveform(file){
    try{
      if(file.type.startsWith('audio')){
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const buf = await file.arrayBuffer();
        const audioBuf = await ctx.decodeAudioData(buf);
        const channel = audioBuf.getChannelData(0);
        const samples = 60;
        const blockSize = Math.floor(channel.length / samples);
        const waveform=[];
        for(let i=0;i<samples;i++){
          let sum=0;
          for(let j=0;j<blockSize;j++){ sum+=Math.abs(channel[i*blockSize+j]); }
          waveform.push(Math.min(100, Math.max(10, (sum/blockSize)*500)));
        }
        return waveform;
      }
    }catch(e){ console.log('Waveform gen failed', e); }
    return Array.from({length:40}).map(()=> 10+Math.random()*80);
  },
  async importToTimeline(typeHint){
    // Permission Once logic
    if(!PermissionManager.hasFilePermission()){
      console.log('First time - File permission will be requested via file picker');
    }
    
    let accept = 'video/*,image/*,audio/*';
    if(typeHint==='audio') accept='audio/*';
    if(typeHint==='pip') accept='video/*,image/*';
    
    const f = await new Promise(res=>{
      const inp=document.createElement('input');
      inp.type='file';
      inp.accept=accept;
      inp.onchange=e=>{ const file=e.target.files[0]; res(file); };
      inp.click();
    });
    
    if(!f) return [];
    
    PermissionManager.markFileGranted();
    
    const url = URL.createObjectURL(f);
    const isVideo = f.type.startsWith('video');
    const isImage = f.type.startsWith('image');
    const isAudio = f.type.startsWith('audio');
    
    let duration = 3;
    if(isVideo){
      duration = await new Promise(r=>{
        const v=document.createElement('video');
        v.preload='metadata';
        v.onloadedmetadata=()=>{ const d=v.duration||5; r(Math.min(d, 60)); };
        v.onerror=()=>r(5);
        v.src=url;
      });
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
    if(isImage){ track=1; type='image'; color='#FF9500'; }
    if(isAudio){ track=2; type='audio'; color='#2C2C2E'; }
    if(typeHint==='pip'){ track=4; type=isImage?'image':'pip'; color='#5AC8FA'; }
    
    if(track===4){
      const hasVideo = window.TimelineUI && TimelineUI.clips.some(c=> c.type==='video'||c.type==='image');
      if(!hasVideo){
        alert('Add a main video first to use PIP/Overlay');
        return [];
      }
    }
    
    const waveform = isAudio ? await this.generateWaveform(f) : null;
    
    const clipData = {
      id: (type+'_'+Date.now()),
      name: f.name || (type+'_'+Date.now()),
      type: type,
      track: track,
      startTime: window.TimelineUI ? TimelineUI.getNextStartTime(track) : 0,
      duration: duration,
      src: url,
      color: color,
      waveform: waveform,
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
    
    if(window.AudioEngine && (isAudio || isVideo)){
      AudioEngine.loadClip(clip);
    }
    
    const hint=document.getElementById('emptyHint');
    if(hint) hint.style.display='none';
    const status=document.getElementById('status');
    if(status) status.textContent='Imported: '+f.name+' -> '+(track===1?'Media':track===2?'Audio':track===3?'Text':'PIP')+' - Paused - Audio Ready - Permission Once';
    
    if(window.AndroidBridge && AndroidBridge.vibrate) AndroidBridge.vibrate(40);
    
    return [clip];
  }
};
window.MediaImportTool=MediaImportTool;
