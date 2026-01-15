import { useMemo, useState, useEffect } from 'react';
import BarosanCard from '../components/BarosanCard';
import CertificateGenerator from '../components/CertificateGenerator';
import SkeletonCard from '../components/SkeletonCard';
import { fetchJSONWithRetry, getErrorMessage } from '../utils/fetchWithRetry';
import { useDebounce } from '../utils/useDebounce';

const API_URL = 'http://localhost/SiteBarosani/api/barosani.php';
const SSE_URL = 'http://localhost/SiteBarosani/api/sse/updates.php';

export default function Zid() {
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
          // Platinum > Gold > Basic
          const tierOrder = { platinum: 1, gold: 2, basic: 3 };
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
      platinum: filteredBarosani.filter(b => b.tier === 'platinum'),
      gold: filteredBarosani.filter(b => b.tier === 'gold'),
      basic: filteredBarosani.filter(b => b.tier === 'basic')
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
      {/* Hero Section */}
      <section className="py-4 md:py-6 px-4 bg-gradient-to-r from-[#1a365d] to-[#2d5986] text-white">
        <div className="container mx-auto text-center">
          {/* SSE Status & Refresh Indicator */}
          <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {/* SSE Connection Status */}
            {sseConnected && (
              <div className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow-lg flex items-center gap-2 text-xs">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>Live Updates</span>
              </div>
            )}

            {/* Refresh Indicator */}
            {isRefreshing && (
              <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm font-medium">Actualizare...</span>
              </div>
            )}
          </div>

          <div className="text-4xl md:text-5xl mb-2">🏆</div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            Zidul Oficial al Barosanilor
          </h1>
          <p className="text-base md:text-lg max-w-3xl mx-auto opacity-90 mb-3">
            Toți barosanii verificați și certificați oficial, organizați după tier-ul lor de elită
          </p>

          {/* Search, Filter and Sort */}
          <div className="max-w-4xl mx-auto mb-4">
            <div className="flex flex-col gap-3">
              {/* Search Bar - Full width on top */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Caută după nume, motto sau certificat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 pl-10 rounded-lg text-gray-900 font-medium border-2 border-white focus:outline-none focus:border-[#D4AF37] transition-colors placeholder:text-gray-500 text-sm md:text-base"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 font-bold text-lg"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filters Row - Tier and Sort side by side */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Tier Filter */}
                <select
                  value={selectedTierFilter}
                  onChange={(e) => setSelectedTierFilter(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg text-gray-800 border-2 border-white focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer font-medium text-sm md:text-base"
                >
                  <option value="all">🎯 Toate Tier-urile</option>
                  <option value="platinum">💎 Doar Platinum</option>
                  <option value="gold">🏆 Doar Gold</option>
                  <option value="basic">⭐ Doar Basic</option>
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg text-gray-800 border-2 border-white focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer font-medium text-sm md:text-base"
                >
                  <option value="tier">🏅 Sortează după Tier</option>
                  <option value="date-desc">📅 Cei mai noi</option>
                  <option value="date-asc">📅 Cei mai vechi</option>
                  <option value="name-asc">🔤 Nume A-Z</option>
                  <option value="name-desc">🔤 Nume Z-A</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            {(searchTerm || selectedTierFilter !== 'all') && (
              <div className="mt-4 text-center">
                <p className="text-sm opacity-90">
                  {filteredBarosani.length} {filteredBarosani.length === 1 ? 'rezultat găsit' : 'rezultate găsite'}
                  {searchTerm && ` pentru "${searchTerm}"`}
                </p>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-4 justify-center">
            {barosaniByTier.platinum.length > 0 && (
              <button
                onClick={() => scrollToZone('platinum-zone')}
                className="bg-gradient-to-r from-[#E5E4E2] to-[#BCC6CC] text-[#1a365d] px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
              >
                💎 Zona Platinum ({barosaniByTier.platinum.length})
              </button>
            )}
            {barosaniByTier.gold.length > 0 && (
              <button
                onClick={() => scrollToZone('gold-zone')}
                className="bg-[#D4AF37] text-[#1a365d] px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
              >
                🏆 Zona Gold ({barosaniByTier.gold.length})
              </button>
            )}
            {barosaniByTier.basic.length > 0 && (
              <button
                onClick={() => scrollToZone('basic-zone')}
                className="bg-gray-400 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
              >
                ⭐ Zona Basic ({barosaniByTier.basic.length})
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Platinum Zone - Most Prominent */}
      {barosaniByTier.platinum.length > 0 && (
        <section id="platinum-zone" className="py-8 md:py-12 px-4 scroll-mt-24">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-gradient-to-r from-[#E5E4E2] to-[#BCC6CC] px-8 py-3 rounded-full mb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1a365d]">
                  💎 ZONA PLATINUM 💎
                </h2>
              </div>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Elita absolută. Carduri mari, glow auriu, link personal. {barosaniByTier.platinum.length} membrii Platinum.
              </p>
            </div>

            <div className="flex justify-center">
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl"
              >
                {barosaniByTier.platinum.map((barosan) => (
                  <div
                    key={barosan.id}
                    className="w-full"
                  >
                    <BarosanCard
                      barosan={barosan}
                      onViewCertificate={handleViewCertificate}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gold Zone - Medium Prominence */}
      {barosaniByTier.gold.length > 0 && (
        <section id="gold-zone" className="py-8 md:py-12 px-4 bg-white/50 scroll-mt-24">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-[#D4AF37] px-8 py-3 rounded-full mb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a365d]">
                  🏆 ZONA GOLD 🏆
                </h2>
              </div>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Membrii Gold. Border auriu, prioritate în grid. {barosaniByTier.gold.length} membrii Gold.
              </p>
            </div>

            <div className="flex justify-center">
              <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-7xl"
              >
                {barosaniByTier.gold.map((barosan) => (
                  <div
                    key={barosan.id}
                    className="w-full"
                  >
                    <BarosanCard
                      barosan={barosan}
                      onViewCertificate={handleViewCertificate}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Basic Zone - Standard Size */}
      {barosaniByTier.basic.length > 0 && (
        <section id="basic-zone" className="py-8 md:py-12 px-4 scroll-mt-24">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-gray-400 px-8 py-3 rounded-full mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  ⭐ ZONA BASIC ⭐
                </h2>
              </div>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Barosani verificați oficial. {barosaniByTier.basic.length} membrii Basic.
              </p>
            </div>

            <div className="flex justify-center">
              <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 w-full max-w-7xl"
              >
                {barosaniByTier.basic.map((barosan) => (
                  <div
                    key={barosan.id}
                    className="w-full"
                  >
                    <BarosanCard
                      barosan={barosan}
                      onViewCertificate={handleViewCertificate}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-[#1a365d] to-[#2d5986] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Vrei să Apari Pe Zid?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Alege tier-ul tău și fă parte din comunitatea oficială de barosani verificați
          </p>
          <a
            href="/cum-devin-barosan"
            className="inline-block bg-[#D4AF37] text-[#1a365d] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#c19b2e] transition-colors shadow-lg"
          >
            Devino Barosan Acum 🚀
          </a>
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
