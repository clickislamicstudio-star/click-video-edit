/**
 * js/core/transform.js - Transform Controls Math
 */
const TransformEngine = {
  // Default transform
  defaultTransform: {
    x: 0, y: 0,
    scaleX: 1, scaleY: 1,
    rotation: 0, // degrees
    skewX: 0, skewY: 0,
    flipH: false, flipV: false,
    anchorX: 0.5, anchorY: 0.5
  },

  // Apply transform to get matrix
  getMatrix(transform) {
    const { x, y, scaleX, scaleY, rotation, flipH, flipV } = { ...this.defaultTransform, ...transform };
    const rad = rotation * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const sx = scaleX * (flipH ? -1 : 1);
    const sy = scaleY * (flipV ? -1 : 1);

    // 2D matrix: [a, b, c, d, tx, ty]
    return {
      a: cos * sx,
      b: sin * sx,
      c: -sin * sy,
      d: cos * sy,
      tx: x,
      ty: y
    };
  },

  // For canvas rendering
  applyToCanvas(ctx, transform) {
    const m = this.getMatrix(transform);
    ctx.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
  }
};
window.TransformEngine = TransformEngine;