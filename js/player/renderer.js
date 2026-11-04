
/**
 * Renderer v3.4 - Bottom Sheet - Video Always Visible 60% top
 */
const Renderer = {
  textEl:null, videoEl:null, _loopId:null,
  init(){
    this.videoEl=document.getElementById('realVideo');
    let old=document.getElementById('textOverlay'); if(old) old.remove();
    const wrap=document.getElementById('playerWrap'); if(!wrap) return;
    this.textEl=document.createElement('div'); this.textEl.id='textOverlay';
    this.textEl.style.cssText=`position:absolute !important;top:50% !important;left:50% !important;transform:translate(-50%,-50%) !important;z-index:5 !important;color:white;font-size:36px;font-weight:800;text-align:center;text-shadow:0 2px 12px rgba(0,0,0,0.9);pointer-events:none;max-width:85%;word-break:break-word;line-height:1.3;display:none;font-family:Inter,sans-serif;padding:4px 8px;border-radius:8px;white-space:pre-wrap;transition:top 0.3s ease`;
    wrap.appendChild(this.textEl); wrap.style.position='relative';
    this._preloadFonts(); this._startLoop();
  },
  _preloadFonts(){ if(document.getElementById('popular-fonts-link')) return; const l=document.createElement('link'); l.id='popular-fonts-link'; l.rel='stylesheet'; l.href='https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Poppins:wght@400;700;900&family=Montserrat:wght@400;700;900&family=Bebas+Neue&family=Oswald:wght@400;700&family=Anton&family=Lobster&family=Pacifico&family=Bangers&family=Righteous&display=swap'; document.head.appendChild(l); },
  _startLoop(){ const loop=()=>{ this.render(); this._loopId=requestAnimationFrame(loop); }; loop(); },
  render(){ const ct=window.TimelineUI?.currentTime??0; const clips=window.TimelineUI?.clips||[]; const active=clips.filter(c=>c.type==='text'&&ct>=c.startTime&&ct<=c.endTime); if(active.length>0){ this._renderClip(active[0], ct); return; } const sel=window.Selection?.selectedClip; if(sel&&sel.type==='text'){ this._forceShow(sel); return; } this._hide(); },
  _forceShow(clip){ if(clip&&this.textEl) this._renderClip(clip, clip.startTime||0); },
  _renderClip(clip, currentTime){
    if(!this.textEl) return; const el=this.textEl; el.style.display='block'; el.textContent=clip.text||'Sample'; el.style.fontSize=(clip.fontSize||36)+'px';
    if(clip.fontColor&&clip.fontColor.includes('gradient')){ el.style.background=clip.fontColor; el.style.webkitBackgroundClip='text'; el.style.webkitTextFillColor='transparent'; el.style.backgroundClip='text'; el.style.color='transparent'; } else { el.style.background='none'; el.style.webkitBackgroundClip='unset'; el.style.webkitTextFillColor='unset'; el.style.backgroundClip='unset'; el.style.color=clip.fontColor||'#FFFFFF'; }
    if(clip.fontFamily) el.style.fontFamily=clip.fontFamily+', Inter, sans-serif';
    if(clip.bgColor&&clip.bgColor!=='transparent'){ el.style.backgroundColor=clip.bgColor; el.style.padding='8px 16px'; } else { el.style.backgroundColor='transparent'; }
    // When bottom sheet open, text at 30% so always visible above sheet
    const modal=document.getElementById('textEditorModal');
    const isOpen=modal&&modal.style.display!=='none';
    if(isOpen){ el.style.top='30%'; } else { if(clip.position==='top') el.style.top='25%'; else if(clip.position==='bottom') el.style.top='70%'; else el.style.top='50%'; }
    this._applyTemplate(el, clip);
    if(clip.animation&&clip.animation!=='none'){ const p=Math.min(1,(currentTime-clip.startTime)/0.6); this._applyAnim(el, clip.animation, p); }
  },
  _applyTemplate(el, clip){
    const t=clip.template||'default'; el.style.fontWeight='700'; el.style.webkitTextStroke='0'; el.style.letterSpacing='normal'; el.style.textTransform='none'; el.style.fontStyle='normal'; el.style.border='none';
    switch(t){ case 'bold': el.style.fontWeight='900'; el.style.textShadow='3px 3px 0 #000'; break; case 'outline': el.style.webkitTextStroke='2px #FFF'; el.style.color='transparent'; break; case 'shadow': el.style.textShadow='4px 4px 16px rgba(0,0,0,0.9)'; break; case 'neon': el.style.textShadow=`0 0 10px ${clip.fontColor}, 0 0 20px ${clip.fontColor}`; break; case 'retro': el.style.background='#FF3B30'; el.style.padding='8px 16px'; break; case '3d': el.style.textShadow='1px 1px 0 #000,2px 2px 0 #000,3px 3px 6px rgba(0,0,0,0.7)'; break; case 'cinema': el.style.border=`2px solid ${clip.fontColor||'#FFF'}`; el.style.padding='8px 16px'; el.style.letterSpacing='4px'; el.style.textTransform='uppercase'; break; case 'bubble': el.style.background='rgba(88,86,214,0.9)'; el.style.padding='8px 18px'; el.style.borderRadius='20px'; break; case 'fire': el.style.background='linear-gradient(45deg,#FF3B30,#FF9500)'; el.style.webkitBackgroundClip='text'; el.style.webkitTextFillColor='transparent'; break; case 'ice': el.style.background='linear-gradient(45deg,#00C9FF,#92FE9D)'; el.style.webkitBackgroundClip='text'; el.style.webkitTextFillColor='transparent'; break; }
  },
  _applyAnim(el, anim, p){ switch(anim){ case 'fadeIn': el.style.opacity=p; break; case 'slideUp': el.style.opacity=p; el.style.transform=`translate(-50%, calc(-50% + ${(1-p)*40}px))`; break; case 'bounce': const b=Math.sin(p*Math.PI*2)*12; el.style.transform=`translate(-50%, calc(-50% + ${b}px))`; break; case 'scale': el.style.transform=`translate(-50%,-50%) scale(${0.5+p*0.5})`; el.style.opacity=p; break; default: el.style.opacity='1'; } },
  _hide(){ const sel=window.Selection?.selectedClip; if(sel&&sel.type==='text') return; if(this.textEl) this.textEl.style.display='none'; }
};
window.Renderer=Renderer; setTimeout(()=>Renderer.init(), 1000);
