// ============================================
// WALK WITH ME - Main Application Logic
// ============================================

// ===== SCREEN NAVIGATION =====
function showScreen(screenId) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  // Show selected screen
  document.getElementById(screenId).classList.add('active');
}

function goToSignup() {
  showScreen('signup-screen');
  loadUserDataToForm();
}

function goToDashboard() {
  showScreen('dashboard-screen');
  updateDashboard();
}

function goToWalk() {
  if (!hasRequiredData()) {
    alert('Please complete your profile and add emergency contacts first');
    return;
  }
  showScreen('walk-screen');
  startWalkMode();
}

function goToShareTrip() {
  showScreen('share-trip-screen');
  updateShareTrip();
}

function backToDashboard() {
  walkActive = false;
  if (walkTimer) clearInterval(walkTimer);
  stopWalkMode();
  showScreen('dashboard-screen');
  updateDashboard();
}

function hasRequiredData() {
  const profile = localStorage.getItem('userProfile');
  const contacts = localStorage.getItem('userContacts');
  return profile && contacts && JSON.parse(contacts).length > 0;
}

// ===== PROFILE & CONTACTS MANAGEMENT =====

let emergencyContacts = [];

function loadUserData() {
  const stored = localStorage.getItem('userContacts');
  if (stored) {
    emergencyContacts = JSON.parse(stored);
    renderContacts();
  }
}

function loadUserDataToForm() {
  loadUserData();
  const user = JSON.parse(localStorage.getItem('userProfile')) || {};
  
  document.getElementById('name').value = user.name || '';
  document.getElementById('email').value = user.email || '';
  document.getElementById('phone').value = user.phone || '';
}

function addContact() {
  const name = document.getElementById('contactName').value.trim();
  const phone = document.getElementById('contactPhone').value.trim();
  
  if (!name || !phone) {
    alert('Please enter contact name and phone number');
    return;
  }
  
  emergencyContacts.push({ name, phone });
  document.getElementById('contactName').value = '';
  document.getElementById('contactPhone').value = '';
  
  renderContacts();
  playSound('success');
}

function removeContact(index) {
  emergencyContacts.splice(index, 1);
  renderContacts();
}

function renderContacts() {
  const container = document.getElementById('contactsList');
  
  if (emergencyContacts.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 20px;">No contacts added yet</p>';
    return;
  }
  
  container.innerHTML = emergencyContacts.map((contact, idx) => `
    <div class="contact-item">
      <div>
        <strong>${contact.name}</strong>
        <small>${contact.phone}</small>
      </div>
      <button class="btn btn-remove btn-sm" onclick="removeContact(${idx})">Remove</button>
    </div>
  `).join('');
}

// ===== SIGNUP FORM SUBMISSION =====

document.addEventListener('DOMContentLoaded', () => {
  loadUserData();
  
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      
      if (!name || !email || !phone) {
        alert('Please fill all fields');
        return;
      }
      
      if (emergencyContacts.length === 0) {
        alert('Please add at least one emergency contact');
        return;
      }
      
      // Save to localStorage
      localStorage.setItem('userProfile', JSON.stringify({ name, email, phone }));
      localStorage.setItem('userContacts', JSON.stringify(emergencyContacts));
      
      playSound('success');
      goToDashboard();
    });
  }
});

// ===== DASHBOARD =====

function updateDashboard() {
  const user = JSON.parse(localStorage.getItem('userProfile')) || { name: 'Friend' };
  document.getElementById('welcomeName').textContent = user.name;
}

// ===== WALK MODE (Imported from walk.js) =====

let walkActive = false;
let walkTimer = null;
let currentLocation = null;
const SAFETY_CHECK_INTERVAL = 300000; // 5 minutes
const GRACE_PERIOD = 30000; // 30 seconds to respond

