# UNNOTICED — Official Artist Experience Website

> *"Once known as Ty Sciullo, now a man unseen."*

A modern, fluid web experience built for recording artist **UNNOTICED** (formerly **Ty Sciullo**). Featuring interactive micro-interactions, spring physics, and kinetic typography inspired by [useplanes.com/components](https://useplanes.com/components/) and [designeer.xyz](https://designeer.xyz/). Sourced with real artist discography, biography, and audio from [Groover](https://groover.me/unnoticed).

---

## ⚡ Tech Stack & Architecture

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + `@tailwindcss/vite`
- **Animations**: Framer Motion 14 (Spring physics, layout morphs, gesture drags)
- **Effects**: HTML5 Fluid Particle & Light Trails Canvas + Canvas Confetti
- **Icons**: Lucide Icons + Custom Vector Brand Marks

---

## 🎵 Features & Modules

1. **Interactive Fluid Particle & Light Canvas (`FluidCanvas.jsx`)**
   - Mouse-tracking chromatic light waves (ultraviolet, cyan, neon magenta) with smooth lerp physics.
   - Spawns organic fluid particle trails and ambient pulsing orbs that react when music plays.

2. **Kinetic Hero & Identity Morph (`HeroSection.jsx`)**
   - High-contrast typography with chromatic text reveal.
   - Interactive identity card flipping between **TY SCIULLO (2016–2023)** and **UNNOTICED (Current Era)**.
   - Quick preview launcher for featured single *"Ándale"*.

3. **Music & Genius-Style Lyric Annotations (`MusicSection.jsx`)**
   - **Self-Hosted Audio Player**: Real 30-second preview streams for *"Andale"*, *"Overthink"*, *"This Ain't Love"*, *"Baddie"*, *"SMILE"*, and *"Calling for Help"*.
   - **Genius-Style Lyric Drawer**: Clickable underlined lyrics revealing verified artist annotations with UNNOTICED's personal commentary behind the bars.
   - **Official Spotify Embed Player**: Switchable embed player connecting directly to full Spotify releases.
   - **Streaming Platform Hub**: One-click direct links to Spotify, Apple Music, YouTube Music, and SoundCloud.

4. **Multi-Paragraph Biography (`BioSection.jsx`)**
   - High-resolution artist portrait with 3D tilt spotlight card.
   - Interactive chapter narrative:
     1. *The Industrial Roots of McKees Rocks*
     2. *The Ty Sciullo Era & The Rise (2016–2023)*
     3. *Metamorphosis: Now A Man Unseen (UNNOTICED)*
   - Artist pull quote highlighting family blue-collar roots and musical motivation.

5. **Two-Column YouTube Video Showcase (`VideoSection.jsx`)**
   - High-impact video cards with view counts and duration pills.
   - Interactive Theatre Mode Modal for viewing video details and stream links.
   - **Channel Subscription Banner**: One-click subscribe CTA with direct link to `@Unnoticed` on YouTube.

6. **Tour Dates & Live Stage Schedule (`TourSection.jsx`)**
   - Upcoming 2026/2027 tour schedule with status badges (*Selling Fast*, *Low Tickets*, *Hometown Capstone*).
   - VIP Soundcheck Experience tags and direct ticket vendor links.
   - Past Tour Archive toggle (Pittsburgh, Cleveland, Chicago, DC).
   - "Request a Tour Date in Your City" interactive RSVP modal with live feedback.

7. **Store / Merch Atelier (`MerchSection.jsx`)**
   - Catalog grid featuring heavyweight hoodies, vintage tees, 180g bone-white vinyl, caps, and screen prints.
   - Category filtering & Quick View Modal with size and color selectors.
   - Slide-out **Shopping Cart Drawer** with real-time subtotal, quantity controls, and checkout link.

8. **Full-Width Visual Gallery Carousel (`GallerySection.jsx`)**
   - Full-width image carousel slideshow with drag gestures, thumbnail bar, and autoplay toggle.
   - Slide captions and full-screen Lightbox with zoom and keyboard navigation.

9. **Live Social Feed Container (`SocialFeedSection.jsx`)**
   - Interactive Instagram & TikTok cards replicating live social reels.
   - Working heart like buttons with interactive counters, comment counts, sound tags, and links to `@unnoticedmusic`.

10. **Mailing List Newsletter Capture (`MailingListSection.jsx`)**
    - "The Unseen Syndicate" VIP capture box for unreleased studio leaks & pre-sale codes.
    - Animated validation and celebration confetti explosion upon submission.

11. **Dedicated Electronic Press Kit (`EPKView.jsx`)**
    - Toggleable dedicated EPK view for festival bookers, promoters, and media.
    - Downloadable High-Res Media Asset Bundles (ZIP packages, 300DPI promo shots, vector logo kit, PDF tech rider).
    - Critical press quotes, audience demographics, technical rider & stage plot specifications.
    - Direct Industry Inquiry Form with budget estimator and routing.

12. **Persistent Floating Audio Player Bar (`AudioPlayerBar.jsx`)**
    - Scrubbable timeline with real-time progress, volume slider, mute toggle, track skipper, and animated equalizer bars.

---

## 🚀 Running the Project Locally

```bash
# Navigate to the project directory
cd unnoticed-website

# Install dependencies (if not already installed)
npm install

# Start Vite development server
npm run dev

# Build for production
npm run build
```

Open [http://127.0.0.1:5173/](http://127.0.0.1:5173/) in your browser.
