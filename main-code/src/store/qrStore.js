import { reactive } from 'vue';

export const qrStore = reactive({
  linkText: 'https://google.com',
  qrColor: '#000000', 
  bgColor: '#ffffff',  
  qrStyle: 'smooth-solid',
  logoSrc: null,
  useFrame: true,
  frameText: 'SCAN ME',
  frameType: 'cyber-bracket',


  saveToHistory(canvasUrl) {
    const newItem = {
      id: Date.now(),
      link: this.linkText,
      image: canvasUrl,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.history.unshift(newItem);
    if (this.history.length > 6) this.history.pop();
    localStorage.setItem('qr_history', JSON.stringify(this.history));
  },
  
  deleteHistory(id) {
    this.history = this.history.filter(item => item.id !== id);
    localStorage.setItem('qr_history', JSON.stringify(this.history));
  }
});