import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost/SiteBarosani/api/barosani.php';

export default function Home() {
  const [barosani, setBarosani] = useState([]);
  const [loading, setLoading] = useState(true);

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

    // Polling automat la 30 secunde
    const pollInterval = setInterval(() => {
      fetchBarosani();
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
      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto text-center">
          <div className="text-8xl mb-8">🏆</div>
          <h1 className="text-5xl md:text-7xl font-bold text-[#1a365d] mb-6">
            ZIDUL BAROSANILOR
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-4xl mx-auto leading-relaxed">
            Bine ai venit la singura instituție acreditată internațional pentru verificarea
            și certificarea barosanilor.
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto italic">
            "Unde șmecheria devine oficială"
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link
              to="/zid"
              className="bg-gradient-to-r from-[#1a365d] to-[#2d5986] text-white px-10 py-5 rounded-xl font-bold text-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Vezi Zidul Oficial 👑
            </Link>
            <Link
              to="/cum-devin-barosan"
              className="bg-[#D4AF37] text-[#1a365d] px-10 py-5 rounded-xl font-bold text-xl hover:bg-[#c19b2e] transition-all shadow-lg"
            >
              Devino Barosan Acum ⭐
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D4AF37]">
              <div className="text-5xl font-bold text-[#D4AF37] mb-2">{totalBarosani}</div>
              <div className="text-gray-700 font-semibold">Barosani Verificați</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#E5E4E2]">
              <div className="text-5xl font-bold text-[#1a365d] mb-2">{platinumCount}</div>
              <div className="text-gray-700 font-semibold">💎 Platinum Elite</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D4AF37]">
              <div className="text-5xl font-bold text-[#D4AF37] mb-2">{goldCount}</div>
              <div className="text-gray-700 font-semibold">🏆 Gold Members</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-300">
              <div className="text-5xl font-bold text-gray-600 mb-2">{basicCount}</div>
              <div className="text-gray-700 font-semibold">⭐ Basic Members</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-gradient-to-r from-[#1a365d] to-[#2d5986] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-[#D4AF37] mb-2">2025</div>
              <div className="text-sm uppercase tracking-wide opacity-90">Anul Fondării</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#D4AF37] mb-2">100%</div>
              <div className="text-sm uppercase tracking-wide opacity-90">Șmecherie Garantată</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#D4AF37] mb-2">24h</div>
              <div className="text-sm uppercase tracking-wide opacity-90">Procesare Rapidă</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-[#1a365d] mb-6">
            Ce Este Zidul Barosanilor?
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            De la fondarea noastră în 2025, am certificat <span className="font-bold text-[#D4AF37]">{totalBarosani} barosani</span> din
            toate colțurile României. Prin puterea conferită de Consiliul Suprem al Șmecheriei,
            certificăm că fiecare barosan de pe Zid a demonstrat calități remarcabile de barosănie
            și este autorizat să se dea mare în orice context social.
          </p>
          <div className="bg-[#D4AF37] bg-opacity-10 border-l-4 border-[#D4AF37] p-6 rounded">
            <p className="text-gray-800 italic">
              "Certificarea oficială de barosan nu este doar un titlu - este un stil de viață,
              o atitudine, o garanție de șmecherie verificată și aprobată."
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-[#1a365d] text-center mb-12">
            De Ce Să Fii Pe Zid?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-2xl transition-shadow">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-[#1a365d] mb-3">Certificare Oficială</h3>
              <p className="text-gray-600">
                Primești certificat digital descărcabil cu ștampilă oficială și număr unic de înregistrare
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-2xl transition-shadow">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-2xl font-bold text-[#1a365d] mb-3">Vizibilitate Publică</h3>
              <p className="text-gray-600">
                Apari pe Zidul oficial unde toată lumea poate vedea că ești barosan autentic verificat
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-2xl transition-shadow">
              <div className="text-6xl mb-4">💎</div>
              <h3 className="text-2xl font-bold text-[#1a365d] mb-3">Comunitate Elite</h3>
              <p className="text-gray-600">
                Faci parte dintr-o comunitate selectă de oameni cu șmecherie certificată oficial
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-[#1a365d] to-[#2d5986] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Gata Să Devii Parte Din Istorie?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Alătură-te celor {totalBarosani} barosani deja verificați și certificați oficial
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/zid"
              className="inline-block bg-white text-[#1a365d] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Explorează Zidul 🔍
            </Link>
            <Link
              to="/cum-devin-barosan"
              className="inline-block bg-[#D4AF37] text-[#1a365d] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#c19b2e] transition-colors shadow-lg"
            >
              Începe Procesul 🚀
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
