import { useEffect, useRef } from 'react';

const STAR_COUNT = 160;
const MAX_METEORS = 7;
const METEOR_MESSAGES = [
  'I love you, Mukami.',
  'Marto cares for you more than words.',
  'I am here for you — always.',
  'Let me be your anchor through every storm.',
  'Your smile is my favorite galaxy.',
  'You are safe in my arms.',
  'Together we outshine every shadow.',
  'My heart orbits only you.'
];

const random = (min, max) => Math.random() * (max - min) + min;

export default function GalaxyCanvas({ onMeteorDestroyed, onReunited, reunited }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const starsRef = useRef([]);
  const meteorsRef = useRef([]);
  const lasersRef = useRef([]);
  const particlesRef = useRef([]);
  const shipRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, tilt: 0 });
  const firingRef = useRef(false);
  const lastFireRef = useRef(0);
  const destroyedCountRef = useRef(0);
  const beaconVisibleRef = useRef(false);
  const reunitedRef = useRef(false);
  const meteorDestroyedRef = useRef(onMeteorDestroyed);
  const reunitedCallbackRef = useRef(onReunited);

  useEffect(() => {
    reunitedRef.current = reunited;
  }, [reunited]);

  useEffect(() => {
    meteorDestroyedRef.current = onMeteorDestroyed;
  }, [onMeteorDestroyed]);

  useEffect(() => {
    reunitedCallbackRef.current = onReunited;
  }, [onReunited]);


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    destroyedCountRef.current = 0;
    beaconVisibleRef.current = false;
    lasersRef.current = [];
    particlesRef.current = [];

    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      canvas.width = clientWidth;
      canvas.height = clientHeight;
      shipRef.current.x = clientWidth / 2;
      shipRef.current.y = clientHeight * 0.75;
      shipRef.current.targetX = shipRef.current.x;
      shipRef.current.targetY = shipRef.current.y;
    };

    resize();
    window.addEventListener('resize', resize);

    starsRef.current = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: random(0.6, 1.8),
      speed: random(0.15, 0.45),
      hue: random(200, 320),
      twinkle: Math.random() * Math.PI * 2
    }));

    const createMeteor = () => ({
      x: random(0, canvas.width),
      y: random(-canvas.height, -80),
      radius: random(26, 46),
      speed: random(1.1, 2.2),
      drift: random(-0.4, 0.4),
      rotation: random(0, Math.PI * 2),
      rotationSpeed: random(-0.02, 0.02)
    });

    meteorsRef.current = Array.from({ length: MAX_METEORS }, createMeteor);

    const drawShip = () => {
      const ship = shipRef.current;
      const noseX = ship.x;

      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.rotate(ship.tilt);

      const hullGradient = ctx.createLinearGradient(0, -40, 0, 36);
      hullGradient.addColorStop(0, '#f8f9ff');
      hullGradient.addColorStop(0.3, '#b8c3ff');
      hullGradient.addColorStop(1, '#5448ff');

      ctx.fillStyle = hullGradient;
      ctx.beginPath();
      ctx.moveTo(0, -44);
      ctx.quadraticCurveTo(34, -12, 22, 32);
      ctx.lineTo(-22, 32);
      ctx.quadraticCurveTo(-34, -12, 0, -44);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#2f2c89';
      ctx.beginPath();
      ctx.moveTo(22, 12);
      ctx.lineTo(44, 28);
      ctx.lineTo(12, 30);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-22, 12);
      ctx.lineTo(-44, 28);
      ctx.lineTo(-12, 30);
      ctx.closePath();
      ctx.fill();

      const glowGradient = ctx.createLinearGradient(0, 24, 0, 46);
      glowGradient.addColorStop(0, 'rgba(118, 166, 255, 0.95)');
      glowGradient.addColorStop(1, 'rgba(255, 120, 180, 0)');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.ellipse(0, 44, 14, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      const canopyGradient = ctx.createLinearGradient(-14, -12, 16, 20);
      canopyGradient.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
      canopyGradient.addColorStop(0.45, 'rgba(162, 205, 255, 0.75)');
      canopyGradient.addColorStop(1, 'rgba(74, 98, 255, 0.9)');
      ctx.fillStyle = canopyGradient;
      ctx.beginPath();
      ctx.ellipse(0, -6, 22, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(-6, -10, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(8, -6, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 109, 162, 0.85)';
      ctx.beginPath();
      ctx.ellipse(-6, -8, 4, 5, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(8, -4, 4.5, 5.5, -0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.beginPath();
      ctx.arc(6, -14, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      ctx.save();
      const flameGradient = ctx.createLinearGradient(noseX, ship.y + 24, noseX, ship.y + 70);
      flameGradient.addColorStop(0, 'rgba(140, 208, 255, 0.9)');
      flameGradient.addColorStop(0.5, 'rgba(118, 82, 255, 0.75)');
      flameGradient.addColorStop(1, 'rgba(255, 120, 185, 0)');
      ctx.fillStyle = flameGradient;
      ctx.beginPath();
      ctx.moveTo(noseX - 12, ship.y + 28);
      ctx.quadraticCurveTo(noseX, ship.y + 62 + Math.sin(Date.now() / 120) * 8, noseX + 12, ship.y + 28);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.fillStyle = 'rgba(255, 184, 220, 0.6)';
      ctx.beginPath();
      ctx.ellipse(ship.x, ship.y - 52, 16, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 124, 174, 0.9)';
      ctx.beginPath();
      ctx.arc(ship.x, ship.y - 52, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawMeteor = (meteor) => {
      ctx.save();
      ctx.translate(meteor.x, meteor.y);
      ctx.rotate(meteor.rotation);

      const meteorGradient = ctx.createRadialGradient(0, 0, meteor.radius * 0.2, 0, 0, meteor.radius);
      meteorGradient.addColorStop(0, 'rgba(255, 188, 120, 0.95)');
      meteorGradient.addColorStop(0.6, 'rgba(196, 105, 55, 0.92)');
      meteorGradient.addColorStop(1, 'rgba(62, 28, 18, 0.95)');

      ctx.fillStyle = meteorGradient;
      ctx.beginPath();
      ctx.arc(0, 0, meteor.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 226, 200, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-meteor.radius * 0.3, -meteor.radius * 0.2);
      ctx.quadraticCurveTo(0, -meteor.radius * 0.6, meteor.radius * 0.4, -meteor.radius * 0.1);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-meteor.radius * 0.4, meteor.radius * 0.3);
      ctx.quadraticCurveTo(0, meteor.radius * 0.7, meteor.radius * 0.2, meteor.radius * 0.4);
      ctx.stroke();

      ctx.restore();
    };

    const drawBeacon = () => {
      const x = canvas.width - 90;
      const y = canvas.height * 0.4;

      ctx.save();
      ctx.translate(x, y);

      const aura = ctx.createRadialGradient(0, 0, 10, 0, 0, 120);
      aura.addColorStop(0, 'rgba(255, 208, 236, 0.9)');
      aura.addColorStop(0.5, 'rgba(140, 118, 255, 0.45)');
      aura.addColorStop(1, 'rgba(40, 22, 64, 0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(0, 0, 120, 0, Math.PI * 2);
      ctx.fill();

      const bodyGradient = ctx.createLinearGradient(-14, -32, 14, 44);
      bodyGradient.addColorStop(0, '#fff9ff');
      bodyGradient.addColorStop(0.4, '#fcd0ff');
      bodyGradient.addColorStop(1, '#8364ff');
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(0, -44);
      ctx.bezierCurveTo(32, -20, 26, 28, 0, 48);
      ctx.bezierCurveTo(-26, 28, -32, -20, 0, -44);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(-6, -12, 6, 0, Math.PI * 2);
      ctx.arc(8, -8, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 128, 188, 0.85)';
      ctx.beginPath();
      ctx.ellipse(1, 12, 22, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 18px "Poppins", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Marto', 0, 66);

      ctx.restore();

      return { x, y };
    };

    const fireLaser = () => {
      if (reunitedRef.current) return;
      const now = performance.now();
      if (now - lastFireRef.current < 180) return;
      lastFireRef.current = now;

      const ship = shipRef.current;
      lasersRef.current.push({
        x: ship.x,
        y: ship.y - 32,
        vy: -7.2,
        life: 0
      });
    };


    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#050519');
      gradient.addColorStop(0.5, '#110529');
      gradient.addColorStop(1, '#1b0733');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach((star) => {
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = -10;
          star.x = Math.random() * canvas.width;
        }
        star.twinkle += 0.02;

        ctx.beginPath();
        ctx.fillStyle = `hsla(${star.hue}, 90%, 75%, ${0.45 + Math.sin(star.twinkle) * 0.25})`;
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      if (firingRef.current) {
        fireLaser();
      }

      lasersRef.current.forEach((laser) => {
        laser.y += laser.vy;
        laser.life += 1;
      });
      lasersRef.current = lasersRef.current.filter((laser) => laser.y > -40 && laser.life < 200);

      lasersRef.current.forEach((laser) => {
        ctx.save();
        const trail = ctx.createLinearGradient(laser.x, laser.y - 32, laser.x, laser.y + 8);
        trail.addColorStop(0, 'rgba(255, 255, 255, 0)');
        trail.addColorStop(1, 'rgba(118, 200, 255, 0.85)');
        ctx.fillStyle = trail;
        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(laser.x - 3, laser.y - 28, 6, 32, 3);
          ctx.fill();
        } else {
          ctx.fillRect(laser.x - 3, laser.y - 28, 6, 32);
        }
        ctx.restore();

      });

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.02;
        particle.life -= 1;
      });
      particlesRef.current = particlesRef.current.filter((particle) => particle.life > 0);
      particlesRef.current.forEach((particle) => {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = Math.max(particle.life / particle.maxLife, 0);
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      meteorsRef.current.forEach((meteor) => {
        meteor.y += meteor.speed;
        meteor.x += meteor.drift;
        meteor.rotation += meteor.rotationSpeed;

        if (meteor.y - meteor.radius > canvas.height + 40) {
          Object.assign(meteor, createMeteor());
        }

        lasersRef.current.forEach((laser) => {
          const dx = meteor.x - laser.x;
          const dy = meteor.y - laser.y;
          if (Math.sqrt(dx * dx + dy * dy) < meteor.radius + 6) {
            Object.assign(meteor, createMeteor());
            laser.life = 999;
            destroyedCountRef.current += 1;
            const message = METEOR_MESSAGES[Math.floor(Math.random() * METEOR_MESSAGES.length)];
            meteorDestroyedRef.current?.(message);

            for (let i = 0; i < 16; i += 1) {
              const life = random(25, 45);
              particlesRef.current.push({
                x: laser.x,
                y: laser.y,
                vx: Math.cos((Math.PI * 2 * i) / 16) * random(1, 2.8),
                vy: Math.sin((Math.PI * 2 * i) / 16) * random(1, 2.4),
                size: random(1.2, 2.6),
                life,
                maxLife: life,
                color: `hsla(${random(330, 360)}, 85%, 72%, 0.9)`
              });
            }
          }
        });

        drawMeteor(meteor);
      });

      lasersRef.current = lasersRef.current.filter((laser) => laser.life < 400);

      const ship = shipRef.current;
      const ease = 0.12;
      ship.x += (ship.targetX - ship.x) * ease;
      ship.y += (ship.targetY - ship.y) * ease;
      ship.x = Math.max(60, Math.min(canvas.width - 60, ship.x));
      ship.y = Math.max(canvas.height * 0.25, Math.min(canvas.height - 40, ship.y));
      const tiltTarget = (ship.targetX - ship.x) * 0.0025;
      ship.tilt += (tiltTarget - ship.tilt) * 0.15;

      drawShip();

      if (destroyedCountRef.current >= 5 || reunitedRef.current) {
        beaconVisibleRef.current = true;
      }

      let beaconPosition = null;
      if (beaconVisibleRef.current) {
        beaconPosition = drawBeacon();
      }

      if (beaconPosition && !reunitedRef.current) {
        const dx = ship.x - beaconPosition.x;
        const dy = ship.y - beaconPosition.y;
        if (Math.sqrt(dx * dx + dy * dy) < 80) {
          reunitedRef.current = true;
          firingRef.current = false;
          lasersRef.current = [];
          reunitedCallbackRef.current?.();
        }
      }


      animationRef.current = requestAnimationFrame(render);
    };

    const handlePointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      shipRef.current.targetX = event.clientX - rect.left;
      shipRef.current.targetY = event.clientY - rect.top;
    };

    const handlePointerDown = (event) => {
      firingRef.current = true;
      handlePointerMove(event);
      fireLaser();
    };

    const handlePointerUp = () => {
      firingRef.current = false;
    };

    const handlePointerLeave = () => {
      firingRef.current = false;
    };

    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        firingRef.current = true;
        fireLaser();
      }
      if (event.key === 'ArrowLeft') {
        shipRef.current.targetX -= 30;
      }
      if (event.key === 'ArrowRight') {
        shipRef.current.targetX += 30;
      }
      if (event.key === 'ArrowUp') {
        shipRef.current.targetY -= 30;
      }
      if (event.key === 'ArrowDown') {
        shipRef.current.targetY += 30;
      }
    };

    const handleKeyUp = (event) => {
      if (event.code === 'Space') {
        firingRef.current = false;
      }
    };

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);


    animationRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);


  return (
    <div className="galaxy-canvas-wrapper">
      <canvas ref={canvasRef} className="galaxy-canvas" />
      <div className="canvas-overlay">
        <p>
          Steer the starship with touch or mouse. Hold your touch, click, or press space to fire love-beams through the
          meteors.
        </p>

      </div>
    </div>
  );
}
