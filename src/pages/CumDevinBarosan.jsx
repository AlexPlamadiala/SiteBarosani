import PricingTiers from '../components/PricingTiers';
import HowItWorks from '../components/HowItWorks';
import ApplicationForm from '../components/ApplicationForm';

export default function CumDevinBarosan() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] to-[#E8D5B7]">
      {/* Hero Section - Premium Design */}
      <section className="py-10 md:py-14 px-4 bg-gradient-to-br from-[#1a365d] via-[#2d5986] to-[#1a365d] text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full mb-5 shadow-2xl">
            <span className="text-4xl">👑</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-lg">
            Cum Devin Barosan Oficial
          </h1>
          <p className="text-base md:text-xl max-w-3xl mx-auto opacity-95 leading-relaxed">
            Completează formularul și primește codul tău unic pentru a finaliza procesul
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Application Form Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <ApplicationForm />
        </div>
      </section>

      {/* Pricing Section - Enhanced */}
      <section className="py-16 px-4 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full mb-4 shadow-xl">
              <span className="text-3xl">💰</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1a365d] to-[#2d5986] mb-4">
              Alege Tier-ul Tău
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              Fiecare tier vine cu beneficii exclusive. Cu cât investești mai mult,
              cu atât arăți mai tare în Registrul Oficial al Barosanilor.
            </p>
          </div>

          <PricingTiers />
        </div>
      </section>

      {/* Benefits Section - Enhanced */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-[#F5E6D3] to-[#E8D5B7]">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1a365d] to-[#2d5986] rounded-full mb-4 shadow-xl">
              <span className="text-3xl">✨</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1a365d] to-[#2d5986] mb-4">
              De Ce Să Devii Barosan Verificat?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl p-6 md:p-8 shadow-lg text-center hover:scale-105 transition-transform border-2 border-transparent group-hover:border-[#D4AF37]">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full mb-4 shadow-lg">
                  <span className="text-3xl">🏆</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#1a365d] mb-2">
                  Status Oficial
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Primești certificat digital descărcabil care atestă statutul tău de barosan verificat
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2d5986] to-[#1a365d] rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl p-6 md:p-8 shadow-lg text-center hover:scale-105 transition-transform border-2 border-transparent group-hover:border-[#2d5986]">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#2d5986] to-[#1a365d] rounded-full mb-4 shadow-lg">
                  <span className="text-3xl">🌟</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#1a365d] mb-2">
                  Vizibilitate Publică
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Apari în Registrul Oficial unde toată lumea poate vedea că ești barosan autentic
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E5E4E2] to-[#BCC6CC] rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl p-6 md:p-8 shadow-lg text-center hover:scale-105 transition-transform border-2 border-transparent group-hover:border-[#BCC6CC]">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#E5E4E2] to-[#BCC6CC] rounded-full mb-4 shadow-lg">
                  <span className="text-3xl">💎</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#1a365d] mb-2">
                  Comunitate Exclusivă
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Faci parte dintr-o comunitate selectă de oameni cu șmecherie certificată
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl p-6 md:p-8 shadow-lg text-center hover:scale-105 transition-transform border-2 border-transparent group-hover:border-pink-400">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mb-4 shadow-lg">
                  <span className="text-3xl">📱</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#1a365d] mb-2">
                  Promovare Social Media
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Distribuie certificatul pe Instagram și TikTok și arată-le tuturor că ești verificat
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl p-6 md:p-8 shadow-lg text-center hover:scale-105 transition-transform border-2 border-transparent group-hover:border-amber-400">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mb-4 shadow-lg">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#1a365d] mb-2">
                  Design Personalizat
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Alege motto-ul tău personal și, pentru Platinum, adaugă link-ul la profilul tău
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl p-6 md:p-8 shadow-lg text-center hover:scale-105 transition-transform border-2 border-transparent group-hover:border-green-400">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4 shadow-lg">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#1a365d] mb-2">
                  Flexibilitate Totală
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Poți schimba tier-ul, modifica poza sau anula oricând fără penalizări
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Enhanced */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-br from-[#0f1f3d] via-[#1a365d] to-[#0f1f3d] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full mb-4 shadow-2xl">
              <span className="text-3xl">💬</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              Ce Spun Barosanii Noștri
            </h2>
            <p className="text-base md:text-lg opacity-90 italic">
              (Mărturii 100% reale și deloc inventate)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative backdrop-blur-sm bg-white/10 rounded-2xl p-6 md:p-8 shadow-xl hover:scale-105 transition-transform border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center text-2xl shadow-lg">
                    😎
                  </div>
                  <div className="ml-3">
                    <p className="font-bold text-lg">Gigel Șmecher</p>
                    <p className="text-xs md:text-sm opacity-75">Barosan Platinum</p>
                  </div>
                </div>
                <p className="italic text-sm md:text-base leading-relaxed">
                  "De când sunt barosan verificat, simt că am urcat 3 trepte pe scara socială.
                  Certificatul meu stă lipit pe frigider."
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative backdrop-blur-sm bg-white/10 rounded-2xl p-6 md:p-8 shadow-xl hover:scale-105 transition-transform border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center text-2xl shadow-lg">
                    🤩
                  </div>
                  <div className="ml-3">
                    <p className="font-bold text-lg">Maria Boss</p>
                    <p className="text-xs md:text-sm opacity-75">Barosan Gold</p>
                  </div>
                </div>
                <p className="italic text-sm md:text-base leading-relaxed">
                  "Toți colegii mă întreabă cum am devenit atât de barosană. Le-am arătat certificatul
                  și acum toți vor să fie ca mine."
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative backdrop-blur-sm bg-white/10 rounded-2xl p-6 md:p-8 shadow-xl hover:scale-105 transition-transform border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center text-2xl shadow-lg">
                    🚀
                  </div>
                  <div className="ml-3">
                    <p className="font-bold text-lg">Costel Tare</p>
                    <p className="text-xs md:text-sm opacity-75">Barosan Basic</p>
                  </div>
                </div>
                <p className="italic text-sm md:text-base leading-relaxed">
                  "20 de lei? Cea mai bună investiție din viața mea. Acum când merg pe stradă,
                  oamenii simt că sunt barosan certificat."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Enhanced */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-[#F5E6D3] to-[#E8D5B7] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full mb-6 shadow-2xl animate-pulse">
            <span className="text-4xl">🚀</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1a365d] to-[#2d5986] mb-4">
            Gata de Acțiune?
          </h2>
          <p className="text-base md:text-xl text-gray-700 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            Nu mai pierde timp! Alege tier-ul tău, trimite plata și în 24h vei fi parte
            din elita barosanilor verificați oficial.
          </p>
          <a
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group relative inline-block"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] rounded-2xl blur-lg group-hover:blur-xl transition-all opacity-75"></div>
            <span className="relative block bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1a365d] px-8 md:px-10 py-4 rounded-2xl font-extrabold text-base md:text-lg hover:scale-105 transition-transform shadow-2xl">
              Alege Tier-ul Tău Acum 👆
            </span>
          </a>
        </div>
      </section>
    </div>
  );
}
