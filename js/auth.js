// User class for OOP requirement
class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
    this.createdAt = new Date().toISOString();
  }

  getMoodHistory() {
    return JSON.parse(localStorage.getItem(`moodHistory_${this.username}`) || '[]');
  }

  saveMoodEntry(mood, weather) {
    const moodHistory = this.getMoodHistory();
    const entry = {
      mood: mood,
      timestamp: new Date().toLocaleString(),
      weather: weather
    };
    moodHistory.push(entry);
    localStorage.setItem(`moodHistory_${this.username}`, JSON.stringify(moodHistory));
  }

  getProfile() {
    return {
      username: this.username,
      email: this.email,
      totalMoods: this.getMoodHistory().length,
      memberSince: this.createdAt
    };
  }
}

// Authentication and user management
document.addEventListener('DOMContentLoaded', function() {
  // Handle login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      if (username && password) {
        // Simple demo authentication
        localStorage.setItem('currentUser', JSON.stringify({
          username: username,
          loginTime: new Date().toISOString()
        }));

        alert('Login successful!');
        window.location.href = 'index.html';
      }
    });
  }

  // Handle register form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const username = document.getElementById('reg-username').value;
      const email = document.getElementById('reg-email').value;
      const password = document.getElementById('reg-password').value;

      if (username && email && password) {
        // Simple demo registration
        localStorage.setItem('registeredUser', JSON.stringify({
          username: username,
          email: email,
          registeredAt: new Date().toISOString()
        }));

        alert('Registration successful! You can now login.');
        window.location.href = 'login.html';
      }
    });
  }
});