function startWalkMode() {
  walkActive = true;
  let timeInWalk = 0;
  
  // Request location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        };
        console.log('📍 Location acquired:', currentLocation);
      },
      (error) => {
        console.warn('Location access:', error.message);
      }
    );
  }
  
  // Update timer
  walkTimer = setInterval(() => {
    if (walkActive) {
      timeInWalk++;
      const mins = Math.floor(timeInWalk / 60);
      const secs = timeInWalk % 60;
      document.getElementById('timerDisplay').textContent = 
        `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  }, 1000);
  
  // Schedule first safety check
  setTimeout(showSafetyCheck, SAFETY_CHECK_INTERVAL);
}

function stopWalkMode() {
  if (walkTimer) clearInterval(walkTimer);
}

function showSafetyCheck() {
  if (!walkActive) return;
  
  playSound('alert');
  document.getElementById('safetyModal').classList.add('active');
  
  // Grace period countdown
  let countdown = 30;
  const countdownEl = document.getElementById('graceCountdown');
  
  const countdownTimer = setInterval(() => {
    countdown--;
    countdownEl.textContent = countdown;
    
    if (countdown <= 0) {
      clearInterval(countdownTimer);
      if (document.getElementById('safetyModal').classList.contains('active')) {
        document.getElementById('safetyModal').classList.remove('active');
        triggerEmergency();
      }
    }
  }, 1000);
}

function respondSafe() {
  document.getElementById('safetyModal').classList.remove('active');
  playSound('success');
  
  // Schedule next check
  if (walkActive) {
    setTimeout(showSafetyCheck, SAFETY_CHECK_INTERVAL);
  }
}

function stopWalk() {
  walkActive = false;
  if (walkTimer) clearInterval(walkTimer);
  playSound('success');
  showScreen('success-screen');
}

function triggerEmergencyFromWalk() {
  walkActive = false;
  if (walkTimer) clearInterval(walkTimer);
  document.getElementById('safetyModal').classList.remove('active');
  triggerEmergency();
}

function triggerEmergencyFromModal() {
  walkActive = false;
  if (walkTimer) clearInterval(walkTimer);
  document.getElementById('safetyModal').classList.remove('active');
  triggerEmergency();
}

// ===== EMERGENCY ALERT =====

function triggerEmergency() {
  walkActive = false;
  playSound('alarm');
  
  // Get location if needed
  if (!currentLocation && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        displayEmergencyScreen();
      },
      () => {
        displayEmergencyScreen();
      }
    );
  } else {
    displayEmergencyScreen();
  }
}

function displayEmergencyScreen() {
  const user = JSON.parse(localStorage.getItem('userProfile')) || { name: 'User' };
  const contacts = JSON.parse(localStorage.getItem('userContacts')) || [];
  
  if (currentLocation) {
    const mapUrl = `https://maps.google.com/?q=${currentLocation.latitude},${currentLocation.longitude}`;
    document.getElementById('mapLink').href = mapUrl;
    document.getElementById('mapLink').textContent = '📍 View Live Location on Maps';
    document.getElementById('locationInfo').textContent = 
      `📍 ${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}`;
    
    const smsMsg = `🚨 Emergency! I may be unsafe. Check my location: ${mapUrl}`;
    const emailMsg = `Subject: Emergency Alert from ${user.name}\n\nI may be in danger. Please call for help.\n\nLive Location: ${mapUrl}`;
    
    document.getElementById('smsPreview').textContent = smsMsg;
    document.getElementById('emailPreview').textContent = emailMsg;
  } else {
    document.getElementById('locationInfo').textContent = '📍 Location unavailable - emergency still sent';
    document.getElementById('mapLink').style.display = 'none';
  }
  
  // Simulate sending alerts
  console.log('🚨 EMERGENCY ALERT SENT');
  console.log('User:', user.name, user.email);
  console.log('Contacts:', contacts);
  console.log('Location:', currentLocation);
  
  showScreen('emergency-screen');
}

// ===== FAKE CALL =====

function triggerFakeCall() {
  playSound('phone-ring');
  showScreen('fake-call-screen');
}

function acceptFakeCall() {
  playSound('call-connected');
  alert('✅ Call accepted! You\'re safe. Good use of your fake call feature!');
  backToDashboard();
}

function declineFakeCall() {
  playSound('success');
  alert('📞 Call declined. Stay safe!');
  backToDashboard();
}

// ===== QUICK SOS =====

function triggerQuickSOS() {
  if (confirm('⚠️ Trigger immediate emergency alert?')) {
    triggerEmergency();
  }
}

// ===== SHARE TRIP =====

let shareTimer = 0;
let shareTimerInterval = null;

function updateShareTrip() {
  // Start timer simulation
  shareTimer = 0;
  if (shareTimerInterval) clearInterval(shareTimerInterval);
  
  shareTimerInterval = setInterval(() => {
    shareTimer++;
    const mins = Math.floor(shareTimer / 60);
    const secs = shareTimer % 60;
    document.getElementById('shareTimer').textContent = 
      `⏱️ ${mins}:${secs.toString().padStart(2, '0')}`;
  }, 1000);
  
  // Simulate live location
  if (!currentLocation && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      currentLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      updateShareDisplay();
    });
  } else {
    updateShareDisplay();
  }
}

function updateShareDisplay() {
  if (currentLocation) {
    const mapUrl = `https://maps.google.com/?q=${currentLocation.latitude},${currentLocation.longitude}`;
    document.getElementById('shareLocation').textContent = 
      `📍 ${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}`;
    document.getElementById('shareLink').innerHTML = 
      `<a href="${mapUrl}" target="_blank" style="word-break: break-all;">View on Google Maps →</a>`;
  }
}

function copyLink() {
  const link = document.getElementById('shareLink').querySelector('a')?.href || 'No link available';
  if (link !== 'No link available') {
    navigator.clipboard.writeText(link).then(() => {
      playSound('success');
      alert('✅ Link copied to clipboard!');
    });
  } else {
    alert('No location available to share');
  }
}

// ===== DATA MANAGEMENT =====

function clearData() {
  if (confirm('⚠️ This will delete all your data. Are you sure?')) {
    localStorage.clear();
    emergencyContacts = [];
    currentLocation = null;
    showScreen('landing-screen');
    playSound('success');
  }
}

// ===== SOUND EFFECTS =====

function playSound(type) {
  // Will be enhanced in audio.js
  if (window.playAudio) {
    window.playAudio(type);
  }
}
