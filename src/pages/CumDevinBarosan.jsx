import PricingTiers from '../components/PricingTiers';
import HowItWorks from '../components/HowItWorks';
import ApplicationForm from '../components/ApplicationForm';

export default function CumDevinBarosan() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] to-[#E8D5B7]">
      {/* Hero Section - Compact */}
      <section className="py-8 md:py-12 px-4 bg-gradient-to-br from-[#1a365d] to-[#2d5986] text-white">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full mb-4 shadow-xl">
            <span className="text-3xl">👑</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-white">
            Devino Barosan Oficial
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto opacity-90">
            Alege tier-ul, completează formularul și primește certificatul tău
          </p>
        </div>
      </section>

      {/* Pricing Section - FIRST! */}
      <section className="py-12 md:py-16 px-4 bg-white" id="pricing">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full mb-3 shadow-lg">
              <span className="text-2xl">💰</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1a365d] to-[#2d5986] mb-2">
              Cât Costă?
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
              Alege tier-ul care ți se potrivește
            </p>
          </div>

          <PricingTiers />
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-[#F5E6D3] to-[#E8D5B7]">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1a365d] to-[#2d5986] mb-2">
              Completează Formularul
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Primești un cod unic pentru plată
            </p>
          </div>
          <ApplicationForm />
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />
    </div>
  );
}
