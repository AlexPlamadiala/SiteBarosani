import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import Header from './components/Header';
import Footer from './components/Footer';

// Eager load Home for fast initial render
import Home from './pages/Home';

// Lazy load other pages for code splitting
const Zid = lazy(() => import('./pages/Zid'));
const CumDevinBarosan = lazy(() => import('./pages/CumDevinBarosan'));
const Termeni = lazy(() => import('./pages/Termeni'));
const Confidentialitate = lazy(() => import('./pages/Confidentialitate'));
const BarosanulSuprem = lazy(() => import('./pages/BarosanulSuprem'));
const BarosanProfile = lazy(() => import('./pages/BarosanProfile'));
const Admin = lazy(() => import('./pages/Admin'));
const Upgrade = lazy(() => import('./pages/Upgrade'));

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#0a0a0a]">
      <div className="text-center">
        <div className="text-5xl animate-bounce mb-4">👑</div>
        <p className="text-yellow-400 font-bold animate-pulse">Se încarcă...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <ScrollToTop />
          {/* Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-[#D4AF37] focus:text-[#1a365d] focus:px-6 focus:py-3 focus:rounded-lg focus:font-bold focus:shadow-xl"
          >
            Sari la conținut principal
          </a>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main id="main-content" className="flex-grow" role="main">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/zid" element={<Zid />} />
                  <Route path="/cum-devin-barosan" element={<CumDevinBarosan />} />
                  <Route path="/termeni" element={<Termeni />} />
                  <Route path="/confidentialitate" element={<Confidentialitate />} />
                  <Route path="/barosanul-suprem" element={<BarosanulSuprem />} />
                  <Route path="/barosan/:certificatId" element={<BarosanProfile />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/upgrade" element={<Upgrade />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <BackToTop />
          </div>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
