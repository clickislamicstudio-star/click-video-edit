
/**
 * Folder: js/engine/ File: permission.js v2.0 FINAL - No Emoji - Permission Once - Master Prompt Compliant
 * Icon System: SVG Only - Material 3 Rounded
 */
const PermissionManager = {
  KEY_FILE: 'eo_file_permission_granted',
  KEY_MIC: 'eo_mic_permission_granted',
  KEY_CAMERA: 'eo_camera_permission_granted',
  hasFilePermission(){ return localStorage.getItem(this.KEY_FILE)==='true'; },
  markFileGranted(){ localStorage.setItem(this.KEY_FILE,'true'); console.log('File permission granted once - Google Play compliant'); },
  async requestMicPermission(){
    if(localStorage.getItem(this.KEY_MIC)==='true') return true;
    try{
      const s=await navigator.mediaDevices.getUserMedia({audio:true});
      s.getTracks().forEach(t=>t.stop());
      localStorage.setItem(this.KEY_MIC,'true');
      return true;
    }catch(e){ console.error('Mic permission denied', e); return false; }
  },
  async requestCameraPermission(){
    if(localStorage.getItem(this.KEY_CAMERA)==='true') return true;
    try{
      const s=await navigator.mediaDevices.getUserMedia({video:true});
      s.getTracks().forEach(t=>t.stop());
      localStorage.setItem(this.KEY_CAMERA,'true');
      return true;
    }catch(e){ console.error('Camera permission denied', e); return false; }
  }
};
window.PermissionManager = PermissionManager;
