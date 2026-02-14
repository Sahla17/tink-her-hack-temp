// =====================================================
// WALK WITH ME - Women Safety Application
// Features: GPS, Emergency Alerts, Fake Call, 
// Shake Detection, Voice Commands, Sound Effects
// =====================================================

/* ===== WEB AUDIO API - SOUND EFFECTS ===== */
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

  // Core tone generator using oscillators
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

  playSuccess() {
    this.playTone(800, 100, 0.3);
    setTimeout(() => this.playTone(1000, 100, 0.3), 150);
  }

  playAlert() {
    this.playTone(600, 300, 0.3);
  }

  // High volume alarm for emergency situations
  playAlarm() {
    const frequencies = [800, 600];
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        this.playTone(frequencies[i % 2], 150, 0.5, 'square');
      }, i * 200);
    }
  }

  // Loud siren sound
  playSiren() {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const freq = i % 2 === 0 ? 1000 : 500;
        this.playTone(freq, 100, 0.7, 'square');
      }, i * 120);
    }
  }

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

  playCallConnected() {
    this.playTone(1200, 100, 0.3);
    setTimeout(() => this.playTone(1400, 100, 0.3), 150);
    setTimeout(() => this.playTone(1200, 100, 0.3), 300);
  }
}

// Initialize audio player
const audioPlayer = new AudioPlayer();

function playSound(type) {
  switch (type) {
    case 'success':
      audioPlayer.playSuccess();
      break;
    case 'alert':
      audioPlayer.playAlert();
      break;
    case 'alarm':
      audioPlayer.playAlarm();
      break;
    case 'siren':
      audioPlayer.playSiren();
      break;
    case 'phone-ring':
      audioPlayer.playPhoneRing();
      break;
    case 'call-connected':
      audioPlayer.playCallConnected();
      break;
  }
}

/* ===== GLOBAL STATE ===== */
let userProfile = null;
let walkActive = false;
let walkTimer = null;
let currentLocation = null;
let shakeDetectionActive = false;
let voiceRecognitionActive = false;

// Walk timer: 5 minutes (300,000 milliseconds)
const WALK_DURATION = 300000; // 5 minutes
const SAFETY_CHECK_INTERVAL = 300000; // Every 5 minutes
const GRACE_PERIOD = 30000; // 30 seconds to respond

/* ===== ON PAGE LOAD ===== */
document.addEventListener('DOMContentLoaded', () => {
  // Check if user already exists
  userProfile = JSON.parse(localStorage.getItem('userProfile'));
  
  if (userProfile && localStorage.getItem('emergencyContacts')) {
    // Skip to dashboard
    setTimeout(() => goToDashboard(), 4000);
  } else {
    // Show opening animation then go to signup
    initOpeningAnimation();
  }

  // Setup form submission
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignupSubmit);
  }

  // Setup add contact button
  const addContactBtn = document.getElementById('addContactBtn');
  if (addContactBtn) {
    addContactBtn.addEventListener('click', addEmergencyContactField);
  }
});

/* ===== OPENING ANIMATION ===== */
function initOpeningAnimation() {
  // After 3.5 seconds, show the START button
  setTimeout(() => {
    const startBtn = document.getElementById('startBtn');
    if (startBtn) startBtn.style.display = 'block';
  }, 3500);
}

/* ===== SCREEN NAVIGATION ===== */
function showScreen(screenId) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  // Show selected screen
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
  }
}

function goToSignup() {
  showScreen('signup-screen');
}

function goToDashboard() {
  showScreen('dashboard-screen');
  const user = JSON.parse(localStorage.getItem('userProfile')) || {};
  document.getElementById('userNameDisplay').textContent = user.name || 'Friend';
}

function goToWalk() {
  // Validate profile exists
  const profile = JSON.parse(localStorage.getItem('userProfile'));
  const contacts = localStorage.getItem('emergencyContacts');
  
  if (!profile || !contacts) {
    alert('Please complete your profile first');
    goToSignup();
    return;
  }

  showScreen('walk-screen');
  startWalkMode();
}

function goToSafetyTools() {
  showScreen('safety-tools-screen');
}

function goToLiveTracking() {
  showScreen('live-tracking-screen');
  updateLiveTracking();
}

