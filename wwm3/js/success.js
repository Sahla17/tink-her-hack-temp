// ============ SUCCESS.JS ============
// Success screen and confetti animation

function createConfetti() {
  const colors = ['#d946ef', '#ec4899', '#f472b6', '#fbcfe8', '#fce7f3'];
  
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0%';
    
    document.body.appendChild(confetti);
    
    // Remove after animation
    setTimeout(() => confetti.remove(), 3500);
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

window.addEventListener('load', function() {
  // Trigger confetti
  createConfetti();
  
  // Load walk stats
  const duration = parseInt(localStorage.getItem('lastWalkDuration')) || 0;
  const checks = parseInt(localStorage.getItem('lastChecksCount')) || 0;
  
  document.getElementById('walkDuration').textContent = formatTime(duration);
  document.getElementById('checksCount').textContent = checks;
  
  // Clear stats after displaying
  setTimeout(() => {
    localStorage.removeItem('lastWalkDuration');
    localStorage.removeItem('lastChecksCount');
  }, 2000);
});

function goToPage(path) {
  window.location.href = path;
}
