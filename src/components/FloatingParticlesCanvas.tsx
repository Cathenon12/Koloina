import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  rotation: number;
  rotSpeed: number;
  swayOffset: number;
  swaySpeed: number;
  type: 'heart' | 'rose' | 'petal' | 'bouquet' | 'star';
  color: string;
  emoji?: string;
}

export const FloatingParticlesCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const bouquetEmojis = ['💐', '🌹', '🌸', '🌷', '🌺', '🥀', '✨', '💖', '💕'];
    const heartColors = [
      'rgba(244, 63, 94, ',   // rose-500
      'rgba(236, 72, 153, ',  // pink-500
      'rgba(225, 29, 72, ',   // rose-600
      'rgba(251, 113, 133, ', // rose-400
      'rgba(249, 168, 212, ', // pink-300
      'rgba(251, 191, 36, '   // amber gold
    ];

    const particles: Particle[] = [];
    const PARTICLE_COUNT = Math.min(65, Math.floor((width * height) / 18000));

    function createParticle(initialY?: number): Particle {
      const typeChance = Math.random();
      let type: Particle['type'] = 'heart';
      let emoji: string | undefined = undefined;

      if (typeChance < 0.35) {
        type = 'heart';
      } else if (typeChance < 0.65) {
        type = 'petal';
      } else if (typeChance < 0.85) {
        type = 'bouquet';
        emoji = bouquetEmojis[Math.floor(Math.random() * bouquetEmojis.length)];
      } else {
        type = 'star';
      }

      const colorBase = heartColors[Math.floor(Math.random() * heartColors.length)];
      const maxAlpha = 0.25 + Math.random() * 0.65;

      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.3 + Math.random() * 0.8), // Floating gently upwards
        size: type === 'bouquet' ? 16 + Math.random() * 16 : type === 'star' ? 1.5 + Math.random() * 2.5 : 10 + Math.random() * 18,
        alpha: Math.random() * maxAlpha,
        maxAlpha: maxAlpha,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        swayOffset: Math.random() * 100,
        swaySpeed: 0.015 + Math.random() * 0.02,
        type,
        color: colorBase,
        emoji
      };
    }

    // Initialize particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }

    // Draw heart path
    function drawHeart(c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number, rotation: number) {
      c.save();
      c.translate(x, y);
      c.rotate(rotation);
      c.fillStyle = `${color}${alpha})`;
      c.shadowColor = `${color}0.8)`;
      c.shadowBlur = size * 0.8;

      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 1.4, 0, size);
      c.bezierCurveTo(0, (size + topCurveHeight) / 1.4, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      c.closePath();
      c.fill();
      c.restore();
    }

    // Draw rose petal
    function drawPetal(c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number, rotation: number) {
      c.save();
      c.translate(x, y);
      c.rotate(rotation);
      c.fillStyle = `${color}${alpha})`;
      c.shadowColor = 'rgba(244, 63, 94, 0.4)';
      c.shadowBlur = 6;

      c.beginPath();
      c.moveTo(0, 0);
      c.quadraticCurveTo(size * 0.6, -size * 0.3, size, 0);
      c.quadraticCurveTo(size * 0.6, size * 0.5, 0, 0);
      c.closePath();
      c.fill();
      c.restore();
    }

    // Draw twinkling star
    function drawStar(c: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) {
      c.save();
      c.translate(x, y);
      c.fillStyle = `rgba(254, 240, 138, ${alpha})`;
      c.shadowColor = 'rgba(250, 204, 21, 0.9)';
      c.shadowBlur = 8;
      c.beginPath();
      c.arc(0, 0, size, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }

    let time = 0;
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Motion physics
        p.swayOffset += p.swaySpeed;
        const sway = Math.sin(p.swayOffset) * 0.6;
        p.x += p.vx + sway;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        // Twinkle / pulse alpha
        p.alpha = Math.min(p.maxAlpha, p.maxAlpha * (0.65 + 0.35 * Math.sin(time + p.swayOffset)));

        // Reset if off-screen top or sides
        if (p.y < -50 || p.x < -50 || p.x > width + 50) {
          particles[i] = createParticle(height + 20);
          continue;
        }

        // Render based on type
        if (p.type === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.color, p.alpha, p.rotation);
        } else if (p.type === 'petal') {
          drawPetal(ctx, p.x, p.y, p.size, p.color, p.alpha, p.rotation);
        } else if (p.type === 'star') {
          drawStar(ctx, p.x, p.y, p.size, p.alpha);
        } else if (p.type === 'bouquet' && p.emoji) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.alpha;
          ctx.font = `${p.size}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.emoji, 0, 0);
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Interactive click burst
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      for (let k = 0; k < 6; k++) {
        const p = createParticle(clientY);
        p.x = clientX + (Math.random() - 0.5) * 40;
        p.vx = (Math.random() - 0.5) * 3;
        p.vy = - (1.5 + Math.random() * 2.5);
        p.maxAlpha = 0.9;
        p.alpha = 0.9;
        particles.push(p);
        if (particles.length > 90) {
          particles.shift();
        }
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('touchstart', handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="romantic-particles-canvas"
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};
