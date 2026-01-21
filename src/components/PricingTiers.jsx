import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PricingTiers() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get initial tier from URL
  const initialTier = ['basic', 'gold', 'platinum', 'suprem'].includes(searchParams.get('tier'))
    ? searchParams.get('tier')
    : null;

  const [selectedTier, setSelectedTier] = useState(initialTier);
  const [supremHours, setSupremHours] = useState(parseInt(searchParams.get('hours')) || 1);
  const [inputValue, setInputValue] = useState((parseInt(searchParams.get('hours')) || 1).toString());
  const BASE_PRICE_PER_HOUR = 50;

  // Sync inputValue when supremHours changes from slider or presets
  useEffect(() => {
    setInputValue(supremHours.toString());
  }, [supremHours]);

  // Update tier when URL changes
  useEffect(() => {
    const tierParam = searchParams.get('tier');
    if (tierParam && ['basic', 'gold', 'platinum', 'suprem'].includes(tierParam)) {
      setSelectedTier(tierParam);
    }
  }, [searchParams]);

  // Calculate price with discounts
  const supremPricing = useMemo(() => {
    const hours = supremHours;
    let totalPrice = hours * BASE_PRICE_PER_HOUR;
    let discount = 0;
    let discountLabel = '';

    if (hours >= 24) {
      discount = 20;
      discountLabel = '-20%';
    } else if (hours >= 12) {
      discount = 10;
      discountLabel = '-10%';
    }

    const discountedPrice = Math.round(totalPrice * (1 - discount / 100));
    const savings = totalPrice - discountedPrice;

    return {
      originalPrice: totalPrice,
      finalPrice: discountedPrice,
      discount,
      discountLabel,
      savings,
      pricePerHour: Math.round(discountedPrice / hours)
    };
  }, [supremHours]);

  const handleSelectTier = (tier) => {
    setSelectedTier(tier);
    // Update URL
    const params = new URLSearchParams(searchParams);
    params.set('tier', tier);
    navigate(`/cum-devin-barosan?${params.toString()}`, { replace: true });
  };

  const handleInputChange = (value) => {
    // Always update the input display value
    setInputValue(value);

    // Only update supremHours if valid
    if (value === '') return;

    const hours = parseInt(value);
    if (!isNaN(hours) && hours >= 1 && hours <= 168) {
      setSupremHours(hours);
    }
  };

  const handleInputBlur = () => {
    // On blur, ensure we have a valid value
    const hours = parseInt(inputValue);
    if (isNaN(hours) || hours < 1) {
      setSupremHours(1);
      setInputValue('1');
    } else if (hours > 168) {
      setSupremHours(168);
      setInputValue('168');
    }
  };

  const scrollToForm = (tier, hours = null) => {
    // Update URL with tier and hours
    const params = new URLSearchParams();
    params.set('tier', tier);
    if (hours) params.set('hours', hours.toString());
    navigate(`/cum-devin-barosan?${params.toString()}`, { replace: true });

    // Scroll to the application form section
    setTimeout(() => {
      const formSection = document.getElementById('application-form');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const tiers = [
    { id: 'suprem', name: 'SUPREM', icon: '👑', price: 'de la 50 RON/h', color: 'from-purple-500 to-pink-500', borderColor: 'border-purple-500' },
    { id: 'platinum', name: 'PLATINUM', icon: '💎', price: '100 RON', color: 'from-[#E5E4E2] to-[#BCC6CC]', borderColor: 'border-gray-300', textDark: true },
    { id: 'gold', name: 'GOLD', icon: '🏆', price: '50 RON', color: 'from-[#D4AF37] to-[#FFD700]', borderColor: 'border-yellow-500', textDark: true },
    { id: 'basic', name: 'BASIC', icon: '⭐', price: '20 RON', color: 'from-gray-500 to-gray-600', borderColor: 'border-gray-400' }
  ];

  const hourPresets = [1, 6, 12, 24, 48];

  return (
    <div className="space-y-6">
      {/* Tier Selection Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tiers.map((tier) => (
          <button
            key={tier.id}
            onClick={() => handleSelectTier(tier.id)}
            className={`relative p-4 rounded-2xl border-2 transition-all ${
              selectedTier === tier.id
                ? `${tier.borderColor} bg-gradient-to-br ${tier.color} scale-105 shadow-lg`
                : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
            }`}
          >
            {selectedTier === tier.id && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
            <div className="text-3xl mb-2">{tier.icon}</div>
            <div className={`font-bold text-sm ${selectedTier === tier.id && tier.textDark ? 'text-[#1a365d]' : 'text-white'}`}>
              {tier.name}
            </div>
            <div className={`text-xs mt-1 ${selectedTier === tier.id && tier.textDark ? 'text-[#1a365d]/70' : 'text-white/60'}`}>
              {tier.price}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Tier Details */}
      {selectedTier && (
        <div className="mt-8">
          {/* SUPREM Details */}
          {selectedTier === 'suprem' && (
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-lg opacity-30"></div>
              <div className="relative bg-[#111] rounded-2xl p-6 border border-purple-500/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-2xl">👑</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Barosanul Suprem</h3>
                    <p className="text-purple-300/80 text-sm">Pagină dedicată exclusivă</p>
                  </div>
                </div>

                {/* Hour Selection */}
                <div className="mb-6">
                  <label className="text-white/80 text-sm font-medium mb-3 block">Alege numărul de ore:</label>

                  {/* Preset buttons */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hourPresets.map((hours) => (
                      <button
                        key={hours}
                        onClick={() => setSupremHours(hours)}
                        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                          supremHours === hours
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {hours}h
                        {hours >= 24 && <span className="ml-1 text-xs text-green-400">-20%</span>}
                        {hours >= 12 && hours < 24 && <span className="ml-1 text-xs text-green-400">-10%</span>}
                      </button>
                    ))}
                  </div>

                  {/* Custom hours input - synced with slider */}
                  <div className="mt-4 p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
                    <label className="text-purple-200 text-sm font-semibold mb-2 block">
                      Sau introdu numărul exact de ore:
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        max="168"
                        placeholder="ex: 33"
                        value={inputValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onBlur={handleInputBlur}
                        className="w-32 px-4 py-3 rounded-xl bg-white/10 border-2 border-purple-400/50 text-white text-xl font-bold text-center placeholder-white/30 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                      />
                      <span className="text-white/70 font-semibold">ore</span>
                      {supremHours >= 12 && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-lg">
                          {supremHours >= 24 ? '-20%' : '-10%'} DISCOUNT
                        </span>
                      )}
                    </div>
                    <p className="text-purple-300/50 text-xs mt-2">Minim 1 oră, maxim 168 ore (1 săptămână)</p>
                  </div>

                  {/* Slider - synced with input */}
                  <input
                    type="range"
                    min="1"
                    max="72"
                    value={Math.min(supremHours, 72)}
                    onChange={(e) => setSupremHours(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    style={{
                      background: `linear-gradient(to right, #a855f7 0%, #ec4899 ${(Math.min(supremHours, 72) / 72) * 100}%, rgba(255,255,255,0.1) ${(Math.min(supremHours, 72) / 72) * 100}%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-white/40 mt-1">
                    <span>1h</span>
                    <span>12h (-10%)</span>
                    <span>24h (-20%)</span>
                    <span>72h+</span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="bg-white/5 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white/60 text-sm mb-1">
                        {supremHours} {supremHours === 1 ? 'oră' : 'ore'} de Suprem
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                          {supremPricing.finalPrice} RON
                        </span>
                        {supremPricing.discount > 0 && (
                          <span className="text-white/40 line-through text-lg">
                            {supremPricing.originalPrice} RON
                          </span>
                        )}
                      </div>
                      {supremPricing.discount > 0 && (
                        <div className="text-green-400 text-sm mt-1">
                          Economisești {supremPricing.savings} RON ({supremPricing.discountLabel})
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-white/60 text-xs">Preț/oră</div>
                      <div className="text-xl font-bold text-white">{supremPricing.pricePerHour} RON</div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {['Pagină dedicată', 'Efecte speciale', 'Badge animat', 'Link personal', 'Top registru', 'Suport VIP'].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-white/70 text-sm">
                      <span className="text-purple-400">✓</span> {f}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => scrollToForm('suprem', supremHours)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:scale-[1.02] transition-all"
                >
                  Continuă cu {supremHours}h 👑
                </button>
              </div>
            </div>
          )}

          {/* PLATINUM Details */}
          {selectedTier === 'platinum' && (
            <div className="bg-[#111] rounded-2xl p-6 border border-gray-300/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E5E4E2] to-[#BCC6CC] flex items-center justify-center">
                  <span className="text-2xl">💎</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Platinum</h3>
                  <p className="text-gray-400 text-sm">Card premium cu link personal</p>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-3xl font-black text-gray-300">100 RON</div>
                  <div className="text-xs text-gray-500">pe lună</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {['Toate beneficiile Gold', 'Card mare cu glow', 'Link personal', 'Certificat exclusiv', 'Top în registru', 'Badge animat'].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/70 text-sm">
                    <span className="text-gray-400">✓</span> {f}
                  </div>
                ))}
              </div>
              <button onClick={() => scrollToForm('platinum')} className="w-full bg-gradient-to-r from-[#E5E4E2] to-[#BCC6CC] text-[#1a365d] py-3 rounded-xl font-bold hover:scale-[1.02] transition-all">
                Continuă cu Platinum 💎
              </button>
            </div>
          )}

          {/* GOLD Details */}
          {selectedTier === 'gold' && (
            <div className="bg-[#111] rounded-2xl p-6 border border-yellow-500/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#FFD700] flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Gold</h3>
                  <p className="text-yellow-500/70 text-sm">Cel mai popular pachet</p>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-3xl font-black text-yellow-400">50 RON</div>
                  <div className="text-xs text-gray-500">pe lună</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {['Toate beneficiile Basic', 'Border auriu', 'Prioritate în grid', 'Badge Gold', 'Suport premium'].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/70 text-sm">
                    <span className="text-yellow-500">✓</span> {f}
                  </div>
                ))}
              </div>
              <button onClick={() => scrollToForm('gold')} className="w-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1a365d] py-3 rounded-xl font-bold hover:scale-[1.02] transition-all">
                Continuă cu Gold 🏆
              </button>
            </div>
          )}

          {/* BASIC Details */}
          {selectedTier === 'basic' && (
            <div className="bg-[#111] rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Basic</h3>
                  <p className="text-gray-400 text-sm">Începe ca barosan oficial</p>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-3xl font-black text-gray-400">20 RON</div>
                  <div className="text-xs text-gray-500">pe lună</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {['În Registrul Oficial', 'Certificat digital', 'Nume personalizat', 'Motto personal'].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/70 text-sm">
                    <span className="text-gray-500">✓</span> {f}
                  </div>
                ))}
              </div>
              <button onClick={() => scrollToForm('basic')} className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-xl font-bold hover:scale-[1.02] transition-all">
                Continuă cu Basic ⭐
              </button>
            </div>
          )}
        </div>
      )}

      {/* No tier selected - prompt */}
      {!selectedTier && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">👆</div>
          <p className="text-white/60">Selectează un pachet de mai sus pentru a continua</p>
        </div>
      )}
    </div>
  );
}
