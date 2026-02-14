// ============ CONTACTS.JS ============
// Manage emergency contacts

function renderContacts() {
  const contacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];
  const contactsList = document.getElementById('contactsList');
  
  if (contacts.length === 0) {
    contactsList.innerHTML = '<p style="text-align: center; color: #999;">No additional contacts yet</p>';
    return;
  }

  contactsList.innerHTML = contacts.map((contact, index) => `
    <div class="contact-card">
      <div class="contact-info">
        <h3>👤 ${contact.name}</h3>
        <p>📱 ${contact.phone}</p>
        <p>📧 ${contact.email}</p>
      </div>
      <div class="contact-actions">
        <button class="btn-icon edit" onclick="editContact(${index})">✏️</button>
        <button class="btn-icon delete" onclick="deleteContact(${index})">🗑️</button>
      </div>
    </div>
  `).join('');
}

function openAddContactForm() {
  document.getElementById('addContactForm').classList.remove('hidden');
}

function closeAddContactForm() {
  document.getElementById('addContactForm').classList.add('hidden');
  document.getElementById('newContactName').value = '';
  document.getElementById('newContactPhone').value = '';
  document.getElementById('newContactEmail').value = '';
}

function addContact() {
  const name = document.getElementById('newContactName').value.trim();
  const phone = document.getElementById('newContactPhone').value.trim();
  const email = document.getElementById('newContactEmail').value.trim();

  if (!name || !phone || !email) {
    alert('Please fill in all fields');
    return;
  }

  const contacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];
  contacts.push({ name, phone, email });
  localStorage.setItem('emergencyContacts', JSON.stringify(contacts));

  closeAddContactForm();
  renderContacts();
}

function deleteContact(index) {
  if (confirm('Delete this contact?')) {
    const contacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];
    contacts.splice(index, 1);
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
    renderContacts();
  }
}

function editContact(index) {
  const contacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];
  const contact = contacts[index];
  
  document.getElementById('newContactName').value = contact.name;
  document.getElementById('newContactPhone').value = contact.phone;
  document.getElementById('newContactEmail').value = contact.email;
  openAddContactForm();

  const addBtn = document.querySelector('button[onclick="addContact()"]');
  addBtn.textContent = 'Update Contact';
  addBtn.onclick = function() {
    const name = document.getElementById('newContactName').value.trim();
    const phone = document.getElementById('newContactPhone').value.trim();
    const email = document.getElementById('newContactEmail').value.trim();

    if (!name || !phone || !email) {
      alert('Please fill in all fields');
      return;
    }

    contacts[index] = { name, phone, email };
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
    closeAddContactForm();
    renderContacts();
    addBtn.textContent = 'Add Contact';
    addBtn.onclick = addContact;
  };
}

function goToWalkScreen() {
  if (!localStorage.getItem('userProfile')) {
    alert('Please complete your profile first');
    window.location.href = 'signup.html';
    return;
  }
  window.location.href = 'walk.html';
}

function goToPage(path) {
  window.location.href = path;
}

// Load on page load
window.addEventListener('load', function() {
  renderContacts();
});
