
/**
 * Folder: js/core/ File: clip.js v3.7
 * Professional Clip Model - Video+Image Same Track V1
 */
class Clip {
  constructor(data={}){
    this.id = data.id || ('clip_'+Date.now()+'_'+Math.random().toString(36).substr(2,5));
    this.name = data.name || 'Clip';
    this.type = data.type || 'video'; // video, image, text, audio, overlay
    this.track = data.track ?? 1; // 1=V1(Main Video+Image), 2=V2(Overlay), 3=Text, 5=A1(Audio)
    this.startTime = data.startTime ?? 0;
    this.duration = data.duration ?? 3;
    this.src = data.src || null;
    this.color = data.color || '#FF3B30';
    // Text props
    this.text = data.text || '';
    this.fontFamily = data.fontFamily || 'Inter';
    this.fontSize = data.fontSize || 32;
    this.fontColor = data.fontColor || '#FFFFFF';
    this.bgColor = data.bgColor || 'transparent';
    this.template = data.template || 'default';
    this.animation = data.animation || 'none';
    this.position = data.position || 'center';
    // Audio
    this.volume = data.volume ?? 1;
    this.waveform = data.waveform || null;
    // Transform - CapCut Style
    this.transform = data.transform || {x:0,y:0,scale:1,rotation:0,flipX:false,flipY:false,cropLeft:0,cropRight:0,cropTop:0,cropBottom:0};
  }
}
window.Clip = Clip;
