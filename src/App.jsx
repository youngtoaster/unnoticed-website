import React, { useState, useEffect } from 'react';
import { DataProvider, useSiteData } from './context/DataContext';
import FluidCanvas from './components/FluidCanvas';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MusicSection from './components/MusicSection';
import BioSection from './components/BioSection';
import MediaSection from './components/MediaSection';
import TourSection from './components/TourSection';
import MerchSection from './components/MerchSection';
import SocialFeedSection from './components/SocialFeedSection';
import MailingListSection from './components/MailingListSection';
import AudioPlayerBar from './components/AudioPlayerBar';
import EPKView from './components/EPKView';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';
import ClickSpark from './components/reactbits/ClickSpark';

function AppContent() {
  const { tracks, merchProducts, isAdminAuthenticated, sectionsVisibility } = useSiteData();
  const [currentTrack, setCurrentTrack] = useState(tracks && tracks[0] ? tracks[0] : null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [activeView, setActiveView] = useState('main'); // 'main' | 'epk' | 'admin'
  const [cartOpen, setCartOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);

  // Keep currentTrack synchronized if tracks change or on initial load
  useEffect(() => {
    if (!currentTrack && tracks && tracks.length > 0) {
      setCurrentTrack(tracks[0]);
    } else if (currentTrack && tracks && tracks.length > 0) {
      const match = tracks.find((t) => t.id === currentTrack.id);
      if (match) {
        setCurrentTrack(match);
      } else {
        setCurrentTrack(tracks[0]);
      }
    }
  }, [tracks]);

  // Listen for stealth URL parameters / hash (#admin or ?admin=true)
  useEffect(() => {
    const checkAdminTrigger = () => {
      const isHashAdmin = window.location.hash.toLowerCase() === '#admin';
      const isSearchAdmin = window.location.search.includes('admin=true');
      if (isHashAdmin || isSearchAdmin) {
        if (isAdminAuthenticated) {
          setActiveView('admin');
        } else {
          setAdminLoginOpen(true);
        }
      }
    };
    checkAdminTrigger();
    window.addEventListener('hashchange', checkAdminTrigger);
    return () => window.removeEventListener('hashchange', checkAdminTrigger);
  }, [isAdminAuthenticated]);

  // Stealth hotkey: Ctrl+Shift+U (or Cmd+Shift+U)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        if (isAdminAuthenticated) {
          setActiveView((prev) => (prev === 'admin' ? 'main' : 'admin'));
        } else {
          setAdminLoginOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminAuthenticated]);

  // Shopping Cart state
  const [cart, setCart] = useState(() => {
    const firstProduct = merchProducts && merchProducts[0] ? merchProducts[0] : null;
    if (!firstProduct) return [];
    return [
      {
        id: firstProduct.id,
        name: firstProduct.name,
        price: firstProduct.price,
        selectedSize: firstProduct.sizes ? firstProduct.sizes[0] : 'L',
        image: firstProduct.image,
        quantity: 1
      }
    ];
  });

  const togglePlay = () => {
    if (!isPlayerVisible) {
      setIsPlayerVisible(true);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const onSelectTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setIsPlayerVisible(true);
  };

  const onNextTrack = () => {
    if (!tracks || tracks.length === 0) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
    setIsPlaying(true);
    setIsPlayerVisible(true);
  };

  const onPrevTrack = () => {
    if (!tracks || tracks.length === 0) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrack(tracks[prevIndex]);
    setIsPlaying(true);
    setIsPlayerVisible(true);
  };

  const handleClosePlayer = () => {
    setIsPlaying(false);
    setIsPlayerVisible(false);
  };

  // Cart operations
  const addToCart = (product, size) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.selectedSize === size
      );
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          selectedSize: size,
          image: product.image,
          quantity: 1
        }
      ];
    });
  };

  const removeFromCart = (id, size) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.selectedSize === size)));
  };

  const updateCartQuantity = (id, size, qty) => {
    if (qty <= 0) {
      removeFromCart(id, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.selectedSize === size
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleOpenAdminTrigger = () => {
    if (isAdminAuthenticated) {
      setActiveView('admin');
    } else {
      setAdminLoginOpen(true);
    }
  };

  return (
    <ClickSpark sparkColor="#c084fc" sparkSize={7} sparkCount={7} duration={400}>
      <div className="relative min-h-screen bg-[#060608] text-slate-100 overflow-x-hidden selection:bg-purple-600/30 selection:text-purple-200">
        
        {/* Interactive Fluid Particle & Light Trails Canvas */}
        <FluidCanvas isPlaying={isPlaying} />

      {/* Secret Admin Login Modal */}
      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onSuccess={() => {
          setAdminLoginOpen(false);
          setActiveView('admin');
        }}
      />

      {/* View routing: Admin Dashboard vs EPK vs Main Experience */}
      {activeView === 'admin' ? (
        <AdminDashboard onReturnToSite={() => setActiveView('main')} />
      ) : (
        <>
          {/* Persistent Floating Navbar with Island aesthetic */}
          <Navbar
            currentTrack={currentTrack || tracks[0]}
            isPlaying={isPlaying}
            isPlayerVisible={isPlayerVisible}
            togglePlay={togglePlay}
            cartCount={cartCount}
            openCart={() => setCartOpen(true)}
            activeView={activeView}
            setActiveView={setActiveView}
            onOpenAdmin={handleOpenAdminTrigger}
          />

          {activeView === 'main' ? (
            <main className="relative z-10">
              {/* 1. Kinetic Hero with Identity Morph & Sound Reactive Badges */}
              <HeroSection
                currentTrack={currentTrack || tracks[0]}
                isPlaying={isPlaying}
                togglePlay={togglePlay}
                onSelectTrack={onSelectTrack}
              />

              {/* 2. Music: Self-Hosted Preview Clips, Genius Lyric Annotations, Spotify Embeds */}
              {sectionsVisibility?.music !== false && (
                <MusicSection
                  currentTrack={currentTrack || tracks[0]}
                  isPlaying={isPlaying}
                  togglePlay={togglePlay}
                  onSelectTrack={onSelectTrack}
                />
              )}

              {/* 3. Bio: McKees Rocks Roots, Ty Sciullo Era, Rebirth into Unnoticed */}
              {sectionsVisibility?.bio !== false && (
                <BioSection />
              )}

              {/* 4. Visual & Media Archive: Combined Videos & Photography Gallery */}
              {sectionsVisibility?.media !== false && (
                <MediaSection />
              )}

              {/* 5. Tour Dates: Schedule, VIP Tickets, Past Tour Archive & RSVP */}
              {sectionsVisibility?.tour !== false && (
                <TourSection />
              )}

              {/* 6. Store / Merch: Catalog Grid, Sizing, Quick View, Slide-Out Cart */}
              {sectionsVisibility?.store !== false && (
                <MerchSection
                  cart={cart}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                  updateCartQuantity={updateCartQuantity}
                  cartOpen={cartOpen}
                  setCartOpen={setCartOpen}
                  cartTotal={cartTotal}
                />
              )}

              {/* 7. Community: Social Feed & Newsletter Syndicate */}
              {sectionsVisibility?.social !== false && (
                <SocialFeedSection />
              )}

              {/* 8. VIP Newsletter Syndicate */}
              {sectionsVisibility?.newsletter !== false && (
                <MailingListSection />
              )}
            </main>
          ) : (
            <main className="relative z-10">
              {/* Dedicated Electronic Press Kit (EPK) View */}
              <EPKView onBackToMain={() => setActiveView('main')} />
            </main>
          )}

          {/* Floating Studio Dynamic Island Audio Player Bar (only shown when user selects or plays music) */}
          {currentTrack && (
            <AudioPlayerBar
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              isPlayerVisible={isPlayerVisible}
              togglePlay={togglePlay}
              onNextTrack={onNextTrack}
              onPrevTrack={onPrevTrack}
              onSelectTrack={onSelectTrack}
              onClosePlayer={handleClosePlayer}
            />
          )}

          {/* Footer with stealth easter-egg trigger */}
          <Footer
            onOpenEPK={() => setActiveView('epk')}
            onOpenAdmin={handleOpenAdminTrigger}
          />
        </>
      )}

      </div>
    </ClickSpark>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}
