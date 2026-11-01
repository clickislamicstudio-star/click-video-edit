/**
 * js/tools/captions.js - Auto Captions v2 with Whisper
 * Urdu, English, Arabic - Offline FREE
 */
const CaptionsTool = {
  currentLanguage: 'auto',

  async addAutoCaptions(audioFileOrClip) {
    if(!audioFileOrClip) {
      alert('Please import video first with audio');
      return [];
    }

    let file = audioFileOrClip;
    // If clip passed, get its file
    if(audioFileOrClip.file) file = audioFileOrClip.file;
    if(audioFileOrClip instanceof Blob === false && audioFileOrClip.fileData) file = audioFileOrClip.fileData;

    const lang = this.currentLanguage || 'auto';
    
    console.log('Starting Auto Captions for', lang);

    if(window.WhisperEngine) {
      const clips = await WhisperEngine.transcribeAndAddToTimeline(file, lang);
      return clips;
    } else {
      console.error('WhisperEngine not loaded');
      return [];
    }
  },

  setLanguage(lang) {
    // lang: 'ur', 'en', 'ar', 'auto'
    this.currentLanguage = lang;
    console.log('Caption language set to', lang);
    
    const badge = document.getElementById('badge');
    if(badge) badge.textContent = `Lang: ${lang.toUpperCase()} - Ready`;
  },

  // Manual caption add
  addManualCaption(text, startTime, duration) {
    if(!window.Clip || !window.TimelineUI) return null;
    
    const clip = new Clip({
      id: 'manual_'+Date.now(),
      track: 'Text',
      startTime: startTime || 0,
      duration: duration || 2,
      type: 'text',
      name: text.substring(0, 20),
      text: text,
      style: {
        fontSize: 32,
        color: '#FFF',
        background: 'rgba(0,0,0,0.7)',
        position: 'bottom'
      }
    });

    TimelineUI.addClip(clip);
    return clip;
  },

  // Quick actions for toolbar
  async autoUrdu() {
    this.setLanguage('ur');
    const videoFile = this.getCurrentVideoFile();
    if(videoFile) return await this.addAutoCaptions(videoFile);
  },

  async autoEnglish() {
    this.setLanguage('en');
    const videoFile = this.getCurrentVideoFile();
    if(videoFile) return await this.addAutoCaptions(videoFile);
  },

  async autoArabic() {
    this.setLanguage('ar');
    const videoFile = this.getCurrentVideoFile();
    if(videoFile) return await this.addAutoCaptions(videoFile);
  },

  getCurrentVideoFile() {
    if(window.TimelineUI && TimelineUI.clips.length>0) {
      const v1 = TimelineUI.clips.find(c=>c.track==='V1');
      if(v1 && v1.file) return v1.file;
      if(v1 && v1.fileData) return v1.fileData;
    }
    // Fallback to last imported
    if(window.MediaImportTool && MediaImportTool.lastFile) {
      return MediaImportTool.lastFile;
    }
    return null;
  }
};
window.CaptionsTool = CaptionsTool;