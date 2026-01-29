import { useState, useEffect, useMemo } from 'react';
import { useToast } from '../contexts/ToastContext';
import { API_BASE, API_ENDPOINTS } from '../config/api';
import Pagination from '../components/Pagination';

export default function Admin() {
  const toast = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Login state
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);

  // Data states
  const [statistics, setStatistics] = useState(null);
  const [applications, setApplications] = useState([]);
  const [barosani, setBarosani] = useState([]);
  const [suprem, setSuprem] = useState(null);

  // Filter states
  const [appFilter, setAppFilter] = useState('all');
  const [barosanFilter, setBarosanFilter] = useState('all');

  // Pagination states
  const [appPage, setAppPage] = useState(1);
  const [barosanPage, setBarosanPage] = useState(1);
  const itemsPerPage = 10;

  // Payment proof modal state
  const [paymentProofModal, setPaymentProofModal] = useState({ show: false, appId: null, appName: '' });
  const [paymentProofUrl, setPaymentProofUrl] = useState('');

  // History modal state
  const [historyModal, setHistoryModal] = useState({ show: false, appId: null, appName: '' });
  const [applicationHistory, setApplicationHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth.php`, { credentials: 'include' });
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        setUser(data.user);
        sessionStorage.setItem('adminAuthenticated', 'true');
        loadData();
      } else {
        sessionStorage.removeItem('adminAuthenticated');
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'login', ...loginData })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setUser(data.user);
        sessionStorage.setItem('adminAuthenticated', 'true');
        toast.success('Autentificare reușită!');
        loadData();
      } else {
        toast.error(data.error || 'Eroare la autentificare');
      }
    } catch {
      toast.error('Eroare de conexiune');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'logout' })
      });
      setIsAuthenticated(false);
      setUser(null);
      sessionStorage.removeItem('adminAuthenticated');
      toast.success('Deconectat cu succes');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const loadData = async () => {
    try {
      const [statsRes, appsRes, barosaniRes, supremRes] = await Promise.all([
        fetch(`${API_BASE}/admin/statistics.php`, { credentials: 'include' }),
        fetch(`${API_BASE}/admin/applications.php`, { credentials: 'include' }),
        fetch(`${API_BASE}/admin/barosani.php`, { credentials: 'include' }),
        fetch(`${API_BASE}/barosan_suprem.php`)
      ]);

      const [statsData, appsData, barosaniData, supremData] = await Promise.all([
        statsRes.json(),
        appsRes.json(),
        barosaniRes.json(),
        supremRes.json()
      ]);

      if (statsData.success) setStatistics(statsData.statistics);
      if (appsData.success) setApplications(appsData.applications);
      if (barosaniData.success) setBarosani(barosaniData.barosani);
      if (supremData.success && supremData.suprem) setSuprem(supremData.suprem);
    } catch (err) {
      console.error('Load data failed:', err);
      toast.error('Eroare la încărcarea datelor');
    }
  };

  // Application actions
  const handleApplicationAction = async (id, action, notes = '', paymentProof = null) => {
    try {
      const bodyData = { id, action, notes };
      if (paymentProof) {
        bodyData.payment_proof = paymentProof;
      }

      const res = await fetch(`${API_BASE}/admin/applications.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bodyData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        loadData();
        // Close payment proof modal if open
        setPaymentProofModal({ show: false, appId: null, appName: '' });
        setPaymentProofUrl('');
      } else {
        toast.error(data.error || 'Eroare necunoscută');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Eroare la procesarea cererii: ' + err.message);
    }
  };

  // Open payment proof modal
  const openPaymentProofModal = (appId, appName) => {
    setPaymentProofModal({ show: true, appId, appName });
    setPaymentProofUrl('');
  };

  // Confirm payment with proof
  const confirmPaymentWithProof = () => {
    if (paymentProofModal.appId) {
      handleApplicationAction(paymentProofModal.appId, 'payment_confirmed', '', paymentProofUrl || null);
    }
  };

  // Fetch application history
  const fetchApplicationHistory = async (appId, appName) => {
    setHistoryModal({ show: true, appId, appName });
    setHistoryLoading(true);
    setApplicationHistory([]);
    try {
      const res = await fetch(`${API_BASE}/admin/applications.php?history=1&id=${appId}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setApplicationHistory(data.history || []);
      } else {
        toast.error(data.error || 'Eroare la încărcarea istoricului');
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      toast.error('Eroare la încărcarea istoricului');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Format history action for display
  const formatHistoryAction = (action) => {
    const actionMap = {
      'payment_confirmed': { label: 'Plată Confirmată', color: 'text-blue-600', icon: '💳' },
      'approved': { label: 'Aprobată', color: 'text-green-600', icon: '✓' },
      'rejected': { label: 'Respinsă', color: 'text-red-600', icon: '✗' },
      'created': { label: 'Creată', color: 'text-gray-600', icon: '📝' },
    };
    return actionMap[action] || { label: action, color: 'text-gray-600', icon: '•' };
  };

  const handleDeleteApplication = async (id) => {
    if (!confirm('Sigur vrei să ștergi această cerere?')) return;
    try {
      const res = await fetch(`${API_BASE}/admin/applications.php?id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Cerere ștearsă');
        loadData();
      }
    } catch {
      toast.error('Eroare la ștergere');
    }
  };

  // Barosan actions
  const handleDeleteBarosan = async (id) => {
    if (!confirm('Sigur vrei să ștergi acest barosan?')) return;
    try {
      const res = await fetch(`${API_BASE}/admin/barosani.php?id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Barosan șters');
        loadData();
      }
    } catch {
      toast.error('Eroare la ștergere');
    }
  };

  const handleUpdateBarosanStatus = async (barosan, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/admin/barosani.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...barosan,
          revolutId: barosan.revolut_id,
          dataExpirare: barosan.data_expirare,
          status: newStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Status actualizat');
        loadData();
      }
    } catch {
      toast.error('Eroare la actualizare');
    }
  };

  const handleDeactivateSuprem = async (id) => {
    if (!confirm('Sigur vrei să dezactivezi Barosanul Suprem?')) return;

    try {
      const res = await fetch(`${API_BASE}/admin/suprem.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Barosanul Suprem a fost dezactivat!');
        setSuprem(null);
        loadData();
      } else {
        toast.error(data.error || 'Eroare la dezactivare');
      }
    } catch {
      toast.error('Eroare la dezactivare');
    }
  };

  // Tier colors and icons
  const tierConfig = {
    suprem: { color: 'from-purple-500 to-pink-500', icon: null, iconImg: '/Crown.png', textColor: 'text-purple-400' },
    platinum: { color: 'from-gray-300 to-gray-400', icon: '💎', textColor: 'text-gray-300' },
    gold: { color: 'from-yellow-400 to-yellow-600', icon: '🏆', textColor: 'text-yellow-400' },
    basic: { color: 'from-blue-400 to-blue-600', icon: '⭐', textColor: 'text-blue-400' }
  };

  // Reset pagination when filters change
  useEffect(() => {
    setAppPage(1);
  }, [appFilter]);

  useEffect(() => {
    setBarosanPage(1);
  }, [barosanFilter]);

  // Filter applications
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      if (appFilter === 'all') return true;
      return app.status === appFilter;
    });
  }, [applications, appFilter]);

  // Paginated applications
  const appTotalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedApplications = useMemo(() => {
    const startIndex = (appPage - 1) * itemsPerPage;
    return filteredApplications.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredApplications, appPage, itemsPerPage]);

  // Filter barosani
  const filteredBarosani = useMemo(() => {
    return barosani.filter(b => {
      if (barosanFilter === 'all') return true;
      if (barosanFilter === 'active') return b.status === 'active';
      if (barosanFilter === 'inactive') return b.status === 'inactive';
      if (barosanFilter === 'expired') return b.status === 'expired';
      return b.tier === barosanFilter;
    });
  }, [barosani, barosanFilter]);

  // Paginated barosani
  const barosanTotalPages = Math.ceil(filteredBarosani.length / itemsPerPage);
  const paginatedBarosani = useMemo(() => {
    const startIndex = (barosanPage - 1) * itemsPerPage;
    return filteredBarosani.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBarosani, barosanPage, itemsPerPage]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-white text-xl">Se încarcă...</div>
      </div>
    );
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-white mb-2">🔐 Admin</h1>
            <p className="text-white/60">Registrul Barosanilor</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="mb-6">
              <label className="block text-white/80 text-sm font-bold mb-2">Username</label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="admin"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-white/80 text-sm font-bold mb-2">Parolă</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              {loginLoading ? 'Se autentifică...' : 'Autentificare'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-white">🔐 Admin Panel</h1>
              <span className="text-white/40 text-sm">|</span>
              <span className="text-white/60 text-sm">{user?.username}</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={loadData}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm"
              >
                🔄 Refresh
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
              >
                Deconectare
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/5 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'dashboard', label: '📊 Dashboard', count: null },
              { id: 'applications', label: '📝 Cereri', count: applications.filter(a => a.status === 'pending').length },
              { id: 'barosani', label: '👥 Barosani', count: barosani.length },
              { id: 'suprem', label: '👑 Suprem', count: suprem ? 1 : 0 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-purple-400 border-b-2 border-purple-500'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-purple-500/30 text-purple-300 text-xs rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Barosani', value: (statistics?.total_barosani || 0) + (suprem ? 1 : 0), icon: '👥', color: 'from-purple-500 to-pink-500' },
                { label: 'Cereri în așteptare', value: statistics?.pending_applications || 0, icon: '📝', color: 'from-yellow-500 to-orange-500' },
                { label: 'Expiră în 7 zile', value: statistics?.expiring_soon || 0, icon: '⏰', color: 'from-red-500 to-pink-500' },
                { label: 'Venit Total', value: `${statistics?.total_revenue || 0} RON`, icon: '💰', color: 'from-green-500 to-emerald-500' }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{stat.icon}</span>
                    <span className="text-white/60 text-sm">{stat.label}</span>
                  </div>
                  <div className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Tier Distribution */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Distribuție pe Tier-uri</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { tier: 'suprem', count: suprem ? 1 : 0 },
                  { tier: 'platinum', count: statistics?.platinum_count || 0 },
                  { tier: 'gold', count: statistics?.gold_count || 0 },
                  { tier: 'basic', count: statistics?.basic_count || 0 }
                ].map(item => (
                  <div key={item.tier} className={`bg-gradient-to-br ${tierConfig[item.tier].color} p-4 rounded-xl text-center`}>
                    <div className="text-3xl mb-1">{tierConfig[item.tier].iconImg ? <img src={tierConfig[item.tier].iconImg} alt="" className="w-8 h-8 object-contain mx-auto" /> : tierConfig[item.tier].icon}</div>
                    <div className="text-2xl font-black text-white">{item.count}</div>
                    <div className="text-white/80 text-sm uppercase font-bold">{item.tier}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Cereri Recente</h3>
              <div className="space-y-3">
                {applications.slice(0, 5).map(app => (
                  <div key={app.id} className="flex items-center justify-between bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{tierConfig[app.tier]?.icon || '⭐'}</span>
                      <div>
                        <p className="text-white font-semibold">{app.nume}</p>
                        <p className="text-white/50 text-sm">{app.code}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      app.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      app.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {app.status === 'pending' ? 'În așteptare' : app.status === 'approved' ? 'Aprobat' : 'Respins'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex gap-2 flex-wrap">
                {[
                  { id: 'all', label: 'Toate' },
                  { id: 'pending', label: 'În așteptare' },
                  { id: 'payment_confirmed', label: 'Plată confirmată' },
                  { id: 'approved', label: 'Aprobate' },
                  { id: 'rejected', label: 'Respinse' }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setAppFilter(filter.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      appFilter === filter.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <div className="text-white/50 text-sm">
                {filteredApplications.length} cereri
              </div>
            </div>

            {/* Pagination Top */}
            {appTotalPages > 1 && (
              <div className="pb-2 border-b border-white/10">
                <Pagination
                  currentPage={appPage}
                  totalPages={appTotalPages}
                  onPageChange={setAppPage}
                />
              </div>
            )}

            {/* Applications List */}
            <div className="space-y-4">
              {paginatedApplications.map(app => (
                <div key={app.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {app.poza && (
                        <img src={app.poza} alt={app.nume} className="w-16 h-16 rounded-full object-cover border-2 border-white/20" />
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xl">{tierConfig[app.tier]?.icon || '⭐'}</span>
                          <h3 className="text-white font-bold text-lg">{app.nume}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                            app.tier === 'suprem' ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50' :
                            app.tier === 'platinum' ? 'bg-gray-500/30 text-gray-200 border border-gray-400/50' :
                            app.tier === 'gold' ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50' :
                            'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                          }`}>
                            {app.tier}
                          </span>
                        </div>
                        <p className="text-white/50 text-sm">Cod: <span className="text-purple-400 font-mono">{app.code}</span></p>
                        <p className="text-white/50 text-sm">Email: {app.email}</p>
                        <p className="text-white/50 text-sm">Revolut: @{app.revolut_id}</p>
                        {app.tier === 'suprem' && app.suprem_hours && (
                          <p className="text-purple-400 text-sm font-semibold flex items-center gap-1"><img src="/Crown.png" alt="" className="w-4 h-4 object-contain inline" /> Suprem: {app.suprem_hours} ore - {app.suma} RON</p>
                        )}
                        {app.tier !== 'suprem' && (
                          <p className="text-white/50 text-sm">Sumă: {app.suma} RON</p>
                        )}
                        <p className="text-white/60 italic mt-1">"{app.motto}"</p>

                        {/* Payment proof display */}
                        {app.payment_proof && (
                          <div className="mt-2 p-2 bg-green-500/10 rounded-lg border border-green-500/30">
                            <p className="text-green-400 text-xs font-semibold mb-1">📎 Dovadă plată:</p>
                            <a
                              href={app.payment_proof}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-300 text-xs hover:underline break-all"
                            >
                              {app.payment_proof}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 md:items-end">
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                        app.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        app.status === 'payment_confirmed' ? 'bg-blue-500/20 text-blue-400' :
                        app.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {app.status === 'pending' ? 'În așteptare' :
                         app.status === 'payment_confirmed' ? 'Plată confirmată' :
                         app.status === 'approved' ? 'Aprobat' : 'Respins'}
                      </div>

                      {(app.status === 'pending' || app.status === 'payment_confirmed') && (
                        <div className="flex flex-col gap-2">
                          {/* Warning when trying to approve suprem while one is active */}
                          {app.tier === 'suprem' && suprem && (
                            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-2 text-xs text-yellow-300">
                              ⚠️ Există deja un Suprem activ ({suprem.nume}). Dezactivează-l din tab-ul "Suprem" înainte de a aproba.
                            </div>
                          )}
                          {/* Warning when trying to approve without payment confirmation */}
                          {app.status === 'pending' && (
                            <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-2 text-xs text-orange-300">
                              ⚠️ Trebuie să confirmi plata înainte de a aproba cererea.
                            </div>
                          )}
                          <div className="flex gap-2 flex-wrap">
                            {app.status === 'pending' && (
                              <button
                                onClick={() => openPaymentProofModal(app.id, app.nume)}
                                className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-semibold hover:bg-blue-500/30"
                              >
                                💳 Confirmă Plată
                              </button>
                            )}
                            <button
                              onClick={() => handleApplicationAction(app.id, 'approve')}
                              disabled={(app.tier === 'suprem' && suprem) || app.status === 'pending'}
                              title={app.status === 'pending' ? 'Trebuie să confirmi plata mai întâi' : ''}
                              className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                                (app.tier === 'suprem' && suprem) || app.status === 'pending'
                                  ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                                  : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              }`}
                            >
                              ✓ Aprobă
                            </button>
                            <button
                              onClick={() => handleApplicationAction(app.id, 'reject', 'Respins de admin')}
                              className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500/30"
                            >
                              ✗ Respinge
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => fetchApplicationHistory(app.id, app.nume)}
                          className="px-3 py-1 bg-white/10 text-white/60 rounded-lg text-sm hover:bg-purple-500/20 hover:text-purple-400"
                        >
                          📜 Istoric {app.history_count > 0 && `(${app.history_count})`}
                        </button>
                        <button
                          onClick={() => handleDeleteApplication(app.id)}
                          className="px-3 py-1 bg-white/10 text-white/60 rounded-lg text-sm hover:bg-red-500/20 hover:text-red-400"
                        >
                          🗑️ Șterge
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {paginatedApplications.length === 0 && (
                <div className="text-center py-12 text-white/50">
                  Nu există cereri în această categorie
                </div>
              )}
            </div>

            {/* Pagination Bottom */}
            {appTotalPages > 1 && (
              <div className="pt-4 border-t border-white/10">
                <Pagination
                  currentPage={appPage}
                  totalPages={appTotalPages}
                  onPageChange={setAppPage}
                />
                <p className="text-center text-white/40 text-xs mt-2">
                  Pagina {appPage} din {appTotalPages} ({filteredApplications.length} cereri)
                </p>
              </div>
            )}
          </div>
        )}

        {/* Barosani Tab */}
        {activeTab === 'barosani' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex gap-2 flex-wrap">
                {[
                  { id: 'all', label: 'Toți' },
                  { id: 'active', label: 'Activi' },
                  { id: 'inactive', label: 'Inactivi' },
                  { id: 'expired', label: 'Expirați' },
                  { id: 'platinum', label: '💎 Platinum' },
                  { id: 'gold', label: '🏆 Gold' },
                  { id: 'basic', label: '⭐ Basic' }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setBarosanFilter(filter.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      barosanFilter === filter.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <div className="text-white/50 text-sm">
                {filteredBarosani.length} barosani
              </div>
            </div>

            {/* Pagination Top */}
            {barosanTotalPages > 1 && (
              <div className="pb-2 border-b border-white/10">
                <Pagination
                  currentPage={barosanPage}
                  totalPages={barosanTotalPages}
                  onPageChange={setBarosanPage}
                />
              </div>
            )}

            {/* Barosani List */}
            <div className="grid md:grid-cols-2 gap-4">
              {paginatedBarosani.map(barosan => (
                <div key={barosan.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-start gap-4">
                    {barosan.poza && (
                      <img src={barosan.poza} alt={barosan.nume} className="w-16 h-16 rounded-full object-cover border-2 border-white/20" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{tierConfig[barosan.tier]?.icon || '⭐'}</span>
                        <h3 className="text-white font-bold">{barosan.nume}</h3>
                      </div>
                      <p className="text-white/50 text-sm">ID: <span className="font-mono text-purple-400">{barosan.certificat_id}</span></p>
                      <p className="text-white/60 italic text-sm">"{barosan.motto}"</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          barosan.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          barosan.status === 'inactive' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {barosan.status === 'active' ? 'Activ' :
                           barosan.status === 'inactive' ? 'Inactiv' : 'Expirat'}
                        </span>
                        <span className="text-white/40 text-xs">
                          Expiră: {new Date(barosan.data_expirare).toLocaleDateString('ro-RO')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                    {barosan.status === 'active' ? (
                      <button
                        onClick={() => handleUpdateBarosanStatus(barosan, 'inactive')}
                        className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-semibold hover:bg-yellow-500/30"
                      >
                        ⏸️ Inactivează
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateBarosanStatus(barosan, 'active')}
                        className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold hover:bg-green-500/30"
                      >
                        ▶️ Reactivează
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteBarosan(barosan.id)}
                      className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500/30"
                    >
                      🗑️ Șterge
                    </button>
                  </div>
                </div>
              ))}

              {paginatedBarosani.length === 0 && (
                <div className="col-span-2 text-center py-12 text-white/50">
                  Nu există barosani în această categorie
                </div>
              )}
            </div>

            {/* Pagination Bottom */}
            {barosanTotalPages > 1 && (
              <div className="pt-4 border-t border-white/10">
                <Pagination
                  currentPage={barosanPage}
                  totalPages={barosanTotalPages}
                  onPageChange={setBarosanPage}
                />
                <p className="text-center text-white/40 text-xs mt-2">
                  Pagina {barosanPage} din {barosanTotalPages} ({filteredBarosani.length} barosani)
                </p>
              </div>
            )}
          </div>
        )}

        {/* Suprem Tab */}
        {activeTab === 'suprem' && (
          <div className="space-y-6">
            {suprem ? (
              <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/30">
                <div className="flex items-center gap-2 mb-6">
                  <img src="/Crown.png" alt="Crown" className="w-10 h-10 object-contain" />
                  <h2 className="text-2xl font-black text-white">Barosanul Suprem Activ</h2>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                  {suprem.poza && (
                    <img src={suprem.poza} alt={suprem.nume} className="w-32 h-32 rounded-full object-cover border-4 border-purple-500" />
                  )}

                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-white/50 text-sm">Nume</p>
                      <p className="text-2xl font-bold text-white">{suprem.nume}</p>
                    </div>

                    <div>
                      <p className="text-white/50 text-sm">Motto</p>
                      <p className="text-white/80 italic">"{suprem.motto}"</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/50 text-sm">Pachet</p>
                        <p className="text-purple-300 font-bold">{suprem.pachet}</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-sm">Sumă plătită</p>
                        <p className="text-green-400 font-bold">{suprem.sumaPlatita} RON</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-sm">Start</p>
                        <p className="text-white">{new Date(suprem.dataStart).toLocaleString('ro-RO')}</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-sm">Expirare</p>
                        <p className="text-white">{new Date(suprem.dataExpirare).toLocaleString('ro-RO')}</p>
                      </div>
                    </div>

                    {suprem.link && (
                      <div>
                        <p className="text-white/50 text-sm">Link</p>
                        <a href={suprem.link} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                          {suprem.link}
                        </a>
                      </div>
                    )}

                    <div className="pt-4 flex flex-col gap-4">
                      <div className="bg-purple-500/20 rounded-lg p-4">
                        <p className="text-white/60 text-sm mb-1">Timp rămas</p>
                        <p className="text-2xl font-bold text-purple-300">
                          {Math.max(0, Math.floor(suprem.secondsRemaining / 3600))}h {Math.max(0, Math.floor((suprem.secondsRemaining % 3600) / 60))}m
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeactivateSuprem(suprem.id)}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 transition-colors"
                      >
                        🗑️ Dezactivează Suprem
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 rounded-2xl p-12 border border-white/10 text-center">
                <div className="mb-4"><img src="/Crown.png" alt="Crown" className="w-16 h-16 object-contain mx-auto" /></div>
                <h2 className="text-2xl font-bold text-white mb-2">Locul de Suprem este liber!</h2>
                <p className="text-white/60">Nu există niciun Barosan Suprem activ în acest moment.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment Proof Modal */}
      {paymentProofModal.show && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] rounded-2xl p-6 max-w-md w-full border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">💳 Confirmă Plata</h3>
            <p className="text-white/60 mb-4">
              Confirmi plata pentru <span className="text-purple-400 font-semibold">{paymentProofModal.appName}</span>?
            </p>

            <div className="mb-4">
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Link dovadă plată (opțional)
              </label>
              <input
                type="url"
                value={paymentProofUrl}
                onChange={(e) => setPaymentProofUrl(e.target.value)}
                placeholder="https://... (screenshot, link Revolut, etc.)"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-white/40 text-xs mt-1">
                Poți adăuga un link către screenshot-ul plății sau confirmarea Revolut
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPaymentProofModal({ show: false, appId: null, appName: '' })}
                className="flex-1 px-4 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                Anulează
              </button>
              <button
                onClick={confirmPaymentWithProof}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:scale-[1.02] transition-transform"
              >
                ✓ Confirmă Plata
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application History Modal */}
      {historyModal.show && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] rounded-2xl p-6 max-w-lg w-full border border-white/10 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">📜 Istoric Cerere</h3>
              <button
                onClick={() => setHistoryModal({ show: false, appId: null, appName: '' })}
                className="text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <p className="text-white/60 mb-4">
              Istoric pentru <span className="text-purple-400 font-semibold">{historyModal.appName}</span>
            </p>

            <div className="flex-1 overflow-y-auto">
              {historyLoading ? (
                <div className="text-center py-8 text-white/50">
                  <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                  Se încarcă...
                </div>
              ) : applicationHistory.length === 0 ? (
                <div className="text-center py-8 text-white/50">
                  <p className="text-4xl mb-2">📭</p>
                  <p>Nu există istoric pentru această cerere.</p>
                  <p className="text-xs mt-2">Istoricul va apărea când se vor face acțiuni asupra cererii.</p>
                  <p className="text-xs mt-2 text-purple-400">ID cerere: {historyModal.appId}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applicationHistory.map((item, index) => {
                    const actionInfo = formatHistoryAction(item.action);
                    return (
                      <div
                        key={item.id || index}
                        className="bg-white/5 rounded-lg p-4 border border-white/10"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{actionInfo.icon}</span>
                          <span className={`font-bold ${actionInfo.color}`}>
                            {actionInfo.label}
                          </span>
                        </div>
                        <div className="text-sm text-white/60 space-y-1">
                          {item.old_status && item.new_status && (
                            <p>
                              Status: <span className="text-yellow-400">{item.old_status}</span>
                              {' → '}
                              <span className="text-green-400">{item.new_status}</span>
                            </p>
                          )}
                          {item.notes && (
                            <p className="italic text-white/50">"{item.notes}"</p>
                          )}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                            <span className="text-white/40 text-xs">
                              {item.admin_name ? `Admin: ${item.admin_name}` : 'Sistem'}
                            </span>
                            <span className="text-white/40 text-xs">
                              {new Date(item.created_at).toLocaleString('ro-RO', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <button
                onClick={() => setHistoryModal({ show: false, appId: null, appName: '' })}
                className="w-full px-4 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                Închide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