function backToDashboard() {
  // Clean up
  walkActive = false;
  if (walkTimer) clearInterval(walkTimer);
  disableShakeDetection();
  disableVoiceCommand();
  
  goToDashboard();
}

/* ===== SIGNUP FORM ===== */
function handleSignupSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();

  // Validate main profile fields
  if (!name || !email || !phone) {
    alert('Please fill all your personal information');
    return;
  }

  // Collect all emergency contacts
  const emergencyContacts = [];
  const contactGroups = document.querySelectorAll('.emergency-contact-group');
  
  contactGroups.forEach(group => {
    const nameInput = group.querySelector('.emergency-name');
    const phoneInput = group.querySelector('.emergency-phone');
    const emailInput = group.querySelector('.emergency-email');
    
    if (nameInput && phoneInput && nameInput.value.trim() && phoneInput.value.trim()) {
      emergencyContacts.push({
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput ? emailInput.value.trim() : ''
      });
    }
  });

  if (emergencyContacts.length === 0) {
    alert('Please add at least one emergency contact');
    return;
  }

  // Save to localStorage
  localStorage.setItem('userProfile', JSON.stringify({ name, email, phone }));
  localStorage.setItem('emergencyContacts', JSON.stringify(emergencyContacts));

  playSound('success');
  goToDashboard();
}

function addEmergencyContactField() {
  const contactsList = document.getElementById('emergencyContactsList');
  const contactCount = document.querySelectorAll('.emergency-contact-group').length + 1;
  
  if (contactCount > 3) {
    alert('Maximum 3 emergency contacts allowed');
    return;
  }

  const contactHTML = `
    <div class="emergency-contact-group">
      <div class="form-group fade-in">
        <label>Contact ${contactCount} Name</label>
        <input type="text" class="emergency-name" placeholder="Contact name">
      </div>
      <div class="form-group fade-in">
        <label>Contact ${contactCount} Phone</label>
        <input type="tel" class="emergency-phone" placeholder="+1 (555) 000-0000">
      </div>
      <div class="form-group fade-in">
        <label>Contact ${contactCount} Email</label>
        <input type="email" class="emergency-email" placeholder="contact@email.com">
      </div>
      <button type="button" class="btn btn-secondary" style="width: 100%; margin-top: 10px; font-size: 0.8rem;" onclick="this.parentElement.remove()">Remove Contact</button>
    </div>
  `;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = contactHTML;
  contactsList.appendChild(tempDiv.firstElementChild);

  // Update button visibility
  updateAddContactButton();
}

function updateAddContactButton() {
  const contactCount = document.querySelectorAll('.emergency-contact-group').length;
  const addBtn = document.getElementById('addContactBtn');
  if (addBtn) {
    addBtn.style.display = contactCount >= 3 ? 'none' : 'block';
  }
}

/* ===== WALK MODE - 5 MINUTE TIMER ===== */
function startWalkMode() {
  walkActive = true;
  let timeRemaining = WALK_DURATION / 1000; // Convert to seconds

  // Request GPS location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        };
        console.log('📍 Location acquired');
      },
      (error) => {
        console.log('Location access denied - but app still works');
        currentLocation = { latitude: 40.7128, longitude: -74.0060 }; // Default NYC coords
      }
    );
  }

  // Update timer every second
  walkTimer = setInterval(() => {
    if (!walkActive) {
      clearInterval(walkTimer);
      return;
    }

    timeRemaining--;
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;

    document.getElementById('timerDisplay').textContent = 
      `${mins}:${secs.toString().padStart(2, '0')}`;

    // Time's up!
    if (timeRemaining <= 0) {
      clearInterval(walkTimer);
      walkActive = false;
      completeWalk();
    }
  }, 1000);

  // Schedule first safety check after 3 minutes
  setTimeout(() => {
    if (walkActive) showSafetyCheck();
  }, 180000);
}

function completeWalk() {
  playSound('success');
  document.getElementById('timerDisplay').textContent = '0:00';
  alert('✅ You reached safely! Well done on your safe walk.');
  backToDashboard();
}

