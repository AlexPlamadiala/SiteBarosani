import { useState } from 'react';

export default function PricingTiers() {
  const [showModal, setShowModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);

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

  const handleButtonClick = (tierName) => {
    setSelectedTier(tierName);
    setShowModal(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`group relative ${tier.popular ? 'md:scale-105' : ''}`}
          >
            {/* Glow Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${tier.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>

            <div className={`relative bg-white rounded-2xl shadow-2xl overflow-hidden border-2 ${tier.borderColor} hover:scale-105 transition-all duration-300`}>
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute top-0 right-0 z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] rounded-bl-2xl blur opacity-75"></div>
                    <div className="relative bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1a365d] px-4 py-2 rounded-bl-2xl font-extrabold text-xs uppercase tracking-wide shadow-lg">
                      ⭐ CEL MAI POPULAR
                    </div>
                  </div>
                </div>
              )}

              {/* Header */}
              <div className={`bg-gradient-to-br ${tier.gradient} text-white p-8 text-center relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 shadow-xl backdrop-blur-sm">
                    <span className="text-5xl">{tier.icon}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold mb-3 tracking-wide drop-shadow-lg">{tier.name}</h3>
                  <div className="text-5xl md:text-6xl font-extrabold drop-shadow-lg">{tier.price}</div>
                  <div className="text-sm opacity-90 mt-2 font-medium">pe lună</div>
                </div>
              </div>

              {/* Features */}
              <div className="p-6 md:p-8">
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start group/item">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r ${tier.gradient} flex items-center justify-center mr-3 mt-0.5 shadow-md group-hover/item:scale-110 transition-transform`}>
                        <svg
                          className="w-4 h-4 text-white"
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
                      <span className="text-gray-700 text-sm md:text-base leading-relaxed font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleButtonClick(tier.name)}
                  className="group/btn relative w-full overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${tier.gradient} blur opacity-50 group-hover/btn:opacity-75 transition-opacity`}></div>
                  <span className={`relative block bg-gradient-to-r ${tier.gradient} text-white px-6 py-4 rounded-xl font-extrabold text-base md:text-lg hover:scale-105 transition-transform shadow-lg`}>
                    Devino Barosan {tier.name} 🚀
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Instructions Modal - Enhanced */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
            <div className="sticky top-0 bg-gradient-to-r from-[#1a365d] to-[#2d5986] text-white p-6 md:p-8 rounded-t-2xl z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold">
                    Instrucțiuni Plată
                  </h2>
                  <p className="text-sm md:text-base opacity-90 mt-1">
                    Tier: <span className="font-bold text-[#D4AF37]">{selectedTier}</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors backdrop-blur-sm"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {/* Payment Info */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-[#FFF9E6] to-[#FFF5CC] border-l-4 border-[#D4AF37] p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-xl">💳</span>
                    </div>
                    <p className="font-extrabold text-[#1a365d] text-lg">
                      Trimite {tiers.find(t => t.name === selectedTier)?.price} prin Revolut
                    </p>
                  </div>
                  <p className="text-2xl md:text-3xl font-extrabold text-[#1a365d] bg-white px-4 py-2 rounded-lg inline-block shadow-md">
                    @username-revolut
                  </p>
                </div>
              </div>

              {/* Message Content */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">📝</span>
                  <h3 className="font-bold text-[#1a365d] text-lg">În mesajul plății, include:</h3>
                </div>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37]">▸</span>
                    <span className="text-gray-700">Numele/Porecla (cum vrei să apari în Registru)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37]">▸</span>
                    <span className="text-gray-700">Tier-ul ales: <strong>{selectedTier}</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37]">▸</span>
                    <span className="text-gray-700">Email-ul tău</span>
                  </li>
                </ul>
              </div>

              {/* Photo Instructions */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">📸</span>
                  <h3 className="font-bold text-[#1a365d] text-lg">Trimite poza ta pe email:</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <strong>Email:</strong> <span className="font-bold text-blue-600">contact@registrulbarosanilor.ro</span>
                  </p>
                  <p className="text-gray-700">
                    <strong>Subiect:</strong> "Vreau să fiu barosan - [Numele tău]"
                  </p>
                  <ul className="space-y-2 ml-4 mt-3">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">▸</span>
                      <span className="text-gray-700">Format: JPG/PNG, minim 400x400px</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">▸</span>
                      <span className="text-gray-700">Include motto-ul personal (max 50 caractere)</span>
                    </li>
                    {selectedTier === 'PLATINUM' && (
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">▸</span>
                        <span className="text-gray-700 font-semibold">Include link-ul dorit (Instagram/TikTok)</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Success Info */}
              <div className="relative group">
                <div className="absolute inset-0 bg-green-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-green-50 border-l-4 border-green-500 p-6 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">✅</span>
                    <p className="font-bold text-green-800 text-lg">În maxim 24h:</p>
                  </div>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-gray-700">Vei apărea în Registrul Oficial al Barosanilor</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-gray-700">Vei primi certificatul pe email</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Important Note */}
              <div className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="font-semibold text-gray-800 mb-2">⚠️ Important:</p>
                <p>Plata e lunară. Pentru reînnoire, retrimite plata în aceeași zi a lunii.</p>
                <p className="mt-2">Pentru anulare, pur și simplu nu mai plăti - vei fi șters după 7 zile de grație.</p>
              </div>
            </div>

            <div className="sticky bottom-0 p-6 bg-white border-t border-gray-200 rounded-b-2xl">
              <button
                onClick={() => setShowModal(false)}
                className="group relative w-full overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a365d] to-[#2d5986] blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <span className="relative block bg-gradient-to-r from-[#1a365d] to-[#2d5986] text-white py-4 rounded-xl font-extrabold text-lg hover:scale-105 transition-transform shadow-lg">
                  Am înțeles ✓
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
