/**
 * js/tools/masking.js - Masking Tool (InShot Pro Feature)
 * Circle, Rectangle, Polygon, Free Draw, Feather, Invert
 */
const MaskingTool = {
  types: ["circle", "rectangle", "polygon", "free-draw", "linear", "mirror"],

  createMask(type, options = {}) {
    return {
      id: 'mask_' + Date.now(),
      type: type || 'circle',
      x: options.x || 0.5, // 0-1 center
      y: options.y || 0.5,
      width: options.width || 0.5,
      height: options.height || 0.5,
      radius: options.radius || 0.3,
      feather: options.feather || 0, // 0-100
      invert: options.invert || false,
      rotation: options.rotation || 0,
      points: options.points || [], // for polygon/free-draw
      opacity: 1
    };
  },

  applyMask(clip, mask) {
    if(!clip.masks) clip.masks = [];
    clip.masks.push(mask);
    return clip;
  },

  removeMask(clip, maskId) {
    if(!clip.masks) return clip;
    clip.masks = clip.masks.filter(m => m.id !== maskId);
    return clip;
  },

  // Canvas masking math
  getMaskPath(ctx, mask, canvasWidth, canvasHeight) {
    const cx = mask.x * canvasWidth;
    const cy = mask.y * canvasHeight;
    const w = mask.width * canvasWidth;
    const h = mask.height * canvasHeight;

    ctx.beginPath();
    if(mask.type === 'circle') {
      ctx.arc(cx, cy, mask.radius * Math.min(canvasWidth, canvasHeight), 0, Math.PI*2);
    } else if(mask.type === 'rectangle') {
      ctx.rect(cx - w/2, cy - h/2, w, h);
    } else if(mask.type === 'polygon' && mask.points.length > 2) {
      ctx.moveTo(mask.points[0].x * canvasWidth, mask.points[0].y * canvasHeight);
      for(let i=1; i<mask.points.length; i++) {
        ctx.lineTo(mask.points[i].x * canvasWidth, mask.points[i].y * canvasHeight);
      }
      ctx.closePath();
    }
    return ctx;
  }
};
window.MaskingTool = MaskingTool;