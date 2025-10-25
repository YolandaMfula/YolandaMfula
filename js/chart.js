
// Chart.js functionality for mood analytics
function updateMoodChart() {
  const ctx = document.getElementById('moodChart');
  if (!ctx) return;

  const moodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
  
  if (moodHistory.length === 0) {
    ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
    return;
  }

  // Count mood frequencies
  const moodCounts = {};
  moodHistory.forEach(entry => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
  });

  // Destroy existing chart if it exists
  if (window.moodChartInstance) {
    window.moodChartInstance.destroy();
  }

  // Create new chart
  window.moodChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(moodCounts),
      datasets: [{
        data: Object.values(moodCounts),
        backgroundColor: [
          '#FFD700', // Happy - Gold
          '#87CEEB', // Sad - Sky Blue
          '#FF69B4', // Excited - Hot Pink
          '#98FB98', // Calm - Pale Green
          '#FFA500', // Anxious - Orange
          '#FF6347'  // Angry - Tomato
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Your Mood Distribution'
        }
      }
    }
  });
}
