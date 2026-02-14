// ============ SIGNUP.JS ============
// Save user profile to localStorage

function saveProfile() {
  const fullName = document.getElementById('fullName').value.trim();
  const phoneNumber = document.getElementById('phoneNumber').value.trim();
  const email = document.getElementById('email').value.trim();
  const contactName = document.getElementById('contactName').value.trim();
  const contactPhone = document.getElementById('contactPhone').value.trim();
  const contactEmail = document.getElementById('contactEmail').value.trim();

  if (!fullName || !phoneNumber || !email || !contactName || !contactPhone || !contactEmail) {
    alert('Please fill in all fields');
    return;
  }

  const userProfile = {
    fullName,
    phoneNumber,
    email,
    primaryContact: {
      name: contactName,
      phone: contactPhone,
      email: contactEmail
    }
  };

  localStorage.setItem('userProfile', JSON.stringify(userProfile));

  // Initialize emergency contacts array with primary contact
  const contacts = [{
    name: contactName,
    phone: contactPhone,
    email: contactEmail
  }];
  localStorage.setItem('emergencyContacts', JSON.stringify(contacts));

  window.location.href = 'contacts.html';
}

function goToPage(path) {
  window.location.href = path;
}

// Load existing profile if available
window.addEventListener('load', function() {
  const userData = JSON.parse(localStorage.getItem('userProfile'));
  if (userData) {
    document.getElementById('fullName').value = userData.fullName;
    document.getElementById('phoneNumber').value = userData.phoneNumber;
    document.getElementById('email').value = userData.email;
    document.getElementById('contactName').value = userData.primaryContact.name;
    document.getElementById('contactPhone').value = userData.primaryContact.phone;
    document.getElementById('contactEmail').value = userData.primaryContact.email;
  }
});
