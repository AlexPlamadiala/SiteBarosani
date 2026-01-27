import { useEffect, useRef, useMemo, useCallback } from 'react';

export default function StarryBackground() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const starsRef = useRef([]);
  const shootingStarsRef = useRef([]);
  const nebulaeRef = useRef([]);

  // Configuration
  const config = useMemo(() => ({
    starCount: 200,
    shootingStarInterval: 3000,
    baseSpeed: 0.5,
    colors: {
      white: 'rgba(255, 255, 255,',
      gold: 'rgba(212, 175, 55,',
      purple: 'rgba(147, 51, 234,',
      blue: 'rgba(100, 149, 237,',
    }
  }), []);

  // Initialize stars
  const initializeStars = useCallback((width, height) => {
    const stars = [];
    const colorKeys = Object.keys(config.colors);

    for (let i = 0; i < config.starCount; i++) {
      const colorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 1000, // Depth for parallax
        size: Math.random() * 2 + 0.5,
        baseOpacity: Math.random() * 0.5 + 0.3,
        opacity: 0,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        color: config.colors[colorKey],
      });
    }
    return stars;
  }, [config]);

  // Initialize nebulae (colorful gas clouds)
  const initializeNebulae = useCallback((width, height) => {
    return [
      { x: width * 0.2, y: height * 0.3, radius: 200, color: 'purple', opacity: 0.03 },
      { x: width * 0.8, y: height * 0.7, radius: 250, color: 'gold', opacity: 0.02 },
      { x: width * 0.5, y: height * 0.5, radius: 300, color: 'blue', opacity: 0.02 },
    ];
  }, []);

  // Create shooting star
  const createShootingStar = useCallback((width, height) => {
    return {
      x: Math.random() * width,
      y: Math.random() * height * 0.5,
      length: Math.random() * 80 + 40,
      speed: Math.random() * 15 + 10,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
      opacity: 1,
      life: 1,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Set canvas size
    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      // Reinitialize stars on resize
      starsRef.current = initializeStars(width, height);
      nebulaeRef.current = initializeNebulae(width, height);
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Initialize
    starsRef.current = initializeStars(width, height);
    nebulaeRef.current = initializeNebulae(width, height);

    // Shooting star spawner
    const shootingStarSpawner = setInterval(() => {
      if (shootingStarsRef.current.length < 2) {
        shootingStarsRef.current.push(createShootingStar(width, height));
      }
    }, config.shootingStarInterval);

    // Animation time tracking
    let time = 0;

    // Main animation loop
    const animate = () => {
      time += 0.016; // ~60fps

      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#0a0a0a');
      gradient.addColorStop(0.3, '#0d0d15');
      gradient.addColorStop(0.6, '#0a0a12');
      gradient.addColorStop(1, '#0a0a0a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw nebulae (background gas clouds)
      nebulaeRef.current.forEach(nebula => {
        const nebulaGradient = ctx.createRadialGradient(
          nebula.x, nebula.y, 0,
          nebula.x, nebula.y, nebula.radius
        );

        let colorStart, colorEnd;
        switch (nebula.color) {
          case 'purple':
            colorStart = `rgba(147, 51, 234, ${nebula.opacity})`;
            colorEnd = 'rgba(147, 51, 234, 0)';
            break;
          case 'gold':
            colorStart = `rgba(212, 175, 55, ${nebula.opacity})`;
            colorEnd = 'rgba(212, 175, 55, 0)';
            break;
          case 'blue':
            colorStart = `rgba(100, 149, 237, ${nebula.opacity})`;
            colorEnd = 'rgba(100, 149, 237, 0)';
            break;
          default:
            colorStart = `rgba(255, 255, 255, ${nebula.opacity})`;
            colorEnd = 'rgba(255, 255, 255, 0)';
        }

        nebulaGradient.addColorStop(0, colorStart);
        nebulaGradient.addColorStop(1, colorEnd);

        ctx.fillStyle = nebulaGradient;
        ctx.beginPath();
        ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update and draw stars
      starsRef.current.forEach(star => {
        // Parallax movement (traveling through space effect)
        star.z -= config.baseSpeed;
        if (star.z <= 0) {
          star.z = 1000;
          star.x = Math.random() * width;
          star.y = Math.random() * height;
        }

        // Calculate position based on depth (perspective projection)
        const scale = 1000 / (1000 + star.z);
        const screenX = (star.x - width / 2) * scale + width / 2;
        const screenY = (star.y - height / 2) * scale + height / 2;
        const size = star.size * scale * 2;

        // Twinkle effect
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;
        const opacity = star.baseOpacity * twinkle * scale;

        // Draw star with glow
        if (screenX > 0 && screenX < width && screenY > 0 && screenY < height) {
          // Outer glow
          const glowGradient = ctx.createRadialGradient(
            screenX, screenY, 0,
            screenX, screenY, size * 3
          );
          glowGradient.addColorStop(0, `${star.color}${opacity})`);
          glowGradient.addColorStop(1, `${star.color}0)`);

          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(screenX, screenY, size * 3, 0, Math.PI * 2);
          ctx.fill();

          // Star core
          ctx.fillStyle = `${star.color}${Math.min(opacity * 1.5, 1)})`;
          ctx.beginPath();
          ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Update and draw shooting stars
      shootingStarsRef.current = shootingStarsRef.current.filter(star => {
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.life -= 0.02;
        star.opacity = star.life;

        if (star.life <= 0) return false;

        // Draw shooting star trail
        const tailX = star.x - Math.cos(star.angle) * star.length;
        const tailY = star.y - Math.sin(star.angle) * star.length;

        const gradient = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.5, `rgba(212, 175, 55, ${star.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${star.opacity})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(star.x, star.y);
        ctx.stroke();

        // Bright head
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      // Add subtle cosmic dust particles
      for (let i = 0; i < 5; i++) {
        const dustX = Math.random() * width;
        const dustY = Math.random() * height;
        const dustOpacity = Math.random() * 0.02;

        ctx.fillStyle = `rgba(212, 175, 55, ${dustOpacity})`;
        ctx.beginPath();
        ctx.arc(dustX, dustY, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      clearInterval(shootingStarSpawner);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config, initializeStars, initializeNebulae, createShootingStar]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
