import React from 'react';

export default function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = '',
  shimmerColor = 'rgba(255, 255, 255, 0.95)'
}) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`bg-clip-text inline-block ${disabled ? '' : 'animate-shine'} ${className}`}
      style={{
        backgroundImage: `linear-gradient(120deg, rgba(255, 255, 255, 0.35) 30%, ${shimmerColor} 50%, rgba(255, 255, 255, 0.35) 70%)`,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animationDuration,
      }}
    >
      {text}
    </span>
  );
}
