/**
 * js/player/renderer.js - Canvas Renderer
 */
const Renderer = {
  canvas: null,
  ctx: null,

  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 720;
    this.canvas.height = 1280;
    this.ctx = this.canvas.getContext('2d');
    console.log('Renderer Ready - 720x1280');
  },

  render(clips, currentTime) {
    if(!this.ctx) return;
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
    // Draw clips in z-order: V1 -> V2 -> Text
    return true;
  }
};
window.Renderer = Renderer;
Renderer.init();