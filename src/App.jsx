import React, { useState } from 'react';
import { TRACKS, ARTIST_INFO, MERCH_PRODUCTS } from './data/artistData';
import FluidCanvas from './components/FluidCanvas';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MusicSection from './components/MusicSection';
import BioSection from './components/BioSection';
import VideoSection from './components/VideoSection';
import TourSection from './components/TourSection';
import MerchSection from './components/MerchSection';
import GallerySection from './components/GallerySection';
import SocialFeedSection from './components/SocialFeedSection';
import MailingListSection from './components/MailingListSection';
import AudioPlayerBar from './components/AudioPlayerBar';
import EPKView from './components/EPKView';
import Footer from './components/Footer';

export default function App() {
  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeView, setActiveView] = useState('main'); // 'main' | 'epk'
  const [cartOpen, setCartOpen] = useState(false);
  
  // Shopping Cart state
  const [cart, setCart] = useState([
    {
      id: MERCH_PRODUCTS[0].id,
      name: MERCH_PRODUCTS[0].name,
      price: MERCH_PRODUCTS[0].price,
      selectedSize: 'L',
      image: MERCH_PRODUCTS[0].image,
      quantity: 1
    }
  ]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const onSelectTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const onNextTrack = () => {
    const currentIndex = TRACKS.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % TRACKS.length;
    setCurrentTrack(TRACKS[nextIndex]);
    setIsPlaying(true);
  };

  const onPrevTrack = () => {
    const currentIndex = TRACKS.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + TRACKS.length) % TRACKS.length;
    setCurrentTrack(TRACKS[prevIndex]);
    setIsPlaying(true);
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

  return (
    <div className="relative min-h-screen bg-[#060608] text-slate-100 overflow-x-hidden selection:bg-purple-600/30 selection:text-purple-200">
      
      {/* Interactive Fluid Particle & Light Trails Canvas */}
      <FluidCanvas isPlaying={isPlaying} />

      {/* Persistent Floating Navbar with Island aesthetic */}
      <Navbar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        cartCount={cartCount}
        openCart={() => setCartOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main View vs. Dedicated EPK Page View */}
      {activeView === 'main' ? (
        <main className="relative z-10">
          {/* 1. Kinetic Hero with Identity Morph & Sound Reactive Badges */}
          <HeroSection
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            onSelectTrack={onSelectTrack}
          />

          {/* 2. Music: Self-Hosted Preview Clips, Genius Lyric Annotations, Spotify Embeds */}
          <MusicSection
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            onSelectTrack={onSelectTrack}
          />

          {/* 3. Bio: McKees Rocks Roots, Ty Sciullo Era, Rebirth into Unnoticed */}
          <BioSection />

          {/* 4. Videos: Two-Column YouTube Showcase & Channel Subscription Banner */}
          <VideoSection />

          {/* 5. Tour Dates: 2026/2027 Schedule, VIP Tickets, Past Tour Archive & RSVP */}
          <TourSection />

          {/* 6. Store / Merch: Catalog Grid, Sizing, Quick View, Slide-Out Cart */}
          <MerchSection
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateCartQuantity={updateCartQuantity}
            cartOpen={cartOpen}
            setCartOpen={setCartOpen}
            cartTotal={cartTotal}
          />

          {/* 7. Gallery: Full-Width Slideshow Carousel with Navigation & Fullscreen Lightbox */}
          <GallerySection />

          {/* 8. Social Feed: Live Instagram & TikTok Reel Cards with Sound Tags */}
          <SocialFeedSection />

          {/* 9. Mailing List: Newsletter Capture linked to marketing service + Confetti */}
          <MailingListSection />
        </main>
      ) : (
        <main className="relative z-10">
          {/* Dedicated Electronic Press Kit (EPK) View */}
          <EPKView onBackToMain={() => setActiveView('main')} />
        </main>
      )}

      {/* Persistent Floating Studio Audio Player Bar */}
      <AudioPlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        onNextTrack={onNextTrack}
        onPrevTrack={onPrevTrack}
        onSelectTrack={onSelectTrack}
      />

      {/* Footer */}
      <Footer onOpenEPK={() => setActiveView('epk')} />
    </div>
  );
}