/* ===== SAFETY CHECK MODAL ===== */
function showSafetyCheck() {
  if (!walkActive) return;

  playSound('alert');
  document.getElementById('safetyModal').style.display = 'flex';

  // Start countdown
  let countdown = 30;
  const countdownEl = document.getElementById('graceCountdown');
  const progressFill = document.getElementById('progressFill');

  const timer = setInterval(() => {
    countdown--;
    countdownEl.textContent = countdown;

    // Update progress bar
    const percent = (countdown / 30) * 100;
    if (progressFill) {
      progressFill.style.width = percent + '%';
    }

    if (countdown <= 0) {
      clearInterval(timer);
      document.getElementById('safetyModal').style.display = 'none';
      // No response = trigger emergency
      triggerEmergency();
    }
  }, 1000);
}

function respondSafe() {
  document.getElementById('safetyModal').style.display = 'none';
  playSound('success');
  document.getElementById('statusText').textContent = '✅ Good! You\'re safe.';

  // Schedule next check
  if (walkActive) {
    setTimeout(showSafetyCheck, SAFETY_CHECK_INTERVAL);
  }
}

function stopWalk() {
  walkActive = false;
  clearInterval(walkTimer);
  playSound('success');
  backToDashboard();
}

/* ===== EMERGENCY MODE ===== */
function triggerEmergency() {
  walkActive = false;
  playSound('alarm');

  // Flash red warning
  const container = document.querySelector('.emergency-container');
  if (container) {
    container.classList.add('flash-warning');
  }

  // Get location
  if (!currentLocation && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      },
      () => {
        currentLocation = { latitude: 40.7128, longitude: -74.0060 };
      }
    );
  }

  // Display emergency screen
  const user = JSON.parse(localStorage.getItem('userProfile')) || { name: 'User' };
  const contacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];

  if (currentLocation) {
    const mapUrl = `https://maps.google.com/?q=${currentLocation.latitude},${currentLocation.longitude}`;
    
    document.getElementById('mapLink').href = mapUrl;
    document.getElementById('mapLink').style.display = 'inline-block';
    document.getElementById('locationInfo').textContent = 
      `📍 ${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}`;

    // Build SMS message
    const smsMsg = `🚨 EMERGENCY ALERT from ${user.name}!\n\nI may be unsafe. Please check my location:\n${mapUrl}\n\nPhone: ${user.phone}`;
    document.getElementById('smsPreview').textContent = smsMsg;

    // Build email message
    let emailContacts = contacts.map(c => `${c.name}: ${c.email || 'No email'}`).join('\n');
    const emailMsg = `EMERGENCY ALERT from ${user.name}\n\nI may be unsafe at this location:\n${mapUrl}\n\nMy Phone: ${user.phone}\nMy Email: ${user.email}\n\nPlease check on me immediately.`;
    document.getElementById('emailPreview').textContent = emailMsg;

    // Display notified contacts
    const contactsList = document.getElementById('notifiedContactsList');
    if (contactsList) {
      contactsList.innerHTML = contacts.map(c => 
        `<p style="margin: 5px 0; font-size: 0.85rem;">✓ ${c.name}${c.phone ? ' - ' + c.phone : ''}${c.email ? ' (' + c.email + ')' : ''}</p>`
      ).join('');
    }
  }

  console.log('🚨 EMERGENCY TRIGGERED', { user, contacts, location: currentLocation });

  showScreen('emergency-screen');
}

/* ===== FAKE CALL FEATURE ===== */
let callTimerInterval = null;

function triggerFakeCall() {
  playSound('phone-ring');
  showScreen('fake-call-screen');

  // Simulate 15 second call timer
  let callTime = 15;
  const callTimerEl = document.getElementById('callTimer');

  if (callTimerInterval) clearInterval(callTimerInterval);

  callTimerInterval = setInterval(() => {
    callTime--;
    callTimerEl.textContent = callTime;

    if (callTime <= 0) {
      clearInterval(callTimerInterval);
      declineCall();
    }
  }, 1000);
}

function acceptCall() {
  clearInterval(callTimerInterval);
  playSound('call-connected');
  alert('✅ Fake call accepted! Hopefully you\'re now safe. Good thinking!');
  backToDashboard();
}

