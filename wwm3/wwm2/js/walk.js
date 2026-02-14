// ============================================
// WALK WITH ME - Walk Mode Utilities
// ============================================

class WalkSession {
  constructor() {
    this.startTime = null;
    this.isActive = false;
    this.location = null;
    this.watchId = null;
    this.safetyCheckInterval = 30000; // 30 seconds
  }

  start() {
    this.startTime = Date.now();
    this.isActive = true;
    this.captureLocation();
  }

  stop() {
    this.isActive = false;
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  captureLocation() {
    if (!navigator.geolocation) {
      console.warn('Geolocation not available');
      return;
    }

    // Watch position - continuous updates
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        };
        console.log('📍 Location updated:', this.location);
      },
      (error) => {
        console.warn('⚠️ Geolocation error:', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  getElapsedTime() {
    if (!this.isActive || !this.startTime) return 0;
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  getLocationUrl() {
    if (!this.location) return null;
    return `https://maps.google.com/?q=${this.location.latitude},${this.location.longitude}`;
  }

  getSessionData() {
    return {
      duration: this.getElapsedTime(),
      location: this.location,
      startTime: this.startTime
    };
  }
}

// Global walk session instance
const walkSession = new WalkSession();

// ===== SAFETY CHECK MANAGER =====

class SafetyCheckManager {
  constructor() {
    this.lastCheckTime = null;
    this.checkInterval = 30000; // 30 seconds
    this.pendingCheck = false;
  }

  shouldShowCheck() {
    const now = Date.now();
    if (this.lastCheckTime === null) return true;
    return (now - this.lastCheckTime) >= this.checkInterval;
  }

  markCheckShown() {
    this.lastCheckTime = Date.now();
    this.pendingCheck = true;
  }

  markCheckResponded() {
    this.pendingCheck = false;
    this.lastCheckTime = Date.now();
  }

  hasOutstandingCheck() {
    return this.pendingCheck;
  }

  resetChecks() {
    this.lastCheckTime = null;
    this.pendingCheck = false;
  }
}

const safetyCheckManager = new SafetyCheckManager();

// ===== EMERGENCY UTILITIES =====

class EmergencyAlert {
  constructor(username, contacts, location) {
    this.username = username;
    this.contacts = contacts;
    this.location = location;
    this.timestamp = new Date().toISOString();
  }

  getMapUrl() {
    if (!this.location) return null;
    return `https://maps.google.com/?q=${this.location.latitude},${this.location.longitude}`;
  }

  generateSMSMessage() {
    const mapUrl = this.getMapUrl();
    if (mapUrl) {
      return `🚨 Emergency! ${this.username} may be unsafe. Check their location: ${mapUrl}`;
    }
    return `🚨 Emergency! ${this.username} has sent an emergency alert. Please contact them immediately.`;
  }

  generateEmailMessage() {
    const mapUrl = this.getMapUrl();
    return {
      subject: `Emergency Alert from ${this.username}`,
      body: `${this.username} has triggered an emergency alert and may be in danger.
      
Timestamp: ${this.timestamp}
${mapUrl ? `Live Location: ${mapUrl}` : 'Location data unavailable'}

Please check on them immediately and call emergency services if needed.`
    };
  }

  getAlertLog() {
    return {
      timestamp: this.timestamp,
      username: this.username,
      contacts: this.contacts.map(c => c.name + ' (' + c.phone + ')'),
      location: this.location,
      mapUrl: this.getMapUrl(),
      smsMessage: this.generateSMSMessage(),
      emailMessage: this.generateEmailMessage()
    };
  }

  // Simulate sending alerts (in real app, connect to backend)
  async sendAlerts() {
    console.log('📤 Sending emergency alerts...');
    console.log(this.getAlertLog());

    // Simulate API calls
    for (const contact of this.contacts) {
      await this.simulateSMSSend(contact);
      await this.simulateEmailSend(contact);
    }

    console.log('✅ All alerts sent');
    return this.getAlertLog();
  }

  async simulateSMSSend(contact) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`📱 SMS sent to ${contact.name}: ${contact.phone}`);
        resolve(true);
      }, 500);
    });
  }

  async simulateEmailSend(contact) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`📧 Email sent to ${contact.name}`);
        resolve(true);
      }, 500);
    });
  }
}

// ===== GPS LOCATION HELPER =====

class LocationHelper {
  static async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString()
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  static getMapUrl(latitude, longitude) {
    return `https://maps.google.com/?q=${latitude},${longitude}`;
  }

  static formatCoordinates(location) {
    if (!location) return 'Location unavailable';
    return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
  }

  static getDistance(lat1, lon1, lat2, lon2) {
    // Haversine formula for distance between two points
    const R = 6371; // Radius of earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }
}

// ===== TIMER UTILITIES =====

class TimerFormatter {
  static format(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  }

  static formatCountdown(seconds) {
    return `${Math.max(0, seconds)}s`;
  }
}

// ===== DATA PERSISTENCE =====

class WalkLogger {
  static logWalk(walkData) {
    const walks = JSON.parse(localStorage.getItem('walkHistory') || '[]');
    walks.push({
      ...walkData,
      id: Date.now()
    });
    localStorage.setItem('walkHistory', JSON.stringify(walks));
  }

  static getWalkHistory() {
    return JSON.parse(localStorage.getItem('walkHistory') || '[]');
  }

  static logEmergency(emergencyData) {
    const emergencies = JSON.parse(localStorage.getItem('emergencyLog') || '[]');
    emergencies.push({
      ...emergencyData,
      id: Date.now()
    });
    localStorage.setItem('emergencyLog', JSON.stringify(emergencies));
  }

  static getEmergencyLog() {
    return JSON.parse(localStorage.getItem('emergencyLog') || '[]');
  }

  static clearHistory() {
    localStorage.removeItem('walkHistory');
    localStorage.removeItem('emergencyLog');
  }
}

console.log('✅ Walk utilities loaded');

