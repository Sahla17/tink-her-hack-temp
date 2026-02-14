# Walk With Me - Women Safety Website 💜

A comprehensive, mobile-first women safety website built with vanilla HTML, CSS, and JavaScript. The app provides real-time safety monitoring with emergency alerts, GPS tracking, and trusted contact notifications.

## 🎯 Features

### Core Features
- ✅ **5-Minute Safety Check Timer** - Automatic periodic safety checks while walking
- ✅ **No Response Trigger** - Emergency triggers if user doesn't respond within 30 seconds
- ✅ **GPS Geolocation** - Real-time location tracking and Google Maps integration
- ✅ **Emergency Alerts** - Email and SMS preview notifications to contacts
- ✅ **Fake Call Decoy** - Simulate incoming call to appear busy (for safety)
- ✅ **Quick SOS Button** - Instant emergency activation
- ✅ **Trip Sharing** - Share trip status with trusted contacts
- ✅ **Emergency Alarm** - Web Audio API alarm sound during emergencies
- ✅ **Contact Management** - Add and manage multiple emergency contacts
- ✅ **LocalStorage Persistence** - All user data saved locally
- ✅ **Confetti Animation** - Celebration on safe arrival

## 📂 Project Structure

```
walk-with-me/
│
├── index.html                 # Landing Page
├── signup.html                # User Profile Creation
├── contacts.html              # Emergency Contacts Management
├── walk.html                  # Main Walk Timer Screen
├── emergency.html             # Emergency Alert Screen
├── success.html               # Safe Arrival Success Screen
│
├── css/
│   └── styles.css             # Main stylesheet with animations
│
├── js/
│   ├── main.js                # Shared utilities
│   ├── signup.js              # Profile signup logic
│   ├── contacts.js            # Contact management
│   ├── walk.js                # Timer and safety check logic
│   ├── emergency.js           # Emergency alert functionality
│   └── success.js             # Success screen and confetti
│
├── assets/
│   ├── images/                # Store image assets
│   └── sounds/                # Store audio files
│
├── script.js                  # Main shared utilities (root reference)
├── styles.css                 # Root reference to CSS
└── README.md                  # This file

```

## 🚀 Getting Started

### 1. **Open the Application**
Simply open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge).

### 2. **Landing Page**
- Welcome screen with app branding
- Click "Start Now" to proceed to signup

### 3. **Create Profile** (signup.html)
- Enter your name, phone, and email
- Add a primary emergency contact (name, phone, email)
- Data is saved to localStorage
- Click "Continue to Contacts"

### 4. **Manage Contacts** (contacts.html)
- View your primary emergency contact
- Add additional emergency contacts (2-3 recommended)
- Edit or delete contacts as needed
- Click "Save & Start Walking" to proceed

### 5. **Walk Screen** (walk.html)
- Click "Start Walk" to begin
- 5-minute timer starts automatically
- Shows "Trip Sharing Active" status badge
- After 5 minutes, "Are you safe?" popup appears
  - Click YES to reset timer for another 5 minutes
  - Click NO for instant emergency
  - No response (30 seconds) triggers emergency auto

### 6. **Emergency Mode** (emergency.html)
- Display your GPS location coordinates
- Google Maps link for easy sharing
- Email and SMS preview messages
- Emergency alarm sound plays automatically
- Buttons to stop alarm or confirm you're safe

### 7. **Success Screen** (success.html)
- Celebration message with confetti animation
- Walking duration and safety checks count
- Option to start another walk or return home

## 🎨 Design Features

- **Feminine Gradient Theme**: Pink/Purple color scheme throughout
- **Smooth Animations**: Page transitions, button effects, confetti
- **Mobile-First**: Responsive design works on all screen sizes
- **Modern UI**: Soft shadows, rounded corners, gradient elements
- **Real App Feel**: Looks and behaves like a native mobile app
- **Accessibility**: Clear readability and intuitive navigation

## 💾 Data Storage

All data is stored in browser's localStorage:

```javascript
// User Profile
localStorage.userProfile = {
  fullName: string,
  phoneNumber: string,
  email: string,
  primaryContact: {
    name: string,
    phone: string,
    email: string
  }
}

// Emergency Contacts Array
localStorage.emergencyContacts = [
  { name, phone, email },
  { name, phone, email }
]

// Walk Stats
localStorage.lastWalkDuration = number (seconds)
localStorage.lastChecksCount = number
```

## 🔧 Technical Implementation

### Key JavaScript Features

1. **Timer Logic** (`walk.js`)
   - 5-minute countdown using `setInterval`
   - Modal popup with 30-second countdown
   - Auto-trigger after no response

