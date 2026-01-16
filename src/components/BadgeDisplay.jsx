import { calculateBadges } from '../utils/badgeSystem';

export default function BadgeDisplay({ barosan, totalBarosani = 0, maxDisplay = 3, size = 'sm' }) {
  const badges = calculateBadges(barosan, totalBarosani);

  if (badges.length === 0) return null;

  const displayedBadges = badges.slice(0, maxDisplay);
  const remainingCount = Math.max(0, badges.length - maxDisplay);

  const sizeClasses = {
    xs: 'w-5 h-5 text-xs',
    sm: 'w-6 h-6 text-sm',
    md: 'w-8 h-8 text-base',
    lg: 'w-10 h-10 text-lg'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.sm;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {displayedBadges.map((badge) => (
        <div
          key={badge.id}
          className={`group/badge relative ${sizeClass} rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-md hover:scale-125 transition-transform cursor-help`}
          title={`${badge.name}: ${badge.description}`}
        >
          <span className="text-white filter drop-shadow-sm">{badge.emoji}</span>

          {/* Tooltip on hover */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 invisible group-hover/badge:opacity-100 group-hover/badge:visible transition-all duration-200 z-[100] pointer-events-none">
            <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-xl">
              <div className="font-bold">{badge.emoji} {badge.name}</div>
              <div className="text-gray-300 text-xs mt-1">{badge.description}</div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className={`${sizeClass} rounded-full bg-gray-400 flex items-center justify-center text-white font-bold shadow-md`}
          title={`+${remainingCount} alte badge-uri`}
        >
          <span className="text-xs">+{remainingCount}</span>
        </div>
      )}
    </div>
  );
}
