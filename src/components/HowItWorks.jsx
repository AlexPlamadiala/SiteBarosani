export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: '📝',
      title: 'Completează Formularul',
      description: 'Alege tier-ul, adaugă poza și motto-ul în formular'
    },
    {
      number: 2,
      icon: '🎫',
      title: 'Primești Codul',
      description: 'După trimitere primești un cod unic pentru cerere'
    },
    {
      number: 3,
      icon: '💳',
      title: 'Plătește prin Revolut',
      description: 'Trimite suma la @username-revolut cu codul primit'
    },
    {
      number: 4,
      icon: '🎉',
      title: 'Apari În Registru',
      description: 'În maxim 24h vei fi în Registrul Oficial!'
    }
  ];

  return (
    <div className="relative py-16 md:py-20 px-4 bg-[#0a0a0f]/60 backdrop-blur-sm border-t border-[#D4AF37]/10">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-3 block">Proces Simplu</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Cum Devii <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#FFD700]">Barosan Oficial</span>
          </h2>
          <p className="text-[#A0A0B0] text-base max-w-2xl mx-auto mb-4">
            Procesul este simplu și rapid. Urmează cei 4 pași.
          </p>
          <span className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] px-5 py-2 rounded-full text-sm font-bold">
            ⚡ Certificare în maxim 24h
          </span>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {steps.map((step) => (
            <div key={step.number} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#9333EA] rounded-2xl blur-xl opacity-0 group-hover:opacity-15 transition-opacity duration-300"></div>

              <div className="relative bg-[#0f0f12] rounded-2xl p-6 text-center border border-[#3a3a45] group-hover:border-[#D4AF37]/40 transition-all duration-300 shadow-lg h-full">
                {/* Number Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#B8860B] via-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center font-bold text-base text-[#0A0A0F] shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                    {step.number}
                  </div>
                </div>

                {/* Icon */}
                <div className="mt-5 mb-3">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto">
                    <span className="text-4xl">{step.icon}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-[#A0A0B0] text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-[#0f0f12] rounded-2xl p-8 text-white border border-[#3a3a45]">
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center w-14 h-14 mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#9333EA] rounded-full blur-md opacity-40"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                <span className="text-2xl">💡</span>
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Întrebări Frecvente</h3>
            <p className="text-sm text-[#A0A0B0]">Tot ce trebuie să știi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/[0.03] rounded-xl p-5 border border-white/10 hover:border-[#D4AF37]/30 transition-colors">
              <p className="font-bold mb-2 text-[#D4AF37] text-sm flex items-center gap-2">
                <span>❓</span> Cât durează procesarea?
              </p>
              <p className="text-xs text-[#A0A0B0]">
                Maximum 24 de ore de la confirmarea plății.
              </p>
            </div>

            <div className="bg-white/[0.03] rounded-xl p-5 border border-white/10 hover:border-[#D4AF37]/30 transition-colors">
              <p className="font-bold mb-2 text-[#D4AF37] text-sm flex items-center gap-2">
                <span>❓</span> Pot schimba tier-ul?
              </p>
              <p className="text-xs text-[#A0A0B0]">
                Da! La următoarea plată poți alege alt tier.
              </p>
            </div>

            <div className="bg-white/[0.03] rounded-xl p-5 border border-white/10 hover:border-[#D4AF37]/30 transition-colors">
              <p className="font-bold mb-2 text-[#D4AF37] text-sm flex items-center gap-2">
                <span>❓</span> Pot modifica poza/motto-ul?
              </p>
              <p className="text-xs text-[#A0A0B0]">
                Da, gratuit o dată pe lună. Trimite pe email.
              </p>
            </div>

            <div className="bg-white/[0.03] rounded-xl p-5 border border-white/10 hover:border-[#D4AF37]/30 transition-colors">
              <p className="font-bold mb-2 text-[#D4AF37] text-sm flex items-center gap-2">
                <span>❓</span> Cum anulez abonamentul?
              </p>
              <p className="text-xs text-[#A0A0B0]">
                Nu mai plăti. După 7 zile vei fi șters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
