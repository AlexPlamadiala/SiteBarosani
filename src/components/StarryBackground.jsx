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

    // Draw highly realistic 3D Earth
    const drawEarth = (x, y, radius) => {
      earthRef.current.rotation += 0.0002;
      earthRef.current.cloudRotation += 0.00025;

      ctx.save();
      ctx.translate(x, y);

      // Light source position (top-left)
      const lightX = -0.6;
      const lightY = -0.5;

      // Outer atmosphere glow (Fresnel effect)
      for (let i = 5; i >= 1; i--) {
        const glowRadius = radius * (1 + i * 0.08);
        const glowGradient = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, glowRadius);
        glowGradient.addColorStop(0, 'rgba(100, 180, 255, 0)');
        glowGradient.addColorStop(0.6, `rgba(80, 160, 255, ${0.02 / i})`);
        glowGradient.addColorStop(1, 'rgba(60, 140, 255, 0)');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Create clipping mask for the planet
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.clip();

      // Base sphere with 3D shading (deep ocean)
      const sphereGradient = ctx.createRadialGradient(
        lightX * radius * 0.5, lightY * radius * 0.5, 0,
        0, 0, radius * 1.2
      );
      sphereGradient.addColorStop(0, '#2980b9');
      sphereGradient.addColorStop(0.3, '#1a5276');
      sphereGradient.addColorStop(0.6, '#154360');
      sphereGradient.addColorStop(0.85, '#0d2840');
      sphereGradient.addColorStop(1, '#051525');
      ctx.fillStyle = sphereGradient;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

      // Ocean depth variation
      const oceanDepth = ctx.createRadialGradient(
        radius * 0.2, radius * 0.3, 0,
        radius * 0.2, radius * 0.3, radius * 0.8
      );
      oceanDepth.addColorStop(0, 'rgba(10, 60, 100, 0.4)');
      oceanDepth.addColorStop(1, 'rgba(10, 60, 100, 0)');
      ctx.fillStyle = oceanDepth;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

      // Draw continents with rotation
      ctx.save();
      ctx.rotate(earthRef.current.rotation);

      // Continent rendering function with 3D shading
      const drawContinent = (points, baseColor, highlightColor, shadowColor) => {
        ctx.beginPath();
        ctx.moveTo(points[0].x * radius, points[0].y * radius);
        for (let i = 1; i < points.length; i++) {
          const cp1x = (points[i - 1].x + (points[i].x - points[i - 1].x) * 0.5) * radius;
          const cp1y = (points[i - 1].y + (points[i].y - points[i - 1].y) * 0.3) * radius;
          ctx.quadraticCurveTo(cp1x, cp1y, points[i].x * radius, points[i].y * radius);
        }
        ctx.closePath();

        // Base land color with gradient for 3D effect
        const landGradient = ctx.createLinearGradient(
          lightX * radius, lightY * radius,
          -lightX * radius * 0.5, -lightY * radius * 0.5
        );
        landGradient.addColorStop(0, highlightColor);
        landGradient.addColorStop(0.4, baseColor);
        landGradient.addColorStop(1, shadowColor);
        ctx.fillStyle = landGradient;
        ctx.fill();
      };

      // Africa - more detailed shape
      drawContinent([
        { x: 0.05, y: -0.35 }, { x: 0.15, y: -0.4 }, { x: 0.25, y: -0.35 },
        { x: 0.3, y: -0.15 }, { x: 0.35, y: 0.05 }, { x: 0.3, y: 0.25 },
        { x: 0.2, y: 0.4 }, { x: 0.1, y: 0.35 }, { x: 0.0, y: 0.2 },
        { x: -0.05, y: 0.0 }, { x: 0.0, y: -0.2 }
      ], '#3d6b22', '#5a9432', '#2a4a18');

      // Europe
      drawContinent([
        { x: -0.05, y: -0.55 }, { x: 0.1, y: -0.6 }, { x: 0.2, y: -0.55 },
        { x: 0.25, y: -0.45 }, { x: 0.15, y: -0.4 }, { x: 0.0, y: -0.42 },
        { x: -0.1, y: -0.48 }
      ], '#4a7a28', '#6ba33a', '#3a5a20');

      // North America
      drawContinent([
        { x: -0.7, y: -0.45 }, { x: -0.55, y: -0.55 }, { x: -0.4, y: -0.5 },
        { x: -0.35, y: -0.35 }, { x: -0.45, y: -0.2 }, { x: -0.55, y: -0.15 },
        { x: -0.65, y: -0.25 }, { x: -0.75, y: -0.35 }
      ], '#4a7a28', '#6ba33a', '#3a5a20');

      // South America
      drawContinent([
        { x: -0.45, y: 0.0 }, { x: -0.35, y: -0.05 }, { x: -0.3, y: 0.1 },
        { x: -0.35, y: 0.3 }, { x: -0.4, y: 0.45 }, { x: -0.5, y: 0.5 },
        { x: -0.55, y: 0.35 }, { x: -0.5, y: 0.15 }
      ], '#3d6b22', '#5a9432', '#2a4a18');

      // Asia
      drawContinent([
        { x: 0.3, y: -0.5 }, { x: 0.5, y: -0.55 }, { x: 0.7, y: -0.45 },
        { x: 0.75, y: -0.25 }, { x: 0.65, y: -0.1 }, { x: 0.5, y: -0.05 },
        { x: 0.35, y: -0.15 }, { x: 0.3, y: -0.35 }
      ], '#4a7a28', '#6ba33a', '#3a5a20');

      // Australia
      drawContinent([
        { x: 0.55, y: 0.3 }, { x: 0.7, y: 0.25 }, { x: 0.8, y: 0.35 },
        { x: 0.75, y: 0.5 }, { x: 0.6, y: 0.5 }, { x: 0.5, y: 0.4 }
      ], '#8B7355', '#a08060', '#6a5a45');

      // Antarctica (ice cap)
      ctx.beginPath();
      ctx.ellipse(0, radius * 0.9, radius * 0.5, radius * 0.15, 0, 0, Math.PI * 2);
      const iceGradient = ctx.createRadialGradient(0, radius * 0.85, 0, 0, radius * 0.9, radius * 0.4);
      iceGradient.addColorStop(0, '#ffffff');
      iceGradient.addColorStop(0.5, '#e8f4f8');
      iceGradient.addColorStop(1, '#c0d8e0');
      ctx.fillStyle = iceGradient;
      ctx.fill();

      // Arctic (ice cap)
      ctx.beginPath();
      ctx.ellipse(0, -radius * 0.88, radius * 0.35, radius * 0.12, 0, 0, Math.PI * 2);
      ctx.fillStyle = iceGradient;
      ctx.fill();

      ctx.restore();

      // Cloud layers with 3D depth
      ctx.save();
      ctx.rotate(earthRef.current.cloudRotation);

      const drawCloud3D = (cx, cy, w, h, opacity) => {
        const cloudGradient = ctx.createRadialGradient(
          cx * radius - w * radius * 0.2, cy * radius - h * radius * 0.3, 0,
          cx * radius, cy * radius, Math.max(w, h) * radius
        );
        cloudGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        cloudGradient.addColorStop(0.5, `rgba(240, 248, 255, ${opacity * 0.7})`);
        cloudGradient.addColorStop(1, `rgba(220, 235, 250, 0)`);
        ctx.fillStyle = cloudGradient;
        ctx.beginPath();
        ctx.ellipse(cx * radius, cy * radius, w * radius, h * radius, 0, 0, Math.PI * 2);
        ctx.fill();
      };

      // Multiple cloud formations
      drawCloud3D(-0.3, -0.4, 0.25, 0.1, 0.6);
      drawCloud3D(0.4, -0.25, 0.3, 0.08, 0.5);
      drawCloud3D(-0.1, 0.35, 0.35, 0.09, 0.55);
      drawCloud3D(0.5, 0.15, 0.2, 0.07, 0.45);
      drawCloud3D(-0.5, 0.05, 0.22, 0.08, 0.5);
      drawCloud3D(0.2, -0.6, 0.18, 0.06, 0.4);
      drawCloud3D(-0.6, -0.2, 0.15, 0.05, 0.35);

      ctx.restore();

      // Atmospheric scattering (blue rim on dark side)
      const atmosScatter = ctx.createRadialGradient(
        -lightX * radius * 0.8, -lightY * radius * 0.8, radius * 0.3,
        0, 0, radius
      );
      atmosScatter.addColorStop(0, 'rgba(100, 180, 255, 0)');
      atmosScatter.addColorStop(0.7, 'rgba(100, 180, 255, 0)');
      atmosScatter.addColorStop(0.9, 'rgba(80, 150, 255, 0.15)');
      atmosScatter.addColorStop(1, 'rgba(60, 120, 255, 0.25)');
      ctx.fillStyle = atmosScatter;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

      // Day/night terminator effect
      const terminator = ctx.createLinearGradient(
        lightX * radius * 1.5, lightY * radius * 1.5,
        -lightX * radius * 0.8, -lightY * radius * 0.8
      );
      terminator.addColorStop(0, 'rgba(0, 0, 0, 0)');
      terminator.addColorStop(0.45, 'rgba(0, 0, 0, 0)');
      terminator.addColorStop(0.55, 'rgba(0, 0, 20, 0.3)');
      terminator.addColorStop(0.7, 'rgba(0, 0, 30, 0.5)');
      terminator.addColorStop(1, 'rgba(0, 0, 20, 0.6)');
      ctx.fillStyle = terminator;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

      // Fresnel rim lighting (atmosphere edge glow)
      const fresnel = ctx.createRadialGradient(0, 0, radius * 0.7, 0, 0, radius);
      fresnel.addColorStop(0, 'rgba(150, 200, 255, 0)');
      fresnel.addColorStop(0.85, 'rgba(150, 200, 255, 0)');
      fresnel.addColorStop(0.93, 'rgba(150, 200, 255, 0.12)');
      fresnel.addColorStop(0.97, 'rgba(130, 190, 255, 0.25)');
      fresnel.addColorStop(1, 'rgba(100, 180, 255, 0.4)');
      ctx.fillStyle = fresnel;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

      // Primary specular highlight (sun reflection)
      const specular = ctx.createRadialGradient(
        lightX * radius * 0.5, lightY * radius * 0.5, 0,
        lightX * radius * 0.5, lightY * radius * 0.5, radius * 0.4
      );
      specular.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
      specular.addColorStop(0.2, 'rgba(255, 255, 255, 0.2)');
      specular.addColorStop(0.5, 'rgba(255, 255, 255, 0.08)');
      specular.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = specular;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

      // Secondary highlight (subsurface scattering simulation)
      const subsurf = ctx.createRadialGradient(
        lightX * radius * 0.3, lightY * radius * 0.3, 0,
        lightX * radius * 0.3, lightY * radius * 0.3, radius * 0.6
      );
      subsurf.addColorStop(0, 'rgba(200, 230, 255, 0.1)');
      subsurf.addColorStop(0.5, 'rgba(180, 220, 255, 0.05)');
      subsurf.addColorStop(1, 'rgba(180, 220, 255, 0)');
      ctx.fillStyle = subsurf;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

      ctx.restore();
    };

    // Draw highly realistic 3D Moon
    const drawMoon = (x, y, radius) => {
      ctx.save();
      ctx.translate(x, y);

      // Light source (same as Earth - top-left)
      const lightX = -0.6;
      const lightY = -0.5;

      // Subtle outer glow
      const outerGlow = ctx.createRadialGradient(0, 0, radius * 0.9, 0, 0, radius * 1.15);
      outerGlow.addColorStop(0, 'rgba(200, 200, 210, 0)');
      outerGlow.addColorStop(0.8, 'rgba(200, 200, 210, 0.02)');
      outerGlow.addColorStop(1, 'rgba(200, 200, 210, 0)');
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // Create clipping mask
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.clip();

      // Base sphere with 3D lighting
      const sphereGradient = ctx.createRadialGradient(
        lightX * radius * 0.4, lightY * radius * 0.4, 0,
        0, 0, radius * 1.1
      );
      sphereGradient.addColorStop(0, '#d8d8d8');
      sphereGradient.addColorStop(0.25, '#c0c0c0');
      sphereGradient.addColorStop(0.5, '#a0a0a0');
      sphereGradient.addColorStop(0.75, '#707070');
      sphereGradient.addColorStop(1, '#404040');
      ctx.fillStyle = sphereGradient;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

      // Surface texture variation (subtle noise effect via multiple gradients)
      for (let i = 0; i < 8; i++) {
        const tx = (Math.sin(i * 1.3) * 0.6);
        const ty = (Math.cos(i * 1.7) * 0.6);
        const size = 0.15 + (i % 3) * 0.1;
        const textureGrad = ctx.createRadialGradient(
          tx * radius, ty * radius, 0,
          tx * radius, ty * radius, size * radius
        );
        const brightness = 90 + (i % 4) * 10;
        textureGrad.addColorStop(0, `rgba(${brightness}, ${brightness}, ${brightness + 5}, 0.15)`);
        textureGrad.addColorStop(1, 'rgba(128, 128, 130, 0)');
        ctx.fillStyle = textureGrad;
        ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
      }

      // Maria (lunar seas) - darker basaltic plains
      const drawMaria = (cx, cy, rx, ry, rotation, opacity) => {
        ctx.save();
        ctx.translate(cx * radius, cy * radius);
        ctx.rotate(rotation);
        const mariaGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(rx, ry) * radius);
        mariaGrad.addColorStop(0, `rgba(60, 60, 70, ${opacity})`);
        mariaGrad.addColorStop(0.6, `rgba(70, 70, 80, ${opacity * 0.6})`);
        mariaGrad.addColorStop(1, 'rgba(80, 80, 90, 0)');
        ctx.fillStyle = mariaGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx * radius, ry * radius, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      // Major maria
      drawMaria(-0.25, -0.1, 0.3, 0.25, 0.2, 0.35);  // Mare Imbrium
      drawMaria(0.15, 0.2, 0.25, 0.2, -0.3, 0.3);    // Mare Serenitatis
      drawMaria(-0.1, 0.35, 0.2, 0.15, 0.1, 0.25);   // Mare Tranquillitatis
      drawMaria(0.35, -0.2, 0.18, 0.12, 0.4, 0.2);   // Mare Crisium
      drawMaria(-0.4, 0.25, 0.12, 0.1, -0.2, 0.2);   // Oceanus Procellarum edge

      // Crater rendering with proper 3D shadows
      const drawCrater3D = (cx, cy, r, depth) => {
        const craterX = cx * radius;
        const craterY = cy * radius;
        const craterR = r * radius;

        // Calculate crater lighting based on position relative to light source
        const distFromLight = Math.sqrt(
          Math.pow(cx - lightX, 2) + Math.pow(cy - lightY, 2)
        );
        const shadowIntensity = Math.min(0.8, depth * (0.5 + distFromLight * 0.3));

        // Crater depression (darker center)
        const craterDepth = ctx.createRadialGradient(
          craterX + craterR * 0.15, craterY + craterR * 0.15, 0,
          craterX, craterY, craterR
        );
        craterDepth.addColorStop(0, `rgba(40, 40, 45, ${shadowIntensity})`);
        craterDepth.addColorStop(0.5, `rgba(60, 60, 65, ${shadowIntensity * 0.6})`);
        craterDepth.addColorStop(0.8, `rgba(80, 80, 85, ${shadowIntensity * 0.3})`);
        craterDepth.addColorStop(1, 'rgba(100, 100, 105, 0)');
        ctx.fillStyle = craterDepth;
        ctx.beginPath();
        ctx.arc(craterX, craterY, craterR, 0, Math.PI * 2);
        ctx.fill();

        // Crater rim highlight (lit side)
        const rimHighlight = ctx.createRadialGradient(
          craterX - craterR * 0.3, craterY - craterR * 0.3, craterR * 0.6,
          craterX, craterY, craterR * 1.1
        );
        rimHighlight.addColorStop(0, 'rgba(255, 255, 255, 0)');
        rimHighlight.addColorStop(0.7, 'rgba(255, 255, 255, 0)');
        rimHighlight.addColorStop(0.85, `rgba(220, 220, 225, ${depth * 0.4})`);
        rimHighlight.addColorStop(1, 'rgba(200, 200, 205, 0)');
        ctx.fillStyle = rimHighlight;
        ctx.beginPath();
        ctx.arc(craterX, craterY, craterR * 1.1, 0, Math.PI * 2);
        ctx.fill();

        // Inner shadow on one side
        ctx.beginPath();
        ctx.arc(craterX, craterY, craterR * 0.9, Math.PI * 0.7, Math.PI * 1.7);
        ctx.strokeStyle = `rgba(180, 180, 185, ${depth * 0.25})`;
        ctx.lineWidth = craterR * 0.08;
        ctx.stroke();
      };

      // Large craters
      drawCrater3D(-0.35, -0.3, 0.12, 0.7);   // Tycho-like
      drawCrater3D(0.3, -0.4, 0.1, 0.6);
      drawCrater3D(0.4, 0.25, 0.11, 0.65);
      drawCrater3D(-0.2, 0.45, 0.09, 0.55);

      // Medium craters
      drawCrater3D(-0.5, 0.1, 0.07, 0.5);
      drawCrater3D(0.15, 0.1, 0.06, 0.45);
      drawCrater3D(-0.1, -0.5, 0.065, 0.5);
      drawCrater3D(0.5, -0.1, 0.055, 0.4);
      drawCrater3D(-0.45, -0.45, 0.05, 0.45);
      drawCrater3D(0.25, 0.45, 0.06, 0.4);

      // Small craters
      drawCrater3D(0.0, 0.25, 0.035, 0.35);
      drawCrater3D(-0.3, 0.15, 0.03, 0.3);
      drawCrater3D(0.45, 0.05, 0.025, 0.3);
      drawCrater3D(-0.15, -0.25, 0.028, 0.32);
      drawCrater3D(0.1, -0.35, 0.022, 0.28);
      drawCrater3D(-0.55, -0.2, 0.02, 0.25);

      // Terminator effect (day/night boundary)
      const terminator = ctx.createLinearGradient(
        lightX * radius * 1.3, lightY * radius * 1.3,
        -lightX * radius * 0.7, -lightY * radius * 0.7
      );
      terminator.addColorStop(0, 'rgba(0, 0, 0, 0)');
      terminator.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
      terminator.addColorStop(0.65, 'rgba(0, 0, 10, 0.25)');
      terminator.addColorStop(0.8, 'rgba(0, 0, 15, 0.45)');
      terminator.addColorStop(1, 'rgba(0, 0, 10, 0.55)');
      ctx.fillStyle = terminator;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

      // Primary specular highlight
      const specular = ctx.createRadialGradient(
        lightX * radius * 0.45, lightY * radius * 0.45, 0,
        lightX * radius * 0.45, lightY * radius * 0.45, radius * 0.35
      );
      specular.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      specular.addColorStop(0.3, 'rgba(255, 255, 255, 0.2)');
      specular.addColorStop(0.6, 'rgba(255, 255, 255, 0.08)');
      specular.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = specular;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

      // Subtle rim lighting
      const rimLight = ctx.createRadialGradient(0, 0, radius * 0.85, 0, 0, radius);
      rimLight.addColorStop(0, 'rgba(200, 200, 210, 0)');
      rimLight.addColorStop(0.9, 'rgba(200, 200, 210, 0.05)');
      rimLight.addColorStop(1, 'rgba(220, 220, 230, 0.12)');
      ctx.fillStyle = rimLight;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

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
      // Draw Earth (larger, more prominent)
      const earthX = width * 0.82;
      const earthY = height * 0.14;
      const earthRadius = Math.min(width, height) * 0.12;
      drawEarth(earthX, earthY, earthRadius);

      // Draw Moon (proportionally larger, positioned nicely)
      const moonX = earthX - earthRadius * 2.2;
      const moonY = earthY + earthRadius * 0.6;
      const moonRadius = earthRadius * 0.32;
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
