import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import CertificateGenerator from '../components/CertificateGenerator';
import BadgeDisplay from '../components/BadgeDisplay';
import { useSEO } from '../hooks/useSEO';
import { BAROSANI_URL } from '../config/api';

export default function BarosanProfile() {
  const { certificatId } = useParams();
  const navigate = useNavigate();
  const [barosan, setBarosan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [totalBarosani, setTotalBarosani] = useState(0);

  useSEO({
    title: barosan ? `${barosan.nume} - Barosan Verificat` : 'Profil Barosan',
    description: barosan ? `${barosan.nume} este un barosan verificat oficial. Motto: "${barosan.motto}"` : 'Profil barosan verificat oficial.',
    url: `/barosan/${certificatId}`
  });

  useEffect(() => {
    async function fetchBarosan() {
      try {
        const response = await fetch(BAROSANI_URL);
        const data = await response.json();

        if (data.success) {
          setTotalBarosani(data.barosani.length);
          const found = data.barosani.find(b => b.certificatId === certificatId);
          if (found) {
            setBarosan(found);
          } else {
            setError('Barosanul nu a fost gasit');
          }
        } else {
          setError('Eroare la incarcarea datelor');
        }
      } catch (err) {
        console.error('Error fetching barosan:', err);
        setError('Nu s-a putut incarca barosanul');
      } finally {
        setLoading(false);
      }
    }

    fetchBarosan();
  }, [certificatId]);

  const tierConfig = {
    suprem: {
      label: 'SUPREM',
      emoji: null,
      emojiImg: '/Crown.png',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-900/50 to-pink-900/50',
      border: 'border-purple-500',
      textColor: 'text-purple-300'
    },
    platinum: {
      label: 'PLATINUM',
      emoji: '💎',
      gradient: 'from-[#E5E4E2] to-[#BCC6CC]',
      bgGradient: 'from-gray-800/50 to-gray-900/50',
      border: 'border-[#BCC6CC]',
      textColor: 'text-gray-300'
    },
    gold: {
      label: 'GOLD',
      emoji: '🏆',
      gradient: 'from-[#D4AF37] to-[#FFD700]',
      bgGradient: 'from-yellow-900/30 to-amber-900/30',
      border: 'border-[#D4AF37]',
      textColor: 'text-yellow-400'
    },
    basic: {
      label: 'BASIC',
      emoji: '⭐',
      gradient: 'from-gray-400 to-gray-500',
      bgGradient: 'from-gray-800/50 to-gray-900/50',
      border: 'border-gray-500',
      textColor: 'text-gray-400'
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <div className="animate-bounce mb-4"><img src="/Crown.png" alt="Crown" className="w-16 h-16 object-contain mx-auto" /></div>
          <p className="text-yellow-400 font-bold animate-pulse">Se incarca...</p>
        </div>
      </div>
    );
  }

  if (error || !barosan) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">😔</div>
          <p className="text-xl font-bold text-red-400 mb-4">{error || 'Barosan negasit'}</p>
          <Link
            to="/zid"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Inapoi la Registru
          </Link>
        </div>
      </div>
    );
  }

  const tier = barosan.tier || 'basic';
  const config = tierConfig[tier] || tierConfig.basic;
  const formattedDate = new Date(barosan.dataInregistrare).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-transparent">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <span>←</span>
            <span>Inapoi</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            {/* Glow Effect */}
            <div className={`absolute -inset-1 bg-gradient-to-r ${config.gradient} rounded-3xl blur-lg opacity-30`}></div>

            <div className={`relative bg-gradient-to-br ${config.bgGradient} rounded-2xl border-2 ${config.border} overflow-hidden`}>
              {/* Tier Badge Header */}
              <div className={`bg-gradient-to-r ${config.gradient} py-3 px-6 text-center`}>
                <span className="text-white font-black text-lg tracking-wider">
                  {config.emojiImg ? <><img src={config.emojiImg} alt="" className="w-6 h-6 object-contain inline" /> {config.label} <img src={config.emojiImg} alt="" className="w-6 h-6 object-contain inline" /></> : <>{config.emoji} {config.label} {config.emoji}</>}
                </span>
              </div>

              {/* Profile Content */}
              <div className="p-6 md:p-8">
                {/* Photo and Basic Info */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                  {/* Photo */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className={`absolute -inset-1 bg-gradient-to-r ${config.gradient} rounded-full blur opacity-50`}></div>
                      <div className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 ${config.border} overflow-hidden bg-gradient-to-br ${config.gradient}`}>
                        {barosan.poza ? (
                          <img
                            src={barosan.poza}
                            alt={barosan.nume}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl">
                            👤
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Name and Motto */}
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                      {barosan.nume}
                    </h1>
                    {barosan.motto && (
                      <p className="text-white/70 italic text-lg mb-4">
                        "{barosan.motto}"
                      </p>
                    )}

                    {/* Badges */}
                    <div className="flex justify-center md:justify-start">
                      <BadgeDisplay barosan={barosan} totalBarosani={totalBarosani} maxDisplay={6} size="md" />
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-white/50 text-sm mb-1">Certificat ID</p>
                    <p className={`font-mono font-bold ${config.textColor}`}>{barosan.certificatId}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-white/50 text-sm mb-1">Barosan din</p>
                    <p className="text-white font-bold">{formattedDate}</p>
                  </div>
                </div>

                {/* Link Personal (for Platinum/Suprem) */}
                {(tier === 'platinum' || tier === 'suprem') && barosan.link && (
                  <div className="mb-6">
                    <a
                      href={barosan.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 bg-gradient-to-r ${config.gradient} text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform w-full justify-center`}
                    >
                      🔗 Link Personal
                    </a>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#1a365d] to-[#2d5986] text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
                  >
                    📜 Vezi Certificat
                  </button>
                  <Link
                    to="/zid"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors"
                  >
                    👥 Vezi Registrul
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <p className="text-white/60 mb-4">Vrei si tu sa fii un barosan verificat?</p>
          <Link
            to="/cum-devin-barosan"
            className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
          >
            Inscrie-te Acum 🚀
          </Link>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <CertificateGenerator
          barosan={barosan}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
}
