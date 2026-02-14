// ============ EMERGENCY.JS ============
// Emergency alert screen and notifications

let alarmInterval = null;
let audioContext = null;

function generateGoogleMapsLink(latitude, longitude) {
  return `https://maps.google.com/?q=${latitude},${longitude}`;
}

function getGeolocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          resolve({ lat, lon });
        },
        function(error) {
          console.log('Geolocation error:', error);
          // Fallback coordinates for demo
          resolve({ lat: 40.7128, lon: -74.0060 });
        }
      );
    } else {
      // Fallback for demo
      resolve({ lat: 40.7128, lon: -74.0060 });
    }
  });
}

async function initializeEmergency() {
  const user = JSON.parse(localStorage.getItem('userProfile'));
  const contacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];
  const location = await getGeolocation();
  
  const mapsLink = generateGoogleMapsLink(location.lat, location.lon);
  const time = new Date().toLocaleTimeString();
  
  // Update location info
  document.getElementById('locationCoords').innerHTML = 
    `<strong>Latitude:</strong> ${location.lat.toFixed(4)}<br><strong>Longitude:</strong> ${location.lon.toFixed(4)}`;
  
  document.getElementById('mapsLink').href = mapsLink;
  
  // Generate email message
  const emailMessage = `
Hello,<br><br>
This is an automatic safety alert from <strong>Walk With Me</strong>.<br><br>
<strong>User:</strong> ${user.fullName}<br>
<strong>Phone:</strong> ${user.phoneNumber}<br>
<strong>Location:</strong> <a href="${mapsLink}" target="_blank">View on Google Maps</a><br>
<strong>Coordinates:</strong> ${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}<br>
<strong>Time:</strong> ${time}<br><br>
<strong>Status:</strong> No response to safety check or emergency triggered.<br><br>
Please contact this person immediately and ensure they are safe.<br>
<strong>In case of life-threatening emergency, call 911/Emergency Services.</strong>
  `.trim();
  
  document.getElementById('emailMessage').innerHTML = emailMessage.replace(/\n/g, '<br>');
  
  // Generate SMS message
  const smsMessage = `🚨 EMERGENCY ALERT 🚨\n${user.fullName} didn't respond to safety check.\n📍 Location: ${mapsLink}\nTime: ${time}\nPlease contact immediately!`;
  document.getElementById('smsMessage').textContent = smsMessage;
  
  // Start alarm
  playEmergencyAlarm();
}

function playEmergencyAlarm() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    function playAlarmSound() {
      if (!audioContext) return;
      
      const now = audioContext.currentTime;
      const freq1 = audioContext.createOscillator();
      const freq2 = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      freq1.frequency.value = 1046; // High frequency
      freq2.frequency.value = 523;  // Lower frequency
      gain.gain.setValueAtTime(0.3, now);
      
      freq1.connect(gain);
      freq2.connect(gain);
      gain.connect(audioContext.destination);
      
      freq1.start(now);
      freq2.start(now);
      freq1.stop(now + 0.2);
      freq2.stop(now + 0.2);
    }
    
    // Play alarm every 400ms
    alarmInterval = setInterval(playAlarmSound, 400);
    playAlarmSound(); // Play immediately
    
    // Flash the alert icon
    const alertIcon = document.getElementById('alertIcon');
    setInterval(() => {
      alertIcon.style.opacity = alertIcon.style.opacity === '0.3' ? '1' : '0.3';
    }, 300);
    
  } catch (e) {
    console.log('Audio error:', e);
  }
}

function stopAlarm() {
  if (alarmInterval) {
    clearInterval(alarmInterval);
    alarmInterval = null;
  }
  
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
  
  document.getElementById('alertIcon').style.opacity = '1';
}

function confirmSafeEmergency() {
  stopAlarm();
  
  // Clear walking data
  localStorage.removeItem('lastWalkDuration');
  localStorage.removeItem('lastChecksCount');
  
  window.location.href = 'success.html';
}

// Initialize on page load
window.addEventListener('load', function() {
  initializeEmergency();
});

// Clean up on page unload
window.addEventListener('beforeunload', function() {
  stopAlarm();
});

function goToPage(path) {
  stopAlarm();
  window.location.href = path;
}
