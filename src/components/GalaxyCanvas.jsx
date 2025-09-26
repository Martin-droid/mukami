import { useEffect, useRef } from 'react';

const STAR_COUNT = 120;
const PARTICLE_COUNT = 45;

const random = (min, max) => Math.random() * (max - min) + min;

export default function GalaxyCanvas({ onCollect, onComboChange }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const starsRef = useRef([]);
  const particlesRef = useRef([]);
  const shipRef = useRef({ x: 0, y: 0 });
  const comboRef = useRef(0);
  const lastCollectRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    shipRef.current = { x: canvas.width / 2, y: canvas.height / 2 };
    window.addEventListener('resize', resize);

    const initStars = () => {
      starsRef.current = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: random(0.8, 2.2),
        speed: random(0.05, 0.25),
        hue: random(200, 320),
        twinkle: Math.random() * Math.PI * 2,
        collected: false
      }));
    };

    const initParticles = () => {
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: random(-0.4, 0.4),
        vy: random(-0.4, 0.4),
        radius: random(1, 3),
        life: random(30, 90)
      }));
    };

    initStars();
    initParticles();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 3,
        canvas.width / 10,
        canvas.width / 2,
        canvas.height,
        canvas.width
      );
      gradient.addColorStop(0, 'rgba(124, 91, 255, 0.65)');
      gradient.addColorStop(0.45, 'rgba(20, 15, 55, 0.75)');
      gradient.addColorStop(1, 'rgba(1, 1, 15, 0.95)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach((star) => {
        if (!star.collected) {
          star.y += star.speed;
          if (star.y > canvas.height) {
            star.y = -10;
            star.x = Math.random() * canvas.width;
            star.collected = false;
          }

          ctx.beginPath();
          ctx.fillStyle = `hsla(${star.hue}, 90%, 75%, ${0.55 + Math.sin(star.twinkle) * 0.2})`;
          ctx.shadowBlur = 12;
          ctx.shadowColor = `hsla(${star.hue}, 90%, 70%, 0.9)`;
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          star.twinkle += 0.02;
        }
      });

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 1;

        if (particle.life <= 0) {
          particle.x = shipRef.current.x;
          particle.y = shipRef.current.y;
          particle.vx = random(-0.7, 0.7);
          particle.vy = random(-0.7, 0.7);
          particle.life = random(45, 120);
        }

        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.save();
      ctx.translate(shipRef.current.x, shipRef.current.y);
      ctx.rotate(Math.sin(Date.now() / 400) * 0.15);

      ctx.beginPath();
      const gradientShip = ctx.createLinearGradient(-16, -28, 24, 28);
      gradientShip.addColorStop(0, '#ff8fb7');
      gradientShip.addColorStop(1, '#7a5cff');
      ctx.fillStyle = gradientShip;
      ctx.moveTo(0, -22);
      ctx.lineTo(20, 20);
      ctx.lineTo(-20, 20);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(0, 8, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animationRef.current = requestAnimationFrame(render);
    };

    const handlePointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      shipRef.current = { x, y };

      const now = performance.now();
      starsRef.current.forEach((star) => {
        if (!star.collected) {
          const dx = star.x - x;
          const dy = star.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 30) {
            star.collected = true;
            if (now - lastCollectRef.current < 1000) {
              comboRef.current += 1;
            } else {
              comboRef.current = 1;
            }
            lastCollectRef.current = now;
            onCollect?.({
              hue: star.hue,
              combo: comboRef.current
            });
            onComboChange?.(comboRef.current);
          }
        }
      });
    };

    const handleLeave = () => {
      comboRef.current = 0;
      onComboChange?.(0);
    };

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handleLeave);

    animationRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handleLeave);
    };
  }, [onCollect, onComboChange]);

  return (
    <div className="galaxy-canvas-wrapper">
      <canvas ref={canvasRef} className="galaxy-canvas" />
      <div className="canvas-overlay">
        <p>Guide the heart-ship with your touch or mouse. Catch the radiant stars for Mukami.</p>
      </div>
    </div>
  );
}
