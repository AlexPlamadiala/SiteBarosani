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
      {/* Hero Section - Dark */}
      <section className="relative py-12 md:py-16 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-xl shadow-purple-500/30">
            <span className="text-4xl">👑</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-white">Devino </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">Barosan</span>
            <span className="text-white"> Oficial</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/60">
            Alege tier-ul, completează formularul și primește certificatul tău oficial
          </p>
        </div>
      </section>

      {/* Pricing Section - Dark Theme */}
      <section className="py-12 md:py-16 px-4" id="pricing">
        <div className="container mx-auto max-w-4xl">
          <PricingTiers />
        </div>
      </section>

      {/* Application Form Section - Slightly lighter */}
      <section className="py-12 px-4 bg-black/40 backdrop-blur-sm" id="application-form">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
              Completează Formularul
            </h2>
            <p className="text-white/50">
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
