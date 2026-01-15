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

    // Fetch inițial
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
        fetchBarosani(); // Refresh instant când se modifică barosanii
      });

      eventSource.addEventListener('heartbeat', (e) => {
        // Keep-alive heartbeat, no action needed
      });

      eventSource.onerror = (err) => {
        console.error('SSE Error:', err);
        setSseConnected(false);
        // SSE va încerca automat să reconecteze
      };
    } catch (err) {
      console.error('Failed to establish SSE connection:', err);
    }

    // Fallback: Polling la 30 secunde (backup dacă SSE nu funcționează)
    const pollInterval = setInterval(() => {
      if (!sseConnected) {
        fetchBarosani();
      }
    }, 30000);

    // Refresh când tab-ul devine vizibil
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchBarosani();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      if (eventSource) {
        eventSource.close();
      }
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const totalBarosani = barosani.length;
  const platinumCount = barosani.filter(b => b.tier === 'platinum').length;
  const goldCount = barosani.filter(b => b.tier === 'gold').length;
  const basicCount = barosani.filter(b => b.tier === 'basic').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] to-[#E8D5B7]">
      {/* Hero Section - Premium Design */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-[#1a365d] via-[#2d5986] to-[#1a365d] text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full mb-6 shadow-2xl">
            <span className="text-6xl">🏆</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
            ZIDUL BAROSANILOR
          </h1>
          <p className="text-lg md:text-2xl mb-3 max-w-4xl mx-auto leading-relaxed opacity-95">
            Bine ai venit la singura instituție acreditată internațional pentru verificarea
            și certificarea barosanilor.
          </p>
          <p className="text-base md:text-xl mb-10 max-w-3xl mx-auto italic opacity-90">
            "Unde șmecheria devine oficială"
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-12">
            <Link
              to="/zid"
              className="group relative inline-block"
            >
              <div className="absolute inset-0 bg-white rounded-2xl blur-lg group-hover:blur-xl transition-all opacity-30"></div>
              <span className="relative block bg-gradient-to-r from-white to-gray-100 text-[#1a365d] px-8 md:px-10 py-4 md:py-5 rounded-2xl font-extrabold text-lg md:text-xl hover:scale-105 transition-transform shadow-2xl">
                Vezi Zidul Oficial 👑
              </span>
            </Link>
            <Link
              to="/cum-devin-barosan"
              className="group relative inline-block"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] rounded-2xl blur-lg group-hover:blur-xl transition-all opacity-75"></div>
              <span className="relative block bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1a365d] px-8 md:px-10 py-4 md:py-5 rounded-2xl font-extrabold text-lg md:text-xl hover:scale-105 transition-transform shadow-2xl">
                Devino Barosan Acum ⭐
              </span>
            </Link>
          </div>

          {/* Stats Cards - Premium Design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Total Barosani Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative backdrop-blur-sm bg-white/95 rounded-2xl shadow-2xl p-6 border-2 border-[#D4AF37] hover:scale-105 transition-transform">
                <div className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent mb-2">{totalBarosani}</div>
                <div className="text-gray-700 font-bold text-sm md:text-base">Barosani Verificați</div>
              </div>
            </div>

            {/* Platinum Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#E5E4E2] to-[#BCC6CC] rounded-2xl blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative backdrop-blur-sm bg-white/95 rounded-2xl shadow-2xl p-6 border-2 border-[#E5E4E2] hover:scale-105 transition-transform">
                <div className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#1a365d] to-[#2d5986] bg-clip-text text-transparent mb-2">{platinumCount}</div>
                <div className="text-gray-700 font-bold text-sm md:text-base">💎 Platinum Elite</div>
              </div>
            </div>

            {/* Gold Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative backdrop-blur-sm bg-white/95 rounded-2xl shadow-2xl p-6 border-2 border-[#D4AF37] hover:scale-105 transition-transform">
                <div className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent mb-2">{goldCount}</div>
                <div className="text-gray-700 font-bold text-sm md:text-base">🏆 Gold Members</div>
              </div>
            </div>

            {/* Basic Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative backdrop-blur-sm bg-white/95 rounded-2xl shadow-2xl p-6 border-2 border-gray-300 hover:scale-105 transition-transform">
                <div className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-gray-500 to-gray-600 bg-clip-text text-transparent mb-2">{basicCount}</div>
                <div className="text-gray-700 font-bold text-sm md:text-base">⭐ Basic Members</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar - Enhanced */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-[#0f1f3d] via-[#1a365d] to-[#0f1f3d] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/3 w-64 h-64 bg-[#D4AF37] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
            <div className="group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full mb-4 shadow-xl group-hover:scale-110 transition-transform">
                <span className="text-2xl">📅</span>
              </div>
              <div className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFD700] mb-2">2025</div>
              <div className="text-sm md:text-base uppercase tracking-wider opacity-90 font-semibold">Anul Fondării</div>
            </div>
            <div className="group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full mb-4 shadow-xl group-hover:scale-110 transition-transform">
                <span className="text-2xl">✓</span>
              </div>
              <div className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFD700] mb-2">100%</div>
              <div className="text-sm md:text-base uppercase tracking-wider opacity-90 font-semibold">Șmecherie Garantată</div>
            </div>
            <div className="group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full mb-4 shadow-xl group-hover:scale-110 transition-transform">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFD700] mb-2">24h</div>
              <div className="text-sm md:text-base uppercase tracking-wider opacity-90 font-semibold">Procesare Rapidă</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Enhanced */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1a365d] to-[#2d5986] rounded-full mb-6 shadow-xl">
            <span className="text-3xl">ℹ️</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1a365d] to-[#2d5986] mb-6">
            Ce Este Zidul Barosanilor?
          </h2>
          <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
            De la fondarea noastră în 2025, am certificat <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFD700]">{totalBarosani} barosani</span> din
            toate colțurile României. Prin puterea conferită de Consiliul Suprem al Șmecheriei,
            certificăm că fiecare barosan de pe Zid a demonstrat calități remarcabile de barosănie
            și este autorizat să se dea mare în orice context social.
          </p>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative backdrop-blur-sm bg-gradient-to-r from-[#FFF9E6] to-[#FFF5CC] border-l-4 border-[#D4AF37] p-6 md:p-8 rounded-2xl shadow-xl">
              <p className="text-gray-800 italic text-base md:text-lg font-medium">
                "Certificarea oficială de barosan nu este doar un titlu - este un stil de viață,
                o atitudine, o garanție de șmecherie verificată și aprobată."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Premium Design */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-[#F5E6D3] to-[#E8D5B7]">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1a365d] to-[#2d5986] text-center mb-12 md:mb-16">
            De Ce Să Fii Pe Zid?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-xl text-center hover:scale-105 transition-transform border-2 border-transparent group-hover:border-[#D4AF37]">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full mb-4 shadow-lg">
                  <span className="text-4xl">🏆</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#1a365d] mb-3">Certificare Oficială</h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  Primești certificat digital descărcabil cu ștampilă oficială și număr unic de înregistrare
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2d5986] to-[#1a365d] rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-xl text-center hover:scale-105 transition-transform border-2 border-transparent group-hover:border-[#2d5986]">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#2d5986] to-[#1a365d] rounded-full mb-4 shadow-lg">
                  <span className="text-4xl">🌟</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#1a365d] mb-3">Vizibilitate Publică</h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  Apari pe Zidul oficial unde toată lumea poate vedea că ești barosan autentic verificat
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E5E4E2] to-[#BCC6CC] rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-xl text-center hover:scale-105 transition-transform border-2 border-transparent group-hover:border-[#BCC6CC]">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#E5E4E2] to-[#BCC6CC] rounded-full mb-4 shadow-lg">
                  <span className="text-4xl">💎</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#1a365d] mb-3">Comunitate Elite</h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  Faci parte dintr-o comunitate selectă de oameni cu șmecherie certificată oficial
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final - Premium Design */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#1a365d] via-[#2d5986] to-[#1a365d] text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full mb-6 shadow-2xl animate-pulse">
            <span className="text-4xl">👑</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-lg">
            Gata Să Devii Parte Din Istorie?
          </h2>
          <p className="text-base md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto opacity-95 leading-relaxed">
            Alătură-te celor <span className="font-extrabold text-[#D4AF37]">{totalBarosani}</span> barosani deja verificați și certificați oficial
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
            <Link
              to="/zid"
              className="group relative inline-block"
            >
              <div className="absolute inset-0 bg-white rounded-2xl blur-lg group-hover:blur-xl transition-all opacity-30"></div>
              <span className="relative block bg-gradient-to-r from-white to-gray-100 text-[#1a365d] px-8 md:px-10 py-3 md:py-4 rounded-2xl font-extrabold text-base md:text-lg hover:scale-105 transition-transform shadow-2xl">
                Explorează Zidul 🔍
              </span>
            </Link>
            <Link
              to="/cum-devin-barosan"
              className="group relative inline-block"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] rounded-2xl blur-lg group-hover:blur-xl transition-all opacity-75"></div>
              <span className="relative block bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1a365d] px-8 md:px-10 py-3 md:py-4 rounded-2xl font-extrabold text-base md:text-lg hover:scale-105 transition-transform shadow-2xl">
                Începe Procesul 🚀
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
