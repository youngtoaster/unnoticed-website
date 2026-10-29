import React, { useRef, useEffect } from 'react';

export default function ClickSpark({
  children,
  sparkColor = '#a855f7',
  sparkSize = 8,
  sparkCount = 8,
  duration = 450,
  className = ''
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      const container = containerRef.current;
      if (container && canvas) {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = performance.now();

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = now - spark.startTime;
        if (elapsed > duration) return false;

        const progress = elapsed / duration;
        const currentDist = spark.speed * progress * 40;
        const x = spark.x + Math.cos(spark.angle) * currentDist;
        const y = spark.y + Math.sin(spark.angle) * currentDist;
        const alpha = 1 - progress;

        ctx.save();
        ctx.strokeStyle = spark.color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(
          x + Math.cos(spark.angle) * (sparkSize * (1 - progress)),
          y + Math.sin(spark.angle) * (sparkSize * (1 - progress))
        );
        ctx.stroke();
        ctx.restore();

        return true;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [duration, sparkSize]);

  const handleClick = (e) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();

    const colors = [sparkColor, '#c084fc', '#38bdf8', '#ffffff'];

    for (let i = 0; i < sparkCount; i++) {
      const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.4;
      const speed = 0.8 + Math.random() * 0.8;
      const color = colors[Math.floor(Math.random() * colors.length)];

      sparksRef.current.push({
        x,
        y,
        angle,
        speed,
        color,
        startTime: now
      });
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`relative ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-50 h-full w-full"
      />
      {children}
    </div>
  );
}
