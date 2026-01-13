import { Link } from 'react-router-dom';
import BarosanGrid from '../components/BarosanGrid';
import barosaniData from '../data/barosani.json';

export default function Home() {
  const totalBarosani = barosaniData.barosani.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] to-[#E8D5B7]">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="text-6xl mb-6">🏆</div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#1a365d] mb-4">
            ZIDUL BAROSANILOR
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Bine ai venit la singura instituție acreditată internațional pentru verificarea
            și certificarea barosanilor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/cum-devin-barosan"
              className="bg-[#D4AF37] text-[#1a365d] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#c19b2e] transition-colors shadow-lg"
            >
              Devino Barosan Acum 👑
            </Link>
            <div className="bg-white px-6 py-3 rounded-lg shadow-md">
              <span className="text-3xl font-bold text-[#D4AF37]">{totalBarosani}</span>
              <span className="text-gray-600 ml-2">barosani verificați</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-[#1a365d] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">{totalBarosani}</div>
              <div className="text-sm uppercase tracking-wide">Barosani Activi</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">2025</div>
              <div className="text-sm uppercase tracking-wide">Anul Fondării</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">100%</div>
              <div className="text-sm uppercase tracking-wide">Șmecherie Garantată</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Wall */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1a365d] mb-4">
              Zidul Oficial
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Toți barosanii verificați și certificați oficial. De la fondarea noastră în 2025,
              am certificat {totalBarosani} barosani din toate colțurile României.
            </p>
          </div>

          <BarosanGrid barosani={barosaniData.barosani} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#1a365d] to-[#2d5986] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ești gata să devii parte din istorie?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Investiția în statutul tău de barosan e cea mai bună decizie pe care o poți lua săptămâna asta.
            Poate chiar luna asta.
          </p>
          <Link
            to="/cum-devin-barosan"
            className="inline-block bg-[#D4AF37] text-[#1a365d] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#c19b2e] transition-colors shadow-lg"
          >
            Vezi Prețuri și Devino Barosan
          </Link>
        </div>
      </section>
    </div>
  );
}
