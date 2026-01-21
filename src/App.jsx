import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Zid from './pages/Zid';
import CumDevinBarosan from './pages/CumDevinBarosan';
import Termeni from './pages/Termeni';
import Confidentialitate from './pages/Confidentialitate';
import BarosanulSuprem from './pages/BarosanulSuprem';
import Admin from './pages/Admin';

function App() {
  return (
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
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/zid" element={<Zid />} />
              <Route path="/cum-devin-barosan" element={<CumDevinBarosan />} />
              <Route path="/termeni" element={<Termeni />} />
              <Route path="/confidentialitate" element={<Confidentialitate />} />
              <Route path="/barosanul-suprem" element={<BarosanulSuprem />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
          <BackToTop />
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
