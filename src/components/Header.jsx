import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#1a365d] to-[#2d5986] text-white shadow-xl border-b border-white/10" role="banner">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group focus:outline-none focus:ring-4 focus:ring-[#D4AF37] rounded-lg" onClick={() => setMobileMenuOpen(false)} aria-label="Registrul Oficial al Barosanilor - Pagina principală">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full blur-md opacity-50"></div>
              <div className="relative w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <span className="text-2xl md:text-3xl">👑</span>
              </div>
            </div>
            <div>
              <h1 className="text-sm md:text-lg font-extrabold text-white">
                REGISTRUL OFICIAL
              </h1>
              <h2 className="text-xs md:text-sm font-bold text-[#D4AF37]">
                AL BAROSANILOR
              </h2>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-4" role="navigation" aria-label="Navigare principală">
            <Link
              to="/"
              className="px-4 py-2 text-sm lg:text-base hover:text-[#D4AF37] transition-colors font-semibold rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              🏠 Acasă
            </Link>
            <Link
              to="/zid"
              className="px-4 py-2 text-sm lg:text-base hover:text-[#D4AF37] transition-colors font-semibold rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              📋 Registrul
            </Link>
            <Link
              to="/barosanul-suprem"
              className="px-4 py-2 text-sm lg:text-base font-bold rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 animate-pulse"
            >
              👑 Suprem
            </Link>
            <Link
              to="/cum-devin-barosan"
              className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1a365d] px-4 lg:px-6 py-2 rounded-lg font-bold text-sm lg:text-base hover:scale-105 transition-transform shadow-lg focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/50"
            >
              ⭐ Înscrie-te
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            aria-label={mobileMenuOpen ? "Închide meniu" : "Deschide meniu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav id="mobile-menu" className="md:hidden mt-4 pb-4 space-y-3 border-t border-white/20 pt-4" role="navigation" aria-label="Navigare mobilă">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base hover:text-[#D4AF37] transition-colors font-semibold py-2 px-3 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              🏠 Acasă
            </Link>
            <Link
              to="/zid"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base hover:text-[#D4AF37] transition-colors font-semibold py-2 px-3 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              📋 Registrul
            </Link>
            <Link
              to="/barosanul-suprem"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-bold py-3 px-4 text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              👑 Barosanul Suprem
            </Link>
            <Link
              to="/cum-devin-barosan"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-bold py-3 px-4 text-center bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1a365d] rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/50"
            >
              ⭐ Înscrie-te Acum
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