2. **Geolocation** (`emergency.js`)
   - Browser Geolocation API integration
   - Fallback coordinates for demo
   - Google Maps link generation

3. **Web Audio API** (`emergency.js`, `walk.js`)
   - Sinusoidal alarm tone generation
   - Fake ringtone sound creation
   - No external audio files needed

4. **Animations** (`styles.css`)
   - CSS keyframes for all transitions
   - Smooth page opening animations
   - Continuous pulse and glow effects
   - Confetti falling animation

5. **LocalStorage** (all JS files)
   - Profile and contact persistence
   - Walk statistics tracking
   - Session data retention

## 📱 Responsive Design

- Works on mobile phones (320px+)
- Tablet optimization
- Desktop compatibility
- Touch-friendly buttons
- Portrait and landscape support

## 🔒 Privacy & Security Notes

### Current Implementation (Demo)
- All data stored locally in browser
- No server communication
- SMS/Email are preview only
- Coordinates are demo-based fallback

### For Production Use
Replace these sections:
```javascript
// In emergency.js - Line 91
getGeolocation() function - Connect to real geolocation

// In emergency.js - Email/SMS generation
Integrate with actual email service (Twilio, SendGrid, AWS SES)
Integrate with SMS service (Twilio, AWS SNS)

// Add backend API
- Secure user authentication
- Server-side emergency notification system
- Real-time contact notification
- Police dispatch integration option
```

## ⚡ Browser Compatibility

- ✅ Chrome (v60+)
- ✅ Firefox (v55+)
- ✅ Safari (v12+)
- ✅ Edge (v79+)
- ✅ Mobile browsers (iOS Safari, Chrome)

### Required APIs
- Geolocation API
- localStorage API
- Web Audio API
- ES6 JavaScript

## 🎮 How to Test Each Feature

### Test Timer & Safety Check
1. Start walk
2. Wait 5 minutes (can speed up by editing `WALK_DURATION` in walk.js)
3. Modal appears asking "Are you safe?"
4. Click YES to reset timer
5. Click NO to trigger emergency

### Test No Response Trigger
1. Start walk
2. Wait 5 minutes for modal
3. Do NOT click any button
4. After 30 seconds, emergency auto-triggers

### Test Emergency Alert
1. Click "QUICK SOS" button
2. Emergency page shows with alarm
3. Location and messages are displayed
4. Click "I'm Safe Now" to reset

### Test Fake Call
1. During walk, click "Fake Call"
2. Call screen appears with ringtone
3. Click accept/reject to end call

## 🚨 Security Considerations

1. **Never store sensitive data in localStorage for production**
   - Use encrypted servers
   - Implement proper authentication
   - Use HTTPS only

2. **Emergency data should be encrypted**
   - Use secure communication protocols
   - Never log sensitive information

3. **Geolocation privacy**
   - Request user permission explicitly
   - Allow users to opt-out
   - Clear location data after use

## 📚 Customization Guide

### Change Timer Duration
In `js/walk.js`, line 8:
```javascript
const WALK_DURATION = 300; // Change from 300 (5 min) to your desired seconds
```

### Change No Response Time
In `js/walk.js`, line 9:
```javascript
const NO_RESPONSE_TIME = 30; // Change from 30 seconds
```

### Change Colors
In `css/styles.css`:
```css
/* Pink/Purple gradient */
--primary: #d946ef;
--secondary: #ec4899;
```

### Add More Contacts
In `js/contacts.js` - the system already supports unlimited contacts
Just keep clicking "+ Add Another Contact"

## 🐛 Troubleshooting

### Geolocation not working
- Check browser permissions
- Must be on HTTPS (or localhost for testing)
- Click "Allow" when prompted

### Audio/Alarm not working
- Check browser audio settings
- Ensure volume is not muted
- Try different browser

### LocalStorage not persisting
- Check if private/incognito mode
- Check if localStorage is disabled
- Clear cache and reload

## 📝 License

This is a hackathon demo project. Feel free to modify and use as needed.

## 👩‍💻 About

Walk With Me is designed to provide women with a simple, effective safety tool while commuting or walking. The app is built entirely with vanilla JavaScript, making it lightweight and easy to customize for different regions or use cases.

**Stay Safe. Walk With Me. 💜**

---

### Quick Test Credentials

**Demo User:**
- Name: Sarah Johnson
- Phone: 555-0100
- Email: sarah@example.com

**Demo Emergency Contact:**
- Name: Mom
- Phone: 555-0101
- Email: mom@example.com
