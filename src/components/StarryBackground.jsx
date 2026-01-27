import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SUPREM_URL } from '../config/api';

// Meteorite component with Barosanul Suprem banner - SLOWER
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
  const earthRef = useRef({ rotation: 0, cloudRotation: 0 });

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
    }, 45000); // Every 45 seconds (slower interval since animation is longer)

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
    { r: 255, g: 255, b: 255 },
    { r: 255, g: 255, b: 255 },
    { r: 200, g: 220, b: 255 },
    { r: 170, g: 200, b: 255 },
    { r: 255, g: 250, b: 230 },
    { r: 255, g: 220, b: 180 },
    { r: 255, g: 200, b: 150 },
    { r: 255, g: 180, b: 180 },
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
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleIntensity: Math.random() * 0.5 + 0.2,
          color,
          speed: Math.random() * (speedRange[1] - speedRange[0]) + speedRange[0],
        });
      }
      return stars;
    };

    return {
      background: createStarLayer(400, [0.2, 0.6], [0.15, 0.35], [0.01, 0.03]),
      midground: createStarLayer(200, [0.5, 1.2], [0.3, 0.6], [0.03, 0.06]),
      foreground: createStarLayer(60, [1, 2.5], [0.5, 0.9], [0.06, 0.12]),
    };
  }, [starColors]);

  const initializeGalaxies = useCallback((width, height) => {
    const galaxies = [];
    for (let i = 0; i < 2; i++) {
      galaxies.push({
        x: Math.random() * width * 0.6 + width * 0.2,
        y: Math.random() * height * 0.4 + height * 0.1,
        size: Math.random() * 50 + 30,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.0003,
        opacity: Math.random() * 0.08 + 0.03,
        type: Math.random() > 0.5 ? 'spiral' : 'elliptical',
      });
    }
    return galaxies;
  }, []);

  const initializeNebulae = useCallback((width, height) => {
    return [
      {
        x: width * 0.1,
        y: height * 0.15,
        radius: Math.min(width, height) * 0.25,
        color: { r: 80, g: 40, b: 120 },
        opacity: 0.012,
      },
      {
        x: width * 0.9,
        y: height * 0.6,
        radius: Math.min(width, height) * 0.3,
        color: { r: 120, g: 80, b: 40 },
        opacity: 0.008,
      },
      {
        x: width * 0.5,
        y: height * 0.4,
        radius: Math.min(width, height) * 0.35,
        color: { r: 40, g: 60, b: 100 },
        opacity: 0.006,
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
      star.twinklePhase += star.twinkleSpeed;
      const twinkle = Math.sin(star.twinklePhase) * star.twinkleIntensity + (1 - star.twinkleIntensity);
      const opacity = star.baseOpacity * twinkle * layerOpacityMod;
      const { r, g, b } = star.color;

      if (star.size > 0.8) {
        const glowGradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 3
        );
        glowGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity * 0.4})`);
        glowGradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${opacity * 0.15})`);
        glowGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();

      if (star.size > 1.8 && opacity > 0.6) {
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.25})`;
        ctx.lineWidth = 0.5;
        const spikeLength = star.size * 5;
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
        for (let arm = 0; arm < 2; arm++) {
          const armAngle = (Math.PI * 2 / 2) * arm;
          for (let i = 0; i < 80; i++) {
            const angle = armAngle + (i / 80) * Math.PI * 2.5;
            const distance = (i / 80) * galaxy.size;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance * 0.35;
            const starOpacity = galaxy.opacity * (1 - i / 80) * 0.8;
            ctx.fillStyle = `rgba(255, 255, 255, ${starOpacity})`;
            ctx.beginPath();
            ctx.arc(x, y, 0.3 + Math.random() * 0.4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        const bulgeGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.size * 0.25);
        bulgeGradient.addColorStop(0, `rgba(255, 250, 230, ${galaxy.opacity * 1.5})`);
        bulgeGradient.addColorStop(1, 'rgba(255, 250, 230, 0)');
        ctx.fillStyle = bulgeGradient;
        ctx.beginPath();
        ctx.arc(0, 0, galaxy.size * 0.25, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.size);
        gradient.addColorStop(0, `rgba(255, 250, 220, ${galaxy.opacity * 1.2})`);
        gradient.addColorStop(0.5, `rgba(255, 240, 200, ${galaxy.opacity * 0.4})`);
        gradient.addColorStop(1, 'rgba(255, 240, 200, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, galaxy.size, galaxy.size * 0.5, 0, 0, Math.PI * 2);
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
      gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${nebula.opacity * 0.6})`);
      gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${nebula.opacity * 0.2})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
      ctx.fill();
    };

    // Draw realistic Earth
    const drawEarth = (x, y, radius) => {
      earthRef.current.rotation += 0.0003;
      earthRef.current.cloudRotation += 0.0004;

      ctx.save();
      ctx.translate(x, y);

      // Atmosphere glow (outer)
      const atmosphereGlow = ctx.createRadialGradient(0, 0, radius * 0.9, 0, 0, radius * 1.4);
      atmosphereGlow.addColorStop(0, 'rgba(100, 180, 255, 0)');
      atmosphereGlow.addColorStop(0.5, 'rgba(100, 180, 255, 0.03)');
      atmosphereGlow.addColorStop(0.8, 'rgba(80, 150, 255, 0.05)');
      atmosphereGlow.addColorStop(1, 'rgba(60, 120, 255, 0)');
      ctx.fillStyle = atmosphereGlow;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // Ocean base
      const oceanGradient = ctx.createRadialGradient(-radius * 0.3, -radius * 0.3, 0, 0, 0, radius);
      oceanGradient.addColorStop(0, '#1a5276');
      oceanGradient.addColorStop(0.5, '#1a4d6e');
      oceanGradient.addColorStop(1, '#0d3d56');
      ctx.fillStyle = oceanGradient;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw continents
      ctx.save();
      ctx.rotate(earthRef.current.rotation);

      // Simplified continent shapes
      const drawContinent = (cx, cy, w, h, color) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(cx, cy, w, h, Math.random() * 0.2, 0, Math.PI * 2);
        ctx.fill();
      };

      // Africa/Europe area
      drawContinent(radius * 0.15, -radius * 0.1, radius * 0.25, radius * 0.4, '#2d5016');
      drawContinent(radius * 0.2, radius * 0.3, radius * 0.2, radius * 0.25, '#3d6b22');

      // Americas area
      drawContinent(-radius * 0.5, -radius * 0.2, radius * 0.15, radius * 0.35, '#2d5016');
      drawContinent(-radius * 0.45, radius * 0.25, radius * 0.12, radius * 0.3, '#3d6b22');

      // Asia area
      drawContinent(radius * 0.5, -radius * 0.25, radius * 0.3, radius * 0.25, '#3d6b22');

      // Australia
      drawContinent(radius * 0.6, radius * 0.4, radius * 0.12, radius * 0.08, '#5a4a32');

      // Ice caps
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.ellipse(0, -radius * 0.85, radius * 0.3, radius * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, radius * 0.88, radius * 0.25, radius * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Cloud layer
      ctx.save();
      ctx.rotate(earthRef.current.cloudRotation);
      ctx.globalAlpha = 0.4;

      const drawCloud = (cx, cy, w, h) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.ellipse(cx, cy, w, h, 0, 0, Math.PI * 2);
        ctx.fill();
      };

      drawCloud(-radius * 0.3, -radius * 0.4, radius * 0.2, radius * 0.08);
      drawCloud(radius * 0.4, -radius * 0.2, radius * 0.25, radius * 0.06);
      drawCloud(-radius * 0.1, radius * 0.3, radius * 0.3, radius * 0.07);
      drawCloud(radius * 0.5, radius * 0.1, radius * 0.15, radius * 0.05);
      drawCloud(-radius * 0.5, radius * 0.0, radius * 0.18, radius * 0.06);

      ctx.globalAlpha = 1;
      ctx.restore();

      // Atmosphere edge highlight
      const atmosphereEdge = ctx.createRadialGradient(
        -radius * 0.4, -radius * 0.4, radius * 0.5,
        0, 0, radius
      );
      atmosphereEdge.addColorStop(0, 'rgba(150, 200, 255, 0)');
      atmosphereEdge.addColorStop(0.85, 'rgba(150, 200, 255, 0)');
      atmosphereEdge.addColorStop(0.95, 'rgba(150, 200, 255, 0.15)');
      atmosphereEdge.addColorStop(1, 'rgba(100, 180, 255, 0.3)');
      ctx.fillStyle = atmosphereEdge;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      // Specular highlight
      const specular = ctx.createRadialGradient(
        -radius * 0.35, -radius * 0.35, 0,
        -radius * 0.35, -radius * 0.35, radius * 0.5
      );
      specular.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      specular.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
      specular.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = specular;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Draw realistic Moon
    const drawMoon = (x, y, radius) => {
      ctx.save();
      ctx.translate(x, y);

      // Moon base (gray surface)
      const moonGradient = ctx.createRadialGradient(
        -radius * 0.3, -radius * 0.3, 0,
        0, 0, radius
      );
      moonGradient.addColorStop(0, '#c8c8c8');
      moonGradient.addColorStop(0.5, '#a0a0a0');
      moonGradient.addColorStop(1, '#606060');
      ctx.fillStyle = moonGradient;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      // Craters
      const drawCrater = (cx, cy, r, depth) => {
        // Crater shadow
        const craterGradient = ctx.createRadialGradient(
          cx - r * 0.2, cy - r * 0.2, 0,
          cx, cy, r
        );
        craterGradient.addColorStop(0, `rgba(60, 60, 60, ${depth})`);
        craterGradient.addColorStop(0.7, `rgba(80, 80, 80, ${depth * 0.5})`);
        craterGradient.addColorStop(1, 'rgba(100, 100, 100, 0)');
        ctx.fillStyle = craterGradient;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();

        // Crater rim highlight
        ctx.strokeStyle = `rgba(200, 200, 200, ${depth * 0.3})`;
        ctx.lineWidth = r * 0.15;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.85, Math.PI * 0.8, Math.PI * 1.8);
        ctx.stroke();
      };

      // Various craters
      drawCrater(-radius * 0.3, -radius * 0.2, radius * 0.2, 0.6);
      drawCrater(radius * 0.25, -radius * 0.35, radius * 0.15, 0.5);
      drawCrater(radius * 0.4, radius * 0.2, radius * 0.18, 0.55);
      drawCrater(-radius * 0.15, radius * 0.4, radius * 0.12, 0.4);
      drawCrater(-radius * 0.5, radius * 0.1, radius * 0.1, 0.45);
      drawCrater(radius * 0.1, radius * 0.15, radius * 0.08, 0.35);
      drawCrater(-radius * 0.4, -radius * 0.5, radius * 0.07, 0.3);
      drawCrater(radius * 0.5, -radius * 0.1, radius * 0.06, 0.3);

      // Maria (dark patches)
      ctx.fillStyle = 'rgba(70, 70, 80, 0.3)';
      ctx.beginPath();
      ctx.ellipse(-radius * 0.2, radius * 0.1, radius * 0.25, radius * 0.15, 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(65, 65, 75, 0.25)';
      ctx.beginPath();
      ctx.ellipse(radius * 0.3, -radius * 0.15, radius * 0.2, radius * 0.12, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Specular highlight
      const specular = ctx.createRadialGradient(
        -radius * 0.3, -radius * 0.3, 0,
        -radius * 0.3, -radius * 0.3, radius * 0.4
      );
      specular.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
      specular.addColorStop(0.5, 'rgba(255, 255, 255, 0.08)');
      specular.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = specular;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      time += 0.016;

      // Deep space gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, '#030305');
      bgGradient.addColorStop(0.15, '#050508');
      bgGradient.addColorStop(0.3, '#08080c');
      bgGradient.addColorStop(0.5, '#0a0a0f');
      bgGradient.addColorStop(0.7, '#08080c');
      bgGradient.addColorStop(0.85, '#050508');
      bgGradient.addColorStop(1, '#030305');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw nebulae
      nebulaeRef.current.forEach(drawNebula);

      // Draw distant galaxies
      galaxiesRef.current.forEach(drawGalaxy);

      // Draw background stars
      starsRef.current.background.forEach(star => {
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
        drawStar(star, 0.5);
      });

      // Draw Earth (positioned in lower right area, visible on first screen)
      const earthX = width * 0.85;
      const earthY = height * 0.12;
      const earthRadius = Math.min(width, height) * 0.08;
      drawEarth(earthX, earthY, earthRadius);

      // Draw Moon (near Earth)
      const moonX = earthX - earthRadius * 2.5;
      const moonY = earthY + earthRadius * 0.8;
      const moonRadius = earthRadius * 0.27;
      drawMoon(moonX, moonY, moonRadius);

      // Draw midground stars
      starsRef.current.midground.forEach(star => {
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
        drawStar(star, 0.7);
      });

      // Draw foreground stars
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
