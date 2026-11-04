
/**
 * Folder: js/tools/ File: camera.js v3.9 FINAL - Permission Once - No Emoji - Master Prompt
 */
const CameraTool={
  async startRecording(){
    const hasPerm = await PermissionManager.requestCameraPermission();
    if(!hasPerm){
      alert('Camera permission denied - Allow once in browser settings');
      return;
    }
    try{
      const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true});
      stream.getTracks().forEach(t=>t.stop());
      alert('Camera permission granted once - Video will drop to Media layer - Phase 4 full recording');
    }catch(e){
      alert('Camera error: '+e.message);
    }
  }
};
window.CameraTool=CameraTool;
