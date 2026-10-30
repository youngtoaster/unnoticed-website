export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const token = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || 'youngtoaster';
  const repo = process.env.GITHUB_REPO || 'unnoticed-website';

  if (token) {
    res.status(200).json({
      available: true,
      token,
      masked: `gho_••••••••••••••••${token.slice(-4)}`,
      owner,
      repo
    });
  } else {
    res.status(200).json({ available: false });
  }
}
