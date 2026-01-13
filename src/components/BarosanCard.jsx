import { useState } from 'react';

export default function BarosanCard({ barosan, onViewCertificate }) {
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <div
      className={`bg-white rounded-lg overflow-hidden transition-all duration-300 border-2 ${colors.border} ${
        isHovered ? 'scale-105 ' + colors.glow : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tier Badge */}
      <div className={`${colors.badge} ${colors.text} text-center py-2 font-bold text-sm`}>
        {tierLabels[barosan.tier]}
      </div>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={barosan.poza}
          alt={barosan.nume}
          className="w-full h-full object-cover"
          loading="lazy"
        />
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

        {/* Certificate Button (shows on hover) */}
        {isHovered && (
          <button
            onClick={() => onViewCertificate(barosan)}
            className="w-full mt-3 bg-[#1a365d] text-white py-2 rounded-lg hover:bg-[#2d5986] transition-colors font-semibold text-sm"
          >
            📜 Vezi Certificat
          </button>
        )}
      </div>
    </div>
  );
}
