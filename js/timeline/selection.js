/**
 * js/timeline/selection.js - Single + Multi Selection
 */
const Selection = {
  selectedIds: [],

  select(id) {
    this.selectedIds = [id];
    console.log('Selected:', id);
    return this.selectedIds;
  },

  multiSelect(id) {
    if(this.selectedIds.includes(id)) {
      this.selectedIds = this.selectedIds.filter(i => i !== id);
    } else {
      this.selectedIds.push(id);
    }
    return this.selectedIds;
  },

  clear() {
    this.selectedIds = [];
  },

  isSelected(id) {
    return this.selectedIds.includes(id);
  }
};
window.Selection = Selection;