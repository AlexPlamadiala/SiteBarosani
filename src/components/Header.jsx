import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#1a365d] via-[#2d5986] to-[#1a365d] text-white shadow-2xl border-b border-white/10">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Enhanced */}
          <Link to="/" className="flex items-center space-x-3 group" onClick={closeMobileMenu}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <span className="text-2xl md:text-3xl">👑</span>
              </div>
            </div>
            <div>
              <h1 className="text-sm md:text-lg lg:text-xl font-extrabold tracking-wide bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">
                REGISTRUL OFICIAL
              </h1>
              <h2 className="text-xs md:text-sm font-bold text-[#D4AF37]">
                AL BAROSANILOR
              </h2>
              <p className="text-[10px] md:text-xs text-gray-300 hidden lg:block italic">
                Unde șmecheria devine oficială
              </p>
            </div>
          </Link>

          {/* Desktop Navigation - Enhanced */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-4">
            <Link
              to="/"
              className="px-4 py-2 text-sm lg:text-base hover:text-[#D4AF37] transition-all font-semibold rounded-lg hover:bg-white/10"
            >
              🏠 Acasă
            </Link>
            <Link
              to="/zid"
              className="px-4 py-2 text-sm lg:text-base hover:text-[#D4AF37] transition-all font-semibold rounded-lg hover:bg-white/10"
            >
              📋 Registrul
            </Link>
            <Link
              to="/cum-devin-barosan"
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <span className="relative block bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1a365d] px-4 lg:px-6 py-2 rounded-lg font-bold text-sm lg:text-base hover:scale-105 transition-transform shadow-lg">
                ⭐ Înscrie-te
              </span>
            </Link>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              // Close icon
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu - Enhanced */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3 border-t border-white/20 pt-4">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="block text-base hover:text-[#D4AF37] transition-all font-semibold py-2 px-3 rounded-lg hover:bg-white/10"
            >
              🏠 Acasă
            </Link>
            <Link
              to="/zid"
              onClick={closeMobileMenu}
              className="block text-base hover:text-[#D4AF37] transition-all font-semibold py-2 px-3 rounded-lg hover:bg-white/10"
            >
              📋 Registrul
            </Link>
            <Link
              to="/cum-devin-barosan"
              onClick={closeMobileMenu}
              className="block text-base font-bold py-3 px-4 text-center bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1a365d] rounded-lg shadow-lg hover:scale-105 transition-transform"
            >
              ⭐ Înscrie-te Acum
            </Link>
          </nav>
        )}

        {/* Badge - Hidden on mobile when menu is open */}
        {!mobileMenuOpen && (
          <div className="mt-3 text-center">
            <div className="relative inline-block group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <span className="relative inline-block bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1a365d] px-4 md:px-6 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-extrabold shadow-lg uppercase tracking-wide">
                ⭐ Instituție Acreditată de Șmecherie din 2025 ⭐
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
