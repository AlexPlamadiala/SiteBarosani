import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

const API_URL = 'http://localhost/SiteBarosani/api/barosan_suprem.php';

export default function BarosanulSuprem() {
  const [supremeBarosan, setSupremeBarosan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);

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
        const response = await fetch(API_URL);
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
          <div className="text-8xl animate-bounce mb-4">👑</div>
          <p className="text-yellow-400 text-xl font-bold animate-pulse">Se încarcă Barosanul Suprem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-black relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Rotating gold rings */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          <div className="absolute inset-0 border-4 border-yellow-500/20 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
          <div className="absolute inset-8 border-2 border-yellow-400/30 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
          <div className="absolute inset-16 border border-yellow-300/40 rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>
        </div>

        {/* Floating emojis */}
        <div className="absolute top-10 left-10 text-6xl animate-bounce" style={{ animationDelay: '0s' }}>👑</div>
        <div className="absolute top-20 right-20 text-5xl animate-bounce" style={{ animationDelay: '0.5s' }}>💎</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-bounce" style={{ animationDelay: '1s' }}>🏆</div>
        <div className="absolute bottom-10 right-10 text-6xl animate-bounce" style={{ animationDelay: '1.5s' }}>💰</div>
        <div className="absolute top-1/3 left-5 text-4xl animate-pulse">✨</div>
        <div className="absolute top-1/3 right-5 text-4xl animate-pulse" style={{ animationDelay: '0.3s' }}>✨</div>
        <div className="absolute bottom-1/3 left-10 text-4xl animate-pulse" style={{ animationDelay: '0.6s' }}>🌟</div>
        <div className="absolute bottom-1/3 right-10 text-4xl animate-pulse" style={{ animationDelay: '0.9s' }}>🌟</div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header - Super Flashy */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <span className="text-8xl animate-pulse drop-shadow-[0_0_30px_rgba(255,215,0,0.8)]">👑</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 animate-pulse mb-4 drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]"
              style={{ textShadow: '0 0 40px rgba(255,215,0,0.5), 0 0 80px rgba(255,215,0,0.3)' }}>
            BAROSANUL SUPREM
          </h1>
          <p className="text-xl md:text-2xl text-yellow-200 font-bold animate-bounce">
            🔥 CEL MAI TARE BAROSAN DIN UNIVERS 🔥
          </p>
          <div className="flex justify-center gap-4 mt-4 text-3xl">
            <span className="animate-spin" style={{ animationDuration: '3s' }}>💫</span>
            <span className="animate-pulse">⚡</span>
            <span className="animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}>💫</span>
          </div>
        </div>

        {/* Current Supreme Barosan Card */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>

            <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-3xl p-8 border-4 border-yellow-500 shadow-[0_0_50px_rgba(255,215,0,0.5)]">
              {/* Crown decoration */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="text-7xl animate-bounce drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]">👑</div>
              </div>

              {/* Photo */}
              <div className="flex justify-center mb-6 mt-8">
                {supremeBarosan?.poza ? (
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
                    <img
                      src={supremeBarosan.poza}
                      alt={supremeBarosan.nume}
                      className="relative w-40 h-40 rounded-full object-cover border-4 border-yellow-400 shadow-[0_0_30px_rgba(255,215,0,0.6)]"
                    />
                  </div>
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-6xl animate-pulse border-4 border-yellow-300 shadow-[0_0_30px_rgba(255,215,0,0.6)]">
                    {isAvailable ? '❓' : '👑'}
                  </div>
                )}
              </div>

              {/* Name */}
              <h2 className="text-3xl md:text-4xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 mb-4 animate-pulse">
                {supremeBarosan?.nume || 'NICIUN BAROSAN'}
              </h2>

              {/* Motto */}
              <p className="text-center text-yellow-100 text-lg italic mb-6 px-4">
                "{supremeBarosan?.motto || 'Locul este liber! Fii primul Barosan Suprem!'}"
              </p>

              {/* Link to social */}
              {supremeBarosan?.link && (
                <div className="text-center mb-4">
                  <a
                    href={supremeBarosan.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full font-bold hover:scale-105 transition-transform"
                  >
                    📱 Urmărește-mă
                  </a>
                </div>
              )}

              {/* Package info */}
              {supremeBarosan?.pachet && (
                <div className="text-center mb-4">
                  <span className="bg-yellow-500/30 text-yellow-200 px-4 py-1 rounded-full text-sm font-bold">
                    Pachet: {supremeBarosan.pachet.toUpperCase()} | {supremeBarosan.sumaPlatita} RON
                  </span>
                </div>
              )}

              {/* Countdown or Available Status */}
              {!isAvailable && supremeBarosan ? (
                <div className="bg-black/50 rounded-2xl p-6 border-2 border-yellow-500/50">
                  <p className="text-center text-yellow-300 font-bold mb-4 text-lg animate-pulse">
                    ⏰ TIMP RĂMAS CA SUPREM ⏰
                  </p>
                  <div className="flex justify-center gap-4">
                    <div className="bg-gradient-to-b from-yellow-500 to-yellow-700 rounded-xl p-4 min-w-[80px] shadow-lg">
                      <div className="text-4xl font-black text-white tabular-nums">{formatTime(timeLeft.hours)}</div>
                      <div className="text-xs text-yellow-200 font-bold">ORE</div>
                    </div>
                    <div className="text-4xl text-yellow-400 font-bold self-center animate-pulse">:</div>
                    <div className="bg-gradient-to-b from-yellow-500 to-yellow-700 rounded-xl p-4 min-w-[80px] shadow-lg">
                      <div className="text-4xl font-black text-white tabular-nums">{formatTime(timeLeft.minutes)}</div>
                      <div className="text-xs text-yellow-200 font-bold">MIN</div>
                    </div>
                    <div className="text-4xl text-yellow-400 font-bold self-center animate-pulse">:</div>
                    <div className="bg-gradient-to-b from-red-500 to-red-700 rounded-xl p-4 min-w-[80px] shadow-lg animate-pulse">
                      <div className="text-4xl font-black text-white tabular-nums">{formatTime(timeLeft.seconds)}</div>
                      <div className="text-xs text-red-200 font-bold">SEC</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 animate-pulse">
                  <p className="text-center text-white font-black text-2xl">
                    🎉 LOCUL ESTE LIBER! 🎉
                  </p>
                  <p className="text-center text-green-100 mt-2">
                    Fii PRIMUL care devine Barosanul Suprem!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Packages */}
        <div className="max-w-4xl mx-auto mb-12">
          <h3 className="text-3xl md:text-4xl font-black text-center text-yellow-400 mb-8 animate-pulse">
            💰 CUMPĂRĂ TIMPUL TĂU CA SUPREM 💰
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <div
                key={pkg.hours}
                className={`relative group ${pkg.best ? 'md:-translate-y-4' : ''}`}
              >
                {/* Best Value Badge */}
                {pkg.best && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-1 rounded-full font-black text-sm animate-bounce shadow-lg">
                      🔥 BEST VALUE 🔥
                    </div>
                  </div>
                )}

                {/* Popular Badge */}
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full font-black text-sm animate-pulse shadow-lg">
                      ⭐ POPULAR ⭐
                    </div>
                  </div>
                )}

                {/* Card Glow */}
                <div className={`absolute -inset-1 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity ${
                  pkg.best ? 'bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400' :
                  pkg.popular ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
                  'bg-gradient-to-r from-gray-400 to-gray-600'
                }`}></div>

                <div className={`relative rounded-2xl p-6 border-2 ${
                  pkg.best ? 'bg-gradient-to-br from-yellow-900 to-red-900 border-yellow-400' :
                  pkg.popular ? 'bg-gradient-to-br from-purple-900 to-pink-900 border-purple-400' :
                  'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-500'
                }`}>
                  <div className="text-center">
                    <span className="text-5xl mb-4 block">{pkg.emoji}</span>
                    <h4 className="text-2xl font-black text-white mb-2">{pkg.label}</h4>

                    {pkg.discount > 0 && (
                      <div className="text-sm text-green-400 font-bold mb-2 animate-pulse">
                        -{pkg.discount}% REDUCERE!
                      </div>
                    )}

                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-4">
                      {pkg.price} RON
                    </div>

                    <p className="text-gray-300 text-sm mb-4">
                      {pkg.discount > 0
                        ? `Doar ${(pkg.price / pkg.hours).toFixed(0)} RON/oră!`
                        : `${pkg.price} RON/oră`
                      }
                    </p>

                    <Link
                      to={`/cum-devin-barosan?tier=suprem&hours=${pkg.hours}`}
                      className={`block w-full py-3 rounded-xl font-black text-lg transition-all hover:scale-105 ${
                        pkg.best ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' :
                        pkg.popular ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
                        'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
                      }`}
                    >
                      CUMPĂRĂ ACUM! 🚀
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-3xl mx-auto mb-12 bg-black/50 rounded-3xl p-8 border-2 border-yellow-500/30">
          <h3 className="text-2xl md:text-3xl font-black text-center text-yellow-400 mb-6">
            ✨ CE PRIMEȘTI CA BAROSAN SUPREM ✨
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { emoji: '👑', text: 'Apari PE PRIMA PAGINĂ ca SUPREM' },
              { emoji: '🔥', text: 'Poza ta cu EFECTE SPECIALE' },
              { emoji: '💎', text: 'Badge EXCLUSIV de Suprem' },
              { emoji: '📣', text: 'Anunț special în comunitate' },
              { emoji: '🏆', text: 'Certificat SUPREM descărcabil' },
              { emoji: '⚡', text: 'Prioritate MAXIMĂ în toate' },
              { emoji: '🎉', text: 'Confetti când intră cineva pe pagină' },
              { emoji: '💪', text: 'Flexare la nivel SUPREM' }
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-yellow-500/10 rounded-xl p-3 hover:bg-yellow-500/20 transition-colors"
              >
                <span className="text-2xl">{benefit.emoji}</span>
                <span className="text-yellow-100 font-semibold">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/cum-devin-barosan"
            className="inline-block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 text-black px-12 py-4 rounded-full font-black text-xl hover:scale-110 transition-all shadow-[0_0_30px_rgba(255,215,0,0.5)] animate-pulse"
          >
            🔥 DEVINO SUPREM ACUM! 🔥
          </Link>
          <p className="text-yellow-200/60 mt-4 text-sm">
            * Locul de Barosan Suprem este UNIC și EXCLUSIV
          </p>
        </div>
      </div>

      {/* CSS for extra animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
