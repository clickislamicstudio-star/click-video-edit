/**
 * js/store.js - IndexedDB + AutoSave
 */
const Store = {
  dbName: 'ClickVideoEditorDB',
  db: null,

  async init() {
    return new Promise((resolve) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('projects')) db.createObjectStore('projects', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('media')) db.createObjectStore('media', { keyPath: 'id' });
      };
      request.onsuccess = (e) => {
        this.db = e.target.result;
        console.log('Store DB Ready');
        this.startAutoSave();
        resolve();
      };
    });
  },

  // Auto Save every 10 seconds
  startAutoSave() {
    setInterval(() => {
      const project = window.currentProject || { id: 'last', time: Date.now() };
      this.saveProject(project);
      console.log('AutoSave @', new Date().toLocaleTimeString());
    }, 10000);
  },

  async saveProject(project) {
    if (!this.db) return;
    const tx = this.db.transaction('projects', 'readwrite');
    tx.objectStore('projects').put({ ...project, id: project.id || 'last', savedAt: Date.now() });
  },

  async getLastProject() {
    if (!this.db) await this.init();
    return new Promise((resolve) => {
      const tx = this.db.transaction('projects', 'readonly');
      const req = tx.objectStore('projects').get('last');
      req.onsuccess = () => resolve(req.result);
    });
  }
};
window.Store = Store;
Store.init();