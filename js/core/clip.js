
class Clip {
  constructor(data={}) {
    this.id = data.id || 'clip_'+Date.now()+'_'+Math.random().toString(36).substr(2,5);
    this.name = data.name || 'Clip';
    this.type = data.type || 'video';
    this.track = data.track || 1;
    this.startTime = data.startTime || 0;
    this.duration = data.duration || 3;
    this.endTime = this.startTime + this.duration;
    this.originalDuration = data.originalDuration || this.duration;
    this.color = data.color || (this.type==='text'?'#5856D6':this.type==='video'?'#FF3B30':'#FF9500');
    this.text = data.text || '';
    this.fontSize = data.fontSize || 36;
    this.fontColor = data.fontColor || '#FFFFFF';
    this.fontFamily = data.fontFamily || 'Inter';
    this.template = data.template || 'default';
    this.animation = data.animation || 'none';
    this.bgColor = data.bgColor || 'transparent';
    this.position = data.position || 'center';
    this.rotation = data.rotation || 0;
    this.transform = data.transform || {x:0,y:0,scale:1,rotation:0,flipX:false,flipY:false,cropLeft:0,cropRight:0,cropTop:0,cropBottom:0};
    this.src = data.src || null;
    this.speed = data.speed || 1;
    this.volume = data.volume || 1;
    this.filterCss = data.filterCss || '';
  }
  updateEndTime(){ this.endTime=this.startTime+this.duration; }
}
window.Clip=Clip;
