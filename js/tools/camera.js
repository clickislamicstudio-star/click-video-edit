
/**
 * Folder: js/tools/ File: camera.js v3.8 NEW - Camera -> Media Layer
 */
const CameraTool={
  async startRecording(){
    try{
      const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true});
      alert('Camera permission granted - Video will go to Media layer\n\nFuture: Record and drop to Media track (Track 1) with effects');
      stream.getTracks().forEach(t=>t.stop());
    }catch(e){
      alert('Camera permission denied - Please allow camera in browser settings');
    }
  }
};
window.CameraTool=CameraTool;
