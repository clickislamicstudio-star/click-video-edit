/**
 * js/timeline/selection.js - v2.0 - Professional Selection with Contextual Toolbar
 * When clip selected, show contextual toolbar above main toolbar
 */
const Selection = {
  selectedClip: null,
  selectedTrack: null,

  init() {
    console.log('Selection v2.0 - Contextual Toolbar Ready');
  },

  selectClip(clip) {
    this.selectedClip = clip;
    this.selectedTrack = clip.track;
    
    // Update TimelineUI selection
    if(window.TimelineUI) {
      TimelineUI.selectedClip = clip;
      TimelineUI.render();
    }

    // Show contextual toolbar based on clip type
    if(window.Toolbar) {
      Toolbar.showForClip(clip);
    }

    // Load clip into player
    if(window.Player && clip.type === 'video') {
      Player.loadClip(clip);
    }

    console.log('Selected:', clip.name, 'Track:', clip.track);
  },

  deselect() {
    this.selectedClip = null;
    this.selectedTrack = null;
    
    if(window.TimelineUI) {
      TimelineUI.selectedClip = null;
      TimelineUI.render();
    }

    if(window.Toolbar) {
      Toolbar.hide();
    }
  },

  getSelected() {
    return this.selectedClip;
  },

  isSelected(clipId) {
    return this.selectedClip && this.selectedClip.id === clipId;
  }
};
window.Selection = Selection;