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
      const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/main`, {
        headers: {
          ...(token ? { 'Authorization': `token ${token}` } : {}),
          'User-Agent': 'Unnoticed-App'
        }
      });
      if (commitRes.ok) {
        const commitData = await commitRes.json();
        const hash = commitData.sha.slice(0, 7);
        const msg = commitData.commit.message.split('\n')[0];
        const date = new Date(commitData.commit.committer.date).toLocaleString();
        res.status(200).json({
          isGit: true,
          branch: 'main',
          remoteUrl: `https://github.com/${owner}/${repo}.git`,
          lastCommit: { hash, message: msg, relativeDate: date },
          hasUncommitted: false
        });
      } else {
        res.status(200).json({
          isGit: true,
          branch: 'main',
          remoteUrl: `https://github.com/${owner}/${repo}.git`,
          lastCommit: { hash: 'main', message: 'Connected to GitHub', relativeDate: 'Live' }
        });
      }
    } catch (err) {
      res.status(500).json({ isGit: false, error: err.message });
    }
    return;
  }

  if (req.method === 'POST') {
    // Forward to sync-data logic
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch {}
      }
      const payload = body.payload || body;
      const commitMessage = body.commitMessage || `content: manual push from site admin [${new Date().toLocaleTimeString()}]`;

      if (!token) {
        res.status(500).json({ success: false, error: 'No GITHUB_TOKEN configured on server' });
        return;
      }

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

      const putRes = await fetch(siteDataUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Unnoticed-App'
        },
        body: JSON.stringify({
          message: commitMessage,
          content: b64Json,
          sha: sha || undefined,
          branch: 'main'
        })
      });

      if (!putRes.ok) {
        const errJson = await putRes.json().catch(() => ({}));
        throw new Error(`GitHub API (${putRes.status}): ${errJson.message || 'Push failed'}`);
      }

      const putData = await putRes.json();
      const hash = putData.commit?.sha?.slice(0, 7);

      res.status(200).json({
        success: true,
        pushed: true,
        hash,
        message: `Pushed commit ${hash} to GitHub!`
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
