import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Check if admin is authenticated
  useEffect(() => {
    const checkAdmin = () => {
      const adminAuth = sessionStorage.getItem('adminAuthenticated');
      setIsAdmin(adminAuth === 'true');
    };
    checkAdmin();
    window.addEventListener('focus', checkAdmin);
    return () => window.removeEventListener('focus', checkAdmin);
  }, [location.pathname]);

  // Detect scroll for header effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClasses = `sticky top-0 z-50 transition-all duration-500 ${
    scrolled
      ? 'bg-[#0a0a0a]/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(212,175,55,0.15)]'
      : 'bg-[#0a0a0a]/80 backdrop-blur-md'
  }`;

  const navLinkVariants = {
    hover: {
      scale: 1.05,
      color: '#D4AF37',
      transition: { duration: 0.2 },
    },
  };

  const logoVariants = {
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, 0],
      transition: { duration: 0.5 },
    },
  };

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  return (
    <motion.header
      className={headerClasses}
      role="banner"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Luxury top border glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo with 3D effect */}
          <Link
            to="/"
            className="flex items-center space-x-3 group focus:outline-none rounded-lg"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Registrul Oficial al Barosanilor - Pagina principala"
          >
            <motion.div
              className="w-12 h-12 md:w-14 md:h-14 relative"
              variants={logoVariants}
              whileHover="hover"
            >
              {/* Glow effect behind logo */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#9333EA] rounded-full blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative w-full h-full bg-gradient-to-br from-[#D4AF37] via-[#FFD700] to-[#D4AF37] rounded-full flex items-center justify-center shadow-xl">
                <span className="text-2xl md:text-3xl drop-shadow-lg">👑</span>
              </div>
            </motion.div>
            <div>
              <motion.h1
                className="text-sm md:text-lg font-extrabold text-white"
                whileHover={{ scale: 1.02 }}
              >
                REGISTRUL OFICIAL
              </motion.h1>
              <motion.h2
                className="text-xs md:text-sm font-bold bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] bg-clip-text text-transparent"
                whileHover={{ scale: 1.02 }}
              >
                AL BAROSANILOR
              </motion.h2>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-4" role="navigation" aria-label="Navigare principala">
            <motion.div variants={navLinkVariants} whileHover="hover">
              <Link
                to="/"
                className="px-4 py-2 text-sm lg:text-base text-white/90 transition-colors font-semibold rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                Acasa
              </Link>
            </motion.div>

            <motion.div variants={navLinkVariants} whileHover="hover">
              <Link
                to="/zid"
                className="px-4 py-2 text-sm lg:text-base text-white/90 transition-colors font-semibold rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                Registrul
              </Link>
            </motion.div>

            {/* Suprem Button - Premium animated */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/barosanul-suprem"
                className="relative px-4 py-2 text-sm lg:text-base font-bold rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                {/* Animated gradient background */}
                <span className="absolute inset-0 bg-gradient-to-r from-[#9333EA] via-[#D4AF37] to-[#9333EA] bg-[length:200%_100%] animate-gradient" />
                {/* Shimmer effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative text-white">Suprem</span>
              </Link>
            </motion.div>

            {/* Inscrie-te Button - Gold luxury */}
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/cum-devin-barosan"
                className="relative px-4 lg:px-6 py-2 rounded-lg font-bold text-sm lg:text-base overflow-hidden group shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-shadow focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/50"
              >
                {/* Gold gradient background */}
                <span className="absolute inset-0 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#FFD700]" />
                {/* Shimmer */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                <span className="relative text-[#0a0a0a] font-bold">Inscrie-te</span>
              </Link>
            </motion.div>

            {isAdmin && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/admin"
                  className="px-3 py-2 text-sm font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Admin
                </Link>
              </motion.div>
            )}
          </nav>

          {/* Mobile Hamburger */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            aria-label={mobileMenuOpen ? "Inchide meniu" : "Deschide meniu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={mobileMenuOpen ? 'open' : 'closed'}
              className="w-6 h-6 flex flex-col justify-center items-center"
            >
              <motion.span
                className="w-5 h-0.5 bg-[#D4AF37] block"
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: 45, y: 6 },
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="w-5 h-0.5 bg-[#D4AF37] block mt-1.5"
                variants={{
                  closed: { opacity: 1 },
                  open: { opacity: 0 },
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="w-5 h-0.5 bg-[#D4AF37] block mt-1.5"
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: -45, y: -6 },
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              id="mobile-menu"
              className="md:hidden mt-4 pb-4 space-y-3 border-t border-[#D4AF37]/20 pt-4 overflow-hidden"
              role="navigation"
              aria-label="Navigare mobila"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {[
                { to: '/', label: 'Acasa' },
                { to: '/zid', label: 'Registrul' },
              ].map((item, i) => (
                <motion.div
                  key={item.to}
                  custom={i}
                  variants={mobileItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base text-white/90 hover:text-[#D4AF37] transition-colors font-semibold py-2 px-3 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                custom={2}
                variants={mobileItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  to="/barosanul-suprem"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-bold py-3 px-4 text-center text-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#9333EA] via-[#D4AF37] to-[#9333EA] bg-[length:200%_100%] animate-gradient" />
                  <span className="relative">Barosanul Suprem</span>
                </Link>
              </motion.div>

              <motion.div
                custom={3}
                variants={mobileItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  to="/cum-devin-barosan"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-bold py-3 px-4 text-center bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#FFD700] text-[#0a0a0a] rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/50"
                >
                  Inscrie-te Acum
                </Link>
              </motion.div>

              {isAdmin && (
                <motion.div
                  custom={4}
                  variants={mobileItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base font-bold py-3 px-4 text-center bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Panou Admin
                  </Link>
                </motion.div>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
