/**
 * js/bridge/android-bridge.js - For Android Studio Kotlin WebView
 */
const AndroidBridge = {
  isAndroid: !!window.Android,

  logEvent(event, payload) {
    if(this.isAndroid) {
      try { window.Android.logEvent(event, JSON.stringify(payload).slice(0,500)); } catch(e){}
    }
  },

  onMediaPicked(fileUrl, fileName, duration) {
    console.log('Android Media Picked', fileName);
    if(window.EventBus) EventBus.emit('android:media', { url: fileUrl, name: fileName, duration });
  },

  pickMedia() {
    if(this.isAndroid) window.Android.pickMedia();
    else {
      const input = document.createElement('input');
      input.type='file'; input.accept='video/*';
      input.onchange = e => {
        const file = e.target.files[0];
        if(file) this.onMediaPicked(URL.createObjectURL(file), file.name, 0);
      };
      input.click();
    }
  },

  exportVideo(preset) {
    if(this.isAndroid) window.Android.exportVideo(preset);
    else console.log('Export web', preset);
  },

  vibrate(ms=50) {
    if(this.isAndroid) { try{ window.Android.vibrate(ms);}catch(e){} }
    else if(navigator.vibrate) navigator.vibrate(ms);
  },

  getState() {
    return JSON.stringify(Store.getState());
  },

  dispatchFromKotlin(actionJson) {
    try {
      const action = JSON.parse(actionJson);
      Store.dispatch(action);
    } catch(e){ console.error('Kotlin dispatch fail', e); }
  }
};
window.AndroidBridge = AndroidBridge;
