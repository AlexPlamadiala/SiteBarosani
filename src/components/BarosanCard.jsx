import { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import BadgeDisplay from './BadgeDisplay';

export default function BarosanCard({ barosan, onViewCertificate, totalBarosani = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef(null);

  // 3D Tilt effect values
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 25, stiffness: 400 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(ySpring, [0, 1], [8, -8]);
  const rotateY = useTransform(xSpring, [0, 1], [-8, 8]);

  // Detect touch device (computed once, stable value)
  const isTouchDevice = useMemo(() => {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  }, []);

  // On touch devices, always show button
  const showButton = isTouchDevice || isHovered;

  const tierColors = {
    suprem: {
      border: 'border-purple-500',
      badge: 'bg-gradient-to-r from-[#9333EA] via-[#D4AF37] to-[#9333EA]',
      badgeText: 'text-white',
      glow: 'shadow-[0_0_40px_rgba(147,51,234,0.5),0_0_60px_rgba(212,175,55,0.3)]',
      cardGradient: 'from-purple-500/20 to-[#D4AF37]/20',
      blurColor: 'bg-gradient-to-r from-purple-500 to-[#D4AF37]',
      cardBg: 'bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#1a1a1a]'
    },
    platinum: {
      border: 'border-[#BCC6CC]',
      badge: 'bg-gradient-to-r from-[#E5E4E2] via-white to-[#BCC6CC]',
      badgeText: 'text-[#1a1a1a]',
      glow: 'shadow-[0_0_30px_rgba(188,198,204,0.5)]',
      cardGradient: 'from-[#E5E4E2]/20 to-[#BCC6CC]/20',
      blurColor: 'bg-[#BCC6CC]',
      cardBg: 'bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#1a1a1a]'
    },
    gold: {
      border: 'border-[#D4AF37]',
      badge: 'bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#FFD700]',
      badgeText: 'text-[#1a1a1a]',
      glow: 'shadow-[0_0_30px_rgba(212,175,55,0.5)]',
      cardGradient: 'from-[#D4AF37]/20 to-[#FFD700]/20',
      blurColor: 'bg-[#D4AF37]',
      cardBg: 'bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#1a1a1a]'
    },
    basic: {
      border: 'border-gray-600',
      badge: 'bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500',
      badgeText: 'text-white',
      glow: 'shadow-[0_0_15px_rgba(100,100,100,0.3)]',
      cardGradient: 'from-gray-700/20 to-gray-600/20',
      blurColor: 'bg-gray-500',
      cardBg: 'bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#1a1a1a]'
    }
  };

  const tierLabels = {
    suprem: 'SUPREM',
    platinum: 'PLATINUM',
    gold: 'GOLD',
    basic: 'BASIC'
  };

  const tier = barosan.tier && tierColors[barosan.tier] ? barosan.tier : 'basic';
  const colors = tierColors[tier];
  const formattedDate = new Date(barosan.dataInregistrare).toLocaleDateString('ro-RO', {
    month: 'short',
    year: 'numeric'
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current || isTouchDevice) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPos = (e.clientX - rect.left) / rect.width;
    const yPos = (e.clientY - rect.top) / rect.height;
    x.set(xPos);
    y.set(yPos);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.article
      ref={cardRef}
      className="group relative h-full"
      aria-label={`Card barosan: ${barosan.nume}, tier ${tier}`}
      data-certificat-id={barosan.certificatId || barosan.certificat_id}
      style={{
        perspective: 1000,
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Animated glow effect */}
      {(tier === 'suprem' || tier === 'platinum' || tier === 'gold') && (
        <motion.div
          className={`absolute inset-0 ${colors.blurColor} rounded-2xl blur-2xl`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.4 : 0.15 }}
          transition={{ duration: 0.4 }}
        />
      )}

      <motion.div
        className={`relative ${colors.cardBg} rounded-2xl overflow-hidden border-2 ${colors.border} h-full flex flex-col`}
        style={{
          rotateX: isTouchDevice ? 0 : rotateX,
          rotateY: isTouchDevice ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={!isTouchDevice ? handleMouseEnter : undefined}
        onMouseLeave={!isTouchDevice ? handleMouseLeave : undefined}
        whileHover={!isTouchDevice ? { scale: 1.02 } : {}}
        transition={{ duration: 0.2 }}
      >
        {/* Shimmer overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none z-10"
          initial={{ x: '-100%' }}
          animate={{ x: isHovered ? '200%' : '-100%' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />

        {/* Clickable area that links to profile */}
        <Link to={`/barosan/${barosan.certificatId}`} className="block">
          {/* Tier Badge - Premium styled */}
          <div className={`relative ${colors.badge} text-center py-3 font-extrabold text-sm tracking-[0.2em] overflow-hidden`}>
            {/* Animated shine effect */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                animate={{ x: isHovered ? '300%' : '0%' }}
                transition={{ duration: 1, ease: 'easeInOut' }}
              />
            </div>
            <span className={`relative ${colors.badgeText} drop-shadow-lg`}>
              {tierLabels[tier]}
            </span>
          </div>

          {/* Image - Enhanced with luxury frame */}
          <div className="relative aspect-square overflow-hidden">
            {/* Gold/purple corner decorations for premium tiers */}
            {(tier === 'suprem' || tier === 'gold') && (
              <>
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/50 z-10" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]/50 z-10" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]/50 z-10" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/50 z-10" />
              </>
            )}

            {barosan.poza && !imageError ? (
              <>
                {/* Loading placeholder */}
                {!imageLoaded && (
                  <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${colors.cardGradient}`}>
                    <motion.div
                      className="relative"
                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <div className={`absolute inset-0 ${colors.blurColor} rounded-full blur-xl opacity-30`}></div>
                      <div className="relative text-5xl">📸</div>
                    </motion.div>
                  </div>
                )}
                {/* Actual image */}
                <img
                  src={barosan.poza}
                  alt={`Fotografie ${barosan.nume}`}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                  }`}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setImageError(true);
                    setImageLoaded(false);
                  }}
                />
                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/60 via-transparent to-transparent pointer-events-none" />
              </>
            ) : (
              <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${colors.cardGradient}`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gray-500 rounded-full blur-2xl opacity-30"></div>
                  <span className="relative text-7xl opacity-75">👤</span>
                </div>
              </div>
            )}
          </div>

          {/* Content - Dark luxury theme */}
          <div className="p-5 space-y-3 flex-1 flex flex-col">
            <h3 className="font-extrabold text-xl text-center text-white leading-tight drop-shadow-lg">
              {barosan.nume}
            </h3>

            {/* Badges */}
            <div className="flex justify-center min-h-[28px]">
              <BadgeDisplay barosan={barosan} totalBarosani={totalBarosani} maxDisplay={4} size="sm" />
            </div>

            <p className="text-sm text-gray-300 text-center italic leading-relaxed min-h-[40px] flex items-center justify-center">
              "{barosan.motto}"
            </p>

            <div className="flex items-center justify-center text-xs font-semibold text-gray-400 pt-1">
              <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <span>Barosan din {formattedDate}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Buttons section */}
        <div className="px-5 pb-5 space-y-3">
          {/* Link for Suprem/Platinum */}
          <div className="min-h-[44px] text-center">
            {(tier === 'suprem' || tier === 'platinum') && barosan.link ? (
              <motion.a
                href={barosan.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 transition-all text-sm font-bold px-4 py-2 rounded-lg ${
                  tier === 'suprem'
                    ? 'text-[#D4AF37] bg-gradient-to-r from-purple-900/50 to-[#D4AF37]/20 border border-purple-500/30 hover:border-[#D4AF37]/50'
                    : 'text-gray-300 bg-white/5 border border-white/10 hover:border-white/20'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Link Personal</span>
              </motion.a>
            ) : null}
          </div>

          {/* Certificate Button */}
          <div className="h-12">
            <motion.div
              className={`relative transition-opacity duration-300 ${
                showButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              initial={false}
              animate={{ opacity: showButton ? 1 : 0 }}
            >
              <motion.button
                onClick={() => onViewCertificate(barosan)}
                className="relative w-full overflow-hidden py-2.5 rounded-xl font-extrabold text-sm touch-manipulation shadow-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                aria-label={`Vezi certificatul pentru ${barosan.nume}`}
              >
                {/* Gold gradient background */}
                <span className="absolute inset-0 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#FFD700]" />
                {/* Shimmer effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative text-[#0a0a0a] font-bold">Vezi Certificat</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}
