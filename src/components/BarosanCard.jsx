import { useState, useMemo } from 'react';
import BadgeDisplay from './BadgeDisplay';

export default function BarosanCard({ barosan, onViewCertificate, totalBarosani = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Detect touch device (computed once, stable value)
  const isTouchDevice = useMemo(() => {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  }, []);

  // On touch devices, always show button
  const showButton = isTouchDevice || isHovered;

  const tierColors = {
    suprem: {
      border: 'border-purple-500',
      badge: 'bg-gradient-to-r from-purple-500 to-pink-500',
      badgeText: 'text-white',
      glow: 'shadow-[0_0_25px_rgba(168,85,247,0.6)]',
      cardGradient: 'from-purple-500/10 to-pink-500/10',
      blurColor: 'bg-purple-500'
    },
    platinum: {
      border: 'border-[#BCC6CC]',
      badge: 'bg-gradient-to-r from-[#E5E4E2] to-[#BCC6CC]',
      badgeText: 'text-[#1a365d]',
      glow: 'shadow-[0_0_20px_rgba(188,198,204,0.6)]',
      cardGradient: 'from-[#E5E4E2]/10 to-[#BCC6CC]/10',
      blurColor: 'bg-[#BCC6CC]'
    },
    gold: {
      border: 'border-[#D4AF37]',
      badge: 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700]',
      badgeText: 'text-[#1a365d]',
      glow: 'shadow-[0_0_20px_rgba(212,175,55,0.5)]',
      cardGradient: 'from-[#D4AF37]/10 to-[#FFD700]/10',
      blurColor: 'bg-[#D4AF37]'
    },
    basic: {
      border: 'border-gray-300',
      badge: 'bg-gradient-to-r from-gray-400 to-gray-500',
      badgeText: 'text-white',
      glow: '',
      cardGradient: 'from-gray-100 to-gray-200',
      blurColor: 'bg-gray-400'
    }
  };

  const tierLabels = {
    suprem: '👑 SUPREM',
    platinum: '💎 PLATINUM',
    gold: '🏆 GOLD',
    basic: '⭐ BASIC'
  };

  const tier = barosan.tier && tierColors[barosan.tier] ? barosan.tier : 'basic';
  const colors = tierColors[tier];
  const formattedDate = new Date(barosan.dataInregistrare).toLocaleDateString('ro-RO', {
    month: 'short',
    year: 'numeric'
  });

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <article className="group relative h-full" aria-label={`Card barosan: ${barosan.nume}, tier ${tier}`}>
      {/* Glow Effect - Always visible for suprem/platinum/gold */}
      {(tier === 'suprem' || tier === 'platinum' || tier === 'gold') && (
        <div className={`absolute inset-0 ${colors.blurColor} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
      )}

      <div
        className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-300 border-2 ${colors.border} shadow-lg h-full flex flex-col ${
          isHovered && !isTouchDevice ? 'scale-105 ' + colors.glow : 'hover:shadow-xl'
        }`}
        onMouseEnter={!isTouchDevice ? handleMouseEnter : undefined}
        onMouseLeave={!isTouchDevice ? handleMouseLeave : undefined}
      >
        {/* Tier Badge - Enhanced */}
        <div className={`relative ${colors.badge} text-center py-2.5 font-extrabold text-sm tracking-wide overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full blur-2xl"></div>
          </div>
          <span className={`relative ${colors.badgeText} drop-shadow-sm`}>
            {tierLabels[tier]}
          </span>
        </div>

      {/* Image - Enhanced */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {barosan.poza && !imageError ? (
          <>
            {/* Loading placeholder */}
            {!imageLoaded && (
              <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${colors.cardGradient} animate-pulse`}>
                <div className="relative">
                  <div className={`absolute inset-0 ${colors.blurColor} rounded-full blur-xl opacity-30`}></div>
                  <div className="relative text-5xl opacity-50">📸</div>
                </div>
              </div>
            )}
            {/* Actual image */}
            <img
              src={barosan.poza}
              alt={barosan.nume}
              className={`w-full h-full object-cover transition-all duration-500 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="relative">
              <div className="absolute inset-0 bg-gray-300 rounded-full blur-2xl opacity-50"></div>
              <span className="relative text-7xl opacity-75">👤</span>
            </div>
          </div>
        )}
      </div>

      {/* Content - Enhanced */}
      <div className="p-5 space-y-3 flex-1 flex flex-col">
        <h3 className="font-extrabold text-xl text-center text-[#1a365d] leading-tight">
          {barosan.nume}
        </h3>

        {/* Badges */}
        <div className="flex justify-center min-h-[28px]">
          <BadgeDisplay barosan={barosan} totalBarosani={totalBarosani} maxDisplay={4} size="sm" />
        </div>

        <p className="text-sm text-gray-600 text-center italic leading-relaxed min-h-[40px] flex items-center justify-center">
          "{barosan.motto}"
        </p>

        <div className="flex items-center justify-center text-xs font-semibold text-gray-500 pt-1">
          <div className="bg-gray-100 px-3 py-1.5 rounded-full">
            <span>🏆 Barosan din {formattedDate}</span>
          </div>
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-1"></div>

        {/* Link for Suprem/Platinum - Fixed height container */}
        <div className="min-h-[44px] pt-2 text-center">
          {(tier === 'suprem' || tier === 'platinum') && barosan.link ? (
            <a
              href={barosan.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 transition-colors text-sm font-bold px-4 py-2 rounded-lg shadow-sm ${
                tier === 'suprem'
                  ? 'text-purple-500 hover:text-purple-400 bg-gradient-to-r from-purple-100 to-pink-50 hover:from-purple-200 hover:to-pink-100'
                  : 'text-[#BCC6CC] hover:text-[#E5E4E2] bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100'
              }`}
            >
              <span>🔗</span>
              <span>Link Personal</span>
            </a>
          ) : null}
        </div>

        {/* Certificate Button - Fixed height to prevent layout shift */}
        <div className="h-12">
          <div className={`relative group/btn transition-opacity duration-300 ${
            showButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <div className={`absolute inset-0 ${colors.blurColor} rounded-xl blur opacity-30 group-hover/btn:opacity-50 transition-opacity`}></div>
            <button
              onClick={() => onViewCertificate(barosan)}
              className="relative w-full bg-gradient-to-r from-[#1a365d] to-[#2d5986] text-white py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all font-extrabold text-sm touch-manipulation shadow-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2"
              aria-label={`Vezi certificatul pentru ${barosan.nume}`}
            >
              📜 Vezi Certificat
            </button>
          </div>
        </div>
      </div>
      </div>
    </article>
  );
}
