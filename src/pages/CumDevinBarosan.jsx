import PricingTiers from '../components/PricingTiers';
import HowItWorks from '../components/HowItWorks';
import ApplicationForm from '../components/ApplicationForm';

export default function CumDevinBarosan() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] to-[#E8D5B7]">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#1a365d] to-[#2d5986] text-white">
        <div className="container mx-auto text-center">
          <div className="text-6xl mb-6">👑</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cum Devin Barosan Oficial
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Completează formularul și primește codul tău unic pentru a finaliza procesul
          </p>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <ApplicationForm />
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Pricing Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1a365d] mb-4">
              Alege Tier-ul Tău
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Fiecare tier vine cu beneficii exclusive. Cu cât investești mai mult,
              cu atât arăți mai tare pe Zidul Barosanilor.
            </p>
          </div>

          <PricingTiers />
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1a365d] mb-4">
              De Ce Să Devii Barosan Verificat?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-[#1a365d] mb-2">
                Status Oficial
              </h3>
              <p className="text-gray-600">
                Primești certificat digital descărcabil care atestă statutul tău de barosan verificat
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-5xl mb-4">🌟</div>
              <h3 className="text-xl font-bold text-[#1a365d] mb-2">
                Vizibilitate Publică
              </h3>
              <p className="text-gray-600">
                Apari pe Zidul public unde toată lumea poate vedea că ești barosan autentic
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-5xl mb-4">💎</div>
              <h3 className="text-xl font-bold text-[#1a365d] mb-2">
                Comunitate Exclusivă
              </h3>
              <p className="text-gray-600">
                Faci parte dintr-o comunitate selectă de oameni cu șmecherie certificată
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-[#1a365d] mb-2">
                Promovare Social Media
              </h3>
              <p className="text-gray-600">
                Distribuie certificatul pe Instagram și TikTok și arată-le tuturor că ești verificat
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-[#1a365d] mb-2">
                Design Personalizat
              </h3>
              <p className="text-gray-600">
                Alege motto-ul tău personal și, pentru Platinum, adaugă link-ul la profilul tău
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-[#1a365d] mb-2">
                Flexibilitate Totală
              </h3>
              <p className="text-gray-600">
                Poți schimba tier-ul, modifica poza sau anula oricând fără penalizări
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section (Satiric) */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#1a365d] to-[#2d5986] text-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Ce Spun Barosanii Noștri
            </h2>
            <p className="text-lg opacity-90">
              (Mărturii 100% reale și deloc inventate)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-2xl">
                  😎
                </div>
                <div className="ml-3">
                  <p className="font-bold">Gigel Șmecher</p>
                  <p className="text-sm opacity-75">Barosan Platinum</p>
                </div>
              </div>
              <p className="italic">
                "De când sunt barosan verificat, simt că am urcat 3 trepte pe scara socială.
                Certificatul meu stă lipit pe frigider."
              </p>
            </div>

            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-2xl">
                  🤩
                </div>
                <div className="ml-3">
                  <p className="font-bold">Maria Boss</p>
                  <p className="text-sm opacity-75">Barosan Gold</p>
                </div>
              </div>
              <p className="italic">
                "Toți colegii mă întreabă cum am devenit atât de barosană. Le-am arătat certificatul
                și acum toți vor să fie ca mine."
              </p>
            </div>

            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-2xl">
                  🚀
                </div>
                <div className="ml-3">
                  <p className="font-bold">Costel Tare</p>
                  <p className="text-sm opacity-75">Barosan Basic</p>
                </div>
              </div>
              <p className="italic">
                "20 de lei? Cea mai bună investiție din viața mea. Acum când merg pe stradă,
                oamenii simt că sunt barosan certificat."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#1a365d] mb-4">
            Gata de Acțiune?
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Nu mai pierde timp! Alege tier-ul tău, trimite plata și în 24h vei fi parte
            din elita barosanilor verificați oficial.
          </p>
          <a
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-block bg-[#D4AF37] text-[#1a365d] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#c19b2e] transition-colors shadow-lg"
          >
            Alege Tier-ul Tău Acum 👆
          </a>
        </div>
      </section>
    </div>
  );
}
