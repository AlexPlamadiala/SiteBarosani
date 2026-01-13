import { useState } from 'react';

export default function PricingTiers() {
  const [showModal, setShowModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);

  const tiers = [
    {
      name: 'BASIC',
      price: '20 RON',
      icon: '⭐',
      features: [
        'Apariție pe Zidul Barosanilor',
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
      features: [
        'Toate beneficiile GOLD',
        'Card mai mare cu efect glow',
        'Link personal pe card (Instagram/TikTok)',
        'Certificat Platinum exclusiv',
        'Poziționare top pe zid',
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
            className={`relative bg-white rounded-xl shadow-lg overflow-hidden border-2 ${
              tier.popular
                ? 'border-[#D4AF37] transform scale-105'
                : 'border-gray-200'
            }`}
          >
            {/* Popular Badge */}
            {tier.popular && (
              <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#1a365d] px-4 py-1 rounded-bl-lg font-bold text-sm">
                CEL MAI POPULAR
              </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-br from-[#1a365d] to-[#2d5986] text-white p-8 text-center">
              <div className="text-5xl mb-4">{tier.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <div className="text-4xl font-bold">{tier.price}</div>
              <div className="text-sm opacity-75 mt-1">pe lună</div>
            </div>

            {/* Features */}
            <div className="p-8">
              <ul className="space-y-4">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleButtonClick(tier.name)}
                className={`w-full mt-8 py-3 rounded-lg font-bold transition-all ${
                  tier.popular
                    ? 'bg-[#D4AF37] text-[#1a365d] hover:bg-[#c19b2e]'
                    : 'bg-[#1a365d] text-white hover:bg-[#2d5986]'
                }`}
              >
                Devino Barosan {tier.name}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Instructions Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1a365d]">
                  Instrucțiuni Plată - {selectedTier}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 text-gray-700">
                <div className="bg-[#D4AF37] bg-opacity-10 border-l-4 border-[#D4AF37] p-4">
                  <p className="font-semibold">
                    Trimite {tiers.find(t => t.name === selectedTier)?.price} prin Revolut la:
                  </p>
                  <p className="text-xl font-bold mt-2">@username-revolut</p>
                </div>

                <div>
                  <h3 className="font-bold mb-2">📝 În mesajul plății, include:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Numele/Porecla (cum vrei să apari pe Zid)</li>
                    <li>Tier-ul ales: {selectedTier}</li>
                    <li>Email-ul tău</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold mb-2">📸 Trimite poza ta pe email:</h3>
                  <p className="ml-4">Email: <span className="font-semibold">contact@zidulbarosanilor.ro</span></p>
                  <p className="ml-4">Subiect: "Vreau să fiu barosan - [Numele tău]"</p>
                  <ul className="list-disc list-inside space-y-1 ml-8 mt-2">
                    <li>Format: JPG/PNG, minim 400x400px</li>
                    <li>Include motto-ul personal (max 50 caractere)</li>
                    {selectedTier === 'PLATINUM' && (
                      <li>Include link-ul dorit (Instagram/TikTok)</li>
                    )}
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <p className="font-semibold">✅ În maxim 24h:</p>
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>Vei apărea pe Zidul Barosanilor</li>
                    <li>Vei primi certificatul pe email</li>
                  </ul>
                </div>

                <div className="text-sm text-gray-500 border-t pt-4">
                  <p><strong>Important:</strong> Plata e lunară. Pentru reînnoire, retrimite plata în aceeași zi a lunii.</p>
                  <p className="mt-2">Pentru anulare, pur și simplu nu mai plăti - vei fi șters după 7 zile de grație.</p>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-full mt-6 bg-[#1a365d] text-white py-3 rounded-lg font-bold hover:bg-[#2d5986] transition-colors"
              >
                Am înțeles
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
