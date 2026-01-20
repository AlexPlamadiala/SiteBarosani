import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PricingTiers() {
  const navigate = useNavigate();
  const [supremHours, setSupremHours] = useState(1);
  const BASE_PRICE_PER_HOUR = 50; // 50 RON per hour base price

  // Calculate price with discounts
  const supremPricing = useMemo(() => {
    let totalPrice = supremHours * BASE_PRICE_PER_HOUR;
    let discount = 0;
    let discountLabel = '';

    if (supremHours >= 24) {
      discount = 20;
      discountLabel = '20% discount';
    } else if (supremHours >= 12) {
      discount = 10;
      discountLabel = '10% discount';
    }

    const discountedPrice = Math.round(totalPrice * (1 - discount / 100));
    const savings = totalPrice - discountedPrice;

    return {
      originalPrice: totalPrice,
      finalPrice: discountedPrice,
      discount,
      discountLabel,
      savings,
      pricePerHour: Math.round(discountedPrice / supremHours)
    };
  }, [supremHours]);

  const handleSelectTier = (tierName, hours = null) => {
    const params = new URLSearchParams();
    params.set('tier', tierName.toLowerCase());
    if (hours) params.set('hours', hours);

    navigate(`/cum-devin-barosan?${params.toString()}`, { replace: true });

    setTimeout(() => {
      const formElement = document.querySelector('form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const hourPresets = [1, 6, 12, 24, 48];

  return (
    <div className="space-y-8">
      {/* Suprem Tier - Featured */}
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>

        <div className="relative bg-[#0a0a0a] rounded-3xl overflow-hidden border border-purple-500/50">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-6 border-b border-purple-500/30">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <span className="text-4xl">👑</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">BAROSANUL SUPREM</h3>
                  <p className="text-purple-300/80 text-sm">Prima pagină dedicată + efecte speciale</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full">
                <span className="text-white font-bold text-sm">EXCLUSIV</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Hour Selector */}
            <div>
              <label className="text-white/80 text-sm font-medium mb-3 block">Alege numărul de ore:</label>

              {/* Preset buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                {hourPresets.map((hours) => (
                  <button
                    key={hours}
                    onClick={() => setSupremHours(hours)}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                      supremHours === hours
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {hours}h
                    {hours >= 24 && <span className="ml-1 text-xs text-green-400">-20%</span>}
                    {hours >= 12 && hours < 24 && <span className="ml-1 text-xs text-green-400">-10%</span>}
                  </button>
                ))}
              </div>

              {/* Slider */}
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="72"
                  value={supremHours}
                  onChange={(e) => setSupremHours(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  style={{
                    background: `linear-gradient(to right, #a855f7 0%, #ec4899 ${(supremHours / 72) * 100}%, rgba(255,255,255,0.1) ${(supremHours / 72) * 100}%)`
                  }}
                />
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>1h</span>
                  <span>12h (-10%)</span>
                  <span>24h (-20%)</span>
                  <span>72h</span>
                </div>
              </div>
            </div>

            {/* Price Display */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="text-white/60 text-sm mb-1">
                    {supremHours} {supremHours === 1 ? 'oră' : 'ore'} de Barosan Suprem
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      {supremPricing.finalPrice} RON
                    </span>
                    {supremPricing.discount > 0 && (
                      <span className="text-white/40 line-through text-lg">
                        {supremPricing.originalPrice} RON
                      </span>
                    )}
                  </div>
                  {supremPricing.discount > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs font-bold">
                        {supremPricing.discountLabel}
                      </span>
                      <span className="text-green-400 text-sm">
                        Economisești {supremPricing.savings} RON
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-white/60 text-xs">Preț per oră</div>
                  <div className="text-2xl font-bold text-white">
                    {supremPricing.pricePerHour} RON/h
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Pagină dedicată exclusivă',
                'Efecte vizuale speciale',
                'Badge animat pe certificat',
                'Link personal pe card',
                'Prioritate maximă în registru',
                'Suport VIP instant'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-white/80 text-sm">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  {feature}
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => handleSelectTier('suprem', supremHours)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-all shadow-lg shadow-purple-500/30"
            >
              Devino Barosanul Suprem pentru {supremHours}h 👑
            </button>
          </div>
        </div>
      </div>

      {/* Other Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Platinum */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
          <div className="relative bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/10 hover:border-gray-400/30 transition-all h-full flex flex-col">
            <div className="bg-gradient-to-br from-[#E5E4E2] to-[#BCC6CC] p-5 text-center">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="text-xl font-black text-[#1a365d]">PLATINUM</h3>
              <div className="text-3xl font-black text-[#1a365d] mt-2">100 RON</div>
              <div className="text-xs text-[#1a365d]/70">pe lună</div>
            </div>
            <div className="p-5 flex-grow flex flex-col">
              <ul className="space-y-2 mb-4 flex-grow">
                {['Toate beneficiile GOLD', 'Card mare cu efect glow', 'Link personal pe card', 'Certificat exclusiv', 'Top în registru'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-white/70 text-sm">
                    <span className="text-gray-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelectTier('platinum')}
                className="w-full bg-gradient-to-r from-[#E5E4E2] to-[#BCC6CC] text-[#1a365d] py-3 rounded-xl font-bold hover:scale-105 transition-all"
              >
                Devino Platinum 💎
              </button>
            </div>
          </div>
        </div>

        {/* Gold */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
          <div className="relative bg-[#0a0a0a] rounded-2xl overflow-hidden border border-yellow-500/30 hover:border-yellow-400/50 transition-all h-full flex flex-col">
            {/* Popular badge */}
            <div className="absolute top-0 right-0 z-10">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#1a365d] px-3 py-1 rounded-bl-xl font-bold text-xs">
                POPULAR
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#D4AF37] to-[#FFD700] p-5 text-center">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-xl font-black text-[#1a365d]">GOLD</h3>
              <div className="text-3xl font-black text-[#1a365d] mt-2">50 RON</div>
              <div className="text-xs text-[#1a365d]/70">pe lună</div>
            </div>
            <div className="p-5 flex-grow flex flex-col">
              <ul className="space-y-2 mb-4 flex-grow">
                {['Toate beneficiile BASIC', 'Border auriu pe card', 'Prioritate în grid', 'Badge Gold pe certificat', 'Suport premium'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-white/70 text-sm">
                    <span className="text-yellow-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelectTier('gold')}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1a365d] py-3 rounded-xl font-bold hover:scale-105 transition-all"
              >
                Devino Gold 🏆
              </button>
            </div>
          </div>
        </div>

        {/* Basic */}
        <div className="group relative">
          <div className="relative bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all h-full flex flex-col">
            <div className="bg-gradient-to-br from-gray-500 to-gray-600 p-5 text-center">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="text-xl font-black text-white">BASIC</h3>
              <div className="text-3xl font-black text-white mt-2">20 RON</div>
              <div className="text-xs text-white/70">pe lună</div>
            </div>
            <div className="p-5 flex-grow flex flex-col">
              <ul className="space-y-2 mb-4 flex-grow">
                {['În Registrul Oficial', 'Certificat digital', 'Nume și motto', 'Card în grid'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-white/70 text-sm">
                    <span className="text-gray-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelectTier('basic')}
                className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-xl font-bold hover:scale-105 transition-all"
              >
                Devino Basic ⭐
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
