
/**
 * Folder: js/timeline/ File: selection.js v3.7 - Fixed audio not selecting image
 */
const Selection = {
  selectedClip:null,
  init(){ console.log('Selection v3.7 - Audio fix'); },
  selectClip(clip){
    if(!clip) return;
    this.selectedClip=clip;
    console.log('Selection selectClip', clip.type, clip.name);
    if(window.Store) Store.dispatch({type:'SELECT_CLIP', payload:{id:clip.id, track:clip.track, clipType:clip.type, name:clip.name, clip:clip}});
    if(window.TimelineUI) TimelineUI.render();
  },
  deselectAll(){
    this.selectedClip=null;
    if(window.Store) Store.dispatch({type:'DESELECT', payload:{}});
    if(window.TimelineUI) TimelineUI.render();
    if(window.Toolbar) Toolbar.hide();
    if(window.Renderer) Renderer._hideTextOnly();
  }
};
window.Selection=Selection;
