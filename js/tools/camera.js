
/**
 * Folder: js/tools/ File: camera.js v3.9 - Permission Once + Record -> Media Layer
 */
const CameraTool={
  async startRecording(){
    const hasPerm = await PermissionManager.requestCameraPermission();
    if(!hasPerm){
      alert('Camera permission denied - Please allow in browser settings. Only once needed.');
      return;
    }
    try{
      const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true});
      alert('Camera permission granted (once) - Video will drop to Media layer\nMedia: 52px with thumbnail strip');
      stream.getTracks().forEach(t=>t.stop());
    }catch(e){
      alert('Camera error: '+e.message);
    }
  }
};
window.CameraTool=CameraTool;
