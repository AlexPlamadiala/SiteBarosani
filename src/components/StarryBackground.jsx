import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SUPREM_URL } from '../config/api';

// Meteorite component with Barosanul Suprem banner
function Meteorite({ supremName, onComplete }) {
  const [startPosition] = useState(() => ({
    startX: -200,
    startY: Math.random() * 40 + 10, // 10-50% from top
    endX: 120,
    endY: Math.random() * 30 + 60, // 60-90% from top
  }));

  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{ zIndex: 5 }}
      initial={{
        left: `${startPosition.startX}%`,
        top: `${startPosition.startY}%`,
        opacity: 0,
        scale: 0.5,
      }}
      animate={{
        left: `${startPosition.endX}%`,
        top: `${startPosition.endY}%`,
        opacity: [0, 1, 1, 1, 0],
        scale: [0.5, 1, 1, 1, 0.8],
      }}
      transition={{
        duration: 8,
        ease: 'linear',
        times: [0, 0.1, 0.5, 0.9, 1],
      }}
      onAnimationComplete={onComplete}
    >
      {/* Meteorite body */}
      <div className="relative">
        {/* Fire trail */}
        <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-40 h-8">
          <div className="absolute inset-0 bg-gradient-to-l from-orange-500 via-yellow-400 to-transparent blur-md opacity-80 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-l from-red-500 via-orange-400 to-transparent blur-lg opacity-60" />
          <div className="absolute top-1 bottom-1 left-0 right-4 bg-gradient-to-l from-white via-yellow-200 to-transparent blur-sm opacity-90" />
        </div>

        {/* Spark particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full"
            style={{
              left: -20 - i * 15,
              top: Math.sin(i * 0.8) * 12,
            }}
            animate={{
              opacity: [1, 0],
              scale: [1, 0],
              y: [0, (i % 2 === 0 ? -1 : 1) * 20],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}

        {/* Meteorite rock */}
        <motion.div
          className="relative w-16 h-14 rounded-full"
          style={{
            background: 'radial-gradient(ellipse at 30% 30%, #8B7355 0%, #5D4E37 40%, #3D2E1F 70%, #1a1a1a 100%)',
            boxShadow: '0 0 30px rgba(255, 165, 0, 0.6), 0 0 60px rgba(255, 100, 0, 0.4), inset -5px -5px 15px rgba(0,0,0,0.5)',
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          {/* Crater details */}
          <div className="absolute top-2 left-3 w-3 h-2 rounded-full bg-black/40" />
          <div className="absolute top-6 left-8 w-2 h-2 rounded-full bg-black/30" />
          <div className="absolute top-4 left-1 w-2 h-1 rounded-full bg-black/30" />

          {/* Glowing edge */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(135deg, transparent 50%, rgba(255, 150, 50, 0.5) 80%, rgba(255, 100, 0, 0.8) 100%)',
            }}
          />
        </motion.div>

        {/* Banner/Pin */}
        <motion.div
          className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {/* Pin line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-6 bg-gradient-to-b from-[#D4AF37] to-transparent" />

          {/* Banner */}
          <div className="relative px-4 py-2 bg-gradient-to-r from-[#9333EA] via-[#D4AF37] to-[#9333EA] rounded-lg shadow-lg shadow-purple-500/50">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer rounded-lg" />
            <div className="flex items-center gap-2">
              <span className="text-lg">👑</span>
              <div className="text-center">
                <div className="text-[10px] font-bold text-white/80 tracking-wider">BAROSANUL SUPREM</div>
                <div className="text-sm font-black text-white truncate max-w-[150px]">
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

  const [showMeteorite, setShowMeteorite] = useState(false);
  const [supremName, setSupremName] = useState(null);

  // Fetch suprem data
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

    // Show meteorite periodically
    const meteoriteInterval = setInterval(() => {
      setShowMeteorite(true);
    }, 25000); // Every 25 seconds

    // Show first meteorite after 5 seconds
    const initialTimeout = setTimeout(() => {
      setShowMeteorite(true);
    }, 5000);

    return () => {
      clearInterval(meteoriteInterval);
      clearTimeout(initialTimeout);
    };
  }, []);

  // Star color palette (realistic star colors)
  const starColors = useCallback(() => [
    { r: 255, g: 255, b: 255 },   // White (most common)
    { r: 255, g: 255, b: 255 },   // White
    { r: 255, g: 255, b: 255 },   // White
    { r: 200, g: 220, b: 255 },   // Blue-white (hot stars)
    { r: 170, g: 200, b: 255 },   // Blue
    { r: 255, g: 250, b: 230 },   // Yellow-white
    { r: 255, g: 220, b: 180 },   // Yellow (like our sun)
    { r: 255, g: 200, b: 150 },   // Orange
    { r: 255, g: 180, b: 180 },   // Red (cool stars)
    { r: 212, g: 175, b: 55 },    // Gold accent
  ], []);

  // Initialize star layers
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
          twinkleIntensity: Math.random() * 0.4 + 0.1,
          color,
          speed: Math.random() * (speedRange[1] - speedRange[0]) + speedRange[0],
        });
      }
      return stars;
    };

    return {
      background: createStarLayer(300, [0.3, 0.8], [0.2, 0.4], [0.02, 0.05]),   // Distant, small, dim
      midground: createStarLayer(150, [0.8, 1.5], [0.4, 0.7], [0.05, 0.1]),    // Medium distance
      foreground: createStarLayer(50, [1.5, 3], [0.6, 1], [0.1, 0.2]),         // Close, bright
    };
  }, [starColors]);

  // Initialize distant galaxies
  const initializeGalaxies = useCallback((width, height) => {
    const galaxies = [];
    const galaxyCount = 3;

    for (let i = 0; i < galaxyCount; i++) {
      galaxies.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 60 + 40,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.0005,
        opacity: Math.random() * 0.1 + 0.05,
        type: Math.random() > 0.5 ? 'spiral' : 'elliptical',
      });
    }
    return galaxies;
  }, []);

  // Initialize nebulae
  const initializeNebulae = useCallback((width, height) => {
    return [
      {
        x: width * 0.15,
        y: height * 0.25,
        radius: Math.min(width, height) * 0.3,
        color: { r: 100, g: 50, b: 150 },
        opacity: 0.015,
      },
      {
        x: width * 0.85,
        y: height * 0.75,
        radius: Math.min(width, height) * 0.35,
        color: { r: 150, g: 100, b: 50 },
        opacity: 0.012,
      },
      {
        x: width * 0.5,
        y: height * 0.5,
        radius: Math.min(width, height) * 0.4,
        color: { r: 50, g: 80, b: 120 },
        opacity: 0.01,
      },
    ];
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
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    let time = 0;

    const drawStar = (star, layerOpacityMod = 1) => {
      // Twinkle effect
      star.twinklePhase += star.twinkleSpeed;
      const twinkle = Math.sin(star.twinklePhase) * star.twinkleIntensity + (1 - star.twinkleIntensity);
      const opacity = star.baseOpacity * twinkle * layerOpacityMod;

      const { r, g, b } = star.color;

      // Draw glow for brighter stars
      if (star.size > 1) {
        const glowGradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 4
        );
        glowGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity * 0.3})`);
        glowGradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${opacity * 0.1})`);
        glowGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw star core
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();

      // Draw cross spikes for very bright stars
      if (star.size > 2 && opacity > 0.7) {
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.3})`;
        ctx.lineWidth = 0.5;

        const spikeLength = star.size * 6;

        ctx.beginPath();
        ctx.moveTo(star.x - spikeLength, star.y);
        ctx.lineTo(star.x + spikeLength, star.y);
        ctx.moveTo(star.x, star.y - spikeLength);
        ctx.lineTo(star.x, star.y + spikeLength);
        ctx.stroke();
      }
    };

    const drawGalaxy = (galaxy) => {
      galaxy.rotation += galaxy.rotationSpeed;

      ctx.save();
      ctx.translate(galaxy.x, galaxy.y);
      ctx.rotate(galaxy.rotation);

      if (galaxy.type === 'spiral') {
        // Spiral galaxy
        const arms = 2;
        for (let arm = 0; arm < arms; arm++) {
          const armAngle = (Math.PI * 2 / arms) * arm;

          for (let i = 0; i < 100; i++) {
            const angle = armAngle + (i / 100) * Math.PI * 3;
            const distance = (i / 100) * galaxy.size;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance * 0.4; // Flatten

            const starOpacity = galaxy.opacity * (1 - i / 100);
            ctx.fillStyle = `rgba(255, 255, 255, ${starOpacity})`;
            ctx.beginPath();
            ctx.arc(x, y, 0.5 + Math.random() * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Central bulge
        const bulgeGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.size * 0.3);
        bulgeGradient.addColorStop(0, `rgba(255, 250, 230, ${galaxy.opacity * 2})`);
        bulgeGradient.addColorStop(1, 'rgba(255, 250, 230, 0)');
        ctx.fillStyle = bulgeGradient;
        ctx.beginPath();
        ctx.arc(0, 0, galaxy.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Elliptical galaxy
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.size);
        gradient.addColorStop(0, `rgba(255, 250, 220, ${galaxy.opacity * 1.5})`);
        gradient.addColorStop(0.5, `rgba(255, 240, 200, ${galaxy.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 240, 200, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, galaxy.size, galaxy.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const drawNebula = (nebula) => {
      const { r, g, b } = nebula.color;
      const gradient = ctx.createRadialGradient(
        nebula.x, nebula.y, 0,
        nebula.x, nebula.y, nebula.radius
      );

      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${nebula.opacity})`);
      gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${nebula.opacity * 0.7})`);
      gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${nebula.opacity * 0.3})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      time += 0.016;

      // Clear with deep space gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, '#050508');
      bgGradient.addColorStop(0.2, '#08080d');
      bgGradient.addColorStop(0.4, '#0a0a10');
      bgGradient.addColorStop(0.6, '#08080d');
      bgGradient.addColorStop(0.8, '#0a0a10');
      bgGradient.addColorStop(1, '#050508');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw nebulae (background)
      nebulaeRef.current.forEach(drawNebula);

      // Draw distant galaxies
      galaxiesRef.current.forEach(drawGalaxy);

      // Draw star layers (back to front)
      starsRef.current.background.forEach(star => {
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
        drawStar(star, 0.6);
      });

      starsRef.current.midground.forEach(star => {
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
        drawStar(star, 0.8);
      });

      starsRef.current.foreground.forEach(star => {
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
        drawStar(star, 1);
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
  }, [initializeStars, initializeGalaxies, initializeNebulae]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />

      {/* Meteorite with Barosanul Suprem banner */}
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
