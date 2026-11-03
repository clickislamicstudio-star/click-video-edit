const MediaImportTool = {
  async importToTimeline(){
    return new Promise((resolve)=>{
      const input=document.createElement('input'); input.type='file'; input.accept='video/*,audio/*,image/*'; input.multiple=true;
      input.onchange=async (e)=>{
        const files=Array.from(e.target.files); if(files.length===0){ resolve([]); return; }
        const clips=[];
        for(let i=0;i<files.length;i++){
          const file=files[i]; const url=URL.createObjectURL(file); let duration=3; let type='video';
          if(file.type.startsWith('video/')){ duration=await this._getVideoDuration(url); type='video'; }
          else if(file.type.startsWith('audio/')){ duration=await this._getAudioDuration(url); type='audio'; }
          else if(file.type.startsWith('image/')){ duration=3; type='image'; }
          const clipData={ name:file.name, file:file, url:url, src:url, duration:duration, originalDuration:duration, type:type, track:type==='audio'?5:(type==='image'?1:0), startTime: window.TimelineUI ? (TimelineUI.clips.length>0 ? Math.max(...TimelineUI.clips.map(c=>c.endTime))+0.1 : 0) : 0 };
          const clip=window.TimelineUI ? TimelineUI.addClip(clipData) : new Clip(clipData);
          if(i===0 && type==='video'){ const video=document.getElementById('realVideo'); if(video){ video.src=url; video.style.display='block'; const btn=document.getElementById('importBtn'); if(btn) btn.style.display='none'; video.load(); } }
          clips.push(clip);
        }
        if(window.TimelineUI) TimelineUI.render(); resolve(clips);
      };
      input.click();
    });
  },
  _getVideoDuration(url){ return new Promise(res=>{ const v=document.createElement('video'); v.preload='metadata'; v.onloadedmetadata=()=>{ res(v.duration||3); }; v.onerror=()=>res(3); v.src=url; }); },
  _getAudioDuration(url){ return new Promise(res=>{ const a=document.createElement('audio'); a.preload='metadata'; a.onloadedmetadata=()=>{ res(a.duration||3); }; a.onerror=()=>res(3); a.src=url; }); }
};
window.MediaImportTool = MediaImportTool;
