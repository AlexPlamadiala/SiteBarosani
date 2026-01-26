import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BarosanCard from '../components/BarosanCard';
import CertificateGenerator from '../components/CertificateGenerator';
import SkeletonCard from '../components/SkeletonCard';
import Pagination from '../components/Pagination';
import { fetchJSONWithRetry, getErrorMessage } from '../utils/fetchWithRetry';
import { useDebounce } from '../utils/useDebounce';
import { useSEO } from '../hooks/useSEO';
import { BAROSANI_URL, SUPREM_URL, SSE_URL } from '../config/api';

export default function Zid() {
  useSEO({
    title: 'Zidul Barosanilor',
    description: 'Descoperă toți barosanii verificați din comunitate. Caută, filtrează și vizualizează certificatele de barosan.',
    url: '/zid'
  });

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedBarosan, setSelectedBarosan] = useState(null);
  const [barosani, setBarosani] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sseConnected, setSseConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'suprem', 'platinum', 'gold', 'basic'
  const [sortBy, setSortBy] = useState('tier');
  const [activeSuprem, setActiveSuprem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24; // Show 24 items per page

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Reset to page 1 when filters/search/tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, debouncedSearchTerm]);

  // Handle URL params for certificate and tier
  useEffect(() => {
    const certificatId = searchParams.get('certificat');
    const tierParam = searchParams.get('tier');

    if (tierParam && ['suprem', 'platinum', 'gold', 'basic', 'all'].includes(tierParam)) {
      setActiveTab(tierParam);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('tier');
      setSearchParams(newParams, { replace: true });
    }

    if (certificatId && barosani.length > 0 && !selectedBarosan) {
      const barosan = barosani.find(b => (b.certificatId || b.certificat_id) === certificatId);
      if (barosan) {
        setSelectedBarosan(barosan);
        setSearchParams({}, { replace: true });
      }
    }
  }, [searchParams, barosani, selectedBarosan, setSearchParams]);

  // Load preferences
  useEffect(() => {
    const savedPreferences = localStorage.getItem('zidPreferences');
    if (savedPreferences) {
      try {
        const prefs = JSON.parse(savedPreferences);
        if (prefs.sortBy) setSortBy(prefs.sortBy);
        if (prefs.activeTab) setActiveTab(prefs.activeTab);
      } catch (e) {
        console.error('Failed to load preferences:', e);
      }
    }
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('zidPreferences', JSON.stringify({ sortBy, activeTab }));
  }, [sortBy, activeTab]);

  // Fetch barosani and suprem
  useEffect(() => {
    async function fetchBarosani(isInitialLoad = false) {
      try {
        if (!isInitialLoad) setIsRefreshing(true);

        // Fetch both regular barosani and suprem in parallel
        const [barosaniData, supremData] = await Promise.all([
          fetchJSONWithRetry(BAROSANI_URL, {}, 3),
          fetchJSONWithRetry(SUPREM_URL, {}, 3).catch(() => ({ success: false }))
        ]);

        if (barosaniData.success) {
          setBarosani(barosaniData.barosani);
          setError(null);
        } else {
          setError('Eroare la încărcarea datelor');
        }

        // Set active suprem if exists
        if (supremData.success && supremData.suprem) {
          setActiveSuprem(supremData.suprem);
        } else {
          setActiveSuprem(null);
        }
      } catch (err) {
        console.error('Error fetching barosani:', err);
        if (isInitialLoad) setError(getErrorMessage(err));
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    }

    fetchBarosani(true);

    let eventSource;
    try {
      eventSource = new EventSource(SSE_URL);
      eventSource.addEventListener('connected', () => setSseConnected(true));
      eventSource.addEventListener('barosani-updated', () => fetchBarosani(false));
      eventSource.onerror = () => setSseConnected(false);
    } catch (err) {
      console.error('Failed to establish SSE connection:', err);
    }

    const pollInterval = setInterval(() => {
      if (!sseConnected) fetchBarosani(false);
    }, 30000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') fetchBarosani(false);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Count by tier (including active suprem from separate table)
  const tierCounts = useMemo(() => {
    const platinumCount = barosani.filter(b => b.tier === 'platinum').length;
    const goldCount = barosani.filter(b => b.tier === 'gold').length;
    const basicCount = barosani.filter(b => b.tier === 'basic').length;
    const supremCount = activeSuprem ? 1 : 0;
    // Total is the sum of all tiers, not barosani.length (to avoid counting barosani with invalid/null tiers)
    const total = platinumCount + goldCount + basicCount + supremCount;

    return {
      all: total,
      suprem: supremCount,
      platinum: platinumCount,
      gold: goldCount,
      basic: basicCount
    };
  }, [barosani, activeSuprem]);

  // Filter and sort
  const filteredBarosani = useMemo(() => {
    let filtered = [...barosani];

    // Search filter
    if (debouncedSearchTerm.trim()) {
      const search = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(b =>
        b.nume.toLowerCase().includes(search) ||
        b.motto?.toLowerCase().includes(search) ||
        b.certificat_id?.toLowerCase().includes(search)
      );
    }

    // Tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(b => b.tier === activeTab);
    }

    // Tier order mapping (lowercase for consistency)
    const tierOrder = { suprem: 0, platinum: 1, gold: 2, basic: 3 };
    const getTierOrder = (tier) => tierOrder[tier?.toLowerCase()] ?? 99;

    // Sort - when showing 'all', always sort by tier first, then by date desc
    if (activeTab === 'all') {
      // For 'all' tab: tier priority first, then date descending within each tier
      filtered.sort((a, b) => {
        const tierDiff = getTierOrder(a.tier) - getTierOrder(b.tier);
        if (tierDiff !== 0) return tierDiff;
        // Within same tier, sort by date descending (newest first)
        return new Date(b.dataInregistrare) - new Date(a.dataInregistrare);
      });
    } else {
      // For specific tier tabs, use the selected sort
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'tier':
            return getTierOrder(a.tier) - getTierOrder(b.tier);
          case 'date-desc':
            return new Date(b.dataInregistrare) - new Date(a.dataInregistrare);
          case 'date-asc':
            return new Date(a.dataInregistrare) - new Date(b.dataInregistrare);
          case 'name-asc':
            return a.nume.localeCompare(b.nume, 'ro');
          case 'name-desc':
            return b.nume.localeCompare(a.nume, 'ro');
          default:
            // Default: date descending
            return new Date(b.dataInregistrare) - new Date(a.dataInregistrare);
        }
      });
    }

    return filtered;
  }, [barosani, debouncedSearchTerm, activeTab, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredBarosani.length / itemsPerPage);
  const paginatedBarosani = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBarosani.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBarosani, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll complet to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewCertificate = (barosan) => setSelectedBarosan(barosan);
  const handleCloseCertificate = () => setSelectedBarosan(null);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <div className="sticky top-16 z-40 bg-[#111] border-b border-white/10 py-3 px-4">
          <div className="container mx-auto">
            <div className="flex gap-2">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-10 w-24 bg-white/10 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
        <section className="py-6 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(18)].map((_, index) => (
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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-xl font-bold text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700"
          >
            Reîncearcă
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'all', label: 'Toți', icon: '🎯', count: tierCounts.all, color: 'from-[#1a365d] to-[#2d5986]' },
    { id: 'suprem', label: 'Suprem', icon: '👑', count: tierCounts.suprem, color: 'from-purple-500 to-pink-500' },
    { id: 'platinum', label: 'Platinum', icon: '💎', count: tierCounts.platinum, color: 'from-[#E5E4E2] to-[#BCC6CC]', textColor: 'text-[#1a365d]' },
    { id: 'gold', label: 'Gold', icon: '🏆', count: tierCounts.gold, color: 'from-[#D4AF37] to-[#FFD700]', textColor: 'text-[#1a365d]' },
    { id: 'basic', label: 'Basic', icon: '⭐', count: tierCounts.basic, color: 'from-gray-400 to-gray-500' }
  ];

  // Grid columns based on active tab
  const getGridClass = () => {
    if (activeTab === 'suprem') return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';
    if (activeTab === 'platinum') return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
    if (activeTab === 'gold') return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5';
    return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Refresh indicator */}
      {isRefreshing && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
          ●
        </div>
      )}

      {/* Filter Bar - Sticky on scroll (top matches header height: 72px mobile, 88px desktop) */}
      <div className="sticky top-[72px] md:top-[88px] z-40 bg-[#111]/95 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20">
        <div className="container mx-auto px-4">
          {/* Tier Tabs - Main element */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? tab.id === 'suprem' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30' :
                        tab.id === 'platinum' ? 'bg-gradient-to-r from-[#E5E4E2] to-[#BCC6CC] text-[#1a365d] shadow-lg' :
                        tab.id === 'gold' ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1a365d] shadow-lg shadow-yellow-500/30' :
                        tab.id === 'basic' ? 'bg-gray-500 text-white shadow-lg' :
                        'bg-white text-[#1a365d] shadow-lg'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id ? 'bg-black/10' : 'bg-white/10'
                  }`}>{tab.count}</span>
                </button>
              ))}
            </div>

            {/* Search only */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Caută..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-32 sm:w-44 px-3 py-2 pl-8 text-sm rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 focus:border-white/40"
                />
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Results count - inside sticky container */}
        {(searchTerm || activeTab !== 'all') && (
          <div className="bg-white/5 py-1.5 px-4 text-center text-xs text-white/50 border-t border-white/5">
            {filteredBarosani.length + ((activeTab === 'suprem' || activeTab === 'all') && activeSuprem && !searchTerm ? 1 : 0)} rezultat{(filteredBarosani.length + ((activeTab === 'suprem' || activeTab === 'all') && activeSuprem && !searchTerm ? 1 : 0)) !== 1 ? 'e' : ''}
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="ml-2 text-purple-400 hover:underline">
                Șterge căutarea
              </button>
            )}
          </div>
        )}
      </div>

      {/* Active Suprem Banner - Prominent version */}
      {activeSuprem && (activeTab === 'all' || activeTab === 'suprem') && !searchTerm && (
        <section className="py-4 px-4 bg-gradient-to-r from-purple-900/40 via-[#0a0a0a] to-pink-900/40 border-b border-purple-500/30">
          <div className="container mx-auto max-w-3xl">
            <div
              onClick={() => navigate('/barosanul-suprem')}
              className="block group cursor-pointer"
              role="link"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/barosanul-suprem')}
            >
              <div className="relative">
                {/* Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>

                <div className="relative bg-gradient-to-br from-purple-900/70 to-pink-900/70 rounded-xl p-4 md:p-5 border border-purple-500/40 group-hover:border-purple-400/60 transition-all">
                  <div className="flex items-center gap-4">
                    {/* Photo */}
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-3 border-purple-400 overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
                        {activeSuprem.poza ? (
                          <img src={activeSuprem.poza} alt={activeSuprem.nume} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">👑</div>
                        )}
                      </div>
                      <div className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm animate-pulse shadow-lg">👑</div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                        👑 BAROSANUL SUPREM ACTIV
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-white truncate group-hover:text-purple-200 transition-colors">
                        {activeSuprem.nume}
                      </h3>
                      {activeSuprem.motto && (
                        <p className="text-white/60 italic text-sm truncate hidden sm:block">"{activeSuprem.motto}"</p>
                      )}
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-xs text-white/50">
                          ⏱️ Expiră: <span className="text-purple-300 font-semibold">
                            {new Date(activeSuprem.dataExpirare).toLocaleString('ro-RO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </span>
                        {activeSuprem.link && (
                          <a
                            href={activeSuprem.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-300 hover:text-purple-200 text-xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            🔗 Link
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleViewCertificate({ ...activeSuprem, tier: 'suprem', dataInregistrare: activeSuprem.dataStart }); }}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:scale-105 transition-transform shadow-lg"
                      >
                        📜 Certificat
                      </button>
                      <span className="text-purple-300 text-xs font-semibold text-center group-hover:translate-x-1 transition-transform">
                        Profil →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Barosani Grid */}
      <section className="py-6 px-4">
        <div className="container mx-auto">
          {filteredBarosani.length === 0 && !(activeSuprem && (activeTab === 'all' || activeTab === 'suprem') && !searchTerm) ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl text-white/70 font-medium">
                {searchTerm ? `Niciun barosan găsit pentru "${searchTerm}"` : 'Niciun barosan în această categorie'}
              </p>
              <button
                onClick={() => { setSearchTerm(''); setActiveTab('all'); }}
                className="mt-4 text-purple-400 font-semibold hover:underline"
              >
                Resetează filtrele
              </button>
            </div>
          ) : filteredBarosani.length > 0 ? (
            <>
              {/* Pagination Top */}
              {totalPages > 1 && (
                <div className="mb-4 pb-3 border-b border-white/10">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}

              <div className={`grid ${getGridClass()}`}>
                {paginatedBarosani.map((barosan) => (
                  <BarosanCard
                    key={barosan.id}
                    barosan={barosan}
                    onViewCertificate={handleViewCertificate}
                  />
                ))}
              </div>

              {/* Pagination Bottom */}
              {totalPages > 1 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                  <p className="text-center text-white/40 text-xs mt-3">
                    Pagina {currentPage} din {totalPages} ({filteredBarosani.length} barosani)
                  </p>
                </div>
              )}
            </>
          ) : null}
        </div>
      </section>

      {/* Compact CTA */}
      <section className="py-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg mb-4 text-white/80">
            <span className="font-bold text-white">Vrei să apari în registru?</span> Certificare instant!
          </p>
          <a
            href="/cum-devin-barosan"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
          >
            Devino Barosan 🚀
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
