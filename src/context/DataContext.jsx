import React, { createContext, useContext, useState, useEffect } from 'react';
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
  EPK_DATA as DEFAULT_EPK
} from '../data/artistData';

const DataContext = createContext(null);

const STORAGE_KEY = 'unnoticed_cms_v1_data';
const AUTH_KEY = 'unnoticed_admin_session_token';

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
        };
      }
    } catch (err) {
      console.warn('Failed to parse CMS storage:', err);
    }

    return {
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
    };
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === 'granted';
    } catch {
      return false;
    }
  });

  // Sync to localStorage whenever data changes
  const updateData = (updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        console.error('LocalStorage write failed:', err);
      }
      return next;
    });
  };

  // Reorder helper: moves item at fromIndex to toIndex in array under key
  const reorderCollection = (key, fromIndex, toIndex) => {
    updateData((prev) => {
      const list = [...prev[key]];
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
        sessionStorage.setItem(AUTH_KEY, 'granted');
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
    sessionStorage.removeItem(AUTH_KEY);
  };

  // Reset to initial default content
  const resetToDefaults = () => {
    const defaults = {
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
        updateData,
        reorderCollection,
        isAdminLoggedIn,
        verifyPassword,
        logoutAdmin,
        resetToDefaults,
        exportBackup,
        importBackup,
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
