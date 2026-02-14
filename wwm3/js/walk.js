// ============ WALK.JS ============
// Main walk timer and safety check logic

let timerInterval = null;
let modalCountdownInterval = null;
let timeRemaining = 300; // 5 minutes in seconds
let walkStartTime = null;
let walkActive = false;
let checksCount = 0;
let safetyCheckShown = false;
let noResponseTimeout = null;
let modalCountdownTime = 30;

const WALK_DURATION = 300; // 5 minutes
const NO_RESPONSE_TIME = 30; // 30 seconds


function updateTimerDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  document.getElementById('timerDisplay').textContent = 
    `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function startWalk() {
  walkActive = true;
  walkStartTime = Date.now();
  timeRemaining = WALK_DURATION;
  checksCount = 0;
  safetyCheckShown = false;
  
  document.getElementById('startBtn').classList.add('hidden');
  document.getElementById('stopBtn').classList.remove('hidden');
  document.getElementById('timerMessage').textContent = 'Walk active. Stay safe!';
  document.getElementById('statusBadge').classList.add('active');
  
  updateTimerDisplay();
  
  // Start main timer
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();
    
    // Show safety check modal at 0
    if (timeRemaining <= 0 && !safetyCheckShown) {
      safetyCheckShown = true;
      showSafetyModal();
    }
  }, 1000);
}

function stopWalk() {
  clearInterval(timerInterval);
  clearInterval(modalCountdownInterval);
  clearTimeout(noResponseTimeout);
  
  walkActive = false;
  document.getElementById('startBtn').classList.remove('hidden');
  document.getElementById('stopBtn').classList.add('hidden');
  document.getElementById('safetyModal').classList.remove('show');
  
  // Calculate walk duration
  const walkDuration = Math.floor((Date.now() - walkStartTime) / 1000);
  
  // Save walk stats and redirect to success page
  localStorage.setItem('lastWalkDuration', walkDuration);
  localStorage.setItem('lastChecksCount', checksCount);
  
  window.location.href = 'success.html';
}

function showSafetyModal() {
  const modal = document.getElementById('safetyModal');
  modal.classList.add('show');
  checksCount++;
  
  modalCountdownTime = NO_RESPONSE_TIME;
  
  // Start modal countdown
  modalCountdownInterval = setInterval(() => {
    modalCountdownTime--;
    document.getElementById('modalTimer').textContent = modalCountdownTime;
    
    if (modalCountdownTime <= 0) {
      clearInterval(modalCountdownInterval);
      triggerEmergency();
    }
  }, 1000);
  
  // Timeout for no response
  noResponseTimeout = setTimeout(() => {
    triggerEmergency();
  }, NO_RESPONSE_TIME * 1000);
}

function confirmSafe() {
  clearInterval(modalCountdownInterval);
  clearTimeout(noResponseTimeout);
  
  const modal = document.getElementById('safetyModal');
  modal.classList.remove('show');
  
  // Reset timer for next check
  timeRemaining = WALK_DURATION;
  safetyCheckShown = false;
  updateTimerDisplay();
  document.getElementById('timerMessage').textContent = '✓ You confirmed you\'re safe. Next check in 5 minutes.';
}

function triggerEmergency() {
  clearInterval(timerInterval);
  clearInterval(modalCountdownInterval);
  clearTimeout(noResponseTimeout);
  
  window.location.href = 'emergency.html';
}

function triggerSOS() {
  // Quick emergency trigger
  window.location.href = 'emergency.html';
}

function fakecall() {
  // Create fake call overlay
  const fakeCallHTML = `
    <div id="fakeCallOverlay" class="fake-call" onclick="rejectCall(event)">
      <div class="fake-call-content" onclick="event.stopPropagation()">
        <div class="caller-avatar">👩</div>
        <div class="caller-name">Mom Calling...</div>
        <div class="caller-status">Incoming Call</div>
        <div class="call-buttons">
          <button class="call-btn accept" onclick="acceptCall()">✓</button>
          <button class="call-btn reject" onclick="rejectCall()">✕</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', fakeCallHTML);
  
  // Play ringtone sound (using Web Audio API)
  playRingtone();
}

function acceptCall() {
  stopRingtone();
  const overlay = document.getElementById('fakeCallOverlay');
  if (overlay) overlay.remove();
  alert('Call accepted! Your mom is here. Stay safe! 💜');
}

function rejectCall(event) {
  if (event && event.target.id !== 'fakeCallOverlay') return;
  
  stopRingtone();
  const overlay = document.getElementById('fakeCallOverlay');
  if (overlay) overlay.remove();
}

let ringtoneOscillator = null;
let ringtoneGain = null;
let audioContext = null;

function playRingtone() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    
    // Create oscillators for ringtone
    for (let i = 0; i < 2; i++) {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.frequency.value = i === 0 ? 800 : 600;
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      gain.gain.setValueAtTime(0.3, now);
      osc.start(now);
      osc.stop(now + 0.3);
      
      if (i === 0) {
        ringtoneOscillator = osc;
        ringtoneGain = gain;
      }
    }
    
    // Loop ringtone
    setTimeout(playRingtone, 500);
  } catch (e) {
    console.log('Ringtone error:', e);
  }
}

function stopRingtone() {
  if (ringtoneOscillator) {
    try {
      ringtoneOscillator.stop();
    } catch (e) {}
  }
}

function shareTrip() {
  const user = JSON.parse(localStorage.getItem('userProfile'));
  const message = `I'm currently using Walk With Me for safety. My trusted contacts are notified. Share my location: https://maps.google.com/?q=my-location`;
  
  if (navigator.share) {
    navigator.share({
      title: 'Walk With Me - Trip Sharing',
      text: message
    }).catch(err => console.log('Share error:', err));
  } else {
    alert('Trip sharing:\n\n' + message);
  }
}

function goToPage(path) {
  clearInterval(timerInterval);
  clearInterval(modalCountdownInterval);
  clearTimeout(noResponseTimeout);
  window.location.href = path;
}

// Initialize on load
window.addEventListener('load', function() {
  updateTimerDisplay();
  
  // Check if user has profile
  if (!localStorage.getItem('userProfile')) {
    alert('Please complete your profile first');
    window.location.href = 'signup.html';
  }
});
