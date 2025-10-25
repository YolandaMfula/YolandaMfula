// GitHub upload functionality for frontend
async function uploadToGitHub() {
  const repoNameInput = document.getElementById('repoNameInput');
  const repoDescInput = document.getElementById('repoDescInput');
  const uploadBtn = document.getElementById('uploadBtn');
  const uploadStatus = document.getElementById('uploadStatus');
  
  const repoName = repoNameInput.value.trim();
  const repoDesc = repoDescInput.value.trim();
  
  if (!repoName) {
    uploadStatus.innerHTML = '<p style="color: red;">Please enter a repository name.</p>';
    return;
  }
  
  // Disable button and show loading
  uploadBtn.disabled = true;
  uploadBtn.textContent = 'Uploading...';
  uploadStatus.innerHTML = '<p style="color: blue;">Uploading project to GitHub...</p>';
  
  try {
    const response = await fetch('/api/github-upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        repoName: repoName,
        description: repoDesc || 'MoodWeather project uploaded from Replit'
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      uploadStatus.innerHTML = `
        <p style="color: green;">✅ Successfully uploaded to GitHub!</p>
        <p>Repository: <a href="${result.repoUrl}" target="_blank">${result.repoName}</a></p>
      `;
      // Clear inputs
      repoNameInput.value = '';
      repoDescInput.value = '';
    } else {
      uploadStatus.innerHTML = `<p style="color: red;">❌ Upload failed: ${result.error}</p>`;
    }
  } catch (error) {
    console.error('Upload error:', error);
    uploadStatus.innerHTML = `<p style="color: red;">❌ Upload failed: ${error.message}</p>`;
  } finally {
    // Re-enable button
    uploadBtn.disabled = false;
    uploadBtn.textContent = 'Upload to GitHub';
  }
}

// Make function globally available
window.uploadToGitHub = uploadToGitHub;