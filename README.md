<p align="center">
  <img src="./img.png" alt="Project Banner" width="100%">
</p>

WALK WITH ME 🎯
Basic Details

Team Name: LYORA

Team Members
- Member 1: Sahla Nasrin cp - jyothi engineering college
- Member 2: Shahanas Ruksana C P - jyothi engineering college

Hosted Project Link
https://deluxe-conkies-3f9a16.netlify.app/

 Project Description
"Walk With Me: Stay safe on every walk. If you don’t check in, your trusted contacts get your live location instantly."

The Problem statement
“Walk With Me monitors your walk and sends automatic alerts to trusted contacts with your live location if you don’t confirm you’re safe.”

 The Solution
“Walking alone can feel unsafe, stressful, and unpredictable. Our app ‘Walk With Me’ ensures your safety by alerting trusted contacts with your live location if you don’t check in.”


---

Technical Details

Technologies/Components Used

For Software:
- Languages used: JavaScript, HTML,CSS
- Frameworks used: none
- Libraries used: none
- Tools used: V S code,Windows OS

 Features

List the key features of your project:
- Feature 1: Automatic Safety Check Timer
Periodically prompts the user at fixed intervals to confirm their safety, ensuring continuous monitoring during solo walks.
- Feature 2: Emergency SOS Activation
Instantly triggers emergency mode through an SOS button, lack of response to safety prompts, or voice detection phrases like “help me”.
- Feature 3: Live Location Sharing
Automatically fetches the user’s real-time GPS location and sends a Google Maps live link to pre-configured emergency contacts.
- Feature 4: Email & SMS Alert System
Sends emergency notifications via Email and SMS using a Promise-based workflow to guarantee delivery confirmation before user notification

---

 Implementation

 For Software:

Installation
```bash
 Clone the repository
git clone https://github.com/your-username/walk-with-me.git

 Move into the project directory
cd walk-with-me

```

Run
```bash
 Open the project
 Option 1: Open index.html directly in your browser
index.html

 Option 2 (Recommended): Run using Live Server in VS Code
 Right-click index.html → Open with Live Server

``

---

## Project Documentation

### For Software:

#### Screenshots (Add at least 3)

[<img width="1920" height="1080" alt="Screenshot (3)" src="https://github.com/user-attachments/assets/06c7ce6b-e916-43bb-9dab-3664702ed085" />
]

[<img width="1920" height="1080" alt="Screenshot (4)" src="https://github.com/user-attachments/assets/ef86b731-b838-4aeb-a496-c456b2cd7211" />
]

[<img width="1920" height="1080" alt="Screenshot (5)" src="https://github.com/user-attachments/assets/806114a7-acf2-43e5-ba3f-d94a5d86cfb4" />
]

 Diagrams

System Architecture:

[┌─────────────────────┐
│        User         │
│ (Mobile / Desktop)  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   Walk With Me UI   │
│ (HTML, CSS, JS)     │
│ - Landing Page      │
│ - Sign Up Page      │
│ - Walk Screen       │
│ - SOS Popup         │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────────────────────┐
│        Application Logic Layer       │
│  (JavaScript – Promise Based)        │
│                                     │
│  - Safety Timer Logic                │
│  - SOS Trigger Handler               │
│  - Voice Detection Handler           │
│  - Popup & Alarm Controller          │
└─────────┬───────────┬───────────────┘
          │           │
          ▼           ▼
┌────────────────┐  ┌─────────────────────┐
│ Geolocation API│  │   Web Speech API     │
│ (Live GPS)     │  │ (Voice Detection)   │
└─────────┬──────┘  └─────────┬──────────┘
          │                   │
          ▼                   ▼
┌─────────────────────────────────────┐
│     Emergency Alert Service          │
│  (Mock Email & SMS – Promise Based)  │
│                                     │
│  - Email Alert                       │
│  - SMS Alert                         │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Emergency Contacts  │
│ (Receive Location)  │
└─────────────────────┘
]

Application Workflow:

[Start
  │
  ▼
Open Walk With Me Website
  │
  ▼
Click "Start Walk"
  │
  ▼
User Sign-Up
  │
  ▼
Safety Timer Starts (5 Minutes)
  │
  ▼
Popup: "Are you safe?"
  │
  ├── YES ──► Reset Timer ──► Continue Walk
  │
  └── NO / No Response / Voice "Help Me"
              │
              ▼
        Emergency Mode Activated
              │
              ▼
      Fetch Live GPS Location
              │
              ▼
   Generate Google Maps Link
              │
              ▼
 Send Email + SMS to Emergency Contact
              │
              ▼
 Show Confirmation Popup
 ("Your live location has been sent.
  Stay calm, help is on the way.")
              │
              ▼
        Alarm Sound Plays
              │
              ▼
             End
]

 Project Demo

 Video
[Add your demo video link here - YouTube, Google Drive, etc.]

*Explain what the video demonstrates - key features, user flow, technical highlights*

### Additional Demos
[Add any extra demo materials/links - Live site, APK download, online demo, etc.]

---

## AI Tools Used (Optional - For Transparency Bonus)

If you used AI tools during development, document them here for transparency:

**Tool Used:** [e.g., GitHub Copilot, v0.dev, Cursor, ChatGPT, Claude]

**Purpose:** [What you used it for]
- Example: "Generated boilerplate React components"
- Example: "Debugging assistance for async functions"
- Example: "Code review and optimization suggestions"

**Key Prompts Used:**
- "Create a REST API endpoint for user authentication"
- "Debug this async function that's causing race conditions"
- "Optimize this database query for better performance"

**Percentage of AI-generated code:** [Approximately X%]

**Human Contributions:**
- Architecture design and planning
- Custom business logic implementation
- Integration and testing
- UI/UX design decisions

*Note: Proper documentation of AI usage demonstrates transparency and earns bonus points in evaluation!*

---

## Team Contributions

- [Name 1]: [Specific contributions - e.g., Frontend development, API integration, etc.]
- [Name 2]: [Specific contributions - e.g., Backend development, Database design, etc.]
- [Name 3]: [Specific contributions - e.g., UI/UX design, Testing, Documentation, etc.]

---

## License

This project is licensed under the [LICENSE_NAME] License - see the [LICENSE](LICENSE) file for details.

**Common License Options:**
- MIT License (Permissive, widely used)
- Apache 2.0 (Permissive with patent grant)
- GPL v3 (Copyleft, requires derivative works to be open source)

---

Made with ❤️ at TinkerHub
