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

    // 1. Primary: Direct upload to Supabase Storage (media bucket, 100MB limit, fast CDN)
    const supaUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://ftinvmrjijnncwzkvgcn.supabase.co').replace(/\/$/, '');
    const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_HLp7KJ1CopJ803WGeoggJg_cwRD5lFV';

    try {
      const supaRes = await fetch(`${supaUrl}/storage/v1/object/media/${finalFileName}`, {
        method: 'POST',
        headers: {
          'apikey': supaKey,
          'Authorization': `Bearer ${supaKey}`,
          'Content-Type': req.headers['content-type'] || 'application/octet-stream'
        },
        body: fileBuffer
      });

      if (supaRes.ok) {
        const publicUrl = `${supaUrl}/storage/v1/object/public/media/${finalFileName}`;
        res.status(200).json({
          success: true,
          fileName: finalFileName,
          url: publicUrl,
          rawUrl: publicUrl,
          provider: 'supabase_storage'
        });
        return;
      }
    } catch (supaErr) {
      console.warn('[upload.js] Supabase storage upload notice:', supaErr.message);
    }

    // 2. Secondary fallback: GitHub repository upload
    const token = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN || req.headers.authorization?.replace(/^Bearer\s+|^token\s+/i, '');
    const owner = process.env.GITHUB_OWNER || 'youngtoaster';
    const repo = process.env.GITHUB_REPO || 'unnoticed-website';

    if (!token) {
      res.status(500).json({
        error: 'Upload storage providers unavailable. Please check Supabase or GitHub configuration.'
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
