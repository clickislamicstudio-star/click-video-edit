/**
  * js/app.js - Click Video Editor Main App
  * Final UI Controller - InShot Style
 */
const App = {
  version: "1.0.0",
  isReady: false,
  currentProject: null,

  init() {
    console.log('🚀 Click Video Editor v' + this.version + ' Starting...');
    
    // Initialize all systems
    this.initProject();
    this.bindEvents();
    this.updateLanguage();
    
    this.isReady = true;
    console.log('✅ Click Editor Ready - FREE Forever');
    
    // Show welcome
    this.showWelcome();
  },

  initProject() {
    this.currentProject = {
      id: 'project_' + Date.now(),
      name: 'My First Video',
      duration: 0,
      clips: [],
      createdAt: Date.now(),
      resolution: "1080p",
      fps: 30
    };
    
    // Load from IndexedDB if exists
    if(window.Store) {
      Store.getProject(this.currentProject.id);
    }
  },

  bindEvents() {
    // Tool buttons
    document.addEventListener('click', (e) => {
      const tool = e.target.closest('[data-tool]');
      if(tool) {
        const toolName = tool.dataset.tool;
        this.openTool(toolName);
      }
    });

    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if(exportBtn) {
      exportBtn.addEventListener('click', () => this.export());
    }

    // Language switcher
    const langBtn = document.getElementById('langBtn');
    if(langBtn) {
      langBtn.addEventListener('click', () => {
        const nextLang = I18n.currentLang === 'en' ? 'ar' : I18n.currentLang === 'ar' ? 'ur' : 'en';
        I18n.setLanguage(nextLang);
      });
    }
  },

  openTool(toolName) {
    console.log('Opening Tool:', toolName);
    
    // Haptic feedback
    if(navigator.vibrate) navigator.vibrate(50);
    
    // Show tool panel
    const panel = document.getElementById('toolPanel');
    if(panel) {
      panel.innerHTML = `<h3>${I18n.t(toolName)}</h3><p>Tool: ${toolName} - Coming from ${toolName}.js</p>`;
      panel.classList.add('active');
    }

    // Actual tool logic
    switch(toolName) {
      case 'trim': 
        if(window.TrimSplitTool) console.log('Trim tool ready');
        break;
      case 'text':
        if(window.TextTool) {
          const clip = TextTool.createTextClip({text: "Click Editor", startTime: 0, duration: 3});
          Timeline.addClip(clip);
        }
        break;
      case 'filter':
        if(window.FilterTool) console.log('Filter presets:', Object.keys(FilterTool.presets));
        break;
      case 'captions':
        if(window.CaptionsTool) CaptionsTool.transcribe({}, 'auto');
        break;
    }
  },

  async export() {
    if(!window.ExportEngine) return;
    
    const preset = HardwareDetector.info.maxPreset || "1080p";
    console.log('Exporting as', preset);
    
    // Show progress
    const progressEl = document.getElementById('exportProgress');
    if(progressEl) progressEl.style.display = 'block';
    
    const result = await ExportEngine.exportProject(
      this.currentProject, 
      preset,
      (p) => {
        if(progressEl) progressEl.textContent = `Exporting ${p}%`;
      }
    );
    
    if(progressEl) progressEl.textContent = '✅ Export Done! FREE - No Watermark';
    
    // Safe ad after export
    if(ExportEngine.shouldShowAd('after_export')) {
      console.log('Show safe ad - after export only');
    }
    
    return result;
  },

  updateLanguage() {
    // Update all [data-i18n] elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      el.textContent = I18n.t(key);
    });
    
    // Update lang button
    const langBtn = document.getElementById('langBtn');
    if(langBtn) langBtn.textContent = I18n.currentLang.toUpperCase();
  },

  showWelcome() {
    const welcome = document.getElementById('welcome');
    if(welcome) {
      welcome.innerHTML = `
        <h1>${I18n.t('app_name')} - v${this.version}</h1>
        <p>✅ ${I18n.t('free_forever')}</p>
        <p>📱 ${HardwareDetector.info.ram}GB RAM | Max: ${HardwareDetector.info.maxPreset}</p>
        <p>🛠️ 22 Tools Ready: Trim, Speed, Text, Filter, Mask, Chroma, Audio, VHS, Glitch, Auto Captions (Urdu/English/Arabic)</p>
      `;
    }
  }
};

// Auto init when DOM ready
if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
window.App = App;