/**
 * js/timeline/timeline.js - Render Timeline Tracks
 */
const Timeline = {
  clips: [],
  init() {
    console.log('Timeline Ready - Tracks: V1,A1,V2,Text');
  },
  addClip(clipData) {
    const clip = new Clip(clipData);
    this.clips.push(clip);
    return clip;
  }
};
window.Timeline = Timeline;
Timeline.init();