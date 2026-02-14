// ===== EMERGENCY CONTACTS PAGE LOGIC =====

let emergencyContacts = [];

// Load contacts from localStorage
function loadContacts() {
  emergencyContacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];
  renderContacts();
  updateProceedButton();
}

// Render contacts list
function renderContacts() {
  const contactsList = document.getElementById('contactsList');
  
  if (emergencyContacts.length === 0) {
    contactsList.innerHTML = '<p style="color: #888; padding: 20px 0;">No contacts added yet.</p>';
    return;
  }

  contactsList.innerHTML = emergencyContacts.map((contact, index) => `
    <div class="contact-item">
      <div class="contact-info">
        <div class="contact-name">📞 ${contact.name}</div>
        <div class="contact-phone">${contact.phone}</div>
      </div>
      <button class="btn-remove" onclick="removeContact(${index})">Remove</button>
    </div>
  `).join('');
}

// Add new contact
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('contactName').value.trim();
  const phone = document.getElementById('contactPhone').value.trim();

  // Validation
  if (!name || !phone) {
    alert('❌ Please fill in all fields');
    return;
  }

  // Add to contacts array
  emergencyContacts.push({
    name: name,
    phone: phone,
    addedAt: new Date().toISOString()
  });

  // Save to localStorage
  localStorage.setItem('emergencyContacts', JSON.stringify(emergencyContacts));

  // Clear form
  document.getElementById('contactForm').reset();

  // Show success message
  document.getElementById('successMsg').classList.add('show');
  setTimeout(() => {
    document.getElementById('successMsg').classList.remove('show');
  }, 2000);

  // Re-render and enable proceed button
  renderContacts();
  updateProceedButton();
});

// Remove contact
function removeContact(index) {
  if (confirm('❌ Remove this contact?')) {
    emergencyContacts.splice(index, 1);
    localStorage.setItem('emergencyContacts', JSON.stringify(emergencyContacts));
    renderContacts();
    updateProceedButton();
  }
}

// Update proceed button state
function updateProceedButton() {
  const proceedBtn = document.getElementById('proceedBtn');
  if (emergencyContacts.length > 0) {
    proceedBtn.disabled = false;
    proceedBtn.classList.remove('secondary');
  } else {
    proceedBtn.disabled = true;
    proceedBtn.classList.add('secondary');
  }
}

// Navigate to walk page
function goToWalk() {
  if (emergencyContacts.length > 0) {
    window.location.href = 'walk.html';
  } else {
    alert('❌ Please add at least one emergency contact!');
  }
}

// Go back
function goBack() {
  window.location.href = 'profile.html';
}

// Load contacts on page load
window.addEventListener('DOMContentLoaded', loadContacts);
