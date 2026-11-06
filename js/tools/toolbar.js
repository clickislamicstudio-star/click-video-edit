/**
 * js/tools/toolbar.js v2.3 FINAL - Contextual Toolbar - Was Missing from index.html - Restored
 * Base: selection.js uses Toolbar.showForClip(clip) but index.html had no <script src="js/tools/toolbar.js">
 * Master Prompt: SVG Only, No Emoji, Material 3 Rounded, 24x24, Active #FF3B30 / Inactive #A0A0A0, Contextual: Video/Text/Audio/Image tools change on selection
 */
const Toolbar = {
  bar: null,
  init(){
    this.bar=document.getElementById('contextualToolbar');
    console.log('Toolbar v2.3 - Contextual - SVG Only - Master Prompt - Restored - Was Missing');
  },
  showForClip(clip){
    if(!this.bar) this.bar=document.getElementById('contextualToolbar');
    if(!this.bar) return;
    let tools=[];
    const svg = {
      edit: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
      transform: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
      split: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8" y2="4"/><line x1="20" y1="20" x2="8" y2="20"/><line x1="12" y1="8" x2="12" y2="16"/></svg>',
      delete: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>'
    };
    if(clip.type==='video' || clip.type==='image'){
      tools=[
        {name:'Edit', icon:svg.edit, action:()=>console.log('Edit', clip.id)},
        {name:'Transform', icon:svg.transform, action:()=>console.log('Transform', clip.id)},
        {name:'Split', icon:svg.split, action:()=>{ if(window.TrimSplitTool) TrimSplitTool.splitAtPlayhead(); }},
        {name:'From Start', icon:svg.edit, action:()=>{}},
        {name:'From Now', icon:svg.edit, action:()=>{}},
        {name:'Until Now', icon:svg.edit, action:()=>{}},
        {name:'Until End', icon:svg.edit, action:()=>{}},
        {name:'Delete', icon:svg.delete, action:()=>{ if(window.TimelineUI){ TimelineUI.clips=TimelineUI.clips.filter(c=>c.id!==clip.id); TimelineUI.render(); } if(window.Selection) Selection.deselect(); }},
      ];
    } else if(clip.type==='text'){
      tools=[
        {name:'Edit', icon:svg.edit, action:()=>{}},
        {name:'Transform', icon:svg.transform, action:()=>{}},
        {name:'Split', icon:svg.split, action:()=>{}},
        {name:'Delete', icon:svg.delete, action:()=>{}},
      ];
    } else {
      tools=[
        {name:'Edit', icon:svg.edit, action:()=>{}},
        {name:'Delete', icon:svg.delete, action:()=>{}},
      ];
    }
    this.bar.innerHTML = tools.map(t=>`<button style="background:#2A2A2A;border:none;color:#FFF;padding:8px 10px;border-radius:8px;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:9px;min-width:48px">${t.icon}<span>${t.name}</span></button>`).join('');
    this.bar.querySelectorAll('button').forEach((btn, i)=>{ btn.addEventListener('click', ()=> tools[i].action()); });
    this.bar.style.transform='translateX(0)';
    console.log('Toolbar show for', clip.type);
  },
  hide(){
    if(!this.bar) this.bar=document.getElementById('contextualToolbar');
    if(this.bar) this.bar.style.transform='translateX(100%)';
  }
};
window.Toolbar = Toolbar;
console.log('Toolbar v2.3 FINAL - Contextual - SVG Only - Master Prompt - Restored');
