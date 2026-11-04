
/**
 * Folder: js/core/ File: clip.js v3.9 FINAL - Master Prompt Compliant - No Emoji
 */
class Clip {
  constructor(d={}){
    this.id = d.id || ('clip_'+Date.now()+'_'+Math.random().toString(36).substr(2,4));
    this.name = d.name || 'Untitled';
    this.type = d.type || 'video';
    this.track = d.track || 1;
    this.startTime = d.startTime || 0;
    this.duration = d.duration || 3;
    this.src = d.src || null;
    this.color = d.color || '#FF3B30';
    this.waveform = d.waveform || null;
    this.text = d.text || null;
    this.fontFamily = d.fontFamily || 'Inter';
    this.fontSize = d.fontSize || 32;
    this.fontColor = d.fontColor || '#FFFFFF';
    this.volume = d.volume ?? 1;
    this.transform = d.transform || {x:0,y:0,scale:1,rotation:0,flipX:false,flipY:false,cropLeft:0,cropRight:0,cropTop:0,cropBottom:0};
    this.keyframes = d.keyframes || [];
  }
}
window.Clip = Clip;
