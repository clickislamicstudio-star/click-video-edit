
/**
 * Folder: js/engine/ File: permission.js v1.0 NEW - Permission Once Logic (Google Play Compliant)
 */
const PermissionManager = {
  KEY_FILE:'eo_file_permission_granted',
  KEY_MIC:'eo_mic_permission_granted',
  KEY_CAMERA:'eo_camera_permission_granted',
  
  hasFilePermission(){
    return localStorage.getItem(this.KEY_FILE)==='true';
  },
  async requestFilePermission(){
    if(this.hasFilePermission()) return true;
    // File picker itself is permission UI - browsers show Allow/Deny
    // We mark granted after first successful file pick
    return true; // File input triggers native permission
  },
  markFileGranted(){
    localStorage.setItem(this.KEY_FILE,'true');
    console.log('File permission granted - once');
  },
  async requestMicPermission(){
    if(localStorage.getItem(this.KEY_MIC)==='true') return true;
    try{
      const s=await navigator.mediaDevices.getUserMedia({audio:true});
      s.getTracks().forEach(t=>t.stop());
      localStorage.setItem(this.KEY_MIC,'true');
      return true;
    }catch(e){ return false; }
  },
  async requestCameraPermission(){
    if(localStorage.getItem(this.KEY_CAMERA)==='true') return true;
    try{
      const s=await navigator.mediaDevices.getUserMedia({video:true});
      s.getTracks().forEach(t=>t.stop());
      localStorage.setItem(this.KEY_CAMERA,'true');
      return true;
    }catch(e){ return false; }
  }
};
window.PermissionManager=PermissionManager;
