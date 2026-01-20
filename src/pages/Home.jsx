import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCountUp } from '../hooks/useCountUp';
import RecentActivity from '../components/RecentActivity';
import Leaderboard from '../components/Leaderboard';
import confetti from 'canvas-confetti';

const API_URL = 'http://localhost/SiteBarosani/api/barosani.php';
const SUPREM_API_URL = 'http://localhost/SiteBarosani/api/barosan_suprem.php';
const SSE_URL = 'http://localhost/SiteBarosani/api/sse/updates.php';

export default function Home() {
  const [barosani, setBarosani] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sseConnected, setSseConnected] = useState(false);
  const [supremBarosan, setSupremBarosan] = useState(null);
  const [supremAvailable, setSupremAvailable] = useState(true);

  // Confetti effect when page loads
  useEffect(() => {
    const colors = ['#D4AF37', '#FFD700', '#9333ea', '#ec4899'];

    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: colors
      });
    }, 300);
  }, []);

  useEffect(() => {
    async function fetchBarosani() {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data.success) {
          setBarosani(data.barosani);
        }
      } catch (err) {
        console.error('Error fetching barosani:', err);
      } finally {
        setLoading(false);
      }
    }

    async function fetchSuprem() {
      try {
        const response = await fetch(SUPREM_API_URL);
        const data = await response.json();
        if (data.success) {
          setSupremAvailable(data.available);
          setSupremBarosan(data.suprem);
        }
      } catch (err) {
        console.error('Error fetching suprem:', err);
      }
    }

    fetchBarosani();
    fetchSuprem();

    // SSE pentru real-time updates
    let eventSource;
    try {
      eventSource = new EventSource(SSE_URL);

      eventSource.addEventListener('connected', () => {
        setSseConnected(true);
      });

      eventSource.addEventListener('barosani-updated', () => {
        fetchBarosani();
      });

      eventSource.onerror = () => {
        setSseConnected(false);
      };
    } catch (err) {
      console.error('Failed to establish SSE connection:', err);
    }

    const pollInterval = setInterval(() => {
      if (!sseConnected) {
        fetchBarosani();
        fetchSuprem();
      }
    }, 30000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchBarosani();
        fetchSuprem();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sseConnected]);

  const totalBarosani = barosani.length;
  const platinumCount = barosani.filter(b => b.tier === 'platinum').length;
  const goldCount = barosani.filter(b => b.tier === 'gold').length;
  const basicCount = barosani.filter(b => b.tier === 'basic').length;

  // Animated counters
  const animatedTotal = useCountUp(totalBarosani, 2000);
  const animatedPlatinum = useCountUp(platinumCount, 2000);
  const animatedGold = useCountUp(goldCount, 2000);
  const animatedBasic = useCountUp(basicCount, 2000);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl animate-bounce mb-4">👑</div>
            <p className="text-yellow-400 font-bold animate-pulse">Se încarcă...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section - Dark Modern */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/10">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-white/80 text-sm font-medium">{animatedTotal} barosani activi</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6">
              <span className="text-white">REGISTRUL</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400">
                OFICIAL
              </span>
              <br />
              <span className="text-white">AL BAROSANILOR</span>
            </h1>

            <p className="text-lg md:text-xl text-white/60 mb-8 max-w-2xl mx-auto">
              Singura instituție acreditată pentru certificarea oficială a barosanilor din România
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/zid"
                className="group bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-2xl shadow-white/10"
              >
                Vezi Registrul
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                to="/cum-devin-barosan"
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-2xl shadow-yellow-500/20"
              >
                Înscrie-te Acum ⭐
              </Link>
            </div>

            {/* Stats Grid - 5 columns with Suprem */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {/* Suprem Card - Special */}
              <Link
                to="/barosanul-suprem"
                className="relative group bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30 hover:border-purple-400/50 transition-all hover:scale-105 col-span-2 sm:col-span-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  {supremBarosan && !supremAvailable ? (
                    <>
                      <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">ACTIV</div>
                      <div className="text-purple-300/80 font-semibold text-sm">👑 Suprem</div>
                      <div className="text-xs text-purple-300/60 mt-1 truncate">{supremBarosan.nume}</div>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">LIBER</div>
                      <div className="text-purple-300/80 font-semibold text-sm">👑 Suprem</div>
                      <div className="text-xs text-green-400 mt-1">Disponibil!</div>
                    </>
                  )}
                </div>
              </Link>

              {/* Total */}
              <Link
                to="/zid"
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-yellow-500/30 transition-all hover:scale-105"
              >
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500 tabular-nums">{animatedTotal}</div>
                <div className="text-white/60 font-semibold text-sm">🎯 Total</div>
              </Link>

              {/* Platinum */}
              <Link
                to="/zid?tier=platinum"
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-gray-300/30 transition-all hover:scale-105"
              >
                <div className="text-3xl font-black text-gray-300 tabular-nums">{animatedPlatinum}</div>
                <div className="text-white/60 font-semibold text-sm">💎 Platinum</div>
              </Link>

              {/* Gold */}
              <Link
                to="/zid?tier=gold"
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-yellow-500/30 transition-all hover:scale-105"
              >
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500 tabular-nums">{animatedGold}</div>
                <div className="text-white/60 font-semibold text-sm">🏆 Gold</div>
              </Link>

              {/* Basic */}
              <Link
                to="/zid?tier=basic"
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-gray-500/30 transition-all hover:scale-105"
              >
                <div className="text-3xl font-black text-gray-400 tabular-nums">{animatedBasic}</div>
                <div className="text-white/60 font-semibold text-sm">⭐ Basic</div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Suprem Spotlight - Only show when active */}
      {supremBarosan && !supremAvailable && (
        <section className="py-8 px-4 bg-gradient-to-r from-purple-900/30 via-black to-pink-900/30 border-y border-purple-500/20">
          <div className="container mx-auto">
            <Link to="/barosanul-suprem" className="flex items-center justify-center gap-4 group">
              <div className="flex items-center gap-3">
                {supremBarosan.poza ? (
                  <img src={supremBarosan.poza} alt={supremBarosan.nume} className="w-12 h-12 rounded-full border-2 border-purple-400 object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">👑</div>
                )}
                <div>
                  <div className="text-xs text-purple-300 uppercase tracking-wider">Barosanul Suprem</div>
                  <div className="text-white font-bold group-hover:text-purple-300 transition-colors">{supremBarosan.nume}</div>
                </div>
              </div>
              <span className="text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </section>
      )}

      {/* Features Section - Glass Cards */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#0a0a0a] to-[#111]">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
            <span className="text-white">De Ce </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">Registrul Oficial?</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-yellow-500/30 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Certificare Oficială</h3>
              <p className="text-white/50 text-sm">
                Certificat digital descărcabil cu ștampilă oficială și cod unic de verificare
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Vizibilitate Publică</h3>
              <p className="text-white/50 text-sm">
                Apari în Registrul Oficial vizibil tuturor și primești certificat partajabil
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-gray-300/30 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Comunitate Elite</h3>
              <p className="text-white/50 text-sm">
                Comunitate selectă cu șmecherie certificată și statut verificat oficial
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Two Column: Recent + Leaderboard */}
      <section className="py-16 px-4 bg-[#111]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div>
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                Activitate Recentă
              </h2>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
                <RecentActivity barosani={barosani} />
              </div>
            </div>

            {/* Leaderboard */}
            <div>
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                Top Barosani
              </h2>
              <Leaderboard barosani={barosani} />
            </div>
          </div>
        </div>
      </section>

      {/* Tier Comparison */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#111] to-[#0a0a0a]">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-4 text-white">
            Alege-ți Nivelul
          </h2>
          <p className="text-center text-white/50 mb-12">Fiecare tier oferă beneficii unice</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Suprem */}
            <Link to="/barosanul-suprem" className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-[#0a0a0a] rounded-2xl p-4 border border-purple-500/50 h-full">
                <div className="text-3xl mb-2">👑</div>
                <h3 className="text-white font-bold mb-1">Suprem</h3>
                <p className="text-purple-300 text-xs mb-2">De la 50 RON/oră</p>
                <ul className="text-white/50 text-xs space-y-1">
                  <li>• Prima pagină</li>
                  <li>• Efecte speciale</li>
                  <li>• Badge exclusiv</li>
                </ul>
              </div>
            </Link>

            {/* Platinum */}
            <Link to="/cum-devin-barosan?tier=platinum" className="group">
              <div className="bg-white/5 rounded-2xl p-4 border border-gray-300/20 h-full hover:border-gray-300/40 transition-colors">
                <div className="text-3xl mb-2">💎</div>
                <h3 className="text-white font-bold mb-1">Platinum</h3>
                <p className="text-gray-300 text-xs mb-2">149 RON</p>
                <ul className="text-white/50 text-xs space-y-1">
                  <li>• Link social</li>
                  <li>• Prioritate afișare</li>
                  <li>• Certificat premium</li>
                </ul>
              </div>
            </Link>

            {/* Gold */}
            <Link to="/cum-devin-barosan?tier=gold" className="group">
              <div className="bg-white/5 rounded-2xl p-4 border border-yellow-500/20 h-full hover:border-yellow-500/40 transition-colors">
                <div className="text-3xl mb-2">🏆</div>
                <h3 className="text-white font-bold mb-1">Gold</h3>
                <p className="text-yellow-400 text-xs mb-2">49 RON</p>
                <ul className="text-white/50 text-xs space-y-1">
                  <li>• Certificat gold</li>
                  <li>• Badge special</li>
                  <li>• Vizibilitate bună</li>
                </ul>
              </div>
            </Link>

            {/* Basic */}
            <Link to="/cum-devin-barosan?tier=basic" className="group">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 h-full hover:border-white/20 transition-colors">
                <div className="text-3xl mb-2">⭐</div>
                <h3 className="text-white font-bold mb-1">Basic</h3>
                <p className="text-gray-400 text-xs mb-2">GRATUIT</p>
                <ul className="text-white/50 text-xs space-y-1">
                  <li>• Certificat basic</li>
                  <li>• În registru</li>
                  <li>• Verificat oficial</li>
                </ul>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto text-center max-w-2xl">
          <div className="text-6xl mb-6">👑</div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Gata Să Devii Barosan Oficial?
          </h2>
          <p className="text-white/60 mb-8">
            Alătură-te celor <span className="text-yellow-400 font-bold tabular-nums">{animatedTotal}</span> barosani verificați și primește certificatul tău oficial
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/zid"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/10"
            >
              Explorează Registrul 🔍
            </Link>
            <Link
              to="/cum-devin-barosan"
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-2xl shadow-yellow-500/20"
            >
              Începe Procesul 🚀
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
