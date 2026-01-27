import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

/**
 * Card3D Component
 * Creates a smooth 3D tilt effect on hover
 */
const Card3D = ({
  children,
  className = '',
  intensity = 10,
  glowColor = 'rgba(212, 175, 55, 0.3)',
  enableGlow = true,
}) => {
  const ref = useRef(null);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 300 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(ySpring, [0, 1], [intensity, -intensity]);
  const rotateY = useTransform(xSpring, [0, 1], [-intensity, intensity]);

  const glowX = useTransform(xSpring, [0, 1], ['0%', '100%']);
  const glowY = useTransform(ySpring, [0, 1], ['0%', '100%']);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPos = (e.clientX - rect.left) / rect.width;
    const yPos = (e.clientY - rect.top) / rect.height;
    x.set(xPos);
    y.set(yPos);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`relative ${className}`}
    >
      {enableGlow && (
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glowX} ${glowY}, ${glowColor}, transparent 50%)`,
          }}
        />
      )}
      <div style={{ transform: 'translateZ(20px)' }}>{children}</div>
    </motion.div>
  );
};

export default Card3D;
