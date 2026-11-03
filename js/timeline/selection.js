const Selection = {
  selectedClip: null,
  init() { console.log('Selection Phase1 Ready'); },
  selectClip(clip) {
    if(!clip) return;
    if(this.selectedClip) this.selectedClip.isSelected = false;
    this.selectedClip = clip; clip.isSelected = true;
    if(window.Store) Store.dispatch({type:'SELECT_CLIP', payload:{id:clip.id, track:clip.track, clipType:clip.type, name:clip.name}});
    if(window.TimelineUI) { TimelineUI.selectedClip = clip; TimelineUI.render(); }
    if(window.Toolbar) Toolbar.showForClip(clip);
    if(window.Player && clip.type==='video') Player.loadClip(clip);
    if(window.AndroidBridge) AndroidBridge.vibrate(50);
    if(window.EventBus) EventBus.emit(EventBus.EVENTS.CLIP_SELECTED, clip);
  },
  deselectAll() {
    if(this.selectedClip) this.selectedClip.isSelected = false;
    this.selectedClip = null;
    if(window.Store) Store.dispatch({type:'DESELECT'});
    if(window.TimelineUI) { TimelineUI.selectedClip = null; TimelineUI.render(); }
    if(window.Toolbar) Toolbar.hide();
    if(window.EventBus) EventBus.emit(EventBus.EVENTS.CLIP_DESELECTED, {});
  }
};
window.Selection = Selection;
Selection.init();
