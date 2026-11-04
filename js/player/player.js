
/**
 * Folder: js/player/ File: player.js v3.8 - Transport Fixed No Autoplay
 */
const Player = {
  currentTime:0, isPlaying:false, videoEl:null,
  init(){
    console.log('Player v3.8 - No Autoplay - Transport Controls Fixed');
    this.videoEl=document.getElementById('realVideo');
    if(this.videoEl){
      this.videoEl.loop=false;
      this.videoEl.autoplay=false;
      this.videoEl.addEventListener('ended', ()=>{
        this.isPlaying=false;
        const btn=document.getElementById('btnPlayPause');
        if(btn) btn.textContent='▶';
        if(window.Transport){ Transport.isPlaying=false; Transport.stopTick(); }
        const st=document.getElementById('status');
        if(st) st.textContent='Ended - Tap Play';
      });
    }
  },
  play(){ if(this.videoEl){ this.videoEl.play(); this.isPlaying=true; } },
  pause(){ if(this.videoEl){ this.videoEl.pause(); this.isPlaying=false; } }
};
window.Player=Player;
