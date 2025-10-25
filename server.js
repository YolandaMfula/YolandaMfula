
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadToGitHub } from './js/github-upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// API endpoint to provide weather API key
app.get('/api/weather-key', (req, res) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ 
      error: 'API key not configured',
      message: 'Please set OPENWEATHER_API_KEY in your Secrets' 
    });
  }
  
  res.json({ apiKey });
});

// GitHub upload endpoint
app.post('/api/github-upload', async (req, res) => {
  try {
    const { repoName, description } = req.body;
    
    if (!repoName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Repository name is required' 
      });
    }
    
    console.log(`Uploading project to GitHub repository: ${repoName}`);
    const result = await uploadToGitHub(repoName, description);
    
    res.json(result);
  } catch (error) {
    console.error('GitHub upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit your app at: http://0.0.0.0:${PORT}`);
});
