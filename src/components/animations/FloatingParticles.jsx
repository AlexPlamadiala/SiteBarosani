import { motion } from 'framer-motion';
import { useMemo } from 'react';

/**
 * FloatingParticles Component
 * Creates elegant floating particles effect (diamonds, stars, sparkles)
 */
const FloatingParticles = ({
  count = 20,
  type = 'mixed',
  className = '',
}) => {
  const particles = useMemo(() => {
    const types = {
      diamond: '◆',
      star: '✦',
      sparkle: '✧',
      dot: '●',
      cross: '✦',
    };

    const getSymbol = (idx) => {
      if (type === 'mixed') {
        const symbols = ['◆', '✦', '✧', '●'];
        return symbols[idx % symbols.length];
      }
      return types[type] || '✦';
    };

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      symbol: getSymbol(i),
      size: Math.random() * 10 + 6,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.3 + 0.1,
    }));
  }, [count, type]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute text-[#D4AF37]"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: particle.size,
            opacity: particle.opacity,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {particle.symbol}
        </motion.span>
      ))}
    </div>
  );
};

export default FloatingParticles;
