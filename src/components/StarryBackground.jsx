import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SUPREM_URL } from '../config/api';

// Meteorite component with Barosanul Suprem banner
function Meteorite({ supremName, onComplete }) {
  const [startPosition] = useState(() => ({
    startX: -15,
    startY: Math.random() * 30 + 5,
    endX: 115,
    endY: Math.random() * 25 + 55,
  }));

  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{ zIndex: 5 }}
      initial={{
        left: `${startPosition.startX}%`,
        top: `${startPosition.startY}%`,
        opacity: 0,
        scale: 0.3,
      }}
      animate={{
        left: `${startPosition.endX}%`,
        top: `${startPosition.endY}%`,
        opacity: [0, 1, 1, 1, 1, 0],
        scale: [0.3, 0.8, 1, 1, 0.9, 0.7],
      }}
      transition={{
        duration: 20,
        ease: 'linear',
        times: [0, 0.05, 0.15, 0.85, 0.95, 1],
      }}
      onAnimationComplete={onComplete}
    >
      <div className="relative">
        {/* Long fire trail */}
        <div className="absolute -left-48 top-1/2 -translate-y-1/2 w-56 h-10">
          <div className="absolute inset-0 bg-gradient-to-l from-orange-500 via-yellow-400 to-transparent blur-md opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-l from-red-600 via-orange-500 to-transparent blur-xl opacity-50" />
          <div className="absolute top-2 bottom-2 left-0 right-8 bg-gradient-to-l from-white via-yellow-200 to-transparent blur-sm opacity-90" />
        </div>

        {/* Spark particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full"
            style={{
              left: -30 - i * 12,
              top: Math.sin(i * 0.7) * 15,
            }}
            animate={{
              opacity: [1, 0.5, 0],
              scale: [1, 0.5, 0],
              y: [0, (i % 2 === 0 ? -1 : 1) * 25],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.08,
            }}
          />
        ))}

        {/* Meteorite rock */}
        <motion.div
          className="relative w-14 h-12 rounded-[40%]"
          style={{
            background: 'radial-gradient(ellipse at 25% 25%, #9a8478 0%, #6d5a4a 30%, #4a3d32 60%, #2a2420 100%)',
            boxShadow: '0 0 40px rgba(255, 165, 0, 0.7), 0 0 80px rgba(255, 100, 0, 0.4), inset -4px -4px 12px rgba(0,0,0,0.6)',
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute top-1 left-2 w-3 h-2 rounded-full bg-black/30" />
          <div className="absolute top-5 left-7 w-2 h-2 rounded-full bg-black/25" />
          <div className="absolute top-3 left-0 w-2 h-1 rounded-full bg-black/20" />
          <div className="absolute top-7 left-4 w-1.5 h-1.5 rounded-full bg-black/30" />
          <div
            className="absolute inset-0 rounded-[40%]"
            style={{
              background: 'linear-gradient(120deg, transparent 40%, rgba(255, 180, 80, 0.4) 70%, rgba(255, 120, 50, 0.7) 100%)',
            }}
          />
        </motion.div>

        {/* Banner/Pin */}
        <motion.div
          className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
        >
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-8 bg-gradient-to-b from-[#D4AF37] to-transparent" />
          <div className="relative px-4 py-2.5 bg-gradient-to-r from-[#9333EA] via-[#D4AF37] to-[#9333EA] rounded-xl shadow-xl shadow-purple-500/40 border border-white/20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer rounded-xl" />
            <div className="flex items-center gap-2">
              <span className="text-xl">👑</span>
              <div className="text-center">
                <div className="text-[10px] font-bold text-white/90 tracking-widest">BAROSANUL SUPREM</div>
                <div className="text-base font-black text-white truncate max-w-[160px]">
                  {supremName || 'Disponibil'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function StarryBackground() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const starsRef = useRef({ background: [], midground: [], foreground: [] });
  const galaxiesRef = useRef([]);
  const nebulaeRef = useRef([]);
  const shootingStarsRef = useRef([]);
  const cosmicDustRef = useRef([]);

  const [showMeteorite, setShowMeteorite] = useState(false);
  const [supremName, setSupremName] = useState(null);

  useEffect(() => {
    const fetchSuprem = async () => {
      try {
        const response = await fetch(SUPREM_URL);
        const data = await response.json();
        if (data.success && !data.available && data.suprem) {
          setSupremName(data.suprem.nume);
        }
      } catch (err) {
        console.error('Error fetching suprem:', err);
      }
    };

    fetchSuprem();

    const meteoriteInterval = setInterval(() => {
      setShowMeteorite(true);
    }, 45000);

    const initialTimeout = setTimeout(() => {
      setShowMeteorite(true);
    }, 8000);

    return () => {
      clearInterval(meteoriteInterval);
      clearTimeout(initialTimeout);
    };
  }, []);

  const starColors = useCallback(() => [
    { r: 255, g: 255, b: 255 },
    { r: 255, g: 255, b: 255 },
    { r: 200, g: 220, b: 255 }, // Blue-white
    { r: 170, g: 200, b: 255 }, // Blue
    { r: 255, g: 250, b: 230 }, // Yellow-white
    { r: 255, g: 220, b: 180 }, // Orange
    { r: 255, g: 200, b: 150 }, // Deep orange
    { r: 255, g: 180, b: 180 }, // Red
    { r: 212, g: 175, b: 55 },  // Gold (theme color)
    { r: 147, g: 51, b: 234 },  // Purple (theme color)
  ], []);

  const initializeStars = useCallback((width, height) => {
    const colors = starColors();

    const createStarLayer = (count, sizeRange, opacityRange, speedRange) => {
      const stars = [];
      for (let i = 0; i < count; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
          baseOpacity: Math.random() * (opacityRange[1] - opacityRange[0]) + opacityRange[0],
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleIntensity: Math.random() * 0.6 + 0.3,
          color,
          speedY: Math.random() * (speedRange[1] - speedRange[0]) + speedRange[0],
          speedX: (Math.random() - 0.5) * 0.02, // Subtle horizontal drift
        });
      }
      return stars;
    };

    return {
      background: createStarLayer(500, [0.3, 0.8], [0.2, 0.4], [0.02, 0.05]),
      midground: createStarLayer(250, [0.6, 1.5], [0.35, 0.7], [0.05, 0.1]),
      foreground: createStarLayer(80, [1.2, 3], [0.6, 1], [0.1, 0.2]),
    };
  }, [starColors]);

  const initializeGalaxies = useCallback((width, height) => {
    const galaxies = [];
    const count = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      galaxies.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.8,
        size: Math.random() * 80 + 40,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.0005,
        opacity: Math.random() * 0.12 + 0.04,
        type: Math.random() > 0.5 ? 'spiral' : 'elliptical',
        driftX: (Math.random() - 0.5) * 0.02,
        driftY: Math.random() * 0.01 + 0.005,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.005 + 0.002,
      });
    }
    return galaxies;
  }, []);

  const initializeNebulae = useCallback((width, height) => {
    const nebulae = [];
    const colors = [
      { r: 147, g: 51, b: 234 },  // Purple
      { r: 212, g: 175, b: 55 },  // Gold
      { r: 80, g: 40, b: 120 },   // Deep purple
      { r: 40, g: 80, b: 140 },   // Blue
      { r: 120, g: 60, b: 100 },  // Magenta
      { r: 60, g: 100, b: 80 },   // Teal
    ];

    for (let i = 0; i < 5; i++) {
      nebulae.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.min(width, height) * (0.2 + Math.random() * 0.25),
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.008 + Math.random() * 0.012,
        driftX: (Math.random() - 0.5) * 0.03,
        driftY: (Math.random() - 0.5) * 0.03,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.003 + 0.001,
      });
    }
    return nebulae;
  }, []);

  const initializeShootingStars = useCallback((width, height) => {
    return [];
  }, []);

  const initializeCosmicDust = useCallback((width, height) => {
    const particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.15 + 0.05,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: Math.random() * 0.2 + 0.05,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        wobbleAmount: Math.random() * 0.5 + 0.2,
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = document.documentElement.scrollHeight;

    const setCanvasSize = () => {
      width = window.innerWidth;
      height = Math.max(document.documentElement.scrollHeight, window.innerHeight * 3);
      canvas.width = width;
      canvas.height = height;
      starsRef.current = initializeStars(width, height);
      galaxiesRef.current = initializeGalaxies(width, height);
      nebulaeRef.current = initializeNebulae(width, height);
      shootingStarsRef.current = initializeShootingStars(width, height);
      cosmicDustRef.current = initializeCosmicDust(width, height);
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    let time = 0;

    // Create shooting star occasionally
    const maybeCreateShootingStar = () => {
      if (Math.random() < 0.003 && shootingStarsRef.current.length < 3) {
        const startX = Math.random() * width;
        const startY = Math.random() * height * 0.5;
        shootingStarsRef.current.push({
          x: startX,
          y: startY,
          length: 50 + Math.random() * 100,
          speed: 8 + Math.random() * 12,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
          opacity: 1,
          life: 1,
        });
      }
    };

    const drawStar = (star, layerOpacityMod = 1) => {
      star.twinklePhase += star.twinkleSpeed;
      const twinkle = Math.sin(star.twinklePhase) * star.twinkleIntensity + (1 - star.twinkleIntensity);
      const opacity = star.baseOpacity * twinkle * layerOpacityMod;
      const { r, g, b } = star.color;

      // Glow for larger stars
      if (star.size > 1) {
        const glowGradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 4
        );
        glowGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity * 0.5})`);
        glowGradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${opacity * 0.2})`);
        glowGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Core
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();

      // Spikes for bright stars
      if (star.size > 2 && opacity > 0.7) {
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.3})`;
        ctx.lineWidth = 0.5;
        const spikeLength = star.size * 6;
        ctx.beginPath();
        ctx.moveTo(star.x - spikeLength, star.y);
        ctx.lineTo(star.x + spikeLength, star.y);
        ctx.moveTo(star.x, star.y - spikeLength);
        ctx.lineTo(star.x, star.y + spikeLength);
        // Diagonal spikes
        const diagLength = spikeLength * 0.5;
        ctx.moveTo(star.x - diagLength, star.y - diagLength);
        ctx.lineTo(star.x + diagLength, star.y + diagLength);
        ctx.moveTo(star.x + diagLength, star.y - diagLength);
        ctx.lineTo(star.x - diagLength, star.y + diagLength);
        ctx.stroke();
      }
    };

    const drawGalaxy = (galaxy, time) => {
      galaxy.rotation += galaxy.rotationSpeed;
      galaxy.x += galaxy.driftX;
      galaxy.y += galaxy.driftY;
      galaxy.pulsePhase += galaxy.pulseSpeed;

      // Wrap around
      if (galaxy.x < -galaxy.size) galaxy.x = width + galaxy.size;
      if (galaxy.x > width + galaxy.size) galaxy.x = -galaxy.size;
      if (galaxy.y > height + galaxy.size) {
        galaxy.y = -galaxy.size;
        galaxy.x = Math.random() * width;
      }

      const pulse = Math.sin(galaxy.pulsePhase) * 0.2 + 1;
      const currentOpacity = galaxy.opacity * pulse;

      ctx.save();
      ctx.translate(galaxy.x, galaxy.y);
      ctx.rotate(galaxy.rotation);

      if (galaxy.type === 'spiral') {
        // Draw spiral arms
        for (let arm = 0; arm < 2; arm++) {
          const armAngle = (Math.PI * 2 / 2) * arm;
          for (let i = 0; i < 100; i++) {
            const angle = armAngle + (i / 100) * Math.PI * 3;
            const distance = (i / 100) * galaxy.size;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance * 0.4;
            const starOpacity = currentOpacity * (1 - i / 100) * 0.9;
            const starSize = 0.3 + Math.random() * 0.5;
            ctx.fillStyle = `rgba(255, 250, 240, ${starOpacity})`;
            ctx.beginPath();
            ctx.arc(x, y, starSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        // Bright center bulge
        const bulgeGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.size * 0.3);
        bulgeGradient.addColorStop(0, `rgba(255, 250, 220, ${currentOpacity * 2})`);
        bulgeGradient.addColorStop(0.5, `rgba(255, 240, 200, ${currentOpacity})`);
        bulgeGradient.addColorStop(1, 'rgba(255, 240, 200, 0)');
        ctx.fillStyle = bulgeGradient;
        ctx.beginPath();
        ctx.arc(0, 0, galaxy.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Elliptical galaxy
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.size);
        gradient.addColorStop(0, `rgba(255, 250, 220, ${currentOpacity * 1.5})`);
        gradient.addColorStop(0.3, `rgba(255, 240, 200, ${currentOpacity * 0.8})`);
        gradient.addColorStop(0.6, `rgba(255, 230, 180, ${currentOpacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(255, 220, 160, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, galaxy.size, galaxy.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawNebula = (nebula, time) => {
      nebula.x += nebula.driftX;
      nebula.y += nebula.driftY;
      nebula.pulsePhase += nebula.pulseSpeed;

      // Wrap around
      if (nebula.x < -nebula.radius) nebula.x = width + nebula.radius;
      if (nebula.x > width + nebula.radius) nebula.x = -nebula.radius;
      if (nebula.y < -nebula.radius) nebula.y = height + nebula.radius;
      if (nebula.y > height + nebula.radius) nebula.y = -nebula.radius;

      const pulse = Math.sin(nebula.pulsePhase) * 0.3 + 1;
      const { r, g, b } = nebula.color;
      const currentOpacity = nebula.opacity * pulse;

      const gradient = ctx.createRadialGradient(
        nebula.x, nebula.y, 0,
        nebula.x, nebula.y, nebula.radius
      );
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${currentOpacity * 1.2})`);
      gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${currentOpacity * 0.8})`);
      gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${currentOpacity * 0.4})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawShootingStar = (star) => {
      const tailX = star.x - Math.cos(star.angle) * star.length;
      const tailY = star.y - Math.sin(star.angle) * star.length;

      const gradient = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
      gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
      gradient.addColorStop(0.7, `rgba(255, 255, 255, ${star.opacity * 0.5})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, ${star.opacity})`);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(star.x, star.y);
      ctx.stroke();

      // Bright head
      const headGlow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 8);
      headGlow.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
      headGlow.addColorStop(0.5, `rgba(200, 220, 255, ${star.opacity * 0.5})`);
      headGlow.addColorStop(1, 'rgba(150, 180, 255, 0)');
      ctx.fillStyle = headGlow;
      ctx.beginPath();
      ctx.arc(star.x, star.y, 8, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawCosmicDust = (particle) => {
      particle.wobblePhase += particle.wobbleSpeed;
      const wobble = Math.sin(particle.wobblePhase) * particle.wobbleAmount;

      ctx.fillStyle = `rgba(200, 180, 255, ${particle.opacity})`;
      ctx.beginPath();
      ctx.arc(particle.x + wobble, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      time += 0.016;

      // Deep space gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, '#020205');
      bgGradient.addColorStop(0.2, '#050510');
      bgGradient.addColorStop(0.4, '#080815');
      bgGradient.addColorStop(0.5, '#0a0a18');
      bgGradient.addColorStop(0.6, '#080815');
      bgGradient.addColorStop(0.8, '#050510');
      bgGradient.addColorStop(1, '#020205');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw nebulae (background layer)
      nebulaeRef.current.forEach(nebula => drawNebula(nebula, time));

      // Draw distant galaxies
      galaxiesRef.current.forEach(galaxy => drawGalaxy(galaxy, time));

      // Draw background stars
      starsRef.current.background.forEach(star => {
        star.y += star.speedY;
        star.x += star.speedX;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        drawStar(star, 0.5);
      });

      // Draw cosmic dust
      cosmicDustRef.current.forEach(particle => {
        particle.y += particle.speedY;
        particle.x += particle.speedX;
        if (particle.y > height) {
          particle.y = 0;
          particle.x = Math.random() * width;
        }
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        drawCosmicDust(particle);
      });

      // Draw midground stars
      starsRef.current.midground.forEach(star => {
        star.y += star.speedY;
        star.x += star.speedX;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        drawStar(star, 0.75);
      });

      // Draw foreground stars
      starsRef.current.foreground.forEach(star => {
        star.y += star.speedY;
        star.x += star.speedX;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        drawStar(star, 1);
      });

      // Maybe create shooting star
      maybeCreateShootingStar();

      // Update and draw shooting stars
      shootingStarsRef.current = shootingStarsRef.current.filter(star => {
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.life -= 0.02;
        star.opacity = star.life;

        if (star.life > 0) {
          drawShootingStar(star);
          return true;
        }
        return false;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initializeStars, initializeGalaxies, initializeNebulae, initializeShootingStars, initializeCosmicDust]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />

      <AnimatePresence>
        {showMeteorite && (
          <Meteorite
            supremName={supremName}
            onComplete={() => setShowMeteorite(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
