import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import CertificateGenerator from '../components/CertificateGenerator';
import { SUPREM_URL } from '../config/api';

export default function BarosanulSuprem() {
  const [supremeBarosan, setSupremeBarosan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Prețuri pe pachete
  const packages = [
    { hours: 1, price: 50, discount: 0, label: '1 Oră', emoji: '⏰' },
    { hours: 12, price: 450, discount: 25, label: '12 Ore', emoji: '🌅', popular: true },
    { hours: 24, price: 800, discount: 33, label: '24 Ore', emoji: '👑', best: true }
  ];

  // Fetch barosan suprem from API
  useEffect(() => {
    async function fetchSuprem() {
      try {
        const response = await fetch(SUPREM_URL);
        const data = await response.json();

        if (data.success) {
          if (data.available) {
            setIsAvailable(true);
            setSupremeBarosan(null);
          } else {
            setIsAvailable(false);
            setSupremeBarosan(data.suprem);
          }
        } else {
          setError(data.error || 'Eroare la încărcare');
        }
      } catch (err) {
        console.error('Error fetching suprem:', err);
        setError('Nu s-a putut încărca');
      } finally {
        setLoading(false);
      }
    }

    fetchSuprem();

    // Refresh every 30 seconds
    const interval = setInterval(fetchSuprem, 30000);
    return () => clearInterval(interval);
  }, []);

  // Confetti on mount
  useEffect(() => {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

    // Continuous sparkles
    const interval = setInterval(() => {
      confetti({
        particleCount: 5,
        spread: 60,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
        colors: colors,
        scalar: 0.8
      });
    }, 500);

    // Initial burst
    confetti({
      particleCount: 150,
      spread: 180,
      origin: { y: 0.5 },
      colors: colors
    });

    return () => clearInterval(interval);
  }, []);

  // Countdown timer based on API data
  useEffect(() => {
    if (!supremeBarosan || !supremeBarosan.secondsRemaining) {
      return;
    }

    // Calculate end time based on seconds remaining from API
    const endTime = Date.now() + (supremeBarosan.secondsRemaining * 1000);

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        setIsAvailable(true);
        setSupremeBarosan(null);
        clearInterval(timer);
        // Big celebration when time ends
        confetti({
          particleCount: 200,
          spread: 180,
          origin: { y: 0.5 },
          colors: ['#FFD700', '#FF0000', '#00FF00']
        });
      } else {
        setTimeLeft({
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [supremeBarosan]);

  const formatTime = (num) => String(num).padStart(2, '0');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-2">👑</div>
          <p className="text-yellow-400 text-lg font-bold animate-pulse">Se încarcă...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <p className="text-red-400 text-lg font-bold mb-4">{error}</p>
          <Link to="/" className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition">
            Înapoi Acasă
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-black relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Rotating gold rings */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
          <div className="absolute inset-0 border-4 border-yellow-500/20 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
          <div className="absolute inset-8 border-2 border-yellow-400/30 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
        </div>

        {/* Floating emojis - smaller and repositioned */}
        <div className="absolute top-2 left-4 text-3xl animate-bounce">👑</div>
        <div className="absolute top-2 right-4 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>💎</div>
        <div className="absolute top-1/4 left-2 text-2xl animate-pulse">✨</div>
        <div className="absolute top-1/4 right-2 text-2xl animate-pulse" style={{ animationDelay: '0.3s' }}>✨</div>
      </div>

      {/* Main Content - Compact */}
      <div className="relative z-10 container mx-auto px-4 py-2">
        {/* Header - Compact */}
        <div className="text-center mb-3">
          <h1 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 animate-pulse"
              style={{ textShadow: '0 0 40px rgba(255,215,0,0.5)' }}>
            👑 BAROSANUL SUPREM 👑
          </h1>
          <p className="text-sm md:text-base text-yellow-200 font-bold">
            🔥 CEL MAI TARE BAROSAN DIN UNIVERS 🔥
          </p>
        </div>

        {/* Current Supreme Barosan Card - BIGGER */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 rounded-3xl blur-xl opacity-75 animate-pulse"></div>

            <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-3xl p-6 md:p-8 border-4 border-yellow-500 shadow-[0_0_50px_rgba(255,215,0,0.6)]">
              {/* Photo and Info - Stacked on mobile, side by side on desktop */}
              <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                {/* Photo - BIGGER */}
                {supremeBarosan?.poza ? (
                  <div className="relative flex-shrink-0">
                    <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-yellow-400 rounded-full animate-spin" style={{ animationDuration: '4s' }}></div>
                    <img
                      src={supremeBarosan.poza}
                      alt={supremeBarosan.nume}
                      className="relative w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-yellow-400 shadow-2xl"
                    />
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-2xl shadow-lg animate-bounce">
                      👑
                    </div>
                  </div>
                ) : (
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-7xl animate-pulse border-4 border-yellow-300 flex-shrink-0 shadow-2xl">
                    {isAvailable ? '❓' : '👑'}
                  </div>
                )}

                {/* Name and Motto - BIGGER */}
                <div className="flex-grow text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 animate-pulse mb-2">
                    {supremeBarosan?.nume || 'NICIUN BAROSAN'}
                  </h2>
                  <p className="text-yellow-100 text-lg md:text-xl italic mb-4">
                    "{supremeBarosan?.motto || 'Locul este liber!'}"
                  </p>

                  {/* Package info + Social link */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    {supremeBarosan?.pachet && (
                      <span className="bg-yellow-500/30 text-yellow-200 px-4 py-1.5 rounded-full text-sm font-bold">
                        ⏱️ {supremeBarosan.pachet.toUpperCase()} | 💰 {supremeBarosan.sumaPlatita} RON
                      </span>
                    )}
                    {supremeBarosan?.link && (
                      <a
                        href={supremeBarosan.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1.5 rounded-full text-sm font-bold hover:scale-105 transition-transform"
                      >
                        📱 Link Personal
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Countdown or Available Status - BIGGER */}
              {!isAvailable && supremeBarosan ? (
                <div className="bg-black/50 rounded-2xl px-6 py-4 mb-4">
                  <p className="text-yellow-300/80 text-sm text-center mb-2">⏰ Timp rămas până expiră titlul</p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <span className="text-yellow-100 font-mono font-black text-4xl md:text-5xl tabular-nums">
                        {formatTime(timeLeft.hours)}
                      </span>
                      <p className="text-yellow-300/60 text-xs">ORE</p>
                    </div>
                    <span className="text-yellow-400 text-3xl">:</span>
                    <div className="text-center">
                      <span className="text-yellow-100 font-mono font-black text-4xl md:text-5xl tabular-nums">
                        {formatTime(timeLeft.minutes)}
                      </span>
                      <p className="text-yellow-300/60 text-xs">MIN</p>
                    </div>
                    <span className="text-yellow-400 text-3xl">:</span>
                    <div className="text-center">
                      <span className="text-yellow-100 font-mono font-black text-4xl md:text-5xl tabular-nums">
                        {formatTime(timeLeft.seconds)}
                      </span>
                      <p className="text-yellow-300/60 text-xs">SEC</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl px-6 py-4 mb-4">
                  <p className="text-center text-white font-black text-xl">
                    🎉 LOCUL ESTE LIBER! 🎉
                  </p>
                  <p className="text-center text-white/80 text-sm mt-1">
                    Fii tu următorul Barosan Suprem!
                  </p>
                </div>
              )}

              {/* Certificate Button - NEW */}
              {!isAvailable && supremeBarosan && (
                <div className="text-center">
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-black text-lg hover:scale-105 transition-transform shadow-lg"
                  >
                    📜 Vezi Certificatul Suprem
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Packages - Compact */}
        <div className="max-w-3xl mx-auto mb-4">
          <h3 className="text-lg md:text-xl font-black text-center text-yellow-400 mb-3">
            💰 CUMPĂRĂ TIMPUL TĂU CA SUPREM 💰
          </h3>

          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {packages.map((pkg) => (
              <div key={pkg.hours} className={`relative ${pkg.best ? '-translate-y-1' : ''}`}>
                {/* Badge */}
                {(pkg.best || pkg.popular) && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20">
                    <div className={`text-white px-2 py-0.5 rounded-full font-black text-[10px] shadow-lg ${
                      pkg.best ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}>
                      {pkg.best ? '🔥 BEST' : '⭐ TOP'}
                    </div>
                  </div>
                )}

                <div className={`relative rounded-xl p-3 border ${
                  pkg.best ? 'bg-gradient-to-br from-yellow-900 to-red-900 border-yellow-400' :
                  pkg.popular ? 'bg-gradient-to-br from-purple-900 to-pink-900 border-purple-400' :
                  'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-500'
                }`}>
                  <div className="text-center">
                    <span className="text-2xl block">{pkg.emoji}</span>
                    <h4 className="text-sm font-black text-white">{pkg.label}</h4>
                    <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                      {pkg.price} RON
                    </div>
                    {pkg.discount > 0 && (
                      <div className="text-[10px] text-green-400 font-bold">-{pkg.discount}%</div>
                    )}
                    <Link
                      to={`/cum-devin-barosan?tier=suprem&hours=${pkg.hours}`}
                      className={`block w-full py-1.5 mt-2 rounded-lg font-bold text-xs transition-all hover:scale-105 ${
                        pkg.best ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' :
                        pkg.popular ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
                        'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
                      }`}
                    >
                      CUMPĂRĂ 🚀
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits - Compact horizontal */}
        <div className="max-w-3xl mx-auto mb-4 bg-black/40 rounded-xl p-3 border border-yellow-500/30">
          <h3 className="text-sm font-bold text-center text-yellow-400 mb-2">✨ CE PRIMEȘTI ✨</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {['👑 Prima pagină', '🔥 Efecte speciale', '💎 Badge exclusiv', '🏆 Certificat'].map((benefit, i) => (
              <span key={i} className="bg-yellow-500/10 text-yellow-100 text-xs px-2 py-1 rounded-full">{benefit}</span>
            ))}
          </div>
        </div>

        {/* CTA - Compact */}
        <div className="text-center">
          <Link
            to="/cum-devin-barosan?tier=suprem"
            className="inline-block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 text-black px-8 py-2 rounded-full font-black text-base hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,215,0,0.5)] animate-pulse"
          >
            🔥 DEVINO SUPREM! 🔥
          </Link>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && supremeBarosan && (
        <CertificateGenerator
          barosan={{
            ...supremeBarosan,
            tier: 'suprem',
            dataInregistrare: supremeBarosan.dataStart
          }}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
}
