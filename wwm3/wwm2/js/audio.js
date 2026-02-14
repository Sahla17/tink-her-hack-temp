// ============================================
// WALK WITH ME - Audio Effects
// Using Web Audio API for cross-browser sound
// ============================================

class AudioPlayer {
  constructor() {
    this.audioContext = null;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
    } catch (e) {
      console.log('Web Audio API not supported');
    }
  }

  playTone(frequency = 440, duration = 200, volume = 0.3, type = 'sine') {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.frequency.value = frequency;
    osc.type = type;

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000);

    osc.start(now);
    osc.stop(now + duration / 1000);
  }

  // Success beep - 2 quick high tones
  playSuccess() {
    this.playTone(800, 100, 0.3);
    setTimeout(() => this.playTone(1000, 100, 0.3), 150);
  }

  // Alert sound - medium tone
  playAlert() {
    this.playTone(600, 300, 0.3);
  }

  // Alarm - rapid alternating tones
  playAlarm() {
    const frequencies = [800, 600];
    const duration = 150;
    
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        this.playTone(frequencies[i % 2], duration, 0.4, 'square');
      }, i * (duration + 50));
    }
  }

  // Phone ring - classic ring pattern
  playPhoneRing() {
    const pattern = [200, 100, 200, 100, 400, 100];
    let totalDelay = 0;

    pattern.forEach((duration, index) => {
      setTimeout(() => {
        const freq = index % 2 === 0 ? 900 : 700;
        this.playTone(freq, duration, 0.3, 'square');
      }, totalDelay);
      totalDelay += duration + 50;
    });
  }

  // Call connected - short chirp
  playCallConnected() {
    this.playTone(1200, 100, 0.3);
    setTimeout(() => this.playTone(1400, 100, 0.3), 150);
    setTimeout(() => this.playTone(1200, 100, 0.3), 300);
  }
}

// Initialize global audio player
const audioPlayer = new AudioPlayer();

// Public API for other scripts
window.playAudio = function(soundType) {
  switch (soundType) {
    case 'success':
      audioPlayer.playSuccess();
      break;
    case 'alert':
      audioPlayer.playAlert();
      break;
    case 'alarm':
      audioPlayer.playAlarm();
      break;
    case 'phone-ring':
      audioPlayer.playPhoneRing();
      break;
    case 'call-connected':
      audioPlayer.playCallConnected();
      break;
    default:
      audioPlayer.playSuccess();
  }
};

console.log('✅ Audio system initialized');
