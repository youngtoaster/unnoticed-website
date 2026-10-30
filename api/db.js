// Unified Multi-Provider Database Engine for UNNOTICED
// Guarantees real-time persistence across every platform (iPhone, Android, Desktop, Tablet)
// Supports: Upstash Redis (Vercel KV), Supabase (Postgres), and GitHub Cloud Document DB

import fs from 'fs';
import path from 'path';

const STORAGE_KEY = 'unnoticed_site_data';

// Helper to send JSON responses reliably across both Vercel Serverless and Vite Connect Middleware
function sendJson(res, statusCode, data) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    res.status(statusCode).json(data);
  } else {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  }
}

// Helper to generate artistData.js source code for repository consistency
function generateArtistDataJs(data) {
  const header = `// Artist data for UNNOTICED (Formerly Ty Sciullo)\n// Auto-synchronized CMS state for production consistency\n\n`;
  return header + [
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
}

// In-memory edge cache to serve sub-millisecond responses
let edgeMemoryCache = null;
let edgeCacheTime = 0;

function getDbConfig(req) {
  const headers = req.headers || {};
  return {
    upstashUrl: (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || headers['x-db-upstash-url'] || '').replace(/\/$/, ''),
    upstashToken: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || headers['x-db-upstash-token'] || '',
    supabaseUrl: (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || headers['x-db-supabase-url'] || 'https://ftinvmrjijnncwzkvgcn.supabase.co').replace(/\/$/, ''),
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || headers['x-db-supabase-key'] || 'sb_publishable_HLp7KJ1CopJ803WGeoggJg_cwRD5lFV',
    githubToken: process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN || headers['authorization']?.replace(/^Bearer\s+|^token\s+/i, '') || '',
    githubOwner: process.env.GITHUB_OWNER || 'youngtoaster',
    githubRepo: process.env.GITHUB_REPO || 'unnoticed-website'
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-db-upstash-url, x-db-upstash-token, x-db-supabase-url, x-db-supabase-key');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const config = getDbConfig(req);
  const urlObj = new URL(req.url, 'http://localhost');
  const isHealthCheck = urlObj.searchParams.get('health') === '1' || urlObj.searchParams.get('check') === '1';

  // ========================================================
  // HEALTH & CONNECTION CHECK
  // ========================================================
  if (isHealthCheck) {
    const report = {
      timestamp: Date.now(),
      providers: {
        upstash: { configured: !!(config.upstashUrl && config.upstashToken) },
        supabase: { configured: !!(config.supabaseUrl && config.supabaseKey) },
        github: { configured: !!config.githubToken, repo: `${config.githubOwner}/${config.githubRepo}` },
        localDisk: { available: typeof process !== 'undefined' && !!fs?.existsSync }
      },
      activeProvider: 'local_disk'
    };

    if (config.upstashUrl && config.upstashToken) {
      const t0 = Date.now();
      try {
        const pingRes = await fetch(`${config.upstashUrl}/ping`, {
          headers: { Authorization: `Bearer ${config.upstashToken}` }
        });
        report.providers.upstash.status = pingRes.ok ? 'connected' : 'auth_failed';
        report.providers.upstash.latencyMs = Date.now() - t0;
        if (pingRes.ok) report.activeProvider = 'upstash_redis';
      } catch (e) {
        report.providers.upstash.status = 'error';
        report.providers.upstash.error = e.message;
      }
    }

    if (config.supabaseUrl && config.supabaseKey) {
      const t0 = Date.now();
      try {
        const supaRes = await fetch(`${config.supabaseUrl}/rest/v1/site_data?limit=1`, {
          headers: {
            'apikey': config.supabaseKey,
            'Authorization': `Bearer ${config.supabaseKey}`
          }
        });
        report.providers.supabase.status = supaRes.ok ? 'connected' : `status_${supaRes.status}`;
        report.providers.supabase.latencyMs = Date.now() - t0;
        if (supaRes.ok && report.activeProvider !== 'upstash_redis') {
          report.activeProvider = 'supabase_postgres';
        }
      } catch (e) {
        report.providers.supabase.status = 'error';
        report.providers.supabase.error = e.message;
      }
    }

    if (config.githubToken) {
      const t0 = Date.now();
      try {
        const ghRes = await fetch(`https://api.github.com/repos/${config.githubOwner}/${config.githubRepo}`, {
          headers: {
            'Authorization': `token ${config.githubToken}`,
            'User-Agent': 'Unnoticed-App'
          }
        });
        report.providers.github.status = ghRes.ok ? 'connected' : 'auth_failed';
        report.providers.github.latencyMs = Date.now() - t0;
        if (ghRes.ok && report.activeProvider === 'local_disk') {
          report.activeProvider = 'github_cloud_db';
        }
      } catch (e) {
        report.providers.github.status = 'error';
        report.providers.github.error = e.message;
      }
    }

    sendJson(res, 200, report);
    return;
  }

  // ========================================================
  // GET: READ DATABASE DOCUMENT
  // ========================================================
  if (req.method === 'GET') {
    const t0 = Date.now();

    // 1. Try Upstash Redis / Vercel KV
    if (config.upstashUrl && config.upstashToken) {
      try {
        const kvRes = await fetch(`${config.upstashUrl}/get/${STORAGE_KEY}`, {
          headers: { Authorization: `Bearer ${config.upstashToken}` }
        });
        if (kvRes.ok) {
          const kvData = await kvRes.json();
          if (kvData?.result) {
            let parsed = kvData.result;
            if (typeof parsed === 'string') {
              try { parsed = JSON.parse(parsed); } catch {}
            }
            if (parsed && typeof parsed === 'object') {
              edgeMemoryCache = parsed;
              edgeCacheTime = Date.now();
              res.setHeader('X-Database-Provider', 'upstash_redis');
              res.setHeader('X-Database-Latency', `${Date.now() - t0}ms`);
              sendJson(res, 200, {
                ...parsed,
                _source: 'upstash_redis',
                _readLatencyMs: Date.now() - t0
              });
              return;
            }
          }
        }
      } catch (err) {
        console.warn('Upstash Redis read failed, falling back:', err.message);
      }
    }

    // 2. Try Supabase Postgres
    if (config.supabaseUrl && config.supabaseKey) {
      try {
        const supaRes = await fetch(`${config.supabaseUrl}/rest/v1/site_data?id=eq.main&select=*`, {
          headers: {
            'apikey': config.supabaseKey,
            'Authorization': `Bearer ${config.supabaseKey}`
          }
        });
        if (supaRes.ok) {
          const rows = await supaRes.json();
          if (Array.isArray(rows) && rows[0]?.data) {
            const parsed = rows[0].data;
            edgeMemoryCache = parsed;
            edgeCacheTime = Date.now();
            res.setHeader('X-Database-Provider', 'supabase_postgres');
            sendJson(res, 200, {
              ...parsed,
              _source: 'supabase_postgres',
              _readLatencyMs: Date.now() - t0
            });
            return;
          }
        }
      } catch (err) {
        console.warn('Supabase read failed, falling back:', err.message);
      }
    }

    // 3. Try GitHub Live API (Bypasses all raw CDNs with 0-minute caching)
    if (config.githubToken) {
      try {
        const ghUrl = `https://api.github.com/repos/${config.githubOwner}/${config.githubRepo}/contents/public/site_data.json`;
        const ghRes = await fetch(ghUrl, {
          headers: {
            'Authorization': `token ${config.githubToken}`,
            'User-Agent': 'Unnoticed-App',
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        if (ghRes.ok) {
          const ghJson = await ghRes.json();
          if (ghJson?.content) {
            const decoded = Buffer.from(ghJson.content, 'base64').toString('utf-8');
            const parsed = JSON.parse(decoded);
            edgeMemoryCache = parsed;
            edgeCacheTime = Date.now();
            res.setHeader('X-Database-Provider', 'github_cloud_db');
            sendJson(res, 200, {
              ...parsed,
              _source: 'github_cloud_db',
              _commitSha: ghJson.sha,
              _readLatencyMs: Date.now() - t0
            });
            return;
          }
        }
      } catch (err) {
        console.warn('GitHub API read notice:', err.message);
      }
    }

    // 4. Try edge memory cache if populated
    if (edgeMemoryCache && (Date.now() - edgeCacheTime < 300000)) {
      res.setHeader('X-Database-Provider', 'edge_memory_cache');
      sendJson(res, 200, {
        ...edgeMemoryCache,
        _source: 'edge_memory_cache',
        _readLatencyMs: Date.now() - t0
      });
      return;
    }

    // 5. Try local disk site_data.json (development / local server)
    try {
      const candidates = [
        path.resolve(process.cwd(), 'public/site_data.json'),
        path.resolve(process.cwd(), 'unnoticed-website/public/site_data.json'),
        path.resolve(process.cwd(), 'site_data.json')
      ];
      for (const p of candidates) {
        if (fs.existsSync(p)) {
          const raw = fs.readFileSync(p, 'utf-8');
          const parsed = JSON.parse(raw);
          res.setHeader('X-Database-Provider', 'local_disk');
          sendJson(res, 200, {
            ...parsed,
            _source: 'local_disk',
            _readLatencyMs: Date.now() - t0
          });
          return;
        }
      }
    } catch {}

    // 6. Last resort: raw GitHub public URL
    try {
      const rawRes = await fetch(`https://raw.githubusercontent.com/${config.githubOwner}/${config.githubRepo}/main/public/site_data.json`);
      if (rawRes.ok) {
        const text = await rawRes.text();
        const parsed = JSON.parse(text);
        sendJson(res, 200, {
          ...parsed,
          _source: 'github_raw_fallback',
          _readLatencyMs: Date.now() - t0
        });
        return;
      }
    } catch {}

    sendJson(res, 404, { error: 'No database document found' });
    return;
  }

  // ========================================================
  // POST: WRITE DATABASE DOCUMENT & BROADCAST ACROSS PLATFORMS
  // ========================================================
  if (req.method === 'POST') {
    const t0 = Date.now();
    try {
      let payload = req.body;
      if (!payload) {
        try {
          const buffers = [];
          for await (const chunk of req) {
            buffers.push(chunk);
          }
          const raw = Buffer.concat(buffers).toString('utf-8');
          if (raw) payload = JSON.parse(raw);
        } catch {}
      }
      if (typeof payload === 'string') {
        try { payload = JSON.parse(payload); } catch {}
      }

      if (!payload || typeof payload !== 'object') {
        sendJson(res, 400, { error: 'Invalid JSON payload' });
        return;
      }

      // Stamp with universal synchronization time
      payload._lastUpdated = Date.now();

      // Update in-memory edge cache immediately
      edgeMemoryCache = payload;
      edgeCacheTime = Date.now();

      const syncedProviders = [];
      const errors = [];

      // 1. Write to Upstash Redis / Vercel KV (Fastest: ~10ms)
      if (config.upstashUrl && config.upstashToken) {
        try {
          const upstashRes = await fetch(`${config.upstashUrl}/set/${STORAGE_KEY}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${config.upstashToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
          if (upstashRes.ok) {
            syncedProviders.push('upstash_redis');
          } else {
            errors.push(`Upstash: ${upstashRes.statusText}`);
          }
        } catch (e) {
          errors.push(`Upstash: ${e.message}`);
        }
      }

      // 2. Write to Supabase Postgres
      if (config.supabaseUrl && config.supabaseKey) {
        try {
          const supaRes = await fetch(`${config.supabaseUrl}/rest/v1/site_data?on_conflict=id`, {
            method: 'POST',
            headers: {
              'apikey': config.supabaseKey,
              'Authorization': `Bearer ${config.supabaseKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify({
              id: 'main',
              data: payload,
              updated_at: new Date().toISOString()
            })
          });
          if (supaRes.ok) {
            syncedProviders.push('supabase_postgres');
          } else {
            errors.push(`Supabase: ${supaRes.statusText}`);
          }
        } catch (e) {
          errors.push(`Supabase: ${e.message}`);
        }
      }

      // 3. Write to local file system if running in local environment
      try {
        const rootDir = process.cwd();
        const candidatePaths = [
          path.resolve(rootDir, 'public/site_data.json'),
          path.resolve(rootDir, 'unnoticed-website/public/site_data.json')
        ];
        for (const p of candidatePaths) {
          if (fs.existsSync(path.dirname(p))) {
            fs.writeFileSync(p, JSON.stringify(payload, null, 2), 'utf-8');
            syncedProviders.push('local_disk');
            break;
          }
        }
        // Also sync artistData.js code defaults
        const artistJsPath = path.resolve(rootDir, 'src/data/artistData.js');
        if (fs.existsSync(artistJsPath)) {
          fs.writeFileSync(artistJsPath, generateArtistDataJs(payload), 'utf-8');
        }
      } catch {}

      // 4. Asynchronously commit & push to GitHub repository so Git stays 100% matched
      if (config.githubToken) {
        try {
          const jsonStr = JSON.stringify(payload, null, 2);
          const b64Json = Buffer.from(jsonStr, 'utf-8').toString('base64');
          const siteDataUrl = `https://api.github.com/repos/${config.githubOwner}/${config.githubRepo}/contents/public/site_data.json`;

          let sha = null;
          try {
            const getFile = await fetch(siteDataUrl, {
              headers: { 'Authorization': `token ${config.githubToken}`, 'User-Agent': 'Unnoticed-App' }
            });
            if (getFile.ok) {
              const fileInfo = await getFile.json();
              sha = fileInfo.sha;
            }
          } catch {}

          const commitMsg = payload.commitMessage || `content: CMS update from database sync [${new Date().toLocaleTimeString()}]`;
          const putRes = await fetch(siteDataUrl, {
            method: 'PUT',
            headers: {
              'Authorization': `token ${config.githubToken}`,
              'Content-Type': 'application/json',
              'User-Agent': 'Unnoticed-App'
            },
            body: JSON.stringify({
              message: commitMsg,
              content: b64Json,
              sha: sha || undefined,
              branch: 'main'
            })
          });

          if (putRes.ok) {
            syncedProviders.push('github_cloud_db');
            // Also sync artistData.js in background
            try {
              const jsContent = generateArtistDataJs(payload);
              const b64Js = Buffer.from(jsContent, 'utf-8').toString('base64');
              const jsUrl = `https://api.github.com/repos/${config.githubOwner}/${config.githubRepo}/contents/src/data/artistData.js`;
              let jsSha = null;
              const getJs = await fetch(jsUrl, {
                headers: { 'Authorization': `token ${config.githubToken}`, 'User-Agent': 'Unnoticed-App' }
              });
              if (getJs.ok) {
                const jsInfo = await getJs.json();
                jsSha = jsInfo.sha;
              }
              await fetch(jsUrl, {
                method: 'PUT',
                headers: {
                  'Authorization': `token ${config.githubToken}`,
                  'Content-Type': 'application/json',
                  'User-Agent': 'Unnoticed-App'
                },
                body: JSON.stringify({
                  message: `chore: sync artistData.js code defaults`,
                  content: b64Js,
                  sha: jsSha || undefined,
                  branch: 'main'
                })
              });
            } catch {}
          } else {
            const errJson = await putRes.json().catch(() => ({}));
            errors.push(`GitHub: ${errJson.message || 'Push failed'}`);
          }
        } catch (ghErr) {
          errors.push(`GitHub: ${ghErr.message}`);
        }
      }

      sendJson(res, 200, {
        success: true,
        timestamp: payload._lastUpdated,
        latencyMs: Date.now() - t0,
        syncedProviders,
        warnings: errors.length > 0 ? errors : undefined,
        message: `Database synchronized across ${syncedProviders.join(', ') || 'edge cache'}`
      });
    } catch (err) {
      console.error('/api/db error:', err);
      sendJson(res, 500, { error: err.message });
    }
  }
}
