import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(var(--theme-primary-rgb, 168, 85, 247), 0.22)',
  tilt = true,
  onClick
}) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  // Dynamically resolve hardcoded default purple to active theme CSS variable
  const resolvedSpotlight = spotlightColor.includes('168, 85, 247')
    ? spotlightColor.replace('168, 85, 247', 'var(--theme-primary-rgb, 168, 85, 247)')
    : spotlightColor;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (tilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      setRotate({ x: rotateX, y: rotateY });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        rotateX: rotate.x,
        rotateY: rotate.y,
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={`relative overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0b0c14] shadow-2xl shadow-black/90 transition-colors duration-300 ${
        isHovered ? 'border-purple-500/50 shadow-purple-500/10' : ''
      } ${className}`}
    >
      {/* Dynamic radial spotlight tracking mouse */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, ${resolvedSpotlight}, transparent 50%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
