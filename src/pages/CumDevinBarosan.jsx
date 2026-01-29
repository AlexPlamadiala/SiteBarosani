import PricingTiers from '../components/PricingTiers';
import HowItWorks from '../components/HowItWorks';
import ApplicationForm from '../components/ApplicationForm';
import { useSEO } from '../hooks/useSEO';

export default function CumDevinBarosan() {
  useSEO({
    title: 'Cum Devin Barosan',
    description: 'Înscrie-te în Registrul Oficial al Barosanilor! Alege pachetul potrivit și obține certificatul tău de barosan verificat.',
    url: '/cum-devin-barosan'
  });

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-[#D4AF37]/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-[#9333EA]/10 rounded-full"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#9333EA]/8 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D4AF37]/8 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 container mx-auto text-center">
          <div className="relative inline-flex items-center justify-center w-20 h-20 mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#9333EA] rounded-2xl blur-lg opacity-50"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-[#9333EA] via-[#D4AF37] to-[#9333EA] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(147,51,234,0.4)]">
              <img src="/Crown.png" alt="Crown" className="w-10 h-10 object-contain" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            <span className="text-white">Devino </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#FFD700]">Barosan</span>
            <span className="text-white"> Oficial</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-[#A0A0B0] leading-relaxed">
            Alege tier-ul, completează formularul și primește certificatul tău oficial
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 md:py-16 px-4 relative" id="pricing">
        <div className="container mx-auto max-w-4xl">
          <PricingTiers />
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-14 px-4 bg-[#0a0a0f]/60 backdrop-blur-sm border-t border-[#D4AF37]/10" id="application-form">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-3 block">Formular de Înscriere</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Completează Formularul
            </h2>
            <p className="text-[#A0A0B0]">
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
