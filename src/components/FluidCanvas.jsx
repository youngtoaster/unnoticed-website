import React, { useEffect, useRef } from 'react';

/**
 * Interactive fluid particle & chromatic light canvas
 * Inspired by designeer.xyz and useplanes.com/components
 * Creates smooth organic trails, glowing particle physics, and ambient fluid mesh
 */
export default function FluidCanvas({ isPlaying = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse tracking with smooth lerp
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      radius: 120,
      active: false
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Particle pool for fluid cursor trails
    const particles = [];
    const maxParticles = 65;

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1.2;
        this.vx = (Math.random() - 0.5) * 1.8;
        this.vy = (Math.random() - 0.5) * 1.8;
        this.life = 1;
        this.decay = Math.random() * 0.015 + 0.008;
        // Ultraviolet / Cyan / Neon Magenta color palette
        const colors = [
          'rgba(139, 92, 246,', // Purple
          'rgba(192, 132, 252,', // Lavender
          'rgba(56, 189, 248,',  // Cyan
          'rgba(236, 72, 153,'   // Pink
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.size *= 0.985;
      }

      draw() {
        ctx.save();
        ctx.fillStyle = `${this.color} ${Math.max(0, this.life * 0.5)})`;
        ctx.shadowBlur = 14;
        ctx.shadowColor = 'rgba(139, 92, 246, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0.2, this.size), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Ambient floating orbs in background
    const orbs = [
      { x: width * 0.2, y: height * 0.25, r: 240, vx: 0.3, vy: 0.2, color: 'rgba(139, 92, 246, 0.06)' },
      { x: width * 0.8, y: height * 0.4, r: 300, vx: -0.25, vy: 0.3, color: 'rgba(56, 189, 248, 0.05)' },
      { x: width * 0.5, y: height * 0.8, r: 260, vx: 0.2, vy: -0.25, color: 'rgba(192, 132, 252, 0.05)' }
    ];

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Lerp mouse
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      // Draw subtle ambient glowing orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -orb.r) orb.x = width + orb.r;
        if (orb.x > width + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = height + orb.r;
        if (orb.y > height + orb.r) orb.y = -orb.r;

        const pulse = Math.sin(tick * 0.02) * 20;
        const currentR = Math.max(10, orb.r + pulse);

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, currentR);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'rgba(6, 6, 8, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, currentR, 0, Math.PI * 2);
        ctx.fill();
      });

      // Interactive mouse aura
      if (mouse.active) {
        const mouseGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radius * (isPlaying ? 1.4 : 1)
        );
        mouseGlow.addColorStop(0, 'rgba(139, 92, 246, 0.1)');
        mouseGlow.addColorStop(0.5, 'rgba(56, 189, 248, 0.03)');
        mouseGlow.addColorStop(1, 'rgba(6, 6, 8, 0)');

        ctx.fillStyle = mouseGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius * (isPlaying ? 1.4 : 1), 0, Math.PI * 2);
        ctx.fill();

        // Spawn particles along mouse movement
        if (particles.length < maxParticles && Math.random() > 0.35) {
          particles.push(new Particle(mouse.x + (Math.random() - 0.5) * 25, mouse.y + (Math.random() - 0.5) * 25));
        }
      }

      // Update & draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();
        if (p.life <= 0 || p.size <= 0.3) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  );
}
