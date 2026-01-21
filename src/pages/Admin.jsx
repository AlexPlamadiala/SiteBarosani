import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';

const API_BASE = 'http://localhost/SiteBarosani/api';

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

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth.php`, { credentials: 'include' });
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        setUser(data.user);
        loadData();
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
        toast.success('Autentificare reușită!');
        loadData();
      } else {
        toast.error(data.error || 'Eroare la autentificare');
      }
    } catch (err) {
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
  const handleApplicationAction = async (id, action, notes = '') => {
    try {
      const res = await fetch(`${API_BASE}/admin/applications.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, action, notes })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        loadData();
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error('Eroare la procesarea cererii');
    }
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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
      toast.error('Eroare la actualizare');
    }
  };

  // Tier colors and icons
  const tierConfig = {
    suprem: { color: 'from-purple-500 to-pink-500', icon: '👑', textColor: 'text-purple-400' },
    platinum: { color: 'from-gray-300 to-gray-400', icon: '💎', textColor: 'text-gray-300' },
    gold: { color: 'from-yellow-400 to-yellow-600', icon: '🏆', textColor: 'text-yellow-400' },
    basic: { color: 'from-blue-400 to-blue-600', icon: '⭐', textColor: 'text-blue-400' }
  };

  // Filter applications
  const filteredApplications = applications.filter(app => {
    if (appFilter === 'all') return true;
    return app.status === appFilter;
  });

  // Filter barosani
  const filteredBarosani = barosani.filter(b => {
    if (barosanFilter === 'all') return true;
    if (barosanFilter === 'active') return b.status === 'active';
    if (barosanFilter === 'expired') return b.status === 'expired';
    return b.tier === barosanFilter;
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white text-xl">Se încarcă...</div>
      </div>
    );
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
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
    <div className="min-h-screen bg-[#0a0a0a]">
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
                { label: 'Total Barosani', value: statistics?.total_barosani || 0, icon: '👥', color: 'from-purple-500 to-pink-500' },
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
                    <div className="text-3xl mb-1">{tierConfig[item.tier].icon}</div>
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

            {/* Applications List */}
            <div className="space-y-4">
              {filteredApplications.map(app => (
                <div key={app.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {app.poza && (
                        <img src={app.poza} alt={app.nume} className="w-16 h-16 rounded-full object-cover border-2 border-white/20" />
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{tierConfig[app.tier]?.icon || '⭐'}</span>
                          <h3 className="text-white font-bold text-lg">{app.nume}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${tierConfig[app.tier]?.textColor || 'text-white'}`}>
                            {app.tier}
                          </span>
                        </div>
                        <p className="text-white/50 text-sm">Cod: <span className="text-purple-400 font-mono">{app.code}</span></p>
                        <p className="text-white/50 text-sm">Email: {app.email}</p>
                        <p className="text-white/50 text-sm">Revolut: @{app.revolut_id}</p>
                        <p className="text-white/60 italic mt-1">"{app.motto}"</p>
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
                        <div className="flex gap-2">
                          {app.status === 'pending' && (
                            <button
                              onClick={() => handleApplicationAction(app.id, 'payment_confirmed')}
                              className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-semibold hover:bg-blue-500/30"
                            >
                              💳 Plată OK
                            </button>
                          )}
                          <button
                            onClick={() => handleApplicationAction(app.id, 'approve')}
                            className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold hover:bg-green-500/30"
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
                      )}

                      <button
                        onClick={() => handleDeleteApplication(app.id)}
                        className="px-3 py-1 bg-white/10 text-white/60 rounded-lg text-sm hover:bg-red-500/20 hover:text-red-400"
                      >
                        🗑️ Șterge
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredApplications.length === 0 && (
                <div className="text-center py-12 text-white/50">
                  Nu există cereri în această categorie
                </div>
              )}
            </div>
          </div>
        )}

        {/* Barosani Tab */}
        {activeTab === 'barosani' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              {[
                { id: 'all', label: 'Toți' },
                { id: 'active', label: 'Activi' },
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

            {/* Barosani List */}
            <div className="grid md:grid-cols-2 gap-4">
              {filteredBarosani.map(barosan => (
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
                          barosan.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {barosan.status === 'active' ? 'Activ' : 'Expirat'}
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
                        onClick={() => handleUpdateBarosanStatus(barosan, 'expired')}
                        className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-semibold hover:bg-yellow-500/30"
                      >
                        Dezactivează
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateBarosanStatus(barosan, 'active')}
                        className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold hover:bg-green-500/30"
                      >
                        Reactivează
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

              {filteredBarosani.length === 0 && (
                <div className="col-span-2 text-center py-12 text-white/50">
                  Nu există barosani în această categorie
                </div>
              )}
            </div>
          </div>
        )}

        {/* Suprem Tab */}
        {activeTab === 'suprem' && (
          <div className="space-y-6">
            {suprem ? (
              <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/30">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-4xl">👑</span>
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

                    <div className="pt-4">
                      <div className="bg-purple-500/20 rounded-lg p-4">
                        <p className="text-white/60 text-sm mb-1">Timp rămas</p>
                        <p className="text-2xl font-bold text-purple-300">
                          {Math.max(0, Math.floor(suprem.secondsRemaining / 3600))}h {Math.max(0, Math.floor((suprem.secondsRemaining % 3600) / 60))}m
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 rounded-2xl p-12 border border-white/10 text-center">
                <div className="text-6xl mb-4">👑</div>
                <h2 className="text-2xl font-bold text-white mb-2">Locul de Suprem este liber!</h2>
                <p className="text-white/60">Nu există niciun Barosan Suprem activ în acest moment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
