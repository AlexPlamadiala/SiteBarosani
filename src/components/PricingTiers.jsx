export default function PricingTiers() {
  const tiers = [
    {
      name: 'STANDARD',
      price: '20 RON',
      icon: '🛡️',
      gradient: 'from-[#4B5563] to-[#9CA3AF]',
      borderColor: 'border-[#9CA3AF]',
      features: [
        'Apariție în Registrul Oficial',
        'Certificat digital descărcabil',
        'Nume și motto personalizat',
        'Card în grid-ul principal'
      ],
      popular: false
    },
    {
      name: 'PREMIUM',
      price: '50 RON',
      icon: '🥉',
      gradient: 'from-[#7A3E12] via-[#CD7F32] to-[#F2C28F]',
      borderColor: 'border-[#CD7F32]',
      features: [
        'Toate beneficiile STANDARD',
        'Border bronz pe card',
        'Prioritate în grid',
        'Badge Premium pe certificat',
        'Suport dedicat'
      ],
      popular: false
    },
    {
      name: 'ELITE',
      price: '100 RON',
      icon: '💎',
      gradient: 'from-[#8F98A3] via-[#E5E7EB] to-[#FFFFFF]',
      borderColor: 'border-[#E5E7EB]',
      textDark: true,
      features: [
        'Toate beneficiile PREMIUM',
        'Card mai mare cu efect glow',
        'Link personal pe card (Instagram/TikTok)',
        'Certificat Elite exclusiv',
        'Poziționare prioritară în registru'
      ],
      popular: true
    },
    {
      name: 'SUPREME',
      price: '200 RON',
      icon: '👑',
      gradient: 'from-[#2A0A4A] via-[#D4AF37] to-[#FFF2B2]',
      borderColor: 'border-[#D4AF37]',
      features: [
        'Toate beneficiile ELITE',
        'Card cel mai mare cu glow intens',
        'Poziționare TOP în registru',
        'Certificat Supreme cu design exclusiv',
        'Badge animat pe certificat',
        'Link personal + badge special'
      ],
      popular: false
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className={`group relative ${tier.popular ? 'sm:scale-105 z-10' : ''}`}
        >
          {/* Glow Effect */}
          <div className={`absolute inset-0 bg-gradient-to-r ${tier.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity`}></div>

          <div className={`relative bg-white rounded-2xl shadow-xl overflow-hidden border-2 ${tier.borderColor} hover:scale-105 transition-all`}>
            {/* Popular Badge */}
            {tier.popular && (
              <div className="absolute top-0 right-0 z-10">
                <div className="bg-gradient-to-r from-[#7AA2FF] to-[#E5E7EB] text-[#0B1220] px-4 py-2 rounded-bl-2xl font-bold text-xs uppercase shadow-lg">
                  💎 CEL MAI POPULAR
                </div>
              </div>
            )}

            {/* Header */}
            <div className={`bg-gradient-to-br ${tier.gradient} ${tier.textDark ? 'text-[#0B1220]' : 'text-white'} p-6 text-center`}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3 shadow-lg">
                <span className="text-4xl">{tier.icon}</span>
              </div>
              <h3 className="text-2xl font-extrabold mb-2">{tier.name}</h3>
              <div className="text-5xl font-extrabold">{tier.price}</div>
              <div className="text-xs opacity-90 mt-1">pe lună</div>
            </div>

            {/* Features */}
            <div className="p-6">
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r ${tier.gradient} flex items-center justify-center mr-2 mt-0.5`}>
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/cum-devin-barosan"
                className={`block text-center bg-gradient-to-r ${tier.gradient} ${tier.textDark ? 'text-[#0B1220]' : 'text-white'} px-6 py-3 rounded-xl font-bold text-base hover:scale-105 transition-transform shadow-lg`}
              >
                Devino {tier.name} 🚀
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
