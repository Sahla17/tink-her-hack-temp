// ============ MAIN.JS ============
// Shared utilities and helper functions

// Check if user is logged in
function checkUserProfile() {
  return localStorage.getItem('userProfile') !== null;
}

// Get current user data
function getUserProfile() {
  return JSON.parse(localStorage.getItem('userProfile'));
}

// Get emergency contacts
function getEmergencyContacts() {
  return JSON.parse(localStorage.getItem('emergencyContacts')) || [];
}

// Clear all user data
function clearAllData() {
  localStorage.removeItem('userProfile');
  localStorage.removeItem('emergencyContacts');
  localStorage.removeItem('lastWalkDuration');
  localStorage.removeItem('lastChecksCount');
}

// Navigate to page
function goToPage(path) {
  window.location.href = path;
}

// Format phone number
function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

// Check browser capabilities
function checkBrowserCapabilities() {
  return {
    geolocation: !!navigator.geolocation,
    localStorage: typeof(Storage) !== 'undefined',
    audioAPI: !!(window.AudioContext || window.webkitAudioContext),
    vibration: !!navigator.vibrate
  };
}

// Request vibration (for mobile)
function vibrate(pattern = 200) {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

console.log('Walk With Me - Safety App Initialized');