function declineCall() {
  clearInterval(callTimerInterval);
  playSound('success');
  alert('📞 Call ended');
  backToDashboard();
}

/* ===== LIVE TRACKING ===== */
function updateLiveTracking() {
  if (!currentLocation && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        displayLiveTracking();
      },
      () => {
        currentLocation = { latitude: 40.7128, longitude: -74.0060 };
        displayLiveTracking();
      }
    );
  } else {
    displayLiveTracking();
  }
}

function displayLiveTracking() {
  if (currentLocation) {
    const mapUrl = `https://maps.google.com/?q=${currentLocation.latitude},${currentLocation.longitude}`;
    
    document.getElementById('trackingLocation').textContent = 
      `📍 ${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}`;
    
    document.getElementById('trackingMapLink').href = mapUrl;
    document.getElementById('shareMessage').textContent = 'Share this link with your trusted contacts';
  }
}

function copyTrackingLink() {
  const mapUrl = `https://maps.google.com/?q=${currentLocation.latitude},${currentLocation.longitude}`;
  navigator.clipboard.writeText(mapUrl).then(() => {
    playSound('success');
    alert('✅ Location link copied!');
  });
}

/* ===== SHAKE DETECTION ===== */
function enableShakeDetection() {
  if (shakeDetectionActive) {
    disableShakeDetection();
    document.getElementById('shakeBtn').textContent = 'Activate';
    document.getElementById('shakeStatus').textContent = 'Shake device to trigger alarm';
    shakeDetectionActive = false;
    return;
  }

  if (!window.DeviceMotionEvent) {
    alert('Shake detection not supported on your device');
    return;
  }

  shakeDetectionActive = true;
  document.getElementById('shakeBtn').textContent = 'Deactivate';
  document.getElementById('shakeStatus').textContent = '🟢 Shake detection ACTIVE';

  let lastShakeTime = 0;
  let shakeThreshold = 15;

  window.addEventListener('devicemotion', (event) => {
    if (!shakeDetectionActive) return;

    const acceleration = event.accelerationIncludingGravity;
    const { x, y, z } = acceleration;

    const magnitude = Math.sqrt(x * x + y * y + z * z);
    const now = Date.now();

    // Detect shake
    if (magnitude > shakeThreshold && now - lastShakeTime > 500) {
      lastShakeTime = now;
      console.log('📳 Shake detected!');
      playSound('alarm');
      alert('🚨 Shake detected! Emergency triggered!');
      triggerEmergency();
    }
  });
}

function disableShakeDetection() {
  shakeDetectionActive = false;
  window.removeEventListener('devicemotion', null);
}

/* ===== VOICE COMMAND - SAY "HELP" ===== */
function enableVoiceCommand() {
  if (voiceRecognitionActive) {
    disableVoiceCommand();
    document.getElementById('voiceBtn').textContent = 'Activate';
    document.getElementById('voiceStatus').textContent = 'Say "HELP" to trigger alert';
    voiceRecognitionActive = false;
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert('Voice recognition not supported on your device');
    return;
  }

  voiceRecognitionActive = true;
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.lang = 'en-US';

  document.getElementById('voiceBtn').textContent = 'Deactivate';
  document.getElementById('voiceStatus').textContent = '🎤 Listening...';

  recognition.onresult = (event) => {
    if (!voiceRecognitionActive) return;

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript.toLowerCase();

      if (transcript.includes('help')) {
        console.log('🎤 "HELP" detected!');
        playSound('alarm');
        alert('🚨 HELP command recognized! Emergency triggered!');
        triggerEmergency();
        recognition.stop();
        voiceRecognitionActive = false;
      }
    }
  };

  recognition.start();
}

function disableVoiceCommand() {
  voiceRecognitionActive = false;
}

/* ===== QUICK SIREN ===== */
function triggerSiren() {
  playSound('siren');
  playSound('siren');
  
  // Visual feedback
  const safetyTools = document.querySelector('.safety-tools-container');
  if (safetyTools) {
    safetyTools.classList.add('flash-warning');
    setTimeout(() => safetyTools.classList.remove('flash-warning'), 1000);
  }

  alert('🚨 SIREN ACTIVATED! Stay safe!');
}

console.log('✅ Walk With Me App Ready');
