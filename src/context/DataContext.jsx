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
    return () => {
      isMounted = false;
    };
  }, []);

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

    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.primary || '#a855f7');
    root.style.setProperty('--theme-primary-rgb', hexToRgb(theme.primary));
    root.style.setProperty('--theme-secondary', theme.secondary || '#6366f1');
    root.style.setProperty('--theme-secondary-rgb', hexToRgb(theme.secondary));
    root.style.setProperty('--theme-accent', theme.accent || '#06b6d4');
    root.style.setProperty('--theme-accent-rgb', hexToRgb(theme.accent));
    root.style.setProperty('--theme-glow', theme.glow || theme.primary || '#a855f7');
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
      // Writes to server disk so all other devices loading the site receive the updates
      try {
        setSyncStatus('syncing');
        fetch('/api/sync-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
          .then((r) => {
            if (r.ok) {
              setSyncStatus('synced');
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
  }, []);

  // Force Push to Server Disk manually
  const syncToServerDisk = useCallback(async () => {
    setSyncStatus('syncing');
    try {
      const payload = {
        ...data,
        _lastUpdated: Date.now()
      };
      const res = await fetch('/api/sync-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSyncStatus('synced');
        return true;
      }
      setSyncStatus('error');
      return false;
    } catch (err) {
      setSyncStatus('error');
      return false;
    }
  }, [data]);

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
