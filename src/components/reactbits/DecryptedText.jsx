import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+<>~';

export default function DecryptedText({
  text,
  speed = 45,
  maxIterations = 14,
  characters = DEFAULT_CHARS,
  animateOn = 'mount', // 'mount', 'hover', 'both'
  className = '',
  revealSpeed = 1
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  const startDecryption = () => {
    let iteration = 0;
    const target = text;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        target
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration / revealSpeed) {
              return target[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      if (iteration >= target.length * revealSpeed + maxIterations) {
        clearInterval(intervalRef.current);
        setDisplayText(target);
      }

      iteration += 1;
    }, speed);
  };

  useEffect(() => {
    if (animateOn === 'mount' || animateOn === 'both') {
      startDecryption();
    } else {
      setDisplayText(text);
    }
    return () => clearInterval(intervalRef.current);
  }, [text]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (animateOn === 'hover' || animateOn === 'both') {
      startDecryption();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`inline-block font-mono ${className}`}
    >
      {displayText}
    </span>
  );
}
