/**
  * js/core/i18n.js - Bilingual System (English default + Arabic RTL)
 */
const I18n = {
  currentLang: localStorage.getItem('click_lang') || 'en',
  
  translations: {
    en: {
      app_name: "Click Video Editor",
      timeline: "Timeline",
      tools: "Tools",
      trim: "Trim",
      split: "Split",
      speed: "Speed",
      text: "Text",
      filter: "Filter",
      masking: "Mask",
      chroma: "Chroma",
      audio: "Audio",
      effects: "Effects",
      captions: "Captions",
      export: "Export",
      play: "Play",
      pause: "Pause",
      free_forever: "FREE Forever - No Watermark",
      export_720: "720p Free",
      export_1080: "1080p Free",
      export_2K: "2K Free",
      export_60fps: "60fps Rewarded"
    },
    ar: {
      app_name: "كليك محرر الفيديو",
      timeline: "الخط الزمني",
      tools: "الأدوات",
      trim: "قص",
      split: "تقسيم",
      speed: "السرعة",
      text: "نص",
      filter: "فلتر",
      masking: "قناع",
      chroma: "كروما",
      audio: "صوت",
      effects: "تأثيرات",
      captions: "تسميات",
      export: "تصدير",
      play: "تشغيل",
      pause: "إيقاف",
      free_forever: "مجاني للأبد - بدون علامة مائية",
      export_720: "720p مجاني",
      export_1080: "1080p مجاني",
      export_2K: "2K مجاني",
      export_60fps: "60fps مكافأة"
    },
    ur: {
      app_name: "کلک ویڈیو ایڈیٹر",
      timeline: "ٹائم لائن",
      tools: "ٹولز",
      trim: "تراش",
      split: "تقسیم",
      speed: "رفتار",
      text: "متن",
      filter: "فلٹر",
      masking: "ماسک",
      chroma: "کروما",
      audio: "آڈیو",
      effects: "ایفیکٹس",
      captions: "کیپشن",
      export: "ایکسپورٹ",
      play: "چلاؤ",
      pause: "روکو",
      free_forever: "ہمیشہ کے لیے فری - کوئی واٹر مارک نہیں",
      export_720: "720p فری",
      export_1080: "1080p فری",
      export_2K: "2K فری",
      export_60fps: "60fps انعام"
    }
  },

  t(key) {
    return this.translations[this.currentLang]?.[key] || this.translations['en'][key] || key;
  },

  setLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('click_lang', lang);
    
    // RTL handling for Arabic
    if(lang === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
      document.body.classList.add('rtl');
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = lang;
      document.body.classList.remove('rtl');
    }
    
    // Update UI
    if(window.App) App.updateLanguage();
    
    return true;
  },

  init() {
    this.setLanguage(this.currentLang);
    console.log('I18n Ready - Language:', this.currentLang);
  }
};
window.I18n = I18n;
I18n.init();