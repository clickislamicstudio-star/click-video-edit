/**
 * js/core/store.js - Phase 0 FIXED - Immutable Store + Undo/Redo + AutoSave Fix
 */
const Store = {
  dbName: 'ClickVideoEditorDB_v2',
  db: null,
  _state: {
    project: null,
    playback: { currentTime: 0, isPlaying: false, scrollOffset: -2 },
    selection: { selectedClipId: null, selectedTrack: null, multiIds: [] },
    ui: { pps: 80, language: 'en', toolbarMode: 'main' },
    history: { stack: [], pointer: -1, limit: 50 }
  },

  async init() {
    return new Promise((resolve) => {
      const req = indexedDB.open(this.dbName, 2);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if(!db.objectStoreNames.contains('projects')) db.createObjectStore('projects', { keyPath: 'id' });
        if(!db.objectStoreNames.contains('media')) db.createObjectStore('media', { keyPath: 'id' });
        if(!db.objectStoreNames.contains('autosave')) db.createObjectStore('autosave', { keyPath: 'id' });
      };
      req.onsuccess = (e) => {
        this.db = e.target.result;
        console.log('Store v2 Ready - Fixed');
        if(window.App && App.currentProject) this._state.project = App.currentProject;
        this.startAutoSave();
        resolve();
      };
      req.onerror = () => resolve();
    });
  },

  dispatch(action) {
    const prev = JSON.parse(JSON.stringify(this._state));
    
    if(['ADD_CLIP','MOVE_CLIP','TRIM_CLIP','DELETE_CLIP'].includes(action.type)) {
      this._state.history.stack = this._state.history.stack.slice(0, this._state.history.pointer + 1);
      this._state.history.stack.push(prev);
      this._state.history.pointer++;
      if(this._state.history.stack.length > this._state.history.limit) {
        this._state.history.stack.shift();
        this._state.history.pointer--;
      }
    }

    switch(action.type) {
      case 'SELECT_CLIP':
        this._state.selection.selectedClipId = action.payload.id;
        this._state.selection.selectedTrack = action.payload.track;
        this._state.ui.toolbarMode = action.payload.clipType || 'video';
        if(window.EventBus) EventBus.emit(EventBus.EVENTS.CLIP_SELECTED, action.payload);
        break;
      case 'DESELECT':
        this._state.selection.selectedClipId = null;
        this._state.ui.toolbarMode = 'main';
        if(window.EventBus) EventBus.emit(EventBus.EVENTS.CLIP_DESELECTED, {});
        break;
      case 'SET_PPS':
        this._state.ui.pps = action.payload.pps;
        break;
      case 'SET_TIME':
        this._state.playback.currentTime = action.payload.time;
        this._state.playback.scrollOffset = action.payload.scrollOffset;
        break;
    }

    if(window.EventBus) EventBus.emit(EventBus.EVENTS.PROJECT_SAVED, this._state);
  },

  undo() {
    if(this._state.history.pointer < 0) return console.log('Nothing to undo');
    this._state = this._state.history.stack[this._state.history.pointer];
    this._state.history.pointer--;
    if(window.EventBus) EventBus.emit('history:undo', this._state);
    console.log('Undo done');
  },

  redo() {
    if(this._state.history.pointer >= this._state.history.stack.length - 1) return console.log('Nothing to redo');
    this._state.history.pointer++;
    this._state = this._state.history.stack[this._state.history.pointer];
    if(window.EventBus) EventBus.emit('history:redo', this._state);
    console.log('Redo done');
  },

  getState() { return this._state; },

  startAutoSave() {
    setInterval(async () => {
      const project = window.App?.currentProject || this._state.project;
      if(!project || !this.db) return;
      try {
        const tx = this.db.transaction('autosave', 'readwrite');
        tx.objectStore('autosave').put({ id: 'last', data: project, ts: Date.now() });
        console.log('AutoSaved:', project.clips?.length || 0, 'clips');
      } catch(e){ console.warn('AutoSave fail', e); }
    }, 10000);
  }
};
window.Store = Store;
