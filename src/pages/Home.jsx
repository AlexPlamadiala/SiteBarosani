import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost/SiteBarosani/api/barosani.php';
const SSE_URL = 'http://localhost/SiteBarosani/api/sse/updates.php';

export default function Home() {
  const [barosani, setBarosani] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sseConnected, setSseConnected] = useState(false);

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

    fetchBarosani();

    // SSE pentru real-time updates
    let eventSource;
    try {
      eventSource = new EventSource(SSE_URL);

      eventSource.addEventListener('connected', (e) => {
        console.log('SSE Connected:', e.data);
        setSseConnected(true);
      });

      eventSource.addEventListener('barosani-updated', (e) => {
        console.log('Barosani updated:', e.data);
        fetchBarosani();
      });

      eventSource.onerror = (err) => {
        console.error('SSE Error:', err);
        setSseConnected(false);
      };
    } catch (err) {
      console.error('Failed to establish SSE connection:', err);
    }

    const pollInterval = setInterval(() => {
      if (!sseConnected) {
        fetchBarosani();
      }
    }, 30000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchBarosani();
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] to-[#E8D5B7]">
      {/* Hero Section - Compact */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-br from-[#1a365d] to-[#2d5986] text-white">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full mb-5 shadow-xl">
            <span className="text-5xl">🏆</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-white">
            REGISTRUL OFICIAL AL BAROSANILOR
          </h1>
          <p className="text-base md:text-lg mb-2 max-w-2xl mx-auto opacity-90">
            Singura instituție acreditată pentru certificarea oficială a barosanilor
          </p>
          <p className="text-sm md:text-base mb-8 opacity-75 italic">
            "Unde șmecheria devine oficială"
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <Link
              to="/zid"
              className="bg-white text-[#1a365d] px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Vezi Registrul 👑
            </Link>
            <Link
              to="/cum-devin-barosan"
              className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1a365d] px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Înscrie-te Acum ⭐
            </Link>
          </div>

          {/* Stats Cards - Compact */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/95 rounded-xl shadow-lg p-4 border-2 border-[#D4AF37]">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">{totalBarosani}</div>
              <div className="text-gray-700 font-semibold text-sm">Barosani Verificați</div>
            </div>
            <div className="bg-white/95 rounded-xl shadow-lg p-4 border-2 border-[#E5E4E2]">
              <div className="text-4xl font-extrabold text-[#1a365d]">{platinumCount}</div>
              <div className="text-gray-700 font-semibold text-sm">💎 Platinum</div>
            </div>
            <div className="bg-white/95 rounded-xl shadow-lg p-4 border-2 border-[#D4AF37]">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">{goldCount}</div>
              <div className="text-gray-700 font-semibold text-sm">🏆 Gold</div>
            </div>
            <div className="bg-white/95 rounded-xl shadow-lg p-4 border-2 border-gray-300">
              <div className="text-4xl font-extrabold text-gray-600">{basicCount}</div>
              <div className="text-gray-700 font-semibold text-sm">⭐ Basic</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Compact */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1a365d] to-[#2d5986] text-center mb-10">
            De Ce Registrul Oficial?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center border-2 border-gray-100 hover:border-[#D4AF37] transition-colors">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full mb-4">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-lg font-bold text-[#1a365d] mb-2">Certificare Oficială</h3>
              <p className="text-gray-600 text-sm">
                Certificat digital descărcabil cu ștampilă oficială
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg text-center border-2 border-gray-100 hover:border-[#2d5986] transition-colors">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#2d5986] to-[#1a365d] rounded-full mb-4">
                <span className="text-3xl">🌟</span>
              </div>
              <h3 className="text-lg font-bold text-[#1a365d] mb-2">Vizibilitate Publică</h3>
              <p className="text-gray-600 text-sm">
                Apari în Registrul Oficial vizibil tuturor
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg text-center border-2 border-gray-100 hover:border-[#BCC6CC] transition-colors">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#E5E4E2] to-[#BCC6CC] rounded-full mb-4">
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="text-lg font-bold text-[#1a365d] mb-2">Comunitate Elite</h3>
              <p className="text-gray-600 text-sm">
                Comunitate selectă cu șmecherie certificată
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final - Compact */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-[#1a365d] to-[#2d5986] text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full mb-5 shadow-xl">
            <span className="text-3xl">👑</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold mb-4 text-white">
            Gata Să Devii Barosan Oficial?
          </h2>
          <p className="text-base md:text-lg mb-8 max-w-xl mx-auto opacity-90">
            Alătură-te celor <span className="font-bold text-[#D4AF37]">{totalBarosani}</span> barosani verificați
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/zid"
              className="bg-white text-[#1a365d] px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Explorează Registrul 🔍
            </Link>
            <Link
              to="/cum-devin-barosan"
              className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1a365d] px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Începe Procesul 🚀
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
