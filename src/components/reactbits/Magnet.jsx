import React, { useRef, useState, useEffect } from 'react';

export default function Magnet({
  children,
  padding = 60,
  magnetStrength = 2.5,
  disabled = false,
  className = '',
  activeScale = 1.02
}) {
  const magnetRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (disabled) return;

    const handleMouseMove = (e) => {
      if (!magnetRef.current) return;
      const rect = magnetRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < rect.width / 2 + padding) {
        setIsHovered(true);
        setPosition({
          x: distX / magnetStrength,
          y: distY / magnetStrength,
        });
      } else {
        setIsHovered(false);
        setPosition({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setPosition({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [disabled, padding, magnetStrength]);

  return (
    <div
      ref={magnetRef}
      className={`inline-block ${className}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isHovered ? activeScale : 1})`,
        transition: isHovered
          ? 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)'
          : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
}
