/**
 * js/player/player.js - Preview Player Sync
 */
const Player = {
  video: null,
  currentTime: 0,
  isPlaying: false,

  init() {
    this.video = document.createElement('video');
    this.video.muted = true;
    this.video.playsInline = true;
    console.log('Player Ready');
  },

  seekTo(time) {
    this.currentTime = time;
    if(this.video) this.video.currentTime = time;
  },

  play() {
    this.isPlaying = true;
  },

  pause() {
    this.isPlaying = false;
  }
};
window.Player = Player;
Player.init();