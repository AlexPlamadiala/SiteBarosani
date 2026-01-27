import { motion } from 'framer-motion';

/**
 * GlowButton Component
 * Luxury button with glow effects and shimmer animation
 */
const GlowButton = ({
  children,
  onClick,
  variant = 'gold',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  fullWidth = false,
}) => {
  const variants = {
    gold: {
      bg: 'bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#FFD700]',
      text: 'text-black',
      glow: 'hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]',
      border: 'border-[#FFD700]',
    },
    purple: {
      bg: 'bg-gradient-to-r from-[#7E22CE] via-[#9333EA] to-[#A855F7]',
      text: 'text-white',
      glow: 'hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]',
      border: 'border-[#A855F7]',
    },
    royal: {
      bg: 'bg-gradient-to-r from-[#D4AF37] via-[#9333EA] to-[#D4AF37]',
      text: 'text-white',
      glow: 'hover:shadow-[0_0_30px_rgba(212,175,55,0.3),0_0_30px_rgba(147,51,234,0.3)]',
      border: 'border-[#D4AF37]',
    },
    dark: {
      bg: 'bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]',
      text: 'text-[#D4AF37]',
      glow: 'hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]',
      border: 'border-[#D4AF37]',
    },
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  const style = variants[variant];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
      className={`
        relative overflow-hidden
        ${style.bg} ${style.text} ${style.glow}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        font-semibold rounded-xl
        border ${style.border}
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {/* Shimmer effect */}
      <span className="absolute inset-0 overflow-hidden rounded-xl">
        <span
          className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]
          bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{ animationDelay: '0.5s' }}
        />
      </span>

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export default GlowButton;
