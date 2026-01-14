import { useState, useEffect, useRef } from 'react';

export default function BarosanCard({ barosan, onViewCertificate }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const hoverTimeoutRef = useRef(null);

  // Detect touch device on mount
  useEffect(() => {
    const checkTouchDevice = () => {
      return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    };
    setIsTouchDevice(checkTouchDevice());
    // On touch devices, always show button
    if (checkTouchDevice()) {
      setShowButton(true);
    }
  }, []);

  const tierColors = {
    platinum: {
      border: 'border-[#D4AF37]',
      badge: 'bg-gradient-to-r from-[#E5E4E2] to-[#BCC6CC]',
      glow: 'shadow-[0_0_15px_rgba(212,175,55,0.5)]',
      text: 'text-[#1a365d]'
    },
    gold: {
      border: 'border-[#D4AF37]',
      badge: 'bg-[#D4AF37]',
      glow: '',
      text: 'text-[#1a365d]'
    },
    basic: {
      border: 'border-gray-300',
      badge: 'bg-gray-400',
      glow: '',
      text: 'text-white'
    }
  };

  const tierLabels = {
    platinum: '💎 PLATINUM',
    gold: '🏆 GOLD',
    basic: '⭐ BASIC'
  };

  const colors = tierColors[barosan.tier];
  const formattedDate = new Date(barosan.dataInregistrare).toLocaleDateString('ro-RO', {
    month: 'short',
    year: 'numeric'
  });

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Delay showing the button for smooth transition
    hoverTimeoutRef.current = setTimeout(() => {
      setShowButton(true);
    }, 200); // 200ms delay
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowButton(false);
    // Clear timeout if user leaves before button appears
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`bg-white rounded-lg overflow-hidden transition-all duration-300 border-2 ${colors.border} ${
        isHovered && !isTouchDevice ? 'scale-105 ' + colors.glow : ''
      }`}
      onMouseEnter={!isTouchDevice ? handleMouseEnter : undefined}
      onMouseLeave={!isTouchDevice ? handleMouseLeave : undefined}
    >
      {/* Tier Badge */}
      <div className={`${colors.badge} ${colors.text} text-center py-2 font-bold text-sm`}>
        {tierLabels[barosan.tier]}
      </div>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-200">
        {barosan.poza ? (
          <img
            src={barosan.poza}
            alt={barosan.nume}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x400/cccccc/666666?text=Fara+Poza';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <span className="text-6xl">👤</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-lg text-center text-[#1a365d]">
          {barosan.nume}
        </h3>
        <p className="text-sm text-gray-600 text-center italic">
          "{barosan.motto}"
        </p>

        <div className="flex items-center justify-center text-xs text-gray-500 pt-2">
          <span>🏆 Barosan din {formattedDate}</span>
        </div>

        {/* Link for Platinum */}
        {barosan.tier === 'platinum' && barosan.link && (
          <div className="pt-2 text-center">
            <a
              href={barosan.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4AF37] hover:underline text-sm font-semibold"
            >
              🔗 Link Personal
            </a>
          </div>
        )}

        {/* Certificate Button (always visible on mobile, shows on hover on desktop) */}
        <div className={`transition-all duration-300 overflow-hidden ${
          showButton ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <button
            onClick={() => onViewCertificate(barosan)}
            className="w-full mt-3 bg-[#1a365d] text-white py-2 md:py-2 rounded-lg hover:bg-[#2d5986] active:bg-[#2d5986] transition-colors font-semibold text-sm touch-manipulation"
          >
            📜 Vezi Certificat
          </button>
        </div>
      </div>
    </div>
  );
}
