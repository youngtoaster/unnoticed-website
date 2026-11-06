import https from 'https';
import http from 'http';

function fetchUrl(targetUrl, headers = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = targetUrl.startsWith('https:');
    const client = isHttps ? https : http;
    const req = client.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/json,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        ...headers
      }
    }, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const base = new URL(targetUrl);
          redirectUrl = new URL(redirectUrl, base.origin).toString();
        }
        return fetchUrl(redirectUrl, headers).then(resolve).catch(reject);
      }

      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
    });

    req.on('error', reject);
    req.setTimeout(8000, () => {
      req.destroy();
      resolve({ status: 408, body: '', headers: {} });
    });
  });
}

function formatDuration(msOrSec) {
  if (!msOrSec || isNaN(msOrSec)) return '3:00';
  const totalSec = msOrSec > 1000 ? Math.round(msOrSec / 1000) : Math.round(msOrSec);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function cleanMediaTitle(rawTitle) {
  if (!rawTitle) return '';
  return rawTitle
    .replace(/\[official\s*(music\s*video|video|audio|visualizer|lyric\s*video)\]/gi, '')
    .replace(/\(official\s*(music\s*video|video|audio|visualizer|lyric\s*video|4k\s*remaster)\)/gi, '')
    .replace(/\(official\s*hd\)/gi, '')
    .replace(/\|\s*official\s*(music\s*video|video)/gi, '')
    .trim();
}

function extractYouTubeId(url) {
  if (!url) return '';
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i);
  return (match && match[1]) ? match[1] : '';
}

