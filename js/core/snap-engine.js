/**
 * js/core/snap-engine.js - Phase 0 REAL - CapCut/InShot Magnet
 * Pure logic - No DOM
 */
const SnapEngine = {
  config: {
    enabled: true,
    thresholdPx: 15,
    snapToPlayhead: true,
    snapToClips: true,
    snapToMarkers: true
  },

  check(currentClip, allClips, playheadTime, markers = []) {
    if(!this.config.enabled) return null;

    const thresholdSec = this.config.thresholdPx / TimelineMath.getPps();
    let bestSnap = null;
    let minDelta = thresholdSec;

    const currentStart = currentClip.startTime;
    const currentEnd = currentClip.startTime + currentClip.duration;

    if(this.config.snapToClips) {
      for(const clip of allClips) {
        if(clip.id === currentClip.id) continue;
        const edges = [clip.startTime, clip.startTime + clip.duration];
        for(const edge of edges) {
          const dStart = Math.abs(currentStart - edge);
          if(dStart < minDelta) {
            minDelta = dStart;
            bestSnap = { snapTime: edge, type: 'clip-edge', target: clip.id, edge: 'start' };
          }
          const dEnd = Math.abs(currentEnd - edge);
          if(dEnd < minDelta) {
            minDelta = dEnd;
            bestSnap = { snapTime: edge - currentClip.duration, type: 'clip-edge', target: clip.id, edge: 'end' };
          }
        }
      }
    }

    if(this.config.snapToPlayhead) {
      const dHeadStart = Math.abs(currentStart - playheadTime);
      if(dHeadStart < minDelta) {
        minDelta = dHeadStart;
        bestSnap = { snapTime: playheadTime, type: 'playhead' };
      }
      const dHeadEnd = Math.abs(currentEnd - playheadTime);
      if(dHeadEnd < minDelta) {
        minDelta = dHeadEnd;
        bestSnap = { snapTime: playheadTime - currentClip.duration, type: 'playhead' };
      }
    }

    if(this.config.snapToMarkers) {
      for(const m of markers) {
        const d = Math.abs(currentStart - m.time);
        if(d < minDelta) {
          minDelta = d;
          bestSnap = { snapTime: m.time, type: 'marker', target: m.id };
        }
      }
    }

    if(bestSnap) {
      bestSnap.delta = minDelta;
      bestSnap.threshold = thresholdSec;
    }
    return bestSnap;
  },

  getSnapLines(currentClip, allClips, playheadTime) {
    const lines = [];
    const snap = this.check(currentClip, allClips, playheadTime);
    if(snap) {
      lines.push({ time: snap.snapTime + currentClip.duration, type: snap.type });
    }
    return lines;
  }
};
window.SnapEngine = SnapEngine;
