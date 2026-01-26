import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RecentActivity({ barosani }) {
  const navigate = useNavigate();

  const handleActivityClick = (e, barosan) => {
    e.preventDefault();
    const certificatId = barosan.certificatId || barosan.certificat_id;

    // If suprem, navigate to suprem page, otherwise go to barosan profile
    if (barosan.tier === 'suprem') {
      navigate('/barosanul-suprem');
    } else {
      navigate(`/barosan/${certificatId}`);
    }
  };
  // Get last 5 barosani sorted by date
  const recentBarosani = useMemo(() => {
    return [...barosani]
      .sort((a, b) => new Date(b.dataInregistrare) - new Date(a.dataInregistrare))
      .slice(0, 5);
  }, [barosani]);

  // Generate animation key from data to trigger re-render when data changes
  const animationKey = useMemo(() => {
    return recentBarosani.map(b => b.id || b.certificatId).join('-');
  }, [recentBarosani]);

  if (recentBarosani.length === 0) return null;

  const getTierEmoji = (tier) => {
    switch (tier) {
      case 'suprem': return '👑';
      case 'platinum': return '💎';
      case 'gold': return '🏆';
      default: return '⭐';
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'suprem': return 'text-purple-500';
      case 'platinum': return 'text-[#BCC6CC]';
      case 'gold': return 'text-[#D4AF37]';
      default: return 'text-gray-600';
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Chiar acum';
    if (minutes < 60) return `Acum ${minutes} min`;
    if (hours < 24) return `Acum ${hours}h`;
    if (days === 1) return 'Ieri';
    return `Acum ${days} zile`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D4AF37]">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative">
          <span className="text-2xl">🔥</span>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#1a365d]">Activitate Recentă</h3>
          <p className="text-xs text-gray-500">Ultimele înscrieri</p>
        </div>
      </div>

      <div className="space-y-3" key={animationKey}>
        {recentBarosani.map((barosan, index) => (
          <a
            key={barosan.id}
            href={barosan.tier === 'suprem' ? '/barosanul-suprem' : `/barosan/${barosan.certificatId || barosan.certificat_id}`}
            onClick={(e) => handleActivityClick(e, barosan)}
            className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white hover:from-[#FFF9E6] hover:to-white transition-all border border-gray-100 animate-fadeIn cursor-pointer group"
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            {/* Avatar or Icon */}
            <div className="flex-shrink-0">
              {barosan.poza ? (
                <img
                  src={barosan.poza}
                  alt={barosan.nume}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#D4AF37] group-hover:scale-110 transition-transform"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#FFD700] flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                  {barosan.nume.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm text-gray-800 truncate group-hover:text-[#D4AF37] transition-colors">
                  {barosan.nume}
                </p>
                <span className={`text-sm ${getTierColor(barosan.tier)}`}>
                  {getTierEmoji(barosan.tier)}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {getTimeAgo(barosan.dataInregistrare)}
              </p>
            </div>

            {/* Badge + Arrow */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                Nou
              </div>
              <span className="text-gray-400 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all">→</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
