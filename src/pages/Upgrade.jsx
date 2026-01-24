import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { UPGRADE_URL } from '../config/api';

export default function Upgrade() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [step, setStep] = useState(token ? 'verifying' : 'email'); // 'email', 'verifying', 'verified', 'select_tier'
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [barosan, setBarosan] = useState(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [devLink, setDevLink] = useState('');

  // Verify token on mount if present
  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  const verifyToken = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${UPGRADE_URL}?action=verify&token=${token}`);
      const data = await response.json();

      if (data.success && data.valid) {
        setBarosan(data.barosan);
        setStep('select_tier');
      } else {
        setError(data.error || 'Token invalid sau expirat');
        setStep('email');
      }
    } catch (err) {
      setError('Eroare la verificare. Încearcă din nou.');
      setStep('email');
    } finally {
      setLoading(false);
    }
  };

  const checkEmail = async () => {
    if (!email || !email.includes('@')) {
      setError('Introdu un email valid');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${UPGRADE_URL}?action=check&email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (data.success) {
        if (data.exists) {
          setBarosan(data.barosan);
          // Send verification email
          await sendVerificationEmail();
        } else {
          setError('Nu există niciun barosan cu acest email. Dorești să te înscrii?');
        }
      } else {
        setError(data.error || 'Eroare la verificare');
      }
    } catch (err) {
      setError('Eroare de conexiune. Încearcă din nou.');
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(UPGRADE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_verification',
          email: email
        })
      });

      const data = await response.json();

      if (data.success) {
        setVerificationSent(true);
        setSuccess('Email de verificare trimis! Verifică inbox-ul.');
        // For development, show the link directly
        if (data.dev_link) {
          setDevLink(data.dev_link);
        }
      } else {
        setError(data.error || 'Eroare la trimiterea email-ului');
      }
    } catch (err) {
      setError('Eroare de conexiune');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTier = (tier) => {
    // Navigate to application form with upgrade params
    navigate(`/cum-devin-barosan?tier=${tier}&upgrade=true&email=${barosan.email}&barosanId=${barosan.id}&currentTier=${barosan.tier}`);
  };

  const tierPrices = {
    basic: 0,
    gold: 49,
    platinum: 149
  };

  const getUpgradePrice = (newTier) => {
    const currentPrice = tierPrices[barosan?.tier] || 0;
    const newPrice = tierPrices[newTier] || 0;
    return Math.max(0, newPrice - currentPrice);
  };

  const tierOrder = { basic: 1, gold: 2, platinum: 3, suprem: 4 };
  const canUpgradeTo = (tier) => {
    if (!barosan) return false;
    return tierOrder[tier] > tierOrder[barosan.tier];
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="container mx-auto max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
            <span className="text-4xl">⬆️</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Upgrade Tier</h1>
          <p className="text-white/60">Treci la un nivel superior și bucură-te de mai multe beneficii</p>
        </div>

        {/* Loading State */}
        {loading && step === 'verifying' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <div className="text-4xl animate-bounce mb-4">🔐</div>
            <p className="text-white/80">Se verifică token-ul...</p>
          </div>
        )}

        {/* Email Input Step */}
        {step === 'email' && !verificationSent && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Verifică emailul</h2>
            <p className="text-white/60 text-sm mb-6">
              Introdu emailul cu care te-ai înregistrat pentru a face upgrade la tier.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplu.ro"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm">
                  {error}
                  {error.includes('înscrii') && (
                    <Link to="/cum-devin-barosan" className="block mt-2 text-purple-300 hover:text-purple-200 font-semibold">
                      → Înscrie-te acum
                    </Link>
                  )}
                </div>
              )}

              <button
                onClick={checkEmail}
                disabled={loading || !email}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? 'Se verifică...' : 'Continuă'}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-white/50 text-sm">Nu ai cont încă?</p>
              <Link to="/cum-devin-barosan" className="text-purple-400 hover:text-purple-300 font-semibold">
                Înscrie-te acum →
              </Link>
            </div>
          </div>
        )}

        {/* Verification Sent */}
        {verificationSent && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-xl font-bold text-white mb-2">Verifică emailul</h2>
            <p className="text-white/60 mb-4">
              Am trimis un link de verificare la <span className="text-purple-400 font-semibold">{email}</span>
            </p>
            <p className="text-white/50 text-sm mb-6">
              Click pe link din email pentru a continua cu upgrade-ul. Link-ul expiră în 1 oră.
            </p>

            {/* Dev mode link */}
            {devLink && (
              <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 mb-4">
                <p className="text-yellow-200 text-sm font-semibold mb-2">🔧 Development Mode</p>
                <a
                  href={devLink}
                  className="text-purple-400 hover:text-purple-300 text-sm break-all"
                >
                  {devLink}
                </a>
              </div>
            )}

            <button
              onClick={() => {
                setVerificationSent(false);
                setEmail('');
                setBarosan(null);
              }}
              className="text-white/60 hover:text-white text-sm"
            >
              ← Întoarce-te și folosește alt email
            </button>
          </div>
        )}

        {/* Select Tier Step */}
        {step === 'select_tier' && barosan && (
          <div className="space-y-6">
            {/* Current Status */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-4">
                {barosan.poza ? (
                  <img src={barosan.poza} alt={barosan.nume} className="w-16 h-16 rounded-full object-cover border-2 border-purple-500" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                    👤
                  </div>
                )}
                <div>
                  <h3 className="text-white font-bold text-lg">{barosan.nume}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-sm">Tier actual:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      barosan.tier === 'platinum' ? 'bg-gray-300 text-gray-800' :
                      barosan.tier === 'gold' ? 'bg-yellow-500 text-yellow-900' :
                      'bg-gray-500 text-white'
                    }`}>
                      {barosan.tier.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade Options */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Alege noul tier</h2>

              {/* Platinum */}
              {canUpgradeTo('platinum') && (
                <button
                  onClick={() => handleSelectTier('platinum')}
                  className="w-full bg-gradient-to-r from-gray-200 to-gray-400 rounded-2xl p-5 text-left hover:scale-[1.02] transition-transform group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">💎</span>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">PLATINUM</h3>
                        <p className="text-gray-600 text-sm">Link social + Prioritate afișare</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-gray-800 text-xl">{getUpgradePrice('platinum')} RON</div>
                      <div className="text-gray-600 text-xs">diferență</div>
                    </div>
                  </div>
                </button>
              )}

              {/* Gold */}
              {canUpgradeTo('gold') && (
                <button
                  onClick={() => handleSelectTier('gold')}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-5 text-left hover:scale-[1.02] transition-transform group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🏆</span>
                      <div>
                        <h3 className="font-bold text-yellow-900 text-lg">GOLD</h3>
                        <p className="text-yellow-800 text-sm">Badge special + Certificat gold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-yellow-900 text-xl">{getUpgradePrice('gold')} RON</div>
                      <div className="text-yellow-800 text-xs">diferență</div>
                    </div>
                  </div>
                </button>
              )}

              {/* Suprem - Special */}
              <Link
                to="/barosanul-suprem"
                className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-5 text-left hover:scale-[1.02] transition-transform group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">👑</span>
                    <div>
                      <h3 className="font-bold text-white text-lg">SUPREM</h3>
                      <p className="text-white/80 text-sm">Titlul suprem temporar!</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-white text-xl">De la 50 RON</div>
                    <div className="text-white/80 text-xs">per oră</div>
                  </div>
                </div>
              </Link>

              {barosan.tier === 'platinum' && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-center">
                  <p className="text-green-200">
                    🎉 Ești deja la nivelul maxim permanent! Poți încerca doar <strong>SUPREM</strong> pentru titlul temporar.
                  </p>
                </div>
              )}
            </div>

            <div className="text-center">
              <Link to="/zid" className="text-white/50 hover:text-white text-sm">
                ← Înapoi la Zid
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
