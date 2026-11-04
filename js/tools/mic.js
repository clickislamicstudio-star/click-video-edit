
/**
 * Folder: js/tools/ File: mic.js v3.8 NEW - Voiceover -> Audio Layer
 */
const MicTool={
  isRecording:false,
  async startRecording(){
    try{
      const stream = await navigator.mediaDevices.getUserMedia({audio:true});
      alert('Mic permission granted - Recording will go to Audio layer\n\nFuture: Record and drop to Audio track (Track 2)');
      // Stop stream for now - full implementation Phase 4
      stream.getTracks().forEach(t=>t.stop());
      
      // Simulate audio clip drop to Audio layer
      const clip = new Clip({
        id:'audio_'+Date.now(),
        name:'Voiceover '+new Date().toLocaleTimeString(),
        type:'audio',
        track:2,
        startTime: window.TimelineUI ? TimelineUI.getNextStartTime(2) : 0,
        duration:3,
        src:null,
        color:'#4A4A4E',
        waveform: Array.from({length:30}).map(()=> 20+Math.random()*60)
      });
      if(window.TimelineUI){ TimelineUI.clips.push(clip); TimelineUI.render(); }
    }catch(e){
      alert('Mic permission denied - Please allow microphone in browser settings');
    }
  }
};
window.MicTool=MicTool;
