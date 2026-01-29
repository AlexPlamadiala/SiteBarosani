import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import BarosanCard from '../components/BarosanCard';
import CertificateGenerator from '../components/CertificateGenerator';
import SkeletonCard from '../components/SkeletonCard';
import { fetchJSONWithRetry, getErrorMessage } from '../utils/fetchWithRetry';
import { useDebounce } from '../utils/useDebounce';

const API_URL = 'http://localhost/SiteBarosani/api/barosani.php';
const SSE_URL = 'http://localhost/SiteBarosani/api/sse/updates.php';

export default function Zid() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedBarosan, setSelectedBarosan] = useState(null);
  const [barosani, setBarosani] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sseConnected, setSseConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState('all');
  const [sortBy, setSortBy] = useState('tier'); // 'tier', 'date-desc', 'date-asc', 'name-asc', 'name-desc'

  // Debounce search term to avoid filtering on every keystroke
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Detectează și deschide certificatul din URL query params
  useEffect(() => {
    const certificatId = searchParams.get('certificat');
    if (certificatId && barosani.length > 0 && !selectedBarosan) {
      const barosan = barosani.find(b => b.certificatId === certificatId);
      if (barosan) {
        setSelectedBarosan(barosan);
        // Elimină query param din URL după ce certificatul e deschis
        setSearchParams({});
      }
    }
  }, [searchParams, barosani, selectedBarosan, setSearchParams]);

  // Load preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('zidPreferences');
    if (savedPreferences) {
      try {
        const prefs = JSON.parse(savedPreferences);
        if (prefs.sortBy) setSortBy(prefs.sortBy);
        if (prefs.tierFilter) setSelectedTierFilter(prefs.tierFilter);
      } catch (e) {
        console.error('Failed to load preferences:', e);
      }
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    const preferences = {
      sortBy,
      tierFilter: selectedTierFilter
    };
    localStorage.setItem('zidPreferences', JSON.stringify(preferences));
  }, [sortBy, selectedTierFilter]);

  // Încarcă barosanii din API
  useEffect(() => {
    async function fetchBarosani(isInitialLoad = false) {
      try {
        // Pentru refresh-uri silențioase (nu la primul load)
        if (!isInitialLoad) {
          setIsRefreshing(true);
        }

        const data = await fetchJSONWithRetry(API_URL, {}, 3);

        if (data.success) {
          setBarosani(data.barosani);
          setError(null);
        } else {
          setError('Eroare la încărcarea datelor');
        }
      } catch (err) {
        console.error('Error fetching barosani:', err);
        // Nu afișăm eroare la refresh-uri silențioase
        if (isInitialLoad) {
          setError(getErrorMessage(err));
        }
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    }

    // Fetch inițial
    fetchBarosani(true);

    // SSE pentru real-time updates
    let eventSource;
    try {
      eventSource = new EventSource(SSE_URL);

      eventSource.addEventListener('connected', (e) => {
        console.log('SSE Connected:', e.data);
        setSseConnected(true);
      });

      eventSource.addEventListener('barosani-updated', (e) => {
        console.log('Barosani updated:', e.data);
        fetchBarosani(false); // Refresh instant când se modifică barosanii
      });

      eventSource.addEventListener('heartbeat', (e) => {
        // Keep-alive heartbeat, no action needed
      });

      eventSource.onerror = (err) => {
        console.error('SSE Error:', err);
        setSseConnected(false);
        // SSE va încerca automat să reconecteze
      };
    } catch (err) {
      console.error('Failed to establish SSE connection:', err);
    }

    // Fallback: Polling la 30 secunde (backup dacă SSE nu funcționează)
    const pollInterval = setInterval(() => {
      if (!sseConnected) {
        fetchBarosani(false);
      }
    }, 30000);

    // Refresh când tab-ul devine vizibil
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchBarosani(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      if (eventSource) {
        eventSource.close();
      }
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Filtrare și sortare
  const filteredBarosani = useMemo(() => {
    let filtered = [...barosani];

    // Apply search term (debounced)
    if (debouncedSearchTerm.trim()) {
      const search = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(b =>
        b.nume.toLowerCase().includes(search) ||
        b.motto?.toLowerCase().includes(search) ||
        b.certificat_id?.toLowerCase().includes(search)
      );
    }

    // Apply tier filter
    if (selectedTierFilter !== 'all') {
      filtered = filtered.filter(b => b.tier === selectedTierFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'tier':
          // Supreme > Elite > Premium > Standard
          const tierOrder = { supreme: 1, elite: 2, premium: 3, standard: 4 };
          return tierOrder[a.tier] - tierOrder[b.tier];

        case 'date-desc':
          // Newest first
          return new Date(b.dataInregistrare) - new Date(a.dataInregistrare);

        case 'date-asc':
          // Oldest first
          return new Date(a.dataInregistrare) - new Date(b.dataInregistrare);

        case 'name-asc':
          // A-Z
          return a.nume.localeCompare(b.nume, 'ro');

        case 'name-desc':
          // Z-A
          return b.nume.localeCompare(a.nume, 'ro');

        default:
          return 0;
      }
    });

    return filtered;
  }, [barosani, debouncedSearchTerm, selectedTierFilter, sortBy]);

  // Organizăm barosanii filtrați pe tier-uri
  const barosaniByTier = useMemo(() => {
    return {
      supreme: filteredBarosani.filter(b => b.tier === 'supreme'),
      elite: filteredBarosani.filter(b => b.tier === 'elite'),
      premium: filteredBarosani.filter(b => b.tier === 'premium'),
      standard: filteredBarosani.filter(b => b.tier === 'standard')
    };
  }, [filteredBarosani]);

  const handleViewCertificate = (barosan) => {
    setSelectedBarosan(barosan);
  };

  const handleCloseCertificate = () => {
    setSelectedBarosan(null);
  };

  const scrollToZone = (zoneId) => {
    const element = document.getElementById(zoneId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Loading state with skeleton cards
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] to-[#E8D5B7]">
        {/* Hero Section Skeleton */}
        <section className="py-16 px-4 bg-gradient-to-r from-[#1a365d] to-[#2d5986] text-white">
          <div className="container mx-auto text-center">
            <div className="text-6xl mb-6 animate-pulse">🏆</div>
            <div className="h-12 bg-white/20 rounded w-96 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-white/20 rounded w-2/3 mx-auto mb-8 animate-pulse"></div>
            <div className="h-12 bg-white/20 rounded w-full max-w-4xl mx-auto animate-pulse"></div>
          </div>
        </section>

        {/* Skeleton Cards Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(12)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] to-[#E8D5B7] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-2xl font-bold text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Reîncearcă
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] to-[#E8D5B7]">
      {/* Hero Section - Modern Design */}
      <section className="py-6 md:py-8 px-4 bg-gradient-to-br from-[#1a365d] via-[#2d5986] to-[#1a365d] text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          {/* Refresh Indicator Only (moved from top-right) */}
          {isRefreshing && (
            <div className="fixed top-20 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold">Actualizare...</span>
            </div>
          )}

          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full mb-4 shadow-2xl">
            <span className="text-4xl">🏆</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-lg">
            Registrul Oficial al Barosanilor
          </h1>
          <p className="text-sm md:text-lg max-w-2xl mx-auto opacity-95 mb-6 leading-relaxed">
            Descoperă barosanii verificați și certificați oficial, organizați după nivelul lor de elită
          </p>

          {/* Search, Filter and Sort - Modern Cards */}
          <div className="max-w-5xl mx-auto mb-6">
            <div className="backdrop-blur-md bg-white/10 rounded-2xl p-4 md:p-6 shadow-2xl border border-white/20">
              <div className="flex flex-col gap-4">
                {/* Search Bar - Enhanced */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="🔍 Caută după nume, motto sau certificat..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 rounded-xl bg-white text-gray-900 font-medium border-2 border-transparent focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all placeholder:text-gray-400 text-sm md:text-base shadow-lg"
                  />
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-600 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filters Row - Enhanced Design */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Tier Filter */}
                  <select
                    value={selectedTierFilter}
                    onChange={(e) => setSelectedTierFilter(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white text-gray-800 border-2 border-transparent focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all cursor-pointer font-semibold text-sm md:text-base shadow-lg"
                  >
                    <option value="all">🎯 Toate Tier-urile</option>
                    <option value="supreme">👑 Doar Supreme</option>
                    <option value="elite">💎 Doar Elite</option>
                    <option value="premium">🥉 Doar Premium</option>
                    <option value="standard">🛡️ Doar Standard</option>
                  </select>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white text-gray-800 border-2 border-transparent focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all cursor-pointer font-semibold text-sm md:text-base shadow-lg"
                  >
                    <option value="tier">🏅 Sortează după Tier</option>
                    <option value="date-desc">📅 Cei mai noi</option>
                    <option value="date-asc">📅 Cei mai vechi</option>
                    <option value="name-asc">🔤 Nume A-Z</option>
                    <option value="name-desc">🔤 Nume Z-A</option>
                  </select>
                </div>

                {/* Results Count - Enhanced */}
                {(searchTerm || selectedTierFilter !== 'all') && (
                  <div className="text-center">
                    <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <p className="text-sm font-semibold text-white">
                        ✨ {filteredBarosani.length} {filteredBarosani.length === 1 ? 'barosan găsit' : 'barosani găsiți'}
                        {searchTerm && ` pentru "${searchTerm}"`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Links - Modern Pills */}
          <div className="flex flex-wrap gap-3 justify-center">
            {barosaniByTier.supreme.length > 0 && (
              <button
                onClick={() => scrollToZone('supreme-zone')}
                className="group relative overflow-hidden bg-gradient-to-r from-[#2A0A4A] via-[#D4AF37] to-[#FFF2B2] text-[#F7F3E8] px-6 py-3 rounded-full font-bold hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
              >
                <span className="relative z-10">👑 Zona Supreme ({barosaniByTier.supreme.length})</span>
              </button>
            )}
            {barosaniByTier.elite.length > 0 && (
              <button
                onClick={() => scrollToZone('elite-zone')}
                className="group relative overflow-hidden bg-gradient-to-r from-[#8F98A3] via-[#E5E7EB] to-[#FFFFFF] text-[#0B1220] px-6 py-3 rounded-full font-bold hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
              >
                <span className="relative z-10">💎 Zona Elite ({barosaniByTier.elite.length})</span>
              </button>
            )}
            {barosaniByTier.premium.length > 0 && (
              <button
                onClick={() => scrollToZone('premium-zone')}
                className="bg-gradient-to-r from-[#7A3E12] via-[#CD7F32] to-[#F2C28F] text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
              >
                🥉 Zona Premium ({barosaniByTier.premium.length})
              </button>
            )}
            {barosaniByTier.standard.length > 0 && (
              <button
                onClick={() => scrollToZone('standard-zone')}
                className="bg-gradient-to-r from-[#4B5563] to-[#9CA3AF] text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
              >
                🛡️ Zona Standard ({barosaniByTier.standard.length})
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Supreme Zone - Top Tier */}
      {barosaniByTier.supreme.length > 0 && (
        <section id="supreme-zone" className="py-12 md:py-16 px-4 scroll-mt-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#2A0A4A]/5 via-transparent to-transparent pointer-events-none"></div>

          <div className="container mx-auto relative z-10">
            <div className="text-center mb-12">
              <div className="inline-block relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#FFF2B2] blur-2xl opacity-40 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-[#2A0A4A] via-[#D4AF37] to-[#FFF2B2] px-8 py-4 rounded-2xl shadow-2xl mb-4 border-2 border-[#D4AF37]">
                  <h2 className="text-3xl md:text-5xl font-extrabold text-[#F7F3E8] drop-shadow-lg">
                    👑 ZONA SUPREME 👑
                  </h2>
                </div>
              </div>
              <p className="text-gray-700 text-lg max-w-2xl mx-auto font-medium">
                Vârful absolut. Glow intens, design exclusiv, link personal.
                <span className="block mt-2 text-[#2A0A4A] font-bold">{barosaniByTier.supreme.length} membr{barosaniByTier.supreme.length === 1 ? 'u' : 'i'} Supreme</span>
              </p>
            </div>

            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
                {barosaniByTier.supreme.map((barosan) => (
                  <div key={barosan.id} className="w-full">
                    <BarosanCard barosan={barosan} onViewCertificate={handleViewCertificate} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Elite Zone */}
      {barosaniByTier.elite.length > 0 && (
        <section id="elite-zone" className="py-12 md:py-16 px-4 bg-gradient-to-br from-white via-[#E5E7EB]/20 to-white scroll-mt-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#7AA2FF] rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto relative z-10">
            <div className="text-center mb-12">
              <div className="inline-block relative">
                <div className="absolute inset-0 bg-[#BFC5CE] blur-xl opacity-40"></div>
                <div className="relative bg-gradient-to-r from-[#8F98A3] via-[#E5E7EB] to-[#FFFFFF] px-8 py-4 rounded-2xl shadow-2xl mb-4 border-2 border-[#E5E7EB]">
                  <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B1220]">
                    💎 ZONA ELITE 💎
                  </h2>
                </div>
              </div>
              <p className="text-gray-700 text-lg max-w-2xl mx-auto font-medium">
                Elita platinată. Card mare cu efect glow, link personal.
                <span className="block mt-2 text-[#0B1220] font-bold">{barosaniByTier.elite.length} membr{barosaniByTier.elite.length === 1 ? 'u' : 'i'} Elite</span>
              </p>
            </div>

            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
                {barosaniByTier.elite.map((barosan) => (
                  <div key={barosan.id} className="w-full">
                    <BarosanCard barosan={barosan} onViewCertificate={handleViewCertificate} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Premium Zone */}
      {barosaniByTier.premium.length > 0 && (
        <section id="premium-zone" className="py-12 md:py-16 px-4 bg-gradient-to-br from-white via-[#F2C28F]/10 to-white scroll-mt-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#CD7F32] rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto relative z-10">
            <div className="text-center mb-12">
              <div className="inline-block relative">
                <div className="absolute inset-0 bg-[#CD7F32] blur-xl opacity-30"></div>
                <div className="relative bg-gradient-to-r from-[#7A3E12] via-[#CD7F32] to-[#F2C28F] px-8 py-4 rounded-2xl shadow-2xl mb-4 border-2 border-[#CD7F32]">
                  <h2 className="text-2xl md:text-4xl font-extrabold text-white drop-shadow-lg">
                    🥉 ZONA PREMIUM 🥉
                  </h2>
                </div>
              </div>
              <p className="text-gray-700 text-lg max-w-2xl mx-auto font-medium">
                Membrii Premium. Border bronz, prioritate în grid.
                <span className="block mt-2 text-[#7A3E12] font-bold">{barosaniByTier.premium.length} membr{barosaniByTier.premium.length === 1 ? 'u' : 'i'} Premium</span>
              </p>
            </div>

            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-7xl">
                {barosaniByTier.premium.map((barosan) => (
                  <div key={barosan.id} className="w-full">
                    <BarosanCard barosan={barosan} onViewCertificate={handleViewCertificate} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Standard Zone */}
      {barosaniByTier.standard.length > 0 && (
        <section id="standard-zone" className="py-12 md:py-16 px-4 bg-gradient-to-b from-[#F5E6D3] to-[#E8D5B7] scroll-mt-24">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block relative">
                <div className="absolute inset-0 bg-[#9CA3AF] blur-lg opacity-20"></div>
                <div className="relative bg-gradient-to-r from-[#4B5563] via-[#9CA3AF] to-[#E5E7EB] px-8 py-4 rounded-2xl shadow-2xl mb-4 border-2 border-[#9CA3AF]">
                  <h2 className="text-xl md:text-3xl font-extrabold text-white drop-shadow-md">
                    🛡️ ZONA STANDARD 🛡️
                  </h2>
                </div>
              </div>
              <p className="text-gray-700 text-lg max-w-2xl mx-auto font-medium">
                Barosani verificați oficial. Fundația comunității.
                <span className="block mt-2 text-[#111827] font-bold">{barosaniByTier.standard.length} membr{barosaniByTier.standard.length === 1 ? 'u' : 'i'} Standard</span>
              </p>
            </div>

            <div className="flex justify-center">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 w-full max-w-7xl">
                {barosaniByTier.standard.map((barosan) => (
                  <div key={barosan.id} className="w-full">
                    <BarosanCard barosan={barosan} onViewCertificate={handleViewCertificate} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section - Enhanced */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#1a365d] via-[#2d5986] to-[#1a365d] text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full mb-6 shadow-2xl">
            <span className="text-3xl">👑</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
            Vrei să Apari În Registru?
          </h2>
          <p className="text-base md:text-xl mb-10 max-w-2xl mx-auto opacity-95 leading-relaxed">
            Alege tier-ul tău și fă parte din comunitatea oficială de barosani verificați.
            Certificare instant, vizibilitate garantată în Registrul Oficial!
          </p>
          <Link
            to="/cum-devin-barosan"
            className="group relative inline-block"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] rounded-2xl blur-lg group-hover:blur-xl transition-all opacity-75"></div>
            <span className="relative block bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1a365d] px-10 py-4 rounded-2xl font-extrabold text-lg hover:scale-105 transition-transform shadow-2xl">
              Devino Barosan Acum 🚀
            </span>
          </Link>
        </div>
      </section>

      {/* Certificate Modal */}
      {selectedBarosan && (
        <CertificateGenerator
          barosan={selectedBarosan}
          onClose={handleCloseCertificate}
        />
      )}
    </div>
  );
}
