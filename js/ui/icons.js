/**
 * js/ui/icons.js - Phase 2 - Material 3 Rounded - Complete Registry
 * Active #FF3B30, Inactive #A0A0A0, 24x24 default
 */
window.IconSystem = {
  config: { active:'#FF3B30', inactive:'#A0A0A0', size:24, stroke:1.8 },
  
  icons: {
    // Main
    media: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 5a2 2 0 0 1 2-2h9l3 3v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 9.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM5 16l4-4 4 3 5-6 3 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    text: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M12 6v12M8 18h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    music: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 18V5l12-2v13M9 13a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM21 11a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" stroke="currentColor" stroke-width="1.8"/></svg>`,
    export: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3v13M8 9l4-4 4 4M3 21h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    zoomIn: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.8"/><path d="M11 8v6M8 11h6M20 20l-3.5-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    zoomOut: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.8"/><path d="M8 11h6M20 20l-3.5-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,

    // Video tools
    trim: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7 3v18M3 7.5h4M3 16.5h4M17 8l4-4v16l-4-4h-3V8h3z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    split: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3v18M7 8a2 2 0 1 0 0 1.5M7 15.5A2.5 2.5 0 1 0 7 16M17 8a2 2 0 1 1 0 1.5M17 15.5A2.5 2.5 0 1 1 17 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    crop: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 3v3M3 6h3M18 18v3M15 21h3M7 10a5 5 0 0 0 5 5M7 15V10h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    speed: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
    volume: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M11 5L6 9H2v6h4l5 4V5zM15 8a5 5 0 0 1 0 8M19 6a9 9 0 0 1 0 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    filter: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M7 12h10M10 18h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="6" cy="6" r="2" fill="currentColor"/></svg>`,
    animation: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9l-2.1 2.1M7 17l-2.1 2.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    delete: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M10 11v6M14 11v6M5 6l1 14h12l1-14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,

    // Text tools
    font: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M12 6v12M8 18h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M6 20l2-2M18 20l-2-2" stroke="currentColor" stroke-width="1.2"/></svg>`,
    color: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" stroke-width="1.8"/></svg>`,
    bg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.8"/><path d="M3 9h18M9 3v18" stroke="currentColor" stroke-width="1.2" opacity="0.3"/></svg>`,
    style: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM8 12h8M12 8v8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,

    // Audio tools
    fade: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 18L9 6l4 8 3-3 5 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="6" r="1.5" fill="currentColor"/><circle cx="18" cy="18" r="1.5" fill="currentColor"/></svg>`,
    noise: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M2 12h3l2-5 4 10 3-6 2 3h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    timer: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="13" r="8" stroke="currentColor" stroke-width="1.8"/><path d="M12 13V9M9 2h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`
  },

  render(name, active=false, size=24) {
    const svg = this.icons[name] || this.icons.media;
    const color = active ? this.config.active : this.config.inactive;
    return `<span style="color:${color};width:${size}px;height:${size}px;display:inline-flex;align-items:center;justify-content:center">${svg}</span>`;
  },

  getRegistry() {
    return {
      video: ['trim','split','crop','speed','volume','filter','animation','delete'],
      text: ['font','color','animation','bg','style','delete'],
      audio: ['volume','speed','fade','noise','music','delete'],
      image: ['crop','filter','animation','timer','delete'],
      main: ['media','text','music','export']
    };
  }
};
