class Clip {
  constructor(data) {
    this.id = data.id || 'clip_' + Date.now() + '_' + Math.random().toString(36).substr(2,5);
    this.name = data.name || data.fileName || 'Clip';
    this.track = data.track ?? 0;
    this.trackType = data.trackType || this._getTrackType(this.track);
    this.startTime = data.startTime ?? 0;
    this.duration = data.duration ?? 2;
    this.originalDuration = data.originalDuration ?? data.duration ?? 2;
    this.sourceOffset = data.sourceOffset ?? 0;
    this.type = data.type || 'video';
    this.src = data.src || data.url || '';
    this.file = data.file || null;
    this.color = data.color || this._getColorForType(this.type, this.track);
    this.effects = data.effects || {};
    this.transform = data.transform || { x:0, y:0, scaleX:1, scaleY:1, rotation:0 };
    this.keyframes = data.keyframes || {};
    this.audioEffects = data.audioEffects || [];
    this.chroma = data.chroma || { enabled:false };
    this.masks = data.masks || [];
    this.waveformData = data.waveformData || null;
    this.text = data.text || (this.type==='text' ? 'Sample Text' : '');
    this.fontSize = data.fontSize || 32;
    this.fontColor = data.fontColor || '#FFFFFF';
    this.isSelected = false;
  }
  _getTrackType(trackId) { const map = {0:'video',1:'video',2:'video',3:'text',4:'image',5:'audio',6:'audio'}; return map[trackId] || 'video'; }
  _getColorForType(type, track) { const colors = { video: track===0 ? '#FF3B30' : '#FF9500', audio: '#4CAF50', text: '#5856D6', image: '#5AC8FA' }; return colors[type] || '#8E8E93'; }
  get endTime() { return this.startTime + this.duration; }
  getDisplayName() { return this.name.length > 18 ? this.name.substr(0,16)+'..' : this.name; }
  clone() { return new Clip(JSON.parse(JSON.stringify(this))); }
}
window.Clip = Clip;
