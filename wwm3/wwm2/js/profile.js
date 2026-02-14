// ===== PROFILE PAGE LOGIC =====
// Handle profile form submission

document.getElementById('profileForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Get form values
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();

  // Validation
  if (!name || !phone) {
    alert('❌ Please fill in all required fields (Name and Phone)');
    return;
  }

  // Create user profile object
  const userProfile = {
    name: name,
    phone: phone,
    email: email,
    createdAt: new Date().toISOString()
  };

  // Save to localStorage
  localStorage.setItem('userProfile', JSON.stringify(userProfile));

  // Show success message
  document.getElementById('successMsg').classList.add('show');

  // Redirect to contacts page after 1 second
  setTimeout(() => {
    window.location.href = 'contacts.html';
  }, 1000);
});

// Go back to home page
function goBack() {
  window.location.href = 'index.html';
}

// Pre-fill form if profile already exists
window.addEventListener('DOMContentLoaded', function() {
  const savedProfile = JSON.parse(localStorage.getItem('userProfile'));
  
  if (savedProfile) {
    document.getElementById('name').value = savedProfile.name;
    document.getElementById('phone').value = savedProfile.phone;
    document.getElementById('email').value = savedProfile.email || '';
  }
});
