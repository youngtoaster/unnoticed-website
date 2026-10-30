import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ARTIST_INFO as DEFAULT_ARTIST,
  TRACKS as DEFAULT_TRACKS,
  BIOGRAPHY_PARAGRAPHS as DEFAULT_BIO,
  VIDEOS as DEFAULT_VIDEOS,
  TOUR_DATES as DEFAULT_TOUR,
  PAST_TOUR_HIGHLIGHTS as DEFAULT_PAST_TOUR,
  MERCH_PRODUCTS as DEFAULT_MERCH,
  GALLERY_IMAGES as DEFAULT_GALLERY,
  SOCIAL_POSTS as DEFAULT_SOCIAL,
  EPK_DATA as DEFAULT_EPK,
  SECTIONS_VISIBILITY as DEFAULT_SECTIONS_VISIBILITY
} from '../data/artistData';

const DataContext = createContext(null);

const STORAGE_KEY = 'unnoticed_cms_v1_data';
// Persistent admin authorization token stored in localStorage so credentials survive tab/browser restarts
const AUTH_KEY = 'unnoticed_admin_persistent_auth_v2';

// Salted SHA-256 administrative authentication credential hash
const TARGET_SALT = 'unnoticed_salt_tyler_2026_';
const TARGET_HASH = '90eeb0b0059529a2ca4bc4b6be0c21b0d3275c1bccba6a7e958b3e336bb1ff17';

