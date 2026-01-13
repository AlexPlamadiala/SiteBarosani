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
      title: 'Apari pe Zid',
      description: 'În maxim 24h vei fi pe Zidul Barosanilor și vei primi certificatul pe email!'
    }
  ];

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-[#1a365d] mb-4">
          Cum Devii Barosan Oficial
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Procesul este simplu și rapid. Urmează cei 4 pași și vei face parte din comunitatea oficială de barosani.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              {/* Connector Line (hidden on mobile, shown on larger screens) */}
              {step.number < 4 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-1 bg-[#D4AF37] opacity-20 z-0" />
              )}

              {/* Step Card */}
              <div className="relative bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow z-10">
                {/* Number Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-[#D4AF37] text-[#1a365d] rounded-full flex items-center justify-center font-bold text-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="text-6xl mb-4 mt-4">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#1a365d] mb-2">
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

        {/* Additional Info */}
        <div className="mt-16 bg-gradient-to-r from-[#1a365d] to-[#2d5986] rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Întrebări Frecvente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
            <div>
              <p className="font-semibold mb-2">❓ Cât durează procesarea?</p>
              <p className="text-sm opacity-90">Maximum 24 de ore de la confirmarea plății și primirea pozei.</p>
            </div>
            <div>
              <p className="font-semibold mb-2">❓ Pot schimba tier-ul?</p>
              <p className="text-sm opacity-90">Da! La următoarea plată lunară poți alege alt tier.</p>
            </div>
            <div>
              <p className="font-semibold mb-2">❓ Pot modifica poza/motto-ul?</p>
              <p className="text-sm opacity-90">Da, trimite pe email noile detalii. Modificări gratuite o dată pe lună.</p>
            </div>
            <div>
              <p className="font-semibold mb-2">❓ Cum anulez abonamentul?</p>
              <p className="text-sm opacity-90">Simplu - nu mai plăti. După 7 zile de grație vei fi șters de pe Zid.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
