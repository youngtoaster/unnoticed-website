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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const token = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN || req.headers.authorization?.replace(/^Bearer\s+|^token\s+/i, '');
  const owner = process.env.GITHUB_OWNER || 'youngtoaster';
  const repo = process.env.GITHUB_REPO || 'unnoticed-website';

  if (req.method === 'GET') {
    try {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/public/site_data.json`;
      const response = await fetch(rawUrl);
      if (response.ok) {
        const text = await response.text();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(text);
      } else {
        res.status(404).json({ error: 'site_data.json not found on GitHub' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      let payload = req.body;
      if (typeof payload === 'string') {
        try { payload = JSON.parse(payload); } catch {}
      }

      if (!payload || typeof payload !== 'object') {
        res.status(400).json({ error: 'Invalid JSON payload' });
        return;
      }

      if (!token) {
        res.status(500).json({ error: 'No GITHUB_TOKEN configured on server' });
        return;
      }

      // Update public/site_data.json on GitHub
      const jsonStr = JSON.stringify(payload, null, 2);
      const b64Json = Buffer.from(jsonStr, 'utf-8').toString('base64');
      const siteDataUrl = `https://api.github.com/repos/${owner}/${repo}/contents/public/site_data.json`;

      let sha = null;
      try {
        const getFile = await fetch(siteDataUrl, {
          headers: { 'Authorization': `token ${token}`, 'User-Agent': 'Unnoticed-App' }
        });
        if (getFile.ok) {
          const fileInfo = await getFile.json();
          sha = fileInfo.sha;
        }
      } catch {}

      const msg = payload.commitMessage || `content: CMS update from site admin [${new Date().toLocaleTimeString()}]`;
      const putRes = await fetch(siteDataUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Unnoticed-App'
        },
        body: JSON.stringify({
          message: msg,
          content: b64Json,
          sha: sha || undefined,
          branch: 'main'
        })
      });

      if (!putRes.ok) {
        const errJson = await putRes.json().catch(() => ({}));
        throw new Error(`GitHub API (${putRes.status}): ${errJson.message || 'Update failed'}`);
      }

      const putData = await putRes.json();
      const commitHash = putData.commit?.sha?.slice(0, 7);

      // Also asynchronously update src/data/artistData.js so code matches
      try {
        const jsContent = generateArtistDataJs(payload);
        const b64Js = Buffer.from(jsContent, 'utf-8').toString('base64');
        const jsUrl = `https://api.github.com/repos/${owner}/${repo}/contents/src/data/artistData.js`;
        let jsSha = null;
        const getJs = await fetch(jsUrl, {
          headers: { 'Authorization': `token ${token}`, 'User-Agent': 'Unnoticed-App' }
        });
        if (getJs.ok) {
          const jsInfo = await getJs.json();
          jsSha = jsInfo.sha;
        }
        await fetch(jsUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Unnoticed-App'
          },
          body: JSON.stringify({
            message: `chore: sync artistData.js code defaults [${commitHash}]`,
            content: b64Js,
            sha: jsSha || undefined,
            branch: 'main'
          })
        });
      } catch (jsErr) {
        console.warn('artistData.js sync notice:', jsErr.message);
      }

      res.status(200).json({
        success: true,
        hash: commitHash,
        pushed: true,
        message: `Saved & pushed commit ${commitHash} to GitHub!`
      });
    } catch (err) {
      console.error('API /api/sync-data error:', err);
      res.status(500).json({ error: err.message });
    }
  }
}
