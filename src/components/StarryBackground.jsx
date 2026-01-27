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

    // Draw TRUE 3D Earth with realistic sphere shading
    const drawEarth = (x, y, radius) => {
      earthRef.current.rotation += 0.0002;
      earthRef.current.cloudRotation += 0.00025;

      ctx.save();
      ctx.translate(x, y);

      // Light source - strong directional from top-left
      const lightAngle = -Math.PI * 0.75;
      const lightX = Math.cos(lightAngle);
      const lightY = Math.sin(lightAngle);

      // === OUTER ATMOSPHERE GLOW ===
      const atmosGlow = ctx.createRadialGradient(0, 0, radius, 0, 0, radius * 1.4);
      atmosGlow.addColorStop(0, 'rgba(80, 160, 255, 0.5)');
      atmosGlow.addColorStop(0.3, 'rgba(60, 140, 255, 0.25)');
      atmosGlow.addColorStop(0.6, 'rgba(40, 120, 255, 0.1)');
      atmosGlow.addColorStop(1, 'rgba(30, 100, 255, 0)');
      ctx.fillStyle = atmosGlow;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // Create clipping mask
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.clip();

      // === BASE SPHERE - TRUE 3D SHADING ===
      // Main sphere gradient positioned off-center for 3D effect
      const sphereGradient = ctx.createRadialGradient(
        lightX * radius * 0.5, lightY * radius * 0.5, 0,
        lightX * radius * -0.2, lightY * radius * -0.2, radius * 1.5
      );
      sphereGradient.addColorStop(0, '#4da6ff');    // Bright lit ocean
      sphereGradient.addColorStop(0.2, '#2980b9');   // Mid ocean
      sphereGradient.addColorStop(0.4, '#1a5276');   // Deeper
      sphereGradient.addColorStop(0.6, '#0e3654');   // Dark side transition
      sphereGradient.addColorStop(0.8, '#061a2e');   // Very dark
      sphereGradient.addColorStop(1, '#020a12');     // Near black
      ctx.fillStyle = sphereGradient;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

      // === DRAW CONTINENTS ===
      ctx.save();
      ctx.rotate(earthRef.current.rotation);

      // Continent drawing with 3D sphere projection
      const drawContinent3D = (points, baseColor, brightColor, darkColor) => {
        ctx.beginPath();
        ctx.moveTo(points[0].x * radius, points[0].y * radius);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x * radius, points[i].y * radius);
        }
        ctx.closePath();

        // Apply sphere shading to continent
        const landGrad = ctx.createRadialGradient(
          lightX * radius * 0.5, lightY * radius * 0.5, 0,
          lightX * radius * -0.2, lightY * radius * -0.2, radius * 1.5
        );
        landGrad.addColorStop(0, brightColor);
        landGrad.addColorStop(0.3, baseColor);
        landGrad.addColorStop(0.6, darkColor);
        landGrad.addColorStop(1, '#0a1a0a');
        ctx.fillStyle = landGrad;
        ctx.fill();
      };

      // Continents with improved colors
      drawContinent3D([
        { x: 0.05, y: -0.35 }, { x: 0.15, y: -0.4 }, { x: 0.25, y: -0.35 },
        { x: 0.3, y: -0.15 }, { x: 0.35, y: 0.05 }, { x: 0.3, y: 0.25 },
        { x: 0.2, y: 0.4 }, { x: 0.1, y: 0.35 }, { x: 0.0, y: 0.2 },
        { x: -0.05, y: 0.0 }, { x: 0.0, y: -0.2 }
      ], '#4a8c2a', '#7acc40', '#1e4010'); // Africa

      drawContinent3D([
        { x: -0.05, y: -0.55 }, { x: 0.1, y: -0.6 }, { x: 0.2, y: -0.55 },
        { x: 0.25, y: -0.45 }, { x: 0.15, y: -0.4 }, { x: 0.0, y: -0.42 },
        { x: -0.1, y: -0.48 }
      ], '#5a9a35', '#8cd050', '#2a5018'); // Europe

      drawContinent3D([
        { x: -0.7, y: -0.45 }, { x: -0.55, y: -0.55 }, { x: -0.4, y: -0.5 },
        { x: -0.35, y: -0.35 }, { x: -0.45, y: -0.2 }, { x: -0.55, y: -0.15 },
        { x: -0.65, y: -0.25 }, { x: -0.75, y: -0.35 }
      ], '#5a9a35', '#8cd050', '#2a5018'); // N. America

      drawContinent3D([
        { x: -0.45, y: 0.0 }, { x: -0.35, y: -0.05 }, { x: -0.3, y: 0.1 },
        { x: -0.35, y: 0.3 }, { x: -0.4, y: 0.45 }, { x: -0.5, y: 0.5 },
        { x: -0.55, y: 0.35 }, { x: -0.5, y: 0.15 }
      ], '#4a8c2a', '#7acc40', '#1e4010'); // S. America

      drawContinent3D([
        { x: 0.3, y: -0.5 }, { x: 0.5, y: -0.55 }, { x: 0.7, y: -0.45 },
        { x: 0.75, y: -0.25 }, { x: 0.65, y: -0.1 }, { x: 0.5, y: -0.05 },
        { x: 0.35, y: -0.15 }, { x: 0.3, y: -0.35 }
      ], '#5a9a35', '#8cd050', '#2a5018'); // Asia

      drawContinent3D([
        { x: 0.55, y: 0.3 }, { x: 0.7, y: 0.25 }, { x: 0.8, y: 0.35 },
        { x: 0.75, y: 0.5 }, { x: 0.6, y: 0.5 }, { x: 0.5, y: 0.4 }
      ], '#a08060', '#d4b896', '#5a4530'); // Australia

      // Ice caps
      ctx.beginPath();
      ctx.ellipse(0, radius * 0.88, radius * 0.45, radius * 0.14, 0, 0, Math.PI * 2);
      const iceGrad = ctx.createRadialGradient(
        lightX * radius * 0.3, radius * 0.75, 0,
        0, radius * 0.88, radius * 0.5
      );
      iceGrad.addColorStop(0, '#ffffff');
      iceGrad.addColorStop(0.5, '#e0f0ff');
      iceGrad.addColorStop(1, '#a0c0d0');
      ctx.fillStyle = iceGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(0, -radius * 0.86, radius * 0.3, radius * 0.1, 0, 0, Math.PI * 2);
      ctx.fillStyle = iceGrad;
      ctx.fill();

      ctx.restore();

      // === CLOUDS with 3D shading ===
      ctx.save();
      ctx.rotate(earthRef.current.cloudRotation);

      const drawCloud = (cx, cy, w, h, opacity) => {
        // Calculate if cloud is on lit or dark side
        const distFromLight = Math.sqrt(Math.pow(cx - lightX * 0.5, 2) + Math.pow(cy - lightY * 0.5, 2));
        const lightFactor = Math.max(0.3, 1 - distFromLight * 0.7);

        const cloudGrad = ctx.createRadialGradient(
          (cx - 0.05) * radius, (cy - 0.05) * radius, 0,
          cx * radius, cy * radius, Math.max(w, h) * radius * 1.2
        );
        cloudGrad.addColorStop(0, `rgba(255, 255, 255, ${opacity * lightFactor})`);
        cloudGrad.addColorStop(0.4, `rgba(240, 248, 255, ${opacity * lightFactor * 0.6})`);
        cloudGrad.addColorStop(1, 'rgba(200, 220, 240, 0)');
        ctx.fillStyle = cloudGrad;
        ctx.beginPath();
        ctx.ellipse(cx * radius, cy * radius, w * radius, h * radius, 0, 0, Math.PI * 2);
        ctx.fill();
      };

      drawCloud(-0.3, -0.35, 0.28, 0.12, 0.75);
      drawCloud(0.35, -0.2, 0.32, 0.1, 0.65);
      drawCloud(-0.15, 0.3, 0.35, 0.11, 0.7);
      drawCloud(0.45, 0.1, 0.22, 0.08, 0.55);
      drawCloud(-0.5, 0.0, 0.24, 0.09, 0.6);

      ctx.restore();

      // === STRONG TERMINATOR (day/night) ===
      const terminator = ctx.createLinearGradient(
        lightX * radius * 1.2, lightY * radius * 1.2,
        -lightX * radius * 1.2, -lightY * radius * 1.2
      );
      terminator.addColorStop(0, 'rgba(0, 0, 0, 0)');
      terminator.addColorStop(0.4, 'rgba(0, 0, 0, 0)');
      terminator.addColorStop(0.5, 'rgba(0, 5, 15, 0.4)');
      terminator.addColorStop(0.6, 'rgba(0, 5, 20, 0.65)');
      terminator.addColorStop(0.75, 'rgba(0, 3, 15, 0.8)');
      terminator.addColorStop(1, 'rgba(0, 2, 10, 0.9)');
      ctx.fillStyle = terminator;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

      // === BRIGHT FRESNEL RIM (atmosphere edge) ===
      const fresnel = ctx.createRadialGradient(0, 0, radius * 0.75, 0, 0, radius);
      fresnel.addColorStop(0, 'rgba(100, 180, 255, 0)');
      fresnel.addColorStop(0.8, 'rgba(100, 180, 255, 0)');
      fresnel.addColorStop(0.88, 'rgba(120, 190, 255, 0.25)');
      fresnel.addColorStop(0.94, 'rgba(150, 210, 255, 0.5)');
      fresnel.addColorStop(0.98, 'rgba(180, 230, 255, 0.7)');
      fresnel.addColorStop(1, 'rgba(200, 240, 255, 0.9)');
      ctx.fillStyle = fresnel;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

      // === STRONG SPECULAR HIGHLIGHT ===
      const specX = lightX * radius * 0.45;
      const specY = lightY * radius * 0.45;
      const specular = ctx.createRadialGradient(specX, specY, 0, specX, specY, radius * 0.5);
      specular.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
      specular.addColorStop(0.1, 'rgba(255, 255, 255, 0.5)');
      specular.addColorStop(0.25, 'rgba(255, 255, 255, 0.25)');
      specular.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
      specular.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = specular;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

      // === SECONDARY HIGHLIGHT ===
      const spec2X = lightX * radius * 0.6;
      const spec2Y = lightY * radius * 0.6;
      const specular2 = ctx.createRadialGradient(spec2X, spec2Y, 0, spec2X, spec2Y, radius * 0.3);
      specular2.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      specular2.addColorStop(0.4, 'rgba(220, 240, 255, 0.15)');
      specular2.addColorStop(1, 'rgba(200, 230, 255, 0)');
      ctx.fillStyle = specular2;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

      ctx.restore();
    };

    // Draw TRUE 3D Moon with realistic sphere shading
    const drawMoon = (x, y, radius) => {
      ctx.save();
      ctx.translate(x, y);

      // Light source - same as Earth
      const lightAngle = -Math.PI * 0.75;
      const lightX = Math.cos(lightAngle);
      const lightY = Math.sin(lightAngle);

      // === OUTER GLOW ===
      const outerGlow = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.25);
      outerGlow.addColorStop(0, 'rgba(220, 220, 230, 0)');
      outerGlow.addColorStop(0.5, 'rgba(200, 200, 215, 0.15)');
      outerGlow.addColorStop(1, 'rgba(180, 180, 200, 0)');
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // Create clipping mask
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.clip();

      // === BASE SPHERE - TRUE 3D SHADING ===
      const sphereGradient = ctx.createRadialGradient(
        lightX * radius * 0.5, lightY * radius * 0.5, 0,
        lightX * radius * -0.2, lightY * radius * -0.2, radius * 1.5
      );
      sphereGradient.addColorStop(0, '#f0f0f0');    // Bright lit side
      sphereGradient.addColorStop(0.15, '#d8d8dc');
      sphereGradient.addColorStop(0.3, '#b8b8c0');
      sphereGradient.addColorStop(0.5, '#888890');
      sphereGradient.addColorStop(0.7, '#505058');
      sphereGradient.addColorStop(0.85, '#303038');
      sphereGradient.addColorStop(1, '#18181c');    // Very dark side
      ctx.fillStyle = sphereGradient;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

      // === MARIA (darker lunar seas) ===
      const drawMaria = (cx, cy, rx, ry, rotation, baseOpacity) => {
        // Calculate if maria is on lit or dark side
        const distFromLight = Math.sqrt(Math.pow(cx - lightX * 0.5, 2) + Math.pow(cy - lightY * 0.5, 2));
        const opacity = baseOpacity * Math.max(0.3, 1 - distFromLight * 0.5);

        ctx.save();
        ctx.translate(cx * radius, cy * radius);
        ctx.rotate(rotation);
        const mariaGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(rx, ry) * radius);
        mariaGrad.addColorStop(0, `rgba(50, 50, 60, ${opacity})`);
        mariaGrad.addColorStop(0.5, `rgba(60, 60, 70, ${opacity * 0.7})`);
        mariaGrad.addColorStop(1, 'rgba(70, 70, 80, 0)');
        ctx.fillStyle = mariaGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx * radius, ry * radius, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      drawMaria(-0.2, -0.05, 0.28, 0.22, 0.2, 0.5);
      drawMaria(0.12, 0.18, 0.22, 0.18, -0.3, 0.45);
      drawMaria(-0.08, 0.32, 0.18, 0.13, 0.1, 0.4);
      drawMaria(0.32, -0.18, 0.15, 0.1, 0.4, 0.35);

      // === CRATERS with proper 3D shadows ===
      const drawCrater = (cx, cy, r, depth) => {
        const craterX = cx * radius;
        const craterY = cy * radius;
        const craterR = r * radius;

        // Check if crater is on lit or dark side
        const distFromLight = Math.sqrt(Math.pow(cx - lightX * 0.5, 2) + Math.pow(cy - lightY * 0.5, 2));
        const shadowMod = Math.max(0.4, 1 - distFromLight * 0.5);

        // Shadow inside crater (opposite to light)
        const shadowGrad = ctx.createRadialGradient(
          craterX + lightX * craterR * 0.3,
          craterY + lightY * craterR * 0.3,
          0,
          craterX, craterY, craterR
        );
        shadowGrad.addColorStop(0, `rgba(30, 30, 35, ${depth * shadowMod})`);
        shadowGrad.addColorStop(0.6, `rgba(50, 50, 55, ${depth * shadowMod * 0.5})`);
        shadowGrad.addColorStop(1, 'rgba(70, 70, 75, 0)');
        ctx.fillStyle = shadowGrad;
        ctx.beginPath();
        ctx.arc(craterX, craterY, craterR, 0, Math.PI * 2);
        ctx.fill();

        // Rim highlight on lit side
        const rimGrad = ctx.createRadialGradient(
          craterX - lightX * craterR * 0.4,
          craterY - lightY * craterR * 0.4,
          craterR * 0.5,
          craterX, craterY, craterR * 1.15
        );
        rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        rimGrad.addColorStop(0.75, 'rgba(255, 255, 255, 0)');
        rimGrad.addColorStop(0.9, `rgba(240, 240, 245, ${depth * 0.5 * shadowMod})`);
        rimGrad.addColorStop(1, 'rgba(220, 220, 230, 0)');
        ctx.fillStyle = rimGrad;
        ctx.beginPath();
        ctx.arc(craterX, craterY, craterR * 1.15, 0, Math.PI * 2);
        ctx.fill();
      };

      // Large craters
      drawCrater(-0.32, -0.28, 0.13, 0.8);
      drawCrater(0.28, -0.38, 0.11, 0.7);
      drawCrater(0.38, 0.22, 0.12, 0.75);
      drawCrater(-0.18, 0.42, 0.1, 0.65);

      // Medium craters
      drawCrater(-0.48, 0.08, 0.08, 0.6);
      drawCrater(0.13, 0.08, 0.065, 0.55);
      drawCrater(-0.08, -0.48, 0.07, 0.6);
      drawCrater(0.48, -0.08, 0.06, 0.5);

      // Small craters
      drawCrater(-0.28, 0.13, 0.04, 0.45);
      drawCrater(0.42, 0.03, 0.03, 0.4);
      drawCrater(-0.13, -0.23, 0.035, 0.4);
      drawCrater(0.08, -0.33, 0.028, 0.35);

      // === STRONG TERMINATOR ===
      const terminator = ctx.createLinearGradient(
        lightX * radius * 1.2, lightY * radius * 1.2,
        -lightX * radius * 1.2, -lightY * radius * 1.2
      );
      terminator.addColorStop(0, 'rgba(0, 0, 0, 0)');
      terminator.addColorStop(0.4, 'rgba(0, 0, 0, 0)');
      terminator.addColorStop(0.5, 'rgba(0, 0, 5, 0.35)');
      terminator.addColorStop(0.6, 'rgba(0, 0, 8, 0.6)');
      terminator.addColorStop(0.75, 'rgba(0, 0, 5, 0.8)');
      terminator.addColorStop(1, 'rgba(0, 0, 3, 0.92)');
      ctx.fillStyle = terminator;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

      // === BRIGHT FRESNEL RIM ===
      const fresnel = ctx.createRadialGradient(0, 0, radius * 0.8, 0, 0, radius);
      fresnel.addColorStop(0, 'rgba(200, 200, 210, 0)');
      fresnel.addColorStop(0.85, 'rgba(200, 200, 210, 0)');
      fresnel.addColorStop(0.92, 'rgba(220, 220, 230, 0.2)');
      fresnel.addColorStop(0.96, 'rgba(235, 235, 245, 0.4)');
      fresnel.addColorStop(1, 'rgba(250, 250, 255, 0.6)');
      ctx.fillStyle = fresnel;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

      // === STRONG SPECULAR HIGHLIGHT ===
      const specX = lightX * radius * 0.4;
      const specY = lightY * radius * 0.4;
      const specular = ctx.createRadialGradient(specX, specY, 0, specX, specY, radius * 0.4);
      specular.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      specular.addColorStop(0.1, 'rgba(255, 255, 255, 0.5)');
      specular.addColorStop(0.3, 'rgba(255, 255, 255, 0.25)');
      specular.addColorStop(0.6, 'rgba(255, 255, 255, 0.08)');
      specular.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = specular;
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
