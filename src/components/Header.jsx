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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { to: '/', label: 'Acasa' },
    { to: '/zid', label: 'Registrul' },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-dark shadow-[0_4px_30px_rgba(201,162,39,0.15)] border-b border-[var(--border-subtle)]'
          : 'bg-[var(--color-bg-void)]/50 backdrop-blur-md'
      }`}
      role="banner"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Top gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-lg"
            aria-label="Registrul Oficial al Barosanilor - Pagina principala"
          >
            <motion.div
              className="relative w-10 h-10 md:w-12 md:h-12"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#9333EA] rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-full h-full rounded-full overflow-hidden shadow-lg">
                <img src="/Panda.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
            </motion.div>
            <div className="hidden sm:block">
              <div className="text-xs md:text-sm font-bold text-[#D4AF37] tracking-wider">
                REGISTRUL OFICIAL
              </div>
              <div className="text-xs md:text-sm font-bold text-[#D4AF37]">
                AL BAROSANILOR
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3" role="navigation" aria-label="Navigare principala">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`
                  relative px-5 py-2 text-sm font-bold rounded-xl overflow-hidden group
                  bg-gradient-to-b from-[#1a1708]/80 via-[#0f0f12]/90 to-[#12110a]/80
                  backdrop-blur-sm
                  hover:border-[#D4AF37]/70 hover:shadow-[0_0_20px_rgba(212,175,55,0.25)]
                  transition-all duration-300 ease-out
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]
                  ${location.pathname === item.to ? 'border border-[#D4AF37]/70 shadow-[0_0_20px_rgba(212,175,55,0.25)]' : 'border border-transparent'}
                `}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative block ${location.pathname === item.to ? 'text-[#D4AF37]' : 'text-[#D4AF37]/80 group-hover:text-[#D4AF37]'} transition-colors duration-300`}
                >
                  {item.label}
                </motion.span>
              </Link>
            ))}

            {/* Suprem Button - Purple/Mauve */}
            <Link
              to="/barosanul-suprem"
              className={`
                relative px-5 py-2 text-sm font-bold rounded-xl overflow-hidden group
                bg-gradient-to-b from-[#1a1025]/80 via-[#0f0f12]/90 to-[#12101a]/80
                backdrop-blur-sm
                hover:border-[#9333EA]/70 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)]
                transition-all duration-300 ease-out
                focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400
                ${location.pathname === '/barosanul-suprem' ? 'border border-[#9333EA]/70 shadow-[0_0_20px_rgba(147,51,234,0.3)]' : 'border border-transparent'}
              `}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#9333EA]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <motion.span
                className={`relative block ${location.pathname === '/barosanul-suprem' ? 'text-[#B388FF]' : 'text-[#B388FF]/80 group-hover:text-[#B388FF]'} transition-colors duration-300`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Suprem
              </motion.span>
            </Link>

            {/* Inscrie-te Button - Same glass style, gold */}
            <Link
              to="/cum-devin-barosan"
              className={`
                relative px-5 py-2 text-sm font-bold rounded-xl overflow-hidden group
                bg-gradient-to-b from-[#1a1708]/80 via-[#0f0f12]/90 to-[#12110a]/80
                backdrop-blur-sm
                hover:border-[#D4AF37]/70 hover:shadow-[0_0_20px_rgba(212,175,55,0.25)]
                transition-all duration-300 ease-out
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]
                ${location.pathname === '/cum-devin-barosan' ? 'border border-[#D4AF37]/70 shadow-[0_0_20px_rgba(212,175,55,0.25)]' : 'border border-transparent'}
              `}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <motion.span
                className={`relative block ${location.pathname === '/cum-devin-barosan' ? 'text-[#D4AF37]' : 'text-[#D4AF37]/80 group-hover:text-[#D4AF37]'} transition-colors duration-300`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Inscrie-te
              </motion.span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="ml-2 px-4 py-2 text-sm font-bold rounded-lg bg-red-600/90 hover:bg-red-600 text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="block">
                  Admin
                </motion.span>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            aria-label={mobileMenuOpen ? 'Inchide meniul' : 'Deschide meniul'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <motion.span
                className="w-5 h-0.5 bg-[#D4AF37] block"
                animate={{
                  rotate: mobileMenuOpen ? 45 : 0,
                  y: mobileMenuOpen ? 6 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="w-5 h-0.5 bg-[#D4AF37] block mt-1.5"
                animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="w-5 h-0.5 bg-[#D4AF37] block mt-1.5"
                animate={{
                  rotate: mobileMenuOpen ? -45 : 0,
                  y: mobileMenuOpen ? -6 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              id="mobile-menu"
              className="md:hidden py-4 border-t border-[#D4AF37]/20"
              role="navigation"
              aria-label="Navigare mobila"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="flex flex-col gap-2">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        block w-full px-4 py-3 text-base font-bold rounded-xl
                        border border-[#D4AF37]/40 bg-gradient-to-b from-[#1a1708]/80 via-[#0f0f12]/90 to-[#12110a]/80
                        backdrop-blur-sm shadow-[0_0_15px_rgba(212,175,55,0.1)]
                        transition-all duration-300
                        hover:border-[#D4AF37]/70 hover:shadow-[0_0_20px_rgba(212,175,55,0.25)]
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]
                        ${location.pathname === item.to ? 'text-[#D4AF37] border-[#D4AF37]/70' : 'text-[#D4AF37]/80'}
                      `}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link
                    to="/barosanul-suprem"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      block w-full px-4 py-3 text-base font-bold rounded-xl
                      border border-[#9333EA]/40 bg-gradient-to-b from-[#1a1025]/80 via-[#0f0f12]/90 to-[#12101a]/80
                      backdrop-blur-sm shadow-[0_0_15px_rgba(147,51,234,0.15)]
                      transition-all duration-300
                      hover:border-[#9333EA]/70 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)]
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400
                      ${location.pathname === '/barosanul-suprem' ? 'text-[#B388FF] border-[#9333EA]/70' : 'text-[#B388FF]/80'}
                    `}
                  >
                    Barosanul Suprem
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    to="/cum-devin-barosan"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      block w-full px-4 py-3 text-base font-bold rounded-xl
                      border border-[#D4AF37]/40 bg-gradient-to-b from-[#1a1708]/80 via-[#0f0f12]/90 to-[#12110a]/80
                      backdrop-blur-sm shadow-[0_0_15px_rgba(212,175,55,0.1)]
                      transition-all duration-300
                      hover:border-[#D4AF37]/70 hover:shadow-[0_0_20px_rgba(212,175,55,0.25)]
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]
                      ${location.pathname === '/cum-devin-barosan' ? 'text-[#D4AF37] border-[#D4AF37]/70' : 'text-[#D4AF37]/80'}
                    `}
                  >
                    Inscrie-te Acum
                  </Link>
                </motion.div>

                {isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 text-base font-bold text-center bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                    >
                      Panou Admin
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
    </motion.header>
  );
}