export function DataProvider({ children }) {
  // Load saved data or fallback to defaults
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          _lastUpdated: parsed._lastUpdated || Date.now(),
          artistInfo: parsed.artistInfo || DEFAULT_ARTIST,
          tracks: parsed.tracks || DEFAULT_TRACKS,
          biography: parsed.biography || DEFAULT_BIO,
          videos: parsed.videos || DEFAULT_VIDEOS,
          tourDates: parsed.tourDates || DEFAULT_TOUR,
          pastTours: parsed.pastTours || DEFAULT_PAST_TOUR,
          merchProducts: parsed.merchProducts || DEFAULT_MERCH,
          galleryImages: parsed.galleryImages || DEFAULT_GALLERY,
          socialPosts: parsed.socialPosts || DEFAULT_SOCIAL,
          epkData: parsed.epkData || DEFAULT_EPK,
          sectionsVisibility: parsed.sectionsVisibility || DEFAULT_SECTIONS_VISIBILITY,
        };
      }
    } catch (err) {
      console.warn('Failed to parse CMS storage:', err);
    }

    return {
      _lastUpdated: Date.now(),
      artistInfo: DEFAULT_ARTIST,
      tracks: DEFAULT_TRACKS,
      biography: DEFAULT_BIO,
      videos: DEFAULT_VIDEOS,
      tourDates: DEFAULT_TOUR,
      pastTours: DEFAULT_PAST_TOUR,
      merchProducts: DEFAULT_MERCH,
      galleryImages: DEFAULT_GALLERY,
      socialPosts: DEFAULT_SOCIAL,
      epkData: DEFAULT_EPK,
      sectionsVisibility: DEFAULT_SECTIONS_VISIBILITY,
    };
  });

  // Persistent administrative authentication state on this device
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return localStorage.getItem(AUTH_KEY) === 'granted';
    } catch {
      return false;
    }
  });

  // Multi-device synchronization state indicator
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'error'
  const [gitStatus, setGitStatus] = useState({
    isGit: false,
    branch: 'main',
    remoteUrl: 'https://github.com/youngtoaster/unnoticed-website.git',
    lastCommit: null,
    hasUncommitted: false
  });
  const [isPushingGit, setIsPushingGit] = useState(false);

  // Check live git status
  const refreshGitStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/git-sync');
      if (res.ok) {
        const info = await res.json();
        setGitStatus((prev) => ({ ...prev, ...info }));
      }
    } catch {}
  }, []);

  // CROSS-DEVICE CLOUD/NETWORK HYDRATION ON MOUNT:
  // Checks server endpoint /site_data.json to ensure content persists across every device
  useEffect(() => {
    let isMounted = true;
    const syncFromNetwork = async () => {
      try {
        setSyncStatus('syncing');
        const res = await fetch(`/site_data.json?t=${Date.now()}`);
        if (res.ok) {
          const remoteData = await res.json();
          if (remoteData && typeof remoteData === 'object' && isMounted) {
            const localStored = localStorage.getItem(STORAGE_KEY);
            const localParsed = localStored ? JSON.parse(localStored) : null;

            const remoteTime = remoteData._lastUpdated || 0;
            const localTime = localParsed?._lastUpdated || 0;

            // If remote has newer data or if device has no local modifications, hydrate
            if (!localParsed || remoteTime >= localTime) {
              setData((prev) => {
                const merged = {
                  ...prev,
                  ...remoteData,
                  artistInfo: remoteData.artistInfo || prev.artistInfo,
                  tracks: remoteData.tracks || prev.tracks,
                  biography: remoteData.biography || prev.biography,
                  videos: remoteData.videos || prev.videos,
                  tourDates: remoteData.tourDates || prev.tourDates,
                  pastTours: remoteData.pastTours || prev.pastTours,
                  merchProducts: remoteData.merchProducts || prev.merchProducts,
                  galleryImages: remoteData.galleryImages || prev.galleryImages,
                  socialPosts: remoteData.socialPosts || prev.socialPosts,
                  epkData: remoteData.epkData || prev.epkData,
                  sectionsVisibility: remoteData.sectionsVisibility || prev.sectionsVisibility,
                  _lastUpdated: remoteData._lastUpdated || Date.now(),
                };
                try {
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
                } catch (e) {
                  console.warn('LocalStorage save failed:', e);
                }
                return merged;
              });
            }
            setSyncStatus('synced');
          }
        } else {
          setSyncStatus('synced');
        }
      } catch (err) {
        console.warn('Network sync notice (running standalone/offline):', err);
        setSyncStatus('idle');
      }
    };

    syncFromNetwork();
    refreshGitStatus();
    return () => {
      isMounted = false;
    };
  }, [refreshGitStatus]);

  // Dynamic CSS variables injection for Global Site Color Theme
  useEffect(() => {
    const rawPrimary = data.artistInfo?.theme?.primary || data.artistInfo?.neonSign?.color || '#a855f7';
    const theme = {
      primary: rawPrimary,
      secondary: data.artistInfo?.theme?.secondary || '#6366f1',
      accent: data.artistInfo?.theme?.accent || '#06b6d4',
      glow: data.artistInfo?.theme?.glow || rawPrimary
    };

    const hexToRgb = (hex) => {
      if (!hex) return '168, 85, 247';
      const clean = hex.replace('#', '');
      if (clean.length === 3) {
        return `${parseInt(clean[0]+clean[0], 16)}, ${parseInt(clean[1]+clean[1], 16)}, ${parseInt(clean[2]+clean[2], 16)}`;
      }
      if (clean.length === 6) {
        return `${parseInt(clean.substring(0, 2), 16)}, ${parseInt(clean.substring(2, 4), 16)}, ${parseInt(clean.substring(4, 6), 16)}`;
      }
      return '168, 85, 247';
    };

    const getLuminance = (hex) => {
      if (!hex) return 0.3;
      const clean = hex.replace('#', '');
      let r, g, b;
      if (clean.length === 3) {
        r = parseInt(clean[0] + clean[0], 16) / 255;
        g = parseInt(clean[1] + clean[1], 16) / 255;
        b = parseInt(clean[2] + clean[2], 16) / 255;
      } else if (clean.length === 6) {
        r = parseInt(clean.substring(0, 2), 16) / 255;
        g = parseInt(clean.substring(2, 4), 16) / 255;
        b = parseInt(clean.substring(4, 6), 16) / 255;
      } else {
        return 0.3;
      }
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const primaryHex = theme.primary || '#a855f7';
    const lum = getLuminance(primaryHex);
    const isLight = lum > 0.6;
    const onPrimary = isLight ? '#06070a' : '#ffffff';
    const shadowRgb = isLight ? '0, 0, 0' : hexToRgb(primaryHex);
    const btnShadow = isLight
      ? '0 10px 25px -5px rgba(0, 0, 0, 0.45), 0 0 10px rgba(255, 255, 255, 0.12)'
      : `0 10px 25px -5px rgba(${hexToRgb(primaryHex)}, 0.4)`;

    const root = document.documentElement;
    root.style.setProperty('--theme-primary', primaryHex);
    root.style.setProperty('--theme-primary-rgb', hexToRgb(primaryHex));
    root.style.setProperty('--theme-secondary', theme.secondary || '#6366f1');
    root.style.setProperty('--theme-secondary-rgb', hexToRgb(theme.secondary));
    root.style.setProperty('--theme-accent', theme.accent || '#06b6d4');
    root.style.setProperty('--theme-accent-rgb', hexToRgb(theme.accent));
    root.style.setProperty('--theme-glow', theme.glow || primaryHex);
    root.style.setProperty('--theme-on-primary', onPrimary);
    root.style.setProperty('--theme-is-light', isLight ? '1' : '0');
    root.style.setProperty('--theme-shadow-rgb', shadowRgb);
    root.style.setProperty('--theme-btn-shadow', btnShadow);
  }, [data.artistInfo?.theme, data.artistInfo?.neonSign?.color]);

  // Universal Data Updater:
  // Saves to localStorage immediately AND synchronizes to server disk (/api/sync-data)
  const updateData = useCallback((updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      const payload = {
        ...next,
        _lastUpdated: Date.now()
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (err) {
        console.error('LocalStorage write failed:', err);
      }

      // Multi-device persistence bridge:
      // Writes to server disk AND triggers auto-commit/push to GitHub so the repo stays 100% consistent everywhere
      try {
        setSyncStatus('syncing');
        fetch('/api/sync-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            autoGitPush: true,
            commitMessage: `content: auto-sync update from admin [${new Date().toLocaleTimeString()}]`
          })
        })
          .then((r) => {
            if (r.ok) {
              setSyncStatus('synced');
              refreshGitStatus();
            } else {
              setSyncStatus('error');
            }
          })
          .catch(() => {
            // Silently fall back to localStorage in environments without local dev server
            setSyncStatus('synced');
          });
      } catch (err) {
        console.warn('Server sync skipped:', err);
      }

      return payload;
    });
  }, [refreshGitStatus]);

  // Force Push to Server Disk manually
  const syncToServerDisk = useCallback(async () => {
    setSyncStatus('syncing');
    try {
      const payload = {
        ...data,
        _lastUpdated: Date.now(),
        autoGitPush: true
      };
      const res = await fetch('/api/sync-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSyncStatus('synced');
        refreshGitStatus();
        return true;
      }
      setSyncStatus('error');
      return false;
    } catch (err) {
      setSyncStatus('error');
      return false;
    }
  }, [data, refreshGitStatus]);

  // Universal Push to GitHub:
  // Directly commits and pushes content to GitHub origin main (via local Git CLI or GitHub REST API)
  const pushToGitHub = useCallback(async (customMsg = null) => {
    setIsPushingGit(true);
    setSyncStatus('syncing');

    const payload = {
      ...data,
      _lastUpdated: Date.now()
    };

    // 1. First attempt: Push via local Git CLI endpoint (/api/git-sync)
    try {
      const res = await fetch('/api/git-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload,
          commitMessage: customMsg || `content: sync CMS updates from site admin [${new Date().toLocaleDateString()}]`
        })
      });

      if (res.ok) {
        const result = await res.json();
        setIsPushingGit(false);
        setSyncStatus('synced');
        refreshGitStatus();
        return { success: true, method: 'local-git', ...result };
      }
    } catch (localErr) {
      console.warn('Local git endpoint unreachable, checking GitHub API fallback:', localErr);
    }

    // 2. Fallback attempt: Push directly to GitHub REST API (for remote/production deployments)
    const storedToken = localStorage.getItem('unnoticed_github_token');
    if (storedToken) {
      try {
        const owner = 'youngtoaster';
        const repo = 'unnoticed-website';
        const filePath = 'public/site_data.json';
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

        // Get current file sha
        let sha = null;
        try {
          const getRes = await fetch(apiUrl, {
            headers: {
              Authorization: `token ${storedToken}`,
              Accept: 'application/vnd.github.v3+json'
            }
          });
          if (getRes.ok) {
            const fileData = await getRes.json();
            sha = fileData.sha;
          }
        } catch {}

        // Base64 encode JSON
        const jsonString = JSON.stringify(payload, null, 2);
        const encodedContent = btoa(unescape(encodeURIComponent(jsonString)));

        const putRes = await fetch(apiUrl, {
          method: 'PUT',
          headers: {
            Authorization: `token ${storedToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github.v3+json'
          },
          body: JSON.stringify({
            message: customMsg || `content: CMS update via GitHub API [${new Date().toISOString()}]`,
            content: encodedContent,
            sha: sha || undefined,
            branch: 'main'
          })
        });

        if (putRes.ok) {
          const putData = await putRes.json();
          setIsPushingGit(false);
          setSyncStatus('synced');
          return {
            success: true,
            method: 'github-api',
            hash: putData.commit?.sha?.slice(0, 7),
            message: 'Pushed directly to GitHub repository via GitHub REST API'
          };
        }
      } catch (apiErr) {
        console.error('GitHub API push failed:', apiErr);
      }
    }

    setIsPushingGit(false);
    setSyncStatus('error');
    return {
      success: false,
      error: 'Could not connect to local Git server or GitHub API.'
    };
  }, [data, refreshGitStatus]);

  // Section Visibility Controls (Turn ON/OFF from Public Site)
  const toggleSectionVisibility = useCallback((sectionKey) => {
    updateData((prev) => {
      const current = prev.sectionsVisibility || DEFAULT_SECTIONS_VISIBILITY;
      const updated = {
        ...current,
        [sectionKey]: !(current[sectionKey] ?? true)
      };
      return {
        ...prev,
        sectionsVisibility: updated
      };
    });
  }, [updateData]);

  const setSectionVisibility = useCallback((sectionKey, isVisible) => {
    updateData((prev) => {
      const current = prev.sectionsVisibility || DEFAULT_SECTIONS_VISIBILITY;
      return {
        ...prev,
        sectionsVisibility: {
          ...current,
          [sectionKey]: !!isVisible
        }
      };
    });
  }, [updateData]);

  // Section "Delete All" Cleaner (Empty a section collection)
  const clearSection = useCallback((collectionKey) => {
    updateData((prev) => {
      if (collectionKey === 'biography') {
        return { ...prev, biography: [] };
      }
      return {
        ...prev,
        [collectionKey]: []
      };
    });
  }, [updateData]);

  // Section "Reset to Defaults" (Restore specific section defaults)
  const resetSectionToDefault = useCallback((collectionKey) => {
    const defaultMap = {
      tracks: DEFAULT_TRACKS,
      videos: DEFAULT_VIDEOS,
      tourDates: DEFAULT_TOUR,
      pastTours: DEFAULT_PAST_TOUR,
      merchProducts: DEFAULT_MERCH,
      biography: DEFAULT_BIO,
      galleryImages: DEFAULT_GALLERY,
      socialPosts: DEFAULT_SOCIAL,
      epkData: DEFAULT_EPK,
    };

    if (defaultMap[collectionKey]) {
      updateData((prev) => ({
        ...prev,
        [collectionKey]: defaultMap[collectionKey]
      }));
    }
  }, [updateData]);

  // Reorder helper: moves item at fromIndex to toIndex in array under key
  const reorderCollection = (key, fromIndex, toIndex) => {
    updateData((prev) => {
      const list = [...(prev[key] || [])];
      if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) {
        return prev;
      }
      const [movedItem] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, movedItem);
      return {
        ...prev,
        [key]: list,
      };
    });
  };

  // Secure Password Verification with Web Crypto SHA-256
  const verifyPassword = async (inputPassword) => {
    try {
      const enc = new TextEncoder();
      const payload = enc.encode(TARGET_SALT + inputPassword);
      const hashBuffer = await crypto.subtle.digest('SHA-256', payload);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      if (hashHex === TARGET_HASH) {
        setIsAdminLoggedIn(true);
        // Persist to localStorage so the device remembers this admin login indefinitely
        localStorage.setItem(AUTH_KEY, 'granted');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Crypto error:', err);
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem(AUTH_KEY);
  };

  // Reset entire site to initial default content
  const resetToDefaults = () => {
    const defaults = {
      _lastUpdated: Date.now(),
      artistInfo: DEFAULT_ARTIST,
      tracks: DEFAULT_TRACKS,
      biography: DEFAULT_BIO,
      videos: DEFAULT_VIDEOS,
      tourDates: DEFAULT_TOUR,
      pastTours: DEFAULT_PAST_TOUR,
      merchProducts: DEFAULT_MERCH,
      galleryImages: DEFAULT_GALLERY,
      socialPosts: DEFAULT_SOCIAL,
      epkData: DEFAULT_EPK,
      sectionsVisibility: DEFAULT_SECTIONS_VISIBILITY,
    };
    updateData(defaults);
  };

  // Export full JSON Backup
  const exportBackup = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unnoticed_site_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const importBackup = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      updateData(parsed);
      return true;
    } catch (err) {
      console.error('Failed to import JSON backup:', err);
      return false;
    }
  };

  return (
    <DataContext.Provider
      value={{
        ...data,
        siteTheme: data.artistInfo?.theme || {
          id: 'violet',
          name: 'Electric Violet',
          primary: '#a855f7',
          secondary: '#6366f1',
          accent: '#06b6d4',
          glow: '#a855f7'
        },
        sectionsVisibility: data.sectionsVisibility || DEFAULT_SECTIONS_VISIBILITY,
        updateData,
        reorderCollection,
        isAdminLoggedIn,
        isAdminAuthenticated: isAdminLoggedIn, // Aliased for seamless compatibility across components
        verifyPassword,
        logoutAdmin,
        resetToDefaults,
        exportBackup,
        importBackup,
        syncStatus,
        syncToServerDisk,
        gitStatus,
        isPushingGit,
        pushToGitHub,
        refreshGitStatus,
        toggleSectionVisibility,
        setSectionVisibility,
        clearSection,
        resetSectionToDefault,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useSiteData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useSiteData must be used within a DataProvider');
  }
  return context;
}
