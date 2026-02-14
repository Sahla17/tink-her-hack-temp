# ⚡ Walk With Me - Quick Start Guide

## 🎯 Get Started in 2 Minutes

### Step 1: Open the App
1. Navigate to the project folder: `c:\Users\User\Desktop\wwm3`
2. Double-click `index.html` or right-click → Open with → Browser
3. You should see the landing page with "Walk With Me" title

### Step 2: Create Your Profile
1. Click "Start Now" button
2. Fill in your information:
   - Full Name: Your name
   - Phone: Your phone number
   - Email: Your email
   - Contact Name: A trusted person's name
   - Contact Phone: Their phone number
   - Contact Email: Their email
3. Click "Continue to Contacts"

### Step 3: Add Emergency Contacts
1. You'll see your primary contact listed
2. (Optional) Click "+ Add Another Contact" to add more
3. Click "Save & Start Walking"

### Step 4: Start Your Walk
1. Click "Start Walk" button
2. Timer starts counting down from 5:00
3. You'll see these options:
   - "QUICK SOS" - Instant emergency
   - "Fake Call" - Simulate incoming call
   - "Share Trip" - Share your status
   - "Stop Walk" - End walk early

### Step 5: Safety Check (After 5 minutes)
A popup will appear asking "Are you safe?"
- Click "YES, I'm Safe" → Timer resets for another 5 minutes
- Click "NO, Help!" → Emergency triggers immediately
- No response in 30 seconds → Emergency auto-triggers

### Step 6: Emergency Mode
1. GPS location is captured
2. Google Maps link appears (clickable)
3. Alarm sound plays automatically
4. Email and SMS preview messages shown
5. Contacts can see your location
6. Click "I'm Safe Now" to end emergency

### Step 7: Success Screen
1. Celebration with confetti animation ✨
2. See your walk duration and safety checks
3. Click "Start Another Walk" or "Back to Home"

---

## 🧪 Try These Quick Tests

### Test 1: Safety Check (5 min timer)
```
Time: 5 minutes
Action: Start walking and wait (or edit walk.js line 8 to reduce timer)
Expected: Modal "Are you safe?" appears after 5 minutes
```

### Test 2: No Response Trigger (30 sec timeout)
```
Action: Walk → Wait 5 min → Modal appears → Do nothing
Expected: Emergency triggers after 30 seconds of no response
```

### Test 3: Quick SOS
```
Action: Click "QUICK SOS" button during walk
Expected: Immediately goes to emergency page
```

### Test 4: Fake Call
```
Action: Click "Fake Call" button
Expected: Call screen appears with ringtone and accept/reject buttons
```

### Test 5: Delete and Edit Data
```
Go to: Contacts page (in signup.html)
Actions: 
- Click ✏️ to edit a contact
- Click 🗑️ to delete a contact
- Add new contacts
Expected: Changes should save to localStorage
```

---

## 🎨 Customization Tips

### Change Timer Duration
Edit `js/walk.js` line 8:
```javascript
const WALK_DURATION = 300; // 300 seconds = 5 minutes
// Change to: const WALK_DURATION = 60; // for 1 minute testing
```

### Change Colors from Pink to Blue
Edit `css/styles.css`:
- Replace `#d946ef` (purple) with `#3b82f6` (blue)
- Replace `#ec4899` (pink) with `#0ea5e9` (cyan)

### Change App Name
Edit all HTML files:
- Replace "Walk With Me" with your app name
- Update logo emoji (currently 💜)

---

## 📊 Data Storage Test

### Check Your Saved Data
Open browser console (F12 → Console tab) and run:
```javascript
// View user profile
JSON.parse(localStorage.getItem('userProfile'))

// View emergency contacts
JSON.parse(localStorage.getItem('emergencyContacts'))

// Clear all data (for testing fresh start)
localStorage.clear()
```

---

## 🔧 File Structure

```
📁 wwm3/
├── 📄 index.html          ← START HERE
├── 📄 signup.html
├── 📄 contacts.html
├── 📄 walk.html
├── 📄 emergency.html
├── 📄 success.html
│
├── 📁 css/
│   └── 📄 styles.css
│
├── 📁 js/
│   ├── 📄 main.js          ← Shared utilities
│   ├── 📄 signup.js
│   ├── 📄 contacts.js
│   ├── 📄 walk.js          ← Main logic (timer, SOS)
│   ├── 📄 emergency.js     ← Emergency alerts & alarm
│   └── 📄 success.js       ← Confetti animation
│
├── 📁 assets/
│   ├── 📁 images/
│   └── 📁 sounds/
│
├── README.md              ← Full documentation
└── QUICKSTART.md          ← This file
```

---

## 🚀 Advanced Features

### Feature: Trip Sharing
- Click "Share Trip" button to share your status
- On desktop/desktop browser: Displays message
- On mobile: Uses native share dialog

### Feature: Multiple Contacts
- Add as many emergency contacts as needed
- All will receive notifications during emergency
- Edit or delete contacts anytime

### Feature: Geolocation
- Uses browser's geolocation API
- Requests permission on first use
- Falls back to demo coordinates if denied
- Generates Google Maps link automatically

### Feature: Web Audio Alarm
- Generated using Web Audio API (no MP3 needed)
- Different tones for ringtone vs emergency alarm
- Continuous until "Stop Alarm" is clicked

---

## ⚙️ Browser Requirements

✅ **Required:**
- Modern browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- localStorage enabled
- Geolocation API support

❌ **Not Required:**
- Internet (works offline)
- Backend server (data saved locally)
- Special plugins

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Page won't load" | Check file paths - make sure all files are in correct folders |
| "Styles not showing" | Hard refresh (Ctrl+Shift+R) or clear cache |
| "Geolocation popup not showing" | Some browsers need HTTPS. Use localhost or `file://` |
| "Audio not working" | Check browser volume, try different browser |
| "Data not saving" | Check if localStorage is enabled in browser settings |
| "Timer doesn't work" | Check browser console (F12) for errors |

---

## 🎓 Learning Value

This project teaches:
- ✅ HTML structure & semantic markup
- ✅ CSS animations & gradients
- ✅ Vanilla JavaScript (no framework)
- ✅ localStorage API
- ✅ Geolocation API
- ✅ Web Audio API
- ✅ Modal dialogs & form handling
- ✅ Timer & interval management
- ✅ Responsive & mobile-first design

---

## 💡 For Hackathon Judges

**What's Implemented:**
- ✅ Multi-page website structure (6 pages)
- ✅ 5-minute timer with safety checks
- ✅ 30-second no-response trigger
- ✅ Geolocation & Google Maps integration
- ✅ Email & SMS preview messages
- ✅ Emergency alarm sound
- ✅ Fake call decoy feature
- ✅ Quick SOS button
- ✅ Contact management system
- ✅ LocalStorage persistence
- ✅ Confetti celebration animation
- ✅ Responsive mobile design
- ✅ Beautiful UI with animations
- ✅ Production-ready code structure

**To Scale to Production:**
1. Add backend server (Node.js/Python)
2. Implement real SMS/Email (Twilio/SendGrid)
3. Add database (MongoDB/PostgreSQL)
4. Implement user authentication (JWT)
5. Add Google Maps API key
6. Add push notifications
7. Police dispatch integration
8. Real-time location tracking

---

**Enjoy testing Walk With Me! Stay Safe! 💜**
