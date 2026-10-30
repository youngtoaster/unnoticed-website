import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disabling automatic body parser to stream raw audio/binary buffers
  },
};

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-File-Name, X-File-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const rawHeaderName = req.headers['x-file-name'] || `media_${Date.now()}.bin`;
    const decodedName = decodeURIComponent(String(rawHeaderName));
    const sanitized = decodedName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const ext = path.extname(sanitized) || '.bin';
    const baseName = path.basename(sanitized, ext);
    const finalFileName = `${baseName}_${Date.now()}${ext}`;

    // Read raw binary chunks
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const fileBuffer = Buffer.concat(chunks);

    if (!fileBuffer || fileBuffer.length === 0) {
      res.status(400).json({ error: 'Empty file payload' });
      return;
    }

    // Get GitHub Token from environment or request authorization header
    const token = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN || req.headers.authorization?.replace(/^Bearer\s+|^token\s+/i, '');
    const owner = process.env.GITHUB_OWNER || 'youngtoaster';
    const repo = process.env.GITHUB_REPO || 'unnoticed-website';

    if (!token) {
      res.status(500).json({
        error: 'No GITHUB_TOKEN configured on server. Please add GITHUB_TOKEN to Vercel environment variables or provide Authorization header.'
      });
      return;
    }

    // Direct GitHub REST API upload
    const base64Content = fileBuffer.toString('base64');
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/public/uploads/${finalFileName}`;

    const ghRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Unnoticed-App'
      },
      body: JSON.stringify({
        message: `media: upload ${finalFileName}`,
        content: base64Content,
        branch: 'main'
      })
    });

    if (!ghRes.ok) {
      const errData = await ghRes.json().catch(() => ({}));
      throw new Error(`GitHub API Error (${ghRes.status}): ${errData.message || 'Upload failed'}`);
    }

    const ghData = await ghRes.json();
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/public/uploads/${finalFileName}`;
    const localUrl = `/uploads/${finalFileName}`;

    res.status(200).json({
      success: true,
      url: rawUrl,
      localUrl,
      fileName: finalFileName,
      size: fileBuffer.length,
      commitHash: ghData.commit?.sha?.slice(0, 7)
    });
  } catch (err) {
    console.error('API /api/upload error:', err);
    res.status(500).json({ error: err.message });
  }
}
