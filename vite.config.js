import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'

// Helper to write data back to src/data/artistData.js so code repository matches live CMS
function syncArtistDataFile(data, rootDir) {
  try {
    const filePath = path.resolve(rootDir, 'src/data/artistData.js');
    if (!fs.existsSync(filePath)) return false;
    const header = `// Artist data for UNNOTICED (Formerly Ty Sciullo)\n// Auto-synchronized CMS state for production consistency\n\n`;
    const content = header + [
      `export const SECTIONS_VISIBILITY = ${JSON.stringify(data.sectionsVisibility || {}, null, 2)};\n`,
      `export const FEATURED_RELEASE = ${JSON.stringify(data.featuredRelease || {}, null, 2)};\n`,
      `export const ARTIST_INFO = ${JSON.stringify(data.artistInfo || {}, null, 2)};\n`,
      `export const TRACKS = ${JSON.stringify(data.tracks || [], null, 2)};\n`,
      `export const BIOGRAPHY_PARAGRAPHS = ${JSON.stringify(data.biography || [], null, 2)};\n`,
      `export const VIDEOS = ${JSON.stringify(data.videos || [], null, 2)};\n`,
      `export const TOUR_DATES = ${JSON.stringify(data.tourDates || [], null, 2)};\n`,
      `export const PAST_TOUR_HIGHLIGHTS = ${JSON.stringify(data.pastTours || [], null, 2)};\n`,
      `export const MERCH_PRODUCTS = ${JSON.stringify(data.merchProducts || [], null, 2)};\n`,
      `export const GALLERY_IMAGES = ${JSON.stringify(data.galleryImages || [], null, 2)};\n`,
      `export const SOCIAL_POSTS = ${JSON.stringify(data.socialPosts || [], null, 2)};\n`,
      `export const EPK_DATA = ${JSON.stringify(data.epkData || {}, null, 2)};\n`
    ].join('\n');
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  } catch (err) {
    console.warn('[devDataSyncPlugin] Could not sync artistData.js:', err.message);
    return false;
  }
}

// Git commit & push helper that ensures changes are published directly to GitHub
function pushToGit(commitMsg = 'content: sync CMS updates from site admin') {
  try {
    const rootDir = process.cwd();
    execSync('git add public/site_data.json src/data/artistData.js', { cwd: rootDir, stdio: 'pipe' });
    const diff = execSync('git diff --cached --name-only', { cwd: rootDir, encoding: 'utf-8' }).trim();
    if (!diff) {
      return { success: true, pushed: false, message: 'Already up to date with Git' };
    }
    const safeMsg = commitMsg.replace(/"/g, '\\"');
    execSync(`git commit -m "${safeMsg}"`, { cwd: rootDir, stdio: 'pipe' });
    execSync('git push origin main', { cwd: rootDir, stdio: 'pipe' });
    const hash = execSync('git rev-parse --short HEAD', { cwd: rootDir, encoding: 'utf-8' }).trim();
    console.log(`[devDataSyncPlugin] Successfully committed and pushed ${hash} to origin main!`);
    return { success: true, pushed: true, hash, message: `Pushed commit ${hash} to GitHub` };
  } catch (err) {
    console.warn('[devDataSyncPlugin] Git push notice:', err.message);
    return { success: false, error: err.message };
  }
}

// Custom plugin for instant cross-device persistence and automatic GitHub synchronization
function devDataSyncPlugin() {
  return {
    name: 'dev-data-sync',
    configureServer(server) {
      // 1. DATA SYNC ENDPOINT (/api/sync-data)
      server.middlewares.use('/api/sync-data', async (req, res) => {
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              const rootDir = process.cwd();
              const publicDir = path.resolve(rootDir, 'public');
              if (!fs.existsSync(publicDir)) {
                fs.mkdirSync(publicDir, { recursive: true });
              }
              const filePath = path.resolve(publicDir, 'site_data.json');
              fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), 'utf-8');

              // Also sync to dist if exists
              const distDir = path.resolve(rootDir, 'dist');
              if (fs.existsSync(distDir)) {
                fs.writeFileSync(path.resolve(distDir, 'site_data.json'), JSON.stringify(parsed, null, 2), 'utf-8');
              }

              // Update source code defaults in src/data/artistData.js
              syncArtistDataFile(parsed, rootDir);

              // Auto-commit & push to GitHub if requested or by default
              let gitResult = null;
              if (parsed.autoGitPush !== false) {
                const msg = parsed.commitMessage || `content: update CMS data from site admin (${new Date().toLocaleTimeString()})`;
                gitResult = pushToGit(msg);
              }

              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                timestamp: Date.now(),
                git: gitResult
              }));
            } catch (err) {
              console.error('Error in /api/sync-data write:', err);
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        if (req.method === 'GET') {
          try {
            const filePath = path.resolve(process.cwd(), 'public/site_data.json');
            if (fs.existsSync(filePath)) {
              const content = fs.readFileSync(filePath, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.statusCode = 200;
              res.end(content);
            } else {
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'No synced data file yet' }));
            }
          } catch (err) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }
      });

      // 2. DEDICATED GITHUB SYNC ENDPOINT (/api/git-sync)
      server.middlewares.use('/api/git-sync', async (req, res) => {
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.statusCode = 204;
          res.end();
          return;
        }

        const rootDir = process.cwd();

        // GET: Check live Git & GitHub repository status
        if (req.method === 'GET') {
          try {
            const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: rootDir, encoding: 'utf-8' }).trim();
            const lastCommitRaw = execSync('git log -1 --format="%h|||%s|||%cr"', { cwd: rootDir, encoding: 'utf-8' }).trim();
            const [hash, msg, relDate] = lastCommitRaw.split('|||');
            const status = execSync('git status --short public/site_data.json src/data/artistData.js', { cwd: rootDir, encoding: 'utf-8' }).trim();
            let remoteUrl = '';
            try {
              remoteUrl = execSync('git remote get-url origin', { cwd: rootDir, encoding: 'utf-8' }).trim();
            } catch {}

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.statusCode = 200;
            res.end(JSON.stringify({
              isGit: true,
              branch,
              remoteUrl,
              lastCommit: { hash, message: msg, relativeDate: relDate },
              hasUncommitted: Boolean(status)
            }));
          } catch (err) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.statusCode = 200;
            res.end(JSON.stringify({
              isGit: false,
              error: err.message
            }));
          }
          return;
        }

        // POST: Explicitly commit and push to GitHub
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              let parsed = {};
              if (body) {
                try { parsed = JSON.parse(body); } catch {}
              }

              // If full data payload included, write it first
              if (parsed.payload) {
                const publicDir = path.resolve(rootDir, 'public');
                fs.writeFileSync(path.resolve(publicDir, 'site_data.json'), JSON.stringify(parsed.payload, null, 2), 'utf-8');
                syncArtistDataFile(parsed.payload, rootDir);
              }

              const msg = parsed.commitMessage || `content: manual push from site admin (${new Date().toLocaleTimeString()})`;
              const gitResult = pushToGit(msg);

              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.statusCode = gitResult.success ? 200 : 500;
              res.end(JSON.stringify(gitResult));
            } catch (err) {
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    devDataSyncPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})