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
    <div className="relative py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1a365d] to-[#2d5986] mb-3">
            Cum Devii Barosan Oficial
          </h2>
          <p className="text-gray-600 text-base max-w-2xl mx-auto mb-3">
            Procesul este simplu și rapid. Urmează cei 4 pași.
          </p>
          <span className="inline-block bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1a365d] px-5 py-2 rounded-full text-sm font-bold shadow-lg">
            ⚡ Certificare în maxim 24h
          </span>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step) => (
            <div key={step.number} className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-xl blur-lg opacity-0 group-hover:opacity-15 transition-opacity`}></div>

              <div className="relative bg-white rounded-xl shadow-lg p-5 text-center hover:shadow-xl transition-all border border-gray-100">
                {/* Number Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center font-bold text-base text-[#1a365d] shadow-lg">
                    {step.number}
                  </div>
                </div>

                {/* Icon */}
                <div className="mt-6 mb-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center shadow-inner mx-auto">
                    <span className="text-4xl">{step.icon}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#1a365d] mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section - Compact */}
        <div className="bg-gradient-to-br from-[#1a365d] to-[#2d5986] rounded-2xl p-8 text-white shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full mb-3 shadow-lg">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold mb-2">Întrebări Frecvente</h3>
            <p className="text-sm text-gray-300">Tot ce trebuie să știi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
              <p className="font-bold mb-2 text-[#D4AF37] text-sm flex items-center gap-2">
                <span>❓</span> Cât durează procesarea?
              </p>
              <p className="text-xs text-gray-200">
                Maximum 24 de ore de la confirmarea plății.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
              <p className="font-bold mb-2 text-[#D4AF37] text-sm flex items-center gap-2">
                <span>❓</span> Pot schimba tier-ul?
              </p>
              <p className="text-xs text-gray-200">
                Da! La următoarea plată poți alege alt tier.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
              <p className="font-bold mb-2 text-[#D4AF37] text-sm flex items-center gap-2">
                <span>❓</span> Pot modifica poza/motto-ul?
              </p>
              <p className="text-xs text-gray-200">
                Da, gratuit o dată pe lună. Trimite pe email.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
              <p className="font-bold mb-2 text-[#D4AF37] text-sm flex items-center gap-2">
                <span>❓</span> Cum anulez abonamentul?
              </p>
              <p className="text-xs text-gray-200">
                Nu mai plăti. După 7 zile vei fi șters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
