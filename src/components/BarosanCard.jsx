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

  // Cosmic Penthouse Design System - Tier Colors (using direct colors for instant rendering)
  const tierColors = {
    suprem: {
      border: 'border-[#9333EA]',
      badge: 'bg-gradient-to-r from-[#9333EA] via-[#a855f7] to-[#ec4899]',
      badgeText: 'text-white',
      glow: 'shadow-[0_0_40px_rgba(147,51,234,0.4),0_0_20px_rgba(212,175,55,0.3)]',
      cardGradient: 'from-[#9333EA]/20 to-[#D4AF37]/15',
      blurColor: 'bg-gradient-to-r from-[#9333EA] to-[#D4AF37]',
      cardBg: 'bg-[#0f0f12]',
      shimmer: true
    },
    platinum: {
      border: 'border-[#A0A0B5]',
      badge: 'bg-gradient-to-r from-[#E5E4E2] via-[#BCC6CC] to-[#A0A0B5]',
      badgeText: 'text-[#0A0A0F]',
      glow: 'shadow-[0_0_30px_rgba(160,160,181,0.3)]',
      cardGradient: 'from-[#A0A0B5]/15 to-[#8a8a9a]/10',
      blurColor: 'bg-[#A0A0B5]',
      cardBg: 'bg-[#0f0f12]',
      shimmer: true
    },
    gold: {
      border: 'border-[#C9A227]',
      badge: 'bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#FFD700]',
      badgeText: 'text-[#0A0A0F]',
      glow: 'shadow-[0_0_25px_rgba(212,175,55,0.4)]',
      cardGradient: 'from-[#D4AF37]/15 to-[#FFD700]/10',
      blurColor: 'bg-[#D4AF37]',
      cardBg: 'bg-[#0f0f12]',
      shimmer: true
    },
    basic: {
      border: 'border-[#3a3a45]',
      badge: 'bg-[#505060]',
      badgeText: 'text-[#F5F5F7]',
      glow: 'shadow-sm',
      cardGradient: 'from-[#505060]/10 to-[#404050]/5',
      blurColor: 'bg-[#505060]',
      cardBg: 'bg-[#0f0f12]',
      shimmer: false
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
    <article
      ref={cardRef}
      className="group relative h-full"
      aria-label={`Card barosan: ${barosan.nume}, tier ${tier}`}
      data-certificat-id={barosan.certificatId || barosan.certificat_id}
      style={{
        perspective: 1000,
      }}
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
                  <div className="absolute inset-0 flex items-center justify-center bg-[#15151a]">
                    <motion.div
                      className="relative"
                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <div className={`absolute inset-0 ${colors.blurColor} rounded-full blur-xl opacity-20`}></div>
                      <div className="relative text-5xl">📸</div>
                    </motion.div>
                  </div>
                )}
                {/* Actual image */}
                <img
                  src={barosan.poza}
                  alt={`Fotografie ${barosan.nume}`}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f12]/80 via-transparent to-transparent pointer-events-none" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#15151a]">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#3a3a45] rounded-full blur-2xl opacity-30"></div>
                  <span className="relative text-7xl opacity-60">👤</span>
                </div>
              </div>
            )}
          </div>

          {/* Content - Cosmic Penthouse luxury theme */}
          <div className="p-5 space-y-3 flex-1 flex flex-col bg-[#0f0f12]/90 backdrop-blur-sm">
            <h3 className="font-bold text-xl text-center text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {barosan.nume}
            </h3>

            {/* Badges */}
            <div className="flex justify-center min-h-[28px]">
              <BadgeDisplay barosan={barosan} totalBarosani={totalBarosani} maxDisplay={4} size="sm" />
            </div>

            <p className="text-sm text-center leading-relaxed min-h-[40px] flex items-center justify-center text-[#d0d0d8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic' }}>
              „{barosan.motto}"
            </p>

            <div className="flex items-center justify-center text-xs font-semibold pt-1">
              <div className="bg-[#1a1a20] border border-[#3a3a45] px-3 py-1.5 rounded-full text-[#b0b0b8] shadow-inner">
                <span>Barosan din {formattedDate}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Buttons section */}
        <div className="px-5 pb-5 space-y-3 bg-[#0f0f12]/90">
          {/* Link for Suprem/Platinum */}
          <div className="min-h-[44px] text-center">
            {(tier === 'suprem' || tier === 'platinum') && barosan.link ? (
              <motion.a
                href={barosan.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 transition-all text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg ${
                  tier === 'suprem'
                    ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white border border-purple-400/50 hover:shadow-purple-500/40 hover:shadow-xl'
                    : 'bg-gradient-to-r from-[#2a2a35] to-[#35354a] text-[#E5E4E2] border border-[#A0A0B5]/30 hover:border-[#A0A0B5]/50 hover:shadow-[#A0A0B5]/20 hover:shadow-xl'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
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
                className="relative w-full overflow-hidden py-3 rounded-xl font-bold text-sm touch-manipulation focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-[#1a1a1a] bg-gradient-to-r from-[#1a1a25] via-[#252535] to-[#1a1a25] border border-[#3a3a50] hover:border-[#5a5a70] shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                aria-label={`Vezi certificatul pentru ${barosan.nume}`}
              >
                <span className="relative flex items-center justify-center gap-2 text-[#E5E4E2]">
                  <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Vezi Certificat</span>
                </span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </article>
  );
}
