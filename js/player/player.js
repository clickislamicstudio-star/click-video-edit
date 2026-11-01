/**
 * js/player/player.js - SUPER SIMPLE - Just play/pause real video
 */
const Player = {
  videoElement: null,

  init() {
    this.videoElement = document.getElementById('realVideo');
    console.log('Simple Player Ready');
  },

  loadClip(clip) {
    // Already handled in media-import.js - nothing needed
    console.log('loadClip called', clip?.name);
  },

  play() {
    const v = document.getElementById('realVideo');
    if(v) v.play();
  },

  pause() {
    const v = document.getElementById('realVideo');
    if(v) v.pause();
  },

  togglePlay() {
    const v = document.getElementById('realVideo');
    if(!v) return;
    if(v.paused) v.play();
    else v.pause();
  },

  seekTo(time) {
    // For now do nothing - just timeline scroll
    console.log('seekTo', time);
  }
};
window.Player = Player;