import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'suprem', 'platinum', 'gold', 'basic'
  const [sortBy, setSortBy] = useState('tier');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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
      const barosan = barosani.find(b => b.certificatId === certificatId);
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

  // Fetch barosani
  useEffect(() => {
    async function fetchBarosani(isInitialLoad = false) {
      try {
        if (!isInitialLoad) setIsRefreshing(true);
        const data = await fetchJSONWithRetry(API_URL, {}, 3);
        if (data.success) {
          setBarosani(data.barosani);
          setError(null);
        } else {
          setError('Eroare la încărcarea datelor');
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
  }, []);

  // Count by tier
  const tierCounts = useMemo(() => ({
    all: barosani.length,
    suprem: barosani.filter(b => b.tier === 'suprem').length,
    platinum: barosani.filter(b => b.tier === 'platinum').length,
    gold: barosani.filter(b => b.tier === 'gold').length,
    basic: barosani.filter(b => b.tier === 'basic').length
  }), [barosani]);

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

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'tier':
          const tierOrder = { suprem: 0, platinum: 1, gold: 2, basic: 3 };
          return tierOrder[a.tier] - tierOrder[b.tier];
        case 'date-desc':
          return new Date(b.dataInregistrare) - new Date(a.dataInregistrare);
        case 'date-asc':
          return new Date(a.dataInregistrare) - new Date(b.dataInregistrare);
        case 'name-asc':
          return a.nume.localeCompare(b.nume, 'ro');
        case 'name-desc':
          return b.nume.localeCompare(a.nume, 'ro');
        default:
          return 0;
      }
    });

    return filtered;
  }, [barosani, debouncedSearchTerm, activeTab, sortBy]);

  const handleViewCertificate = (barosan) => setSelectedBarosan(barosan);
  const handleCloseCertificate = () => setSelectedBarosan(null);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F4EF]">
        <div className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm py-2 px-4">
          <div className="container mx-auto">
            <div className="flex gap-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-8 w-16 bg-gray-200 rounded-full animate-pulse"></div>
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
      <div className="min-h-screen bg-[#F8F4EF] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-xl font-bold text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
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
    <div className="min-h-screen bg-[#F8F4EF]">
      {/* Refresh indicator */}
      {isRefreshing && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
          ●
        </div>
      )}

      {/* Filter Bar - Visible on scroll */}
      <div className="sticky top-16 z-40 bg-gradient-to-r from-[#1a365d] to-[#2d5986] shadow-lg">
        <div className="container mx-auto px-4">
          {/* Tier Tabs - Main element */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
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

            {/* Search & Sort */}
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
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm rounded-full bg-white/10 border border-white/20 text-white focus:outline-none focus:bg-white/20 cursor-pointer"
              >
                <option value="tier" className="text-gray-800">Tier</option>
                <option value="date-desc" className="text-gray-800">Noi</option>
                <option value="date-asc" className="text-gray-800">Vechi</option>
                <option value="name-asc" className="text-gray-800">A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results count - only when filtered */}
      {(searchTerm || activeTab !== 'all') && (
        <div className="bg-gray-50 py-1.5 px-4 text-center text-xs text-gray-500">
          {filteredBarosani.length} rezultat{filteredBarosani.length !== 1 ? 'e' : ''}
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="ml-2 text-blue-600 hover:underline">
              Șterge căutarea
            </button>
          )}
        </div>
      )}

      {/* Barosani Grid */}
      <section className="py-6 px-4">
        <div className="container mx-auto">
          {filteredBarosani.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl text-gray-600 font-medium">
                {searchTerm ? `Niciun barosan găsit pentru "${searchTerm}"` : 'Niciun barosan în această categorie'}
              </p>
              <button
                onClick={() => { setSearchTerm(''); setActiveTab('all'); }}
                className="mt-4 text-[#1a365d] font-semibold hover:underline"
              >
                Resetează filtrele
              </button>
            </div>
          ) : (
            <div className={`grid ${getGridClass()}`}>
              {filteredBarosani.map((barosan) => (
                <BarosanCard
                  key={barosan.id}
                  barosan={barosan}
                  onViewCertificate={handleViewCertificate}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Compact CTA */}
      <section className="py-8 bg-gradient-to-r from-[#1a365d] to-[#2d5986] text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg mb-4">
            <span className="font-bold">Vrei să apari în registru?</span> Certificare instant!
          </p>
          <a
            href="/cum-devin-barosan"
            className="inline-block bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1a365d] px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
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
