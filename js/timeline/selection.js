
/**
 * Selection v3.6.2 - Fixed Selection + Renderer Sync
 */
const Selection = {
  selectedClip:null,
  selectClip(clip){
    this.selectedClip=clip;
    console.log('Selection select', clip.id, clip.type);
    if(window.TimelineUI) TimelineUI.render();
    if(window.EventBus) EventBus.emit(EventBus.EVENTS.CLIP_SELECTED, clip);
    if(window.Store) Store.dispatch({type:'SELECT_CLIP', payload:{id:clip.id, track:clip.track, clipType:clip.type, name:clip.name}});
    if(window.Renderer) Renderer.showClip(clip);
    if(window.Toolbar) Toolbar.showForClip(clip);
  },
  deselectAll(){
    this.selectedClip=null;
    if(window.TimelineUI) TimelineUI.render();
    if(window.EventBus) EventBus.emit(EventBus.EVENTS.CLIP_DESELECTED, {});
    if(window.Store) Store.dispatch({type:'DESELECT'});
    if(window.Toolbar) Toolbar.hide();
    if(window.Renderer) Renderer._hide();
    if(window.TransformTool) TransformTool._removeBox();
  }
};
window.Selection=Selection;
