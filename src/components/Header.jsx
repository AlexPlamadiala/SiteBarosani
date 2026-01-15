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
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#1a365d] to-[#2d5986] text-white shadow-lg">
      <div className="container mx-auto px-4 py-2 md:py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <div className="text-xl md:text-2xl">👑</div>
            <div>
              <h1 className="text-base md:text-xl font-bold tracking-wide">
                ZIDUL BAROSANILOR
              </h1>
              <p className="text-xs text-gray-300 hidden md:block">
                Unde șmecheria devine oficială
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-base hover:text-[#D4AF37] transition-colors font-medium"
            >
              Acasă
            </Link>
            <Link
              to="/zid"
              className="text-base hover:text-[#D4AF37] transition-colors font-medium"
            >
              Zidul
            </Link>
            <Link
              to="/cum-devin-barosan"
              className="text-base hover:text-[#D4AF37] transition-colors font-medium"
            >
              Cum Devin Barosan
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3 border-t border-white/20 pt-4">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="block text-base hover:text-[#D4AF37] transition-colors font-medium py-2"
            >
              🏠 Acasă
            </Link>
            <Link
              to="/zid"
              onClick={closeMobileMenu}
              className="block text-base hover:text-[#D4AF37] transition-colors font-medium py-2"
            >
              👑 Zidul
            </Link>
            <Link
              to="/cum-devin-barosan"
              onClick={closeMobileMenu}
              className="block text-base hover:text-[#D4AF37] transition-colors font-medium py-2 bg-[#D4AF37] text-[#1a365d] rounded-lg px-4 text-center"
            >
              ⭐ Cum Devin Barosan
            </Link>
          </nav>
        )}

        {/* Badge - Hidden on mobile when menu is open */}
        {!mobileMenuOpen && (
          <div className="mt-3 text-center">
            <span className="inline-block bg-[#D4AF37] text-[#1a365d] px-3 md:px-4 py-1 rounded-full text-xs font-semibold">
              ⭐ Instituție Acreditată de Șmecherie din 2025 ⭐
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
