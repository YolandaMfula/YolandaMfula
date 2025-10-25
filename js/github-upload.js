import { Octokit } from '@octokit/rest'
import fs from 'fs'
import path from 'path'

let connectionSettings;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
export async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

// Function to upload project to GitHub
export async function uploadToGitHub(repoName, description = 'MoodWeather project uploaded from Replit') {
  try {
    const octokit = await getUncachableGitHubClient();
    
    // Get authenticated user
    const { data: user } = await octokit.rest.users.getAuthenticated();
    console.log(`Authenticated as: ${user.login}`);
    
    // Create repository with auto initialization
    const { data: repo } = await octokit.rest.repos.createForAuthenticatedUser({
      name: repoName,
      description: description,
      private: false,
      auto_init: true
    });
    
    console.log(`Repository created: ${repo.full_name}`);
    
    // Get the default branch and current HEAD
    const defaultBranch = repo.default_branch;
    const { data: ref } = await octokit.rest.git.getRef({
      owner: user.login,
      repo: repoName,
      ref: `heads/${defaultBranch}`
    });
    const headSha = ref.object.sha;
    
    // Get the base tree from current HEAD
    const { data: headCommit } = await octokit.rest.git.getCommit({
      owner: user.login,
      repo: repoName,
      commit_sha: headSha
    });
    const baseTreeSha = headCommit.tree.sha;
    
    // Get all files to upload (excluding node_modules and .replit files)
    const filesToUpload = getAllFiles('.');
    
    // Create blobs for all files
    const treeEntries = [];
    for (const file of filesToUpload) {
      const content = fs.readFileSync(file, 'utf8');
      const { data: blob } = await octokit.rest.git.createBlob({
        owner: user.login,
        repo: repoName,
        content: content,
        encoding: 'utf-8'
      });
      
      treeEntries.push({
        path: file,
        sha: blob.sha,
        mode: '100644',
        type: 'blob'
      });
    }
    
    // Create tree based on the current tree
    const { data: tree } = await octokit.rest.git.createTree({
      owner: user.login,
      repo: repoName,
      tree: treeEntries,
      base_tree: baseTreeSha
    });
    
    // Create commit with parent
    const { data: commit } = await octokit.rest.git.createCommit({
      owner: user.login,
      repo: repoName,
      message: 'Add MoodWeather project files',
      tree: tree.sha,
      parents: [headSha]
    });
    
    // Update the default branch reference
    await octokit.rest.git.updateRef({
      owner: user.login,
      repo: repoName,
      ref: `heads/${defaultBranch}`,
      sha: commit.sha,
      force: false
    });
    
    console.log(`Project uploaded successfully to: ${repo.html_url}`);
    return {
      success: true,
      repoUrl: repo.html_url,
      repoName: repo.full_name
    };
    
  } catch (error) {
    console.error('Error uploading to GitHub:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Helper function to get all files recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    // Skip node_modules, .replit files, and hidden files
    if (file === 'node_modules' || file.startsWith('.replit') || file.startsWith('.')) {
      return;
    }
    
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      // Get relative path from root
      const relativePath = path.relative('.', fullPath);
      arrayOfFiles.push(relativePath);
    }
  });
  
  return arrayOfFiles;
}