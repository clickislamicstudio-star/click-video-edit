
/**
 * Folder: js/timeline/ File: selection.js v3.9 FINAL - Text Selection Fix - No Emoji
 */
const Selection={
  selectedClip:null,
  selectClip(clip){
    this.selectedClip=clip;
    console.log('Selection v3.9 FINAL - Selected:', clip.type, clip.name, 'Track:', clip.track);
    if(window.Store) Store.dispatch({type:'SELECT_CLIP', payload:{id:clip.id, track:clip.track, clipType:clip.type, name:clip.name, clip:clip}});
    if(window.TimelineUI) TimelineUI.render();
    if(window.Toolbar) Toolbar.showForClip(clip);
    if(window.Renderer) Renderer.showClip(clip);
    if(window.CanvasControls) CanvasControls.show(clip);
    if(window.AudioEngine) AudioEngine.loadClip(clip);
  },
  deselectAll(){
    this.selectedClip=null;
    if(window.Store) Store.dispatch({type:'DESELECT', payload:{}});
    if(window.TimelineUI) TimelineUI.render();
    if(window.Toolbar) Toolbar.hide();
    if(window.Renderer) Renderer._hideTextOnly();
    if(window.CanvasControls) CanvasControls.hide();
  }
};
window.Selection=Selection;
