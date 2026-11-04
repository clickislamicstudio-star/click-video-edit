
/**
 * Folder: js/tools/ File: audio.js v3.7 - No canvas icon
 */
const AudioTool={
  showVolumeUI(clip){
    if(!clip) clip=window.Selection?.selectedClip;
    if(!clip) return;
    alert('Audio: '+clip.name+'\nVolume: '+(clip.volume||1)+'\n\nAudio icon on canvas removed - Professional fix ✅');
  }
};
window.AudioTool=AudioTool;
