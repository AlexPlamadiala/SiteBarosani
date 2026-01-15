export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: '🎯',
      title: 'Alege Tier-ul',
      description: 'Selectează pachetul care ți se potrivește: Basic, Gold sau Platinum'
    },
    {
      number: 2,
      icon: '💳',
      title: 'Plătește prin Revolut',
      description: 'Trimite suma corespunzătoare la @username-revolut și include detaliile cerute în mesaj'
    },
    {
      number: 3,
      icon: '📸',
      title: 'Trimite Poza',
      description: 'Trimite pe email poza ta (min 400x400px), motto-ul și link-ul (pentru Platinum)'
    },
    {
      number: 4,
      icon: '🎉',
      title: 'Apari În Registru',
      description: 'În maxim 24h vei fi în Registrul Oficial al Barosanilor și vei primi certificatul pe email!'
    }
  ];

  return (
    <div className="relative py-16 md:py-20 px-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1a365d] rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1a365d] to-[#2d5986] mb-4">
            Cum Devii Barosan Oficial
          </h2>
          <p className="text-center text-gray-600 text-base md:text-lg mb-4 max-w-2xl mx-auto leading-relaxed">
            Procesul este simplu și rapid. Urmează cei 4 pași și vei face parte din comunitatea oficială de barosani.
          </p>
          <div className="inline-block">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <span className="relative inline-block bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1a365d] px-6 py-2 rounded-full text-sm font-extrabold shadow-lg">
                ⚡ Certificare în maxim 24h
              </span>
            </div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step) => (
            <div key={step.number} className="relative group">
              {/* Connector Line */}
              {step.number < 4 && (
                <div className="hidden lg:block absolute top-16 left-1/2 w-full h-1 z-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                </div>
              )}

              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

              {/* Step Card */}
              <div className="relative bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 z-10 border border-gray-100">
                {/* Number Badge with Gradient */}
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full blur-md opacity-50"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center font-extrabold text-lg text-[#1a365d] shadow-lg">
                      {step.number}
                    </div>
                  </div>
                </div>

                {/* Icon Circle */}
                <div className="mt-6 mb-4 inline-flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-[#FFD700]/20 rounded-full blur-lg"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center shadow-inner">
                      <span className="text-5xl">{step.icon}</span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-extrabold text-[#1a365d] mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section - Enhanced */}
        <div className="relative group">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a365d] to-[#2d5986] rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>

          <div className="relative bg-gradient-to-br from-[#1a365d] via-[#2d5986] to-[#1a365d] rounded-2xl p-8 md:p-10 text-white shadow-2xl overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full mb-4 shadow-xl">
                  <span className="text-3xl">💡</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold mb-2">Întrebări Frecvente</h3>
                <p className="text-sm text-gray-300">Tot ce trebuie să știi despre procesul de înregistrare</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                <div className="group/faq relative">
                  <div className="absolute inset-0 bg-white/5 rounded-xl blur opacity-0 group-hover/faq:opacity-100 transition-opacity"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all border border-white/20">
                    <p className="font-extrabold mb-3 text-[#D4AF37] text-base flex items-center gap-2">
                      <span className="text-xl">❓</span> Cât durează procesarea?
                    </p>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      Maximum 24 de ore de la confirmarea plății și primirea pozei.
                    </p>
                  </div>
                </div>

                <div className="group/faq relative">
                  <div className="absolute inset-0 bg-white/5 rounded-xl blur opacity-0 group-hover/faq:opacity-100 transition-opacity"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all border border-white/20">
                    <p className="font-extrabold mb-3 text-[#D4AF37] text-base flex items-center gap-2">
                      <span className="text-xl">❓</span> Pot schimba tier-ul?
                    </p>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      Da! La următoarea plată lunară poți alege alt tier.
                    </p>
                  </div>
                </div>

                <div className="group/faq relative">
                  <div className="absolute inset-0 bg-white/5 rounded-xl blur opacity-0 group-hover/faq:opacity-100 transition-opacity"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all border border-white/20">
                    <p className="font-extrabold mb-3 text-[#D4AF37] text-base flex items-center gap-2">
                      <span className="text-xl">❓</span> Pot modifica poza/motto-ul?
                    </p>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      Da, trimite pe email noile detalii. Modificări gratuite o dată pe lună.
                    </p>
                  </div>
                </div>

                <div className="group/faq relative">
                  <div className="absolute inset-0 bg-white/5 rounded-xl blur opacity-0 group-hover/faq:opacity-100 transition-opacity"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all border border-white/20">
                    <p className="font-extrabold mb-3 text-[#D4AF37] text-base flex items-center gap-2">
                      <span className="text-xl">❓</span> Cum anulez abonamentul?
                    </p>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      Simplu - nu mai plăti. După 7 zile de grație vei fi șters din Registru.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
