
/**
 * Folder: js/i18n/ File: i18n.js v3.7 - EN Default + AR Support - Domain Ready
 */
const I18n={
  lang:'en',
  dict:{
    en:{media:'Media', text:'Text', audio:'Audio', export:'Export', transform:'Transform', trim:'Trim', split:'Split', crop:'Crop'},
    ar:{media:'وسائط', text:'نص', audio:'صوت', export:'تصدير', transform:'تحويل', trim:'قص', split:'تقسيم', crop:'اقتصاص'}
  },
  init(){ const saved=localStorage.getItem('click_lang'); if(saved) this.lang=saved; this.apply(); },
  t(k){ return (this.dict[this.lang]&&this.dict[this.lang][k])||this.dict.en[k]||k; },
  setLang(l){ this.lang=l; localStorage.setItem('click_lang', l); this.apply(); document.documentElement.lang=l; document.documentElement.dir=l==='ar'?'rtl':'ltr'; },
  apply(){ const btn=document.getElementById('langBtn'); if(btn) btn.textContent=this.lang.toUpperCase(); }
};
window.I18n=I18n;
setTimeout(()=>I18n.init(), 300);