export async function resolveMetadata(cleanUrl) {
  const lower = cleanUrl.toLowerCase();

  // =========================================================================
  // 1. SPOTIFY
  // =========================================================================
  if (lower.includes('spotify.com')) {
    const trackMatch = cleanUrl.match(/track[\/:]([a-zA-Z0-9]+)/);
    const albumMatch = cleanUrl.match(/album[\/:]([a-zA-Z0-9]+)/);

    // Track handling
    if (trackMatch) {
      const trackId = trackMatch[1];
      const embedUrl = `https://open.spotify.com/embed/track/${trackId}`;
      const embedRes = await fetchUrl(embedUrl);

      if (embedRes.status === 200) {
        const nextDataMatch = embedRes.body.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
        if (nextDataMatch) {
          try {
            const parsed = JSON.parse(nextDataMatch[1]);
            const entity = parsed.props?.pageProps?.state?.data?.entity;
            if (entity) {
              const title = entity.title || entity.name || '';
              const artists = (entity.artists || []).map((a) => a.name);

              let artist = 'UNNOTICED';
              let featuring = '';

              // If primary artist is listed
              const nonUnnoticed = artists.filter((a) => !['unnoticed', 'ty sciullo'].includes(a.toLowerCase()));
              const hasTySciullo = artists.some((a) => a.toLowerCase() === 'ty sciullo');
              const hasUnnoticed = artists.some((a) => a.toLowerCase() === 'unnoticed');

              if (nonUnnoticed.length > 0) {
                featuring = `feat. ${nonUnnoticed.join(', ')}`;
              } else if (hasTySciullo && !hasUnnoticed) {
                // Track released under Ty Sciullo
                artist = 'UNNOTICED';
                featuring = 'feat. Ty Sciullo';
              }

              const duration = entity.duration ? formatDuration(entity.duration) : '3:00';
              let releaseYear = '';
              if (entity.releaseDate?.isoString) {
                releaseYear = new Date(entity.releaseDate.isoString).getFullYear().toString();
              }

              let cover = '';
              if (entity.visualIdentity?.image?.length) {
                const sorted = [...entity.visualIdentity.image].sort((a, b) => (b.maxWidth || 0) - (a.maxWidth || 0));
                cover = sorted[0]?.url || '';
              }

              const previewAudio = entity.audioPreview?.url || '';

              return {
                success: true,
                provider: 'spotify',
                type: 'Single',
                releaseType: 'Single',
                title: title || 'New Single',
                artist,
                featuring,
                duration,
                releaseYear: releaseYear || '2024',
                cover,
                thumbnail: cover,
                previewAudio,
                audioUrl: previewAudio,
                spotifyUrl: `https://open.spotify.com/track/${trackId}`,
                description: `Studio recording mastered by ${artist}. Available on all streaming platforms.`
              };
            }
          } catch (e) {
            console.warn('Error parsing Spotify embed NEXT_DATA:', e.message);
          }
        }
      }

      // Track HTML fallback for meta tags
      const trackRes = await fetchUrl(`https://open.spotify.com/track/${trackId}`);
      if (trackRes.status === 200) {
        const metaDuration = trackRes.body.match(/<meta\s+name="music:duration"\s+content="(\d+)"/i);
        const metaDate = trackRes.body.match(/<meta\s+name="music:release_date"\s+content="([^"]+)"/i);
        const metaDesc = trackRes.body.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);
        const metaTitle = trackRes.body.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
        const metaImage = trackRes.body.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);

        let duration = '3:00';
        if (metaDuration && metaDuration[1]) {
          duration = formatDuration(parseInt(metaDuration[1], 10));
        }

        let releaseYear = '';
        if (metaDate && metaDate[1]) {
          releaseYear = metaDate[1].slice(0, 4);
        } else if (metaDesc && metaDesc[1]) {
          const yrMatch = metaDesc[1].match(/\b(19\d{2}|20\d{2})\b/);
          if (yrMatch) releaseYear = yrMatch[1];
        }

        return {
          success: true,
          provider: 'spotify',
          type: 'Single',
          releaseType: 'Single',
          title: metaTitle ? metaTitle[1] : 'New Single',
          artist: 'UNNOTICED',
          featuring: '',
          duration,
          releaseYear: releaseYear || '2024',
          cover: metaImage ? metaImage[1] : '',
          thumbnail: metaImage ? metaImage[1] : '',
          previewAudio: '',
          spotifyUrl: `https://open.spotify.com/track/${trackId}`,
          description: metaDesc ? metaDesc[1] : 'Studio single by UNNOTICED.'
        };
      }
    }

    // Album handling
    if (albumMatch) {
      const albumId = albumMatch[1];
      const embedRes = await fetchUrl(`https://open.spotify.com/embed/album/${albumId}`);
      if (embedRes.status === 200) {
        const nextDataMatch = embedRes.body.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
        if (nextDataMatch) {
          try {
            const parsed = JSON.parse(nextDataMatch[1]);
            const entity = parsed.props?.pageProps?.state?.data?.entity;
            if (entity) {
              const albumName = entity.name || entity.title || 'Studio Album';
              const firstTrack = entity.trackList?.[0] || {};
              const title = firstTrack.title || albumName;
              const duration = firstTrack.duration ? formatDuration(firstTrack.duration) : '3:00';
              const previewAudio = firstTrack.audioPreview?.url || '';
              const isSingle = (entity.trackList?.length || 1) === 1;

              let cover = '';
              if (entity.visualIdentity?.image?.length) {
                const sorted = [...entity.visualIdentity.image].sort((a, b) => (b.maxWidth || 0) - (a.maxWidth || 0));
                cover = sorted[0]?.url || '';
              }

              let releaseYear = '';
              if (entity.releaseDate?.isoString) {
                releaseYear = new Date(entity.releaseDate.isoString).getFullYear().toString();
              } else if (typeof entity.releaseDate === 'string') {
                const match = entity.releaseDate.match(/\b(19\d{2}|20\d{2})\b/);
                if (match) releaseYear = match[1];
              }

              // If album embed doesn't have releaseDate on entity, check firstTrack URI
              if (!releaseYear && firstTrack.uri && firstTrack.uri.startsWith('spotify:track:')) {
                const innerTrackId = firstTrack.uri.replace('spotify:track:', '');
                try {
                  const innerTrackRes = await fetchUrl(`https://open.spotify.com/embed/track/${innerTrackId}`);
                  if (innerTrackRes.status === 200) {
                    const trackDataMatch = innerTrackRes.body.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
                    if (trackDataMatch) {
                      const trackParsed = JSON.parse(trackDataMatch[1]);
                      const trackEntity = trackParsed.props?.pageProps?.state?.data?.entity;
                      if (trackEntity?.releaseDate?.isoString) {
                        releaseYear = new Date(trackEntity.releaseDate.isoString).getFullYear().toString();
                      }
                    }
                  }
                } catch (innerErr) {}
              }

              if (!releaseYear) {
                const tLower = (title || albumName).toLowerCase();
                if (tLower.includes('overthink')) releaseYear = '2019';
                else if (tLower.includes('andale') || tLower.includes('ándale')) releaseYear = '2020';
                else releaseYear = '2024';
              }

              return {
                success: true,
                provider: 'spotify',
                type: isSingle ? 'Single' : 'Album Track',
                releaseType: isSingle ? 'Single' : 'Album Track',
                title,
                artist: 'UNNOTICED',
                featuring: '',
                duration,
                releaseYear: releaseYear || '2024',
                cover,
                thumbnail: cover,
                previewAudio,
                spotifyUrl: `https://open.spotify.com/album/${albumId}`,
                description: `Release from ${albumName} by UNNOTICED.`
              };
            }
          } catch (e) {}
        }
      }
    }
  }

  // =========================================================================
  // 2. YOUTUBE
  // =========================================================================
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
    const videoId = extractYouTubeId(cleanUrl);
    if (!videoId) {
      return { success: false, error: 'Invalid YouTube link' };
    }

    let title = '';
    let duration = '3:30';
    let releaseYear = new Date().getFullYear().toString();
    const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const fallbackThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    try {
      const ytRes = await fetchUrl(`https://www.youtube.com/watch?v=${videoId}`);
      if (ytRes.status === 200) {
        const titleMatch = ytRes.body.match(/<meta\s+name="title"\s+content="([^"]+)"/i) || ytRes.body.match(/<title>([^<]+)<\/title>/i);
        if (titleMatch) {
          title = cleanMediaTitle(titleMatch[1].replace(/ - YouTube$/, ''));
        }

        const matchDur = ytRes.body.match(/"approxDurationMs":\s*"(\d+)"/) || ytRes.body.match(/"lengthSeconds":\s*"(\d+)"/);
        if (matchDur) {
          const sec = matchDur[0].includes('approxDurationMs') ? Math.round(parseInt(matchDur[1], 10) / 1000) : parseInt(matchDur[1], 10);
          duration = formatDuration(sec);
        }

        const matchDate = ytRes.body.match(/"publishDate":\s*"([^"]+)"/) || ytRes.body.match(/"datePublished":\s*"([^"]+)"/);
        if (matchDate) {
          releaseYear = matchDate[1].slice(0, 4);
        }
      }
    } catch (e) {
      console.warn('YouTube scraping notice:', e.message);
    }

    if (!title) {
      try {
        const oembedRes = await fetchUrl(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
        if (oembedRes.status === 200) {
          const odata = JSON.parse(oembedRes.body);
          if (odata && odata.title) {
            title = cleanMediaTitle(odata.title);
          }
        }
      } catch (e) {}
    }

    return {
      success: true,
      provider: 'youtube',
      type: 'video',
      title: title || 'UNNOTICED — Music Video',
      artist: 'UNNOTICED',
      author: 'UNNOTICED',
      videoId,
      embedId: videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1`,
      thumbnail,
      fallbackThumbnail,
      duration,
      releaseYear,
      views: '280K views',
      category: 'Music Video',
      description: `Official music visual for "${title}" by UNNOTICED. High-definition studio cut.`,
      originalUrl: cleanUrl
    };
  }

  // =========================================================================
  // 3. SOUNDCLOUD
  // =========================================================================
  if (lower.includes('soundcloud.com')) {
    let title = '';
    let author = 'UNNOTICED';
    let thumbnail = '';
    let duration = '3:15';
    let releaseYear = new Date().getFullYear().toString();

    try {
      const oembedRes = await fetchUrl(`https://soundcloud.com/oembed?url=${encodeURIComponent(cleanUrl)}&format=json`);
      if (oembedRes.status === 200) {
        const data = JSON.parse(oembedRes.body);
        title = data.title || '';
        author = data.author_name || author;
        thumbnail = (data.thumbnail_url || '').replace('-large.jpg', '-t500x500.jpg');
      }
    } catch (e) {}

    return {
      success: true,
      provider: 'soundcloud',
      type: 'Single',
      releaseType: 'Single',
      title: title || 'SoundCloud Exclusive',
      artist: author,
      author,
      thumbnail,
      cover: thumbnail,
      duration,
      releaseYear,
      description: `SoundCloud release by ${author}.`,
      originalUrl: cleanUrl
    };
  }

  return {
    success: false,
    error: 'Unsupported media URL provider'
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  let targetUrl = '';
  if (req.method === 'GET') {
    const urlObj = new URL(req.url, 'http://localhost');
    targetUrl = urlObj.searchParams.get('url') || '';
  } else if (req.method === 'POST') {
    let body = '';
    for await (const chunk of req) {
      body += chunk;
    }
    try {
      const parsed = JSON.parse(body);
      targetUrl = parsed.url || '';
    } catch (e) {}
  }

  if (!targetUrl || !targetUrl.trim()) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'Missing "url" parameter' }));
    return;
  }

  try {
    const result = await resolveMetadata(targetUrl.trim());
    res.statusCode = result.success ? 200 : 422;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: err.message || 'Internal metadata error' }));
  }
}
