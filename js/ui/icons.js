/**
 * js/ui/icons.js - Material 3 Rounded - SVG Only - No PNG
 * Active: #FF3B30, Inactive: #A0A0A0, 24x24 Toolbar, 20px Timeline, 28px Floating
 * Supports RTL mirroring
 */
const IconSystem = {
  config: {
    active: '#FF3B30',
    inactive: '#A0A0A0',
    sizeToolbar: 24,
    sizeTimeline: 20,
    sizeFloating: 28
  },

  icons: {
    trim: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7 3v18M3 7.5h4M3 16.5h4M17 8l4-4v16l-4-4h-3V8h3z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    split: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M16 3v18M8 7c0-1 1-2 2-2h2M8 17c0 1 1 2 2 2h2M3 12h6M15 12h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    crop: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 3v3M3 6h3M18 18v3M15 21h3M7 11a5 5 0 0 0 5 5M7 16V11h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    speed: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
    volume: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M11 5L6 9H2v6h4l5 4V5zM15 8a4 4 0 0 1 0 8M19 6a8 8 0 0 1 0 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    filter: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M7 12h10M10 18h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="6" cy="6" r="2" fill="currentColor"/><circle cx="14" cy="12" r="2" fill="currentColor"/><circle cx="17" cy="18" r="2" fill="currentColor"/></svg>`,
    delete: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M10 11v6M14 11v6M5 6l1 14h12l1-14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    font: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M12 6v12M8 18h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    color: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>`,
    animation: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1l2.1-2.1M17 7l2.1-2.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    music: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 18V5l12-2v13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="1.8"/></svg>`,
    media: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 5h12a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2V5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M16 5l4 4v4" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="9" cy="12" r="1.5" fill="currentColor"/></svg>`,
    text: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M8 7v10M16 7v10M8 17h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    export: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3v13M8 11l4-4 4 4M3 21h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    zoomIn: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.8"/><path d="M11 8v6M8 11h6M20 20l-3.5-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    zoomOut: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.8"/><path d="M8 11h6M20 20l-3.5-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`
  },

  render(name, active=false, size=24, rtl=false) {
    const svg = this.icons[name] || this.icons.media;
    const color = active ? this.config.active : this.config.inactive;
    return `<span style="color:${color};width:${size}px;height:${size}px;display:inline-flex;${rtl ? 'transform:scaleX(-1);' : ''}">${svg}</span>`;
  },

  getRegistry() {
    return {
      video: ['trim','split','crop','speed','volume','filter','delete'],
      text: ['font','color','animation','delete'],
      audio: ['volume','speed','music','delete'],
      image: ['crop','filter','animation','delete'],
      main: ['media','text','music','export']
    };
  }
};
window.IconSystem = IconSystem;
