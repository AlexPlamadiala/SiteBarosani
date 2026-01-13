import { useMemo } from 'react';
import BarosanCard from '../components/BarosanCard';
import CertificateGenerator from '../components/CertificateGenerator';
import { useState } from 'react';
import barosaniData from '../data/barosani.json';

export default function Zid() {
  const [selectedBarosan, setSelectedBarosan] = useState(null);

  // Organizăm barosanii pe tier-uri
  const barosaniByTier = useMemo(() => {
    return {
      platinum: barosaniData.barosani.filter(b => b.tier === 'platinum'),
      gold: barosaniData.barosani.filter(b => b.tier === 'gold'),
      basic: barosaniData.barosani.filter(b => b.tier === 'basic')
    };
  }, []);

  const handleViewCertificate = (barosan) => {
    setSelectedBarosan(barosan);
  };

  const handleCloseCertificate = () => {
    setSelectedBarosan(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] to-[#E8D5B7]">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#1a365d] to-[#2d5986] text-white">
        <div className="container mx-auto text-center">
          <div className="text-6xl mb-6">🏆</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Zidul Oficial al Barosanilor
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Toți barosanii verificați și certificați oficial, organizați după tier-ul lor de elită
          </p>
        </div>
      </section>

      {/* Platinum Zone - Most Prominent */}
      {barosaniByTier.platinum.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-gradient-to-r from-[#E5E4E2] to-[#BCC6CC] px-8 py-3 rounded-full mb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1a365d]">
                  💎 ZONA PLATINUM 💎
                </h2>
              </div>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Elita absolută. Carduri mari, glow auriu, link personal. {barosaniByTier.platinum.length} membrii Platinum.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {barosaniByTier.platinum.map((barosan) => (
                <div key={barosan.id} className="transform scale-110">
                  <BarosanCard
                    barosan={barosan}
                    onViewCertificate={handleViewCertificate}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gold Zone - Medium Prominence */}
      {barosaniByTier.gold.length > 0 && (
        <section className="py-16 px-4 bg-white/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-[#D4AF37] px-8 py-3 rounded-full mb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a365d]">
                  🏆 ZONA GOLD 🏆
                </h2>
              </div>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Membrii Gold. Border auriu, prioritate în grid. {barosaniByTier.gold.length} membrii Gold.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {barosaniByTier.gold.map((barosan) => (
                <BarosanCard
                  key={barosan.id}
                  barosan={barosan}
                  onViewCertificate={handleViewCertificate}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Basic Zone - Standard Size */}
      {barosaniByTier.basic.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-gray-400 px-8 py-3 rounded-full mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  ⭐ ZONA BASIC ⭐
                </h2>
              </div>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Barosani verificați oficial. {barosaniByTier.basic.length} membrii Basic.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
              {barosaniByTier.basic.map((barosan) => (
                <div key={barosan.id} className="transform scale-90">
                  <BarosanCard
                    barosan={barosan}
                    onViewCertificate={handleViewCertificate}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#1a365d] to-[#2d5986] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Vrei să Apari Pe Zid?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Alege tier-ul tău și fă parte din comunitatea oficială de barosani verificați
          </p>
          <a
            href="/cum-devin-barosan"
            className="inline-block bg-[#D4AF37] text-[#1a365d] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#c19b2e] transition-colors shadow-lg"
          >
            Devino Barosan Acum 🚀
          </a>
        </div>
      </section>

      {/* Certificate Modal */}
      {selectedBarosan && (
        <CertificateGenerator
          barosan={selectedBarosan}
          onClose={handleCloseCertificate}
        />
      )}
    </div>
  );
}
