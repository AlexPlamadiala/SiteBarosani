import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import StarryBackground from './components/StarryBackground';

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

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Page wrapper component with animation
function PageWrapper({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
}

// Loading fallback component with animation
function PageLoader() {
  return (
    <motion.div
      className="min-h-[60vh] flex items-center justify-center bg-transparent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
        <motion.div
          className="text-5xl mb-4"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <img src="/Crown.png" alt="Crown" className="w-16 h-16 object-contain mx-auto" />
        </motion.div>
        <motion.p
          className="text-yellow-400 font-bold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Se încarcă...
        </motion.p>
      </div>
    </motion.div>
  );
}

// Animated routes component
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/zid" element={<PageWrapper><Zid /></PageWrapper>} />
        <Route path="/cum-devin-barosan" element={<PageWrapper><CumDevinBarosan /></PageWrapper>} />
        <Route path="/termeni" element={<PageWrapper><Termeni /></PageWrapper>} />
        <Route path="/confidentialitate" element={<PageWrapper><Confidentialitate /></PageWrapper>} />
        <Route path="/barosanul-suprem" element={<PageWrapper><BarosanulSuprem /></PageWrapper>} />
        <Route path="/barosan/:certificatId" element={<PageWrapper><BarosanProfile /></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
        <Route path="/upgrade" element={<PageWrapper><Upgrade /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
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
          {/* Animated cosmic background */}
          <StarryBackground />

          <div className="flex flex-col min-h-screen relative z-10">
            <Header />
            <main id="main-content" className="flex-grow pt-16 md:pt-20" role="main">
              <Suspense fallback={<PageLoader />}>
                <AnimatedRoutes />
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
