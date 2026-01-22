import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Leaderboard({ barosani }) {
  const [topBarosani, setTopBarosani] = useState([]);

  useEffect(() => {
    // Calculate "score" pentru fiecare barosan (tier-based)
    const scored = barosani.map(barosan => {
      let score = 0;

      // Tier points
      if (barosan.tier === 'suprem') score += 2000;
      else if (barosan.tier === 'platinum') score += 1000;
      else if (barosan.tier === 'gold') score += 500;
      else score += 100;

      // Seniority bonus (mai vechi = mai multe puncte)
      const daysSince = Math.floor(
        (new Date() - new Date(barosan.dataInregistrare)) / (1000 * 60 * 60 * 24)
      );
      score += daysSince * 2;

      // Bonus pentru poza
      if (barosan.poza) score += 50;

      // Bonus pentru link (platinum și suprem)
      if (barosan.link && (barosan.tier === 'platinum' || barosan.tier === 'suprem')) score += 100;

      // Bonus pentru motto creativ (mai lung = mai creativ)
      if (barosan.motto) score += barosan.motto.length;

      return { ...barosan, score };
    });

    // Sort și top 10
    const top = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    setTopBarosani(top);
  }, [barosani]);

  if (topBarosani.length === 0) return null;

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'suprem':
        return { emoji: '👑', color: 'from-purple-500 to-pink-500', text: 'text-white' };
      case 'platinum':
        return { emoji: '💎', color: 'from-[#E5E4E2] to-[#BCC6CC]', text: 'text-[#1a365d]' };
      case 'gold':
        return { emoji: '🏆', color: 'from-[#D4AF37] to-[#FFD700]', text: 'text-[#1a365d]' };
      default:
        return { emoji: '⭐', color: 'from-gray-400 to-gray-500', text: 'text-white' };
    }
  };

  const getMedalEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-[#D4AF37]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a365d] to-[#2d5986] p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] rounded-full blur-3xl opacity-20"></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🏆</span>
            <h3 className="text-2xl font-extrabold">Leaderboard</h3>
          </div>
          <p className="text-sm opacity-90">Top 10 Barosani de Elită</p>
        </div>
      </div>

      {/* Points Explanation */}
      <div className="bg-gradient-to-r from-gray-50 to-white px-4 py-3 border-b border-gray-100">
        <details className="group">
          <summary className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-[#1a365d] transition-colors">
            <span>ℹ️</span>
            <span className="font-semibold">Cum se calculează punctele?</span>
            <span className="ml-auto text-xs group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-3 space-y-1 text-xs text-gray-500 pl-6">
            <p>• <span className="font-semibold text-purple-500">Suprem:</span> 2000 puncte</p>
            <p>• <span className="font-semibold text-gray-400">Platinum:</span> 1000 puncte</p>
            <p>• <span className="font-semibold text-yellow-600">Gold:</span> 500 puncte</p>
            <p>• <span className="font-semibold text-gray-500">Basic:</span> 100 puncte</p>
            <p>• <span className="font-semibold">Senioritate:</span> +2 puncte/zi de când ești barosan</p>
            <p>• <span className="font-semibold">Poză:</span> +50 puncte</p>
            <p>• <span className="font-semibold">Link personal:</span> +100 puncte (Platinum/Suprem)</p>
            <p>• <span className="font-semibold">Motto creativ:</span> +1 punct/caracter</p>
          </div>
        </details>
      </div>

      {/* Leaderboard List */}
      <div className="p-4">
        <div className="space-y-2">
          {topBarosani.map((barosan, index) => {
            const badge = getTierBadge(barosan.tier);
            const isPodium = index < 3;

            return (
              <Link
                to={`/zid?certificat=${barosan.certificatId}`}
                key={barosan.id}
                className={`group relative flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                  isPodium
                    ? 'bg-gradient-to-r from-[#FFF9E6] to-white border-2 border-[#D4AF37] shadow-md hover:shadow-lg hover:scale-[1.02]'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:scale-[1.01]'
                }`}
              >
                {/* Medal/Rank */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-extrabold ${
                  isPodium ? 'bg-gradient-to-br ' + badge.color + ' text-2xl' : 'bg-gray-200 text-gray-600 text-sm'
                }`}>
                  {getMedalEmoji(index)}
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0">
                  {barosan.poza ? (
                    <img
                      src={barosan.poza}
                      alt={barosan.nume}
                      className={`w-12 h-12 rounded-full object-cover border-2 ${
                        isPodium ? 'border-[#D4AF37]' : 'border-gray-300'
                      }`}
                    />
                  ) : (
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-white font-bold text-xl`}>
                      {barosan.nume.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-bold truncate ${isPodium ? 'text-lg text-[#1a365d]' : 'text-sm text-gray-800'}`}>
                      {barosan.nume}
                    </h4>
                    <span className="text-sm">{badge.emoji}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate italic">"{barosan.motto}"</p>
                </div>

                {/* Score */}
                <div className="flex-shrink-0 text-right">
                  <div className={`font-extrabold ${isPodium ? 'text-lg text-[#D4AF37]' : 'text-sm text-gray-600'}`}>
                    {barosan.score}
                  </div>
                  <div className="text-xs text-gray-500">puncte</div>
                </div>

                {/* Podium glow effect */}
                {isPodium && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 to-[#FFD700]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-t">
        <p className="text-center text-sm text-gray-600 mb-2">
          Vrei să ajungi în Top 10?
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <Link
            to="/upgrade"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2 rounded-lg font-bold text-sm hover:scale-105 transition-transform shadow-md"
          >
            ⬆️ Upgrade Tier
          </Link>
          <Link
            to="/cum-devin-barosan?tier=platinum"
            className="inline-block bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1a365d] px-5 py-2 rounded-lg font-bold text-sm hover:scale-105 transition-transform shadow-md"
          >
            💎 Înscrie-te Platinum
          </Link>
        </div>
      </div>
    </div>
  );
}
