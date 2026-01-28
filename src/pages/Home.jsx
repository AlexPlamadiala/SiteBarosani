import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp';
import { useSEO } from '../hooks/useSEO';
import RecentActivity from '../components/RecentActivity';
import { FadeIn, FloatingParticles, StaggerContainer, StaggerItem } from '../components/animations';
import confetti from 'canvas-confetti';
import { BAROSANI_URL, SUPREM_URL, SSE_URL } from '../config/api';

export default function Home() {
  useSEO({
    title: 'Registrul Oficial al Barosanilor',
    description: 'Bun venit in Registrul Oficial al Barosanilor! Alatura-te comunitatii si obtine certificatul tau de barosan verificat.',
    url: '/'
  });

  const [barosani, setBarosani] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sseConnected, setSseConnected] = useState(false);
  const [supremBarosan, setSupremBarosan] = useState(null);
  const [supremAvailable, setSupremAvailable] = useState(true);

  // Confetti effect when page loads
  useEffect(() => {
    const colors = ['#D4AF37', '#FFD700', '#9333ea', '#ec4899'];

    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors
      });
    }, 500);
  }, []);

  useEffect(() => {
    async function fetchBarosani() {
      try {
        const response = await fetch(BAROSANI_URL);
        const data = await response.json();
        if (data.success) {
          setBarosani(data.barosani);
        }
      } catch (err) {
        console.error('Error fetching barosani:', err);
      } finally {
        setLoading(false);
      }
    }

    async function fetchSuprem() {
      try {
        const response = await fetch(SUPREM_URL);
        const data = await response.json();
        if (data.success) {
          setSupremAvailable(data.available);
          setSupremBarosan(data.suprem);
        }
      } catch (err) {
        console.error('Error fetching suprem:', err);
      }
    }

    fetchBarosani();
    fetchSuprem();

    // SSE pentru real-time updates
    let eventSource;
    try {
      eventSource = new EventSource(SSE_URL);

      eventSource.addEventListener('connected', () => {
        setSseConnected(true);
      });

      eventSource.addEventListener('barosani-updated', () => {
        fetchBarosani();
      });

      eventSource.onerror = () => {
        setSseConnected(false);
      };
    } catch (err) {
      console.error('Failed to establish SSE connection:', err);
    }

    const pollInterval = setInterval(() => {
      if (!sseConnected) {
        fetchBarosani();
        fetchSuprem();
      }
    }, 30000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchBarosani();
        fetchSuprem();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sseConnected]);

  // Count tiers - include suprem in total
  const platinumCount = barosani.filter(b => b.tier === 'platinum').length;
  const goldCount = barosani.filter(b => b.tier === 'gold').length;
  const basicCount = barosani.filter(b => b.tier === 'basic').length;
  const supremCount = supremBarosan && !supremAvailable ? 1 : 0;
  const totalBarosani = platinumCount + goldCount + basicCount + supremCount;

  // Combine barosani with suprem for recent activity
  const allBarosaniForActivity = useMemo(() => {
    if (supremBarosan && !supremAvailable) {
      const supremAsBarosan = {
        id: `suprem-${supremBarosan.id}`,
        certificatId: supremBarosan.certificatId || `SUP-${String(supremBarosan.id).padStart(6, '0')}`,
        nume: supremBarosan.nume,
        motto: supremBarosan.motto,
        tier: 'suprem',
        poza: supremBarosan.poza,
        link: supremBarosan.link,
        dataInregistrare: supremBarosan.dataStart
      };
      return [supremAsBarosan, ...barosani];
    }
    return barosani;
  }, [barosani, supremBarosan, supremAvailable]);

  // Animated counters
  const animatedTotal = useCountUp(totalBarosani, 2000);
  const animatedPlatinum = useCountUp(platinumCount, 2000);
  const animatedGold = useCountUp(goldCount, 2000);
  const animatedBasic = useCountUp(basicCount, 2000);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-transparent">
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-7xl mb-4"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              👑
            </motion.div>
            <p className="text-gold-shimmer text-xl font-bold">Se incarca...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Luxury Dark */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50">
          {/* Decorative circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-[#D4AF37]/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-[#9333EA]/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-[#D4AF37]/10 rounded-full"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <FadeIn delay={0}>
              <div className="inline-flex items-center gap-2 glass-gold px-5 py-2.5 rounded-full mb-8">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-[#D4AF37] text-sm font-semibold">{animatedTotal} barosani activi</span>
              </div>
            </FadeIn>

            {/* Main Title - Playfair Display */}
            <FadeIn delay={0.1}>
              <div className="text-[var(--color-text-secondary)] text-sm md:text-base font-semibold tracking-[0.2em] uppercase mb-4">
                Registrul Oficial
              </div>
              <h1 className="mb-8 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                <span className="block text-5xl md:text-7xl lg:text-8xl font-bold text-[var(--color-text-primary)]">AL</span>
                <span className="block text-5xl md:text-7xl lg:text-8xl font-bold text-gradient-gold">BAROSANILOR</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
                Unde statutul devine legendă. Certifică-ți măreția. Oficial.
              </p>
            </FadeIn>

            {/* BAROSANUL SUPREM - FEATURED SECTION - Cosmic Penthouse Style */}
            <FadeIn delay={0.3}>
              {supremBarosan && !supremAvailable ? (
                <Link to="/barosanul-suprem" className="block group mb-12">
                  <motion.div
                    className="relative max-w-2xl mx-auto"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Animated Glow - Purple + Gold */}
                    <motion.div
                      className="absolute -inset-2 bg-[var(--gradient-suprem)] rounded-3xl blur-xl"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    <div className="relative glass-purple rounded-2xl p-6 md:p-8 border-2 border-[var(--purple-primary)]/50 group-hover:border-[var(--gold-primary)] transition-all shadow-[var(--shadow-glow-purple),var(--shadow-glow-gold)]">
                      {/* Suprem Badge */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <div className="badge badge-suprem px-4 py-1.5 text-xs shadow-lg">
                          ✦ BAROSANUL SUPREM ✦
                        </div>
                      </div>

                      <div className="flex items-center gap-6 pt-2">
                        {/* Photo with Suprem Avatar Style */}
                        <div className="relative flex-shrink-0">
                          <motion.div
                            className="avatar avatar-suprem w-24 h-24 md:w-32 md:h-32 overflow-hidden"
                            animate={{ boxShadow: ['0 0 30px rgba(147,51,234,0.4)', '0 0 50px rgba(201,162,39,0.4)', '0 0 30px rgba(147,51,234,0.4)'] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            whileHover={{ scale: 1.05 }}
                          >
                            {supremBarosan.poza ? (
                              <img src={supremBarosan.poza} alt={supremBarosan.nume} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-5xl bg-[var(--gradient-suprem)]">👑</div>
                            )}
                          </motion.div>
                          <motion.div
                            className="absolute -top-2 -right-2 w-10 h-10 bg-[var(--gradient-gold)] rounded-full flex items-center justify-center text-xl shadow-lg"
                            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            👑
                          </motion.div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 text-left">
                          <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] truncate group-hover:text-gradient-gold transition-colors" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            {supremBarosan.nume}
                          </h3>
                          {supremBarosan.motto && (
                            <p className="text-motto text-[var(--color-text-secondary)] text-base mt-2 truncate" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic' }}>
                              „{supremBarosan.motto}"
                            </p>
                          )}
                          <div className="mt-4 flex items-center gap-3">
                            <span className="btn-secondary text-sm py-2 px-4 inline-flex items-center gap-2">
                              <span>Vezi profilul</span>
                              <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1, repeat: Infinity }}>→</motion.span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ) : (
                <Link to="/barosanul-suprem" className="block group mb-12">
                  <motion.div
                    className="relative max-w-xl mx-auto"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute -inset-1 bg-[var(--gradient-suprem)] rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                    <div className="relative glass-purple rounded-xl p-6 border border-[var(--gold-primary)]/40 group-hover:border-[var(--gold-primary)]/60 transition-all">
                      <div className="text-center">
                        <motion.div
                          className="text-5xl mb-3"
                          animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          👑
                        </motion.div>
                        <div className="text-xl font-bold text-gradient-gold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                          Poziția Suprem e liberă!
                        </div>
                        <p className="text-[var(--color-text-secondary)] text-sm mt-2">Devino cel mai baros dintre barosani</p>
                        <div className="mt-4 inline-flex items-center gap-2 text-[var(--color-success)] text-sm font-semibold">
                          <span className="w-2 h-2 bg-[var(--color-success)] rounded-full animate-pulse"></span>
                          Disponibil acum →
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              )}
            </FadeIn>

            {/* CTA Buttons */}
            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/zid"
                    className="block bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg border border-white/20 hover:border-white/40 transition-all shadow-lg"
                  >
                    Vezi Registrul
                    <span className="inline-block ml-2">→</span>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/cum-devin-barosan"
                    className="relative block overflow-hidden px-8 py-4 rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transition-shadow"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#FFD700]" />
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
                    <span className="relative text-[#0a0a0a]">Inscrie-te Acum</span>
                  </Link>
                </motion.div>
              </div>
            </FadeIn>

            {/* Stats Grid */}
            <FadeIn delay={0.5}>
              <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4" staggerDelay={0.08}>
                {/* Total */}
                <StaggerItem>
                  <Link
                    to="/zid"
                    className="group block card-luxury p-5 hover:border-[#D4AF37]/50"
                  >
                    <div className="text-4xl font-black text-gold-shimmer tabular-nums">{animatedTotal}</div>
                    <div className="text-gray-400 font-semibold text-sm">Total Barosani</div>
                  </Link>
                </StaggerItem>

                {/* Platinum */}
                <StaggerItem>
                  <Link
                    to="/zid?tier=platinum"
                    className="group block card-luxury p-5 hover:border-gray-300/50"
                  >
                    <div className="text-4xl font-black text-gray-300 tabular-nums">{animatedPlatinum}</div>
                    <div className="text-gray-400 font-semibold text-sm">Platinum</div>
                  </Link>
                </StaggerItem>

                {/* Gold */}
                <StaggerItem>
                  <Link
                    to="/zid?tier=gold"
                    className="group block card-luxury p-5 hover:border-[#D4AF37]/50"
                  >
                    <div className="text-4xl font-black text-[#D4AF37] tabular-nums">{animatedGold}</div>
                    <div className="text-gray-400 font-semibold text-sm">Gold</div>
                  </Link>
                </StaggerItem>

                {/* Basic */}
                <StaggerItem>
                  <Link
                    to="/zid?tier=basic"
                    className="group block card-luxury p-5 hover:border-gray-500/50"
                  >
                    <div className="text-4xl font-black text-gray-400 tabular-nums">{animatedBasic}</div>
                    <div className="text-gray-400 font-semibold text-sm">Basic</div>
                  </Link>
                </StaggerItem>
              </StaggerContainer>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Luxury Divider */}
      <div className="divider-luxury h-px" />

      {/* Features Section - Cosmic Penthouse Style */}
      <section className="py-24 px-4 bg-[var(--color-bg-space)]/60 backdrop-blur-sm relative overflow-hidden">

        <div className="container mx-auto max-w-5xl relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="text-overline text-[var(--gold-primary)] mb-4 block">Beneficii Exclusive</span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                <span className="text-[var(--color-text-primary)]">De Ce </span>
                <span className="text-gradient-gold">Registrul Oficial?</span>
              </h2>
              <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
                Beneficii exclusive pentru barosani verificați oficial
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.15}>
            <StaggerItem>
              <motion.div
                className="card-luxury p-8 h-full"
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                  <span className="text-3xl">🏆</span>
                </div>
                <h3 className="text-white font-bold text-xl mb-3">Certificare Oficiala</h3>
                <p className="text-gray-400">
                  Certificat digital descarcabil cu stampila oficiala si cod unic de verificare
                </p>
              </motion.div>
            </StaggerItem>

            <StaggerItem>
              <motion.div
                className="card-luxury p-8 h-full"
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#9333EA] to-[#D4AF37] rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                  <span className="text-3xl">🌟</span>
                </div>
                <h3 className="text-white font-bold text-xl mb-3">Vizibilitate Publica</h3>
                <p className="text-gray-400">
                  Apari in Registrul Oficial vizibil tuturor si primesti certificat partajabil
                </p>
              </motion.div>
            </StaggerItem>

            <StaggerItem>
              <motion.div
                className="card-luxury p-8 h-full"
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-500 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(156,163,175,0.3)]">
                  <span className="text-3xl">💎</span>
                </div>
                <h3 className="text-white font-bold text-xl mb-3">Comunitate Elite</h3>
                <p className="text-gray-400">
                  Comunitate selecta cu smecherie certificata si statut verificat oficial
                </p>
              </motion.div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="py-20 px-4 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-3xl">
          <FadeIn>
            <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3 justify-center">
              <motion.span
                className="text-3xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🔥
              </motion.span>
              <span>Activitate Recenta</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="card-luxury p-4">
              <RecentActivity barosani={allBarosaniForActivity} />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Tier Comparison - Cosmic Penthouse Style */}
      <section className="py-24 px-4 bg-[var(--color-bg-void)]/50 relative overflow-hidden">

        <div className="container mx-auto max-w-5xl relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="text-overline text-[var(--gold-primary)] mb-4 block">Planuri & Prețuri</span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[var(--color-text-primary)]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Alege-ți Destinul
              </h2>
              <p className="text-[var(--color-text-secondary)]">Fiecare tier oferă beneficii unice</p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4" staggerDelay={0.1}>
            {/* Suprem */}
            <StaggerItem>
              <Link to="/barosanul-suprem" className="group relative block h-full">
                <motion.div
                  className="absolute -inset-0.5 bg-gradient-to-r from-[#9333EA] via-[#D4AF37] to-[#9333EA] rounded-2xl blur opacity-50 group-hover:opacity-100 transition-opacity"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{ backgroundSize: '200% 200%' }}
                />
                <div className="relative bg-black/80 backdrop-blur-sm rounded-2xl p-5 border border-[#9333EA]/50 h-full">
                  <div className="text-4xl mb-3">👑</div>
                  <h3 className="text-white font-bold mb-1">Suprem</h3>
                  <p className="text-[#D4AF37] text-xs mb-3 font-semibold">De la 50 RON/ora</p>
                  <ul className="text-gray-400 text-xs space-y-1.5">
                    <li>• Prima pagina</li>
                    <li>• Efecte speciale</li>
                    <li>• Badge exclusiv</li>
                  </ul>
                </div>
              </Link>
            </StaggerItem>

            {/* Platinum */}
            <StaggerItem>
              <Link to="/cum-devin-barosan?tier=platinum" className="group block h-full">
                <motion.div
                  className="card-luxury p-5 h-full group-hover:border-gray-300/50"
                  whileHover={{ y: -5 }}
                >
                  <div className="text-4xl mb-3">💎</div>
                  <h3 className="text-white font-bold mb-1">Platinum</h3>
                  <p className="text-gray-300 text-xs mb-3 font-semibold">149 RON</p>
                  <ul className="text-gray-400 text-xs space-y-1.5">
                    <li>• Link social</li>
                    <li>• Prioritate afisare</li>
                    <li>• Certificat premium</li>
                  </ul>
                </motion.div>
              </Link>
            </StaggerItem>

            {/* Gold */}
            <StaggerItem>
              <Link to="/cum-devin-barosan?tier=gold" className="group block h-full">
                <motion.div
                  className="card-luxury p-5 h-full group-hover:border-[#D4AF37]/50"
                  whileHover={{ y: -5 }}
                >
                  <div className="text-4xl mb-3">🏆</div>
                  <h3 className="text-white font-bold mb-1">Gold</h3>
                  <p className="text-[#D4AF37] text-xs mb-3 font-semibold">49 RON</p>
                  <ul className="text-gray-400 text-xs space-y-1.5">
                    <li>• Certificat gold</li>
                    <li>• Badge special</li>
                    <li>• Vizibilitate buna</li>
                  </ul>
                </motion.div>
              </Link>
            </StaggerItem>

            {/* Basic */}
            <StaggerItem>
              <Link to="/cum-devin-barosan?tier=basic" className="group block h-full">
                <motion.div
                  className="card-luxury p-5 h-full group-hover:border-gray-500/50"
                  whileHover={{ y: -5 }}
                >
                  <div className="text-4xl mb-3">⭐</div>
                  <h3 className="text-white font-bold mb-1">Basic</h3>
                  <p className="text-gray-400 text-xs mb-3 font-semibold">GRATUIT</p>
                  <ul className="text-gray-400 text-xs space-y-1.5">
                    <li>• Certificat basic</li>
                    <li>• In registru</li>
                    <li>• Verificat oficial</li>
                  </ul>
                </motion.div>
              </Link>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Final CTA - Cosmic Penthouse Style */}
      <section className="py-24 px-4 bg-[var(--color-bg-space)]/70 backdrop-blur-sm relative overflow-hidden">

        <div className="relative z-10 container mx-auto text-center max-w-2xl">
          <FadeIn>
            <motion.div
              className="text-7xl mb-8"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              👑
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Gata să devii <span className="text-gradient-gold">Barosan Oficial</span>?
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-10 text-lg">
              Alătură-te celor <span className="text-[var(--gold-primary)] font-bold tabular-nums">{animatedTotal}</span> barosani verificați și primește certificatul tău oficial
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/zid"
                  className="block glass-gold px-8 py-4 rounded-xl font-bold text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all"
                >
                  Exploreaza Registrul
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/cum-devin-barosan"
                  className="relative block overflow-hidden px-8 py-4 rounded-xl font-bold shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#FFD700]" />
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
                  <span className="relative text-[#0a0a0a]">Incepe Procesul</span>
                </Link>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
