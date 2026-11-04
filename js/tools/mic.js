
/**
 * Folder: js/tools/ File: mic.js v3.9 FINAL - Permission Once - No Emoji - Master Prompt
 */
const MicTool={
  isRecording:false,
  async startRecording(){
    const hasPerm = await PermissionManager.requestMicPermission();
    if(!hasPerm){
      alert('Microphone permission denied - Allow once in browser settings');
      return;
    }
    try{
      const stream = await navigator.mediaDevices.getUserMedia({audio:true});
      stream.getTracks().forEach(t=>t.stop());
      const clip = new Clip({
        id:'audio_'+Date.now(),
        name:'Voiceover '+new Date().toLocaleTimeString().slice(0,8),
        type:'audio',
        track:2,
        startTime: window.TimelineUI ? TimelineUI.getNextStartTime(2) : 0,
        duration:3,
        src:null,
        color:'#2C2C2E',
        waveform: Array.from({length:40}).map(()=> 20+Math.random()*60)
      });
      if(window.TimelineUI){ TimelineUI.clips.push(clip); TimelineUI.render(); if(window.Selection) Selection.selectClip(clip); }
      if(window.PermissionManager) PermissionManager.markFileGranted();
    }catch(e){
      alert('Mic error: '+e.message);
    }
  }
};
window.MicTool=MicTool;
