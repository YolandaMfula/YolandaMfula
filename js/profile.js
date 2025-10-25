
// Profile and welcome message functionality
document.addEventListener('DOMContentLoaded', function() {
  const welcomeDiv = document.getElementById('welcome');
  if (welcomeDiv) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (currentUser) {
      welcomeDiv.innerHTML = `Welcome back, ${currentUser.username}! 👋`;
    } else {
      welcomeDiv.innerHTML = 'Welcome to MoodWeather! Please <a href="login.html">login</a> to get started.';
    }
  }
});
