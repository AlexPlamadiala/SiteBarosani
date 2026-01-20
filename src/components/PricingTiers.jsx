import { useNavigate } from 'react-router-dom';

export default function PricingTiers() {
  const navigate = useNavigate();

  const handleSelectTier = (tierName) => {
    // Navigate with tier param, which will auto-select the tier in the form
    navigate(`/cum-devin-barosan?tier=${tierName.toLowerCase()}`, { replace: true });

    // Scroll to form section
    setTimeout(() => {
      const formElement = document.querySelector('form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };
  const tiers = [
    {
      name: 'BASIC',
      price: '20 RON',
      icon: '⭐',
      gradient: 'from-gray-400 to-gray-500',
      borderColor: 'border-gray-300',
      features: [
        'Apariție în Registrul Oficial',
        'Certificat digital descărcabil',
        'Nume și motto personalizat',
        'Card în grid-ul principal'
      ],
      popular: false
    },
    {
      name: 'GOLD',
      price: '50 RON',
      icon: '🏆',
      gradient: 'from-[#D4AF37] to-[#FFD700]',
      borderColor: 'border-[#D4AF37]',
      features: [
        'Toate beneficiile BASIC',
        'Border auriu pe card',
        'Prioritate în grid (apar mai sus)',
        'Badge Gold pe certificat',
        'Suport premium'
      ],
      popular: true
    },
    {
      name: 'PLATINUM',
      price: '100 RON',
      icon: '💎',
      gradient: 'from-[#E5E4E2] to-[#BCC6CC]',
      borderColor: 'border-[#BCC6CC]',
      features: [
        'Toate beneficiile GOLD',
        'Card mai mare cu efect glow',
        'Link personal pe card (Instagram/TikTok)',
        'Certificat Platinum exclusiv',
        'Poziționare top în registru',
        'Badge animat pe certificat'
      ],
      popular: false
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className={`group relative ${tier.popular ? 'md:scale-105' : ''}`}
        >
          {/* Glow Effect */}
          <div className={`absolute inset-0 bg-gradient-to-r ${tier.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity`}></div>

          <div className={`relative bg-white rounded-2xl shadow-xl overflow-hidden border-2 ${tier.borderColor} hover:scale-105 transition-all`}>
            {/* Popular Badge */}
            {tier.popular && (
              <div className="absolute top-0 right-0 z-10">
                <div className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1a365d] px-4 py-2 rounded-bl-2xl font-bold text-xs uppercase shadow-lg">
                  ⭐ CEL MAI POPULAR
                </div>
              </div>
            )}

            {/* Header */}
            <div className={`bg-gradient-to-br ${tier.gradient} text-white p-6 text-center`}>
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

              <button
                onClick={() => handleSelectTier(tier.name)}
                className={`w-full text-center bg-gradient-to-r ${tier.gradient} text-white px-6 py-3 rounded-xl font-bold text-base hover:scale-105 transition-transform shadow-lg`}
              >
                Devino Barosan {tier.name} 🚀
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
