import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#0f1f3d] via-[#1a365d] to-[#0f1f3d] text-white overflow-hidden" role="contentinfo">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-8">
          {/* Logo & Brand */}
          <div className="text-center md:text-left md:col-span-2" role="region" aria-label="Informații despre site">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full blur-md opacity-50"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-2xl">👑</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-extrabold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  REGISTRUL OFICIAL
                </h3>
                <p className="text-xs font-bold text-[#D4AF37]">AL BAROSANILOR</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 italic mb-4">
              "Unde șmecheria devine oficială"
            </p>

            {/* Disclaimer Compact */}
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">
              <span className="text-lg">⚠️</span>
              <p className="text-xs text-yellow-300">
                <strong>PARODIE / UMOR</strong> - Certificatele nu au valoare oficială.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-sm font-bold text-[#D4AF37] mb-3 uppercase tracking-wide">Navigare</h4>
            <nav className="space-y-2" role="navigation" aria-label="Link-uri rapide footer">
              <Link
                to="/"
                className="block text-sm text-gray-300 hover:text-[#D4AF37] transition-colors focus:outline-none focus:text-[#D4AF37]"
              >
                🏠 Acasă
              </Link>
              <Link
                to="/zid"
                className="block text-sm text-gray-300 hover:text-[#D4AF37] transition-colors focus:outline-none focus:text-[#D4AF37]"
              >
                📋 Registrul
              </Link>
              <Link
                to="/cum-devin-barosan"
                className="block text-sm text-gray-300 hover:text-[#D4AF37] transition-colors focus:outline-none focus:text-[#D4AF37]"
              >
                ⭐ Înscrie-te
              </Link>
            </nav>
          </div>

          {/* Social & Legal */}
          <div className="text-center md:text-left">
            <h4 className="text-sm font-bold text-[#D4AF37] mb-3 uppercase tracking-wide">Urmărește-ne</h4>

            {/* Social Links */}
            <div className="flex justify-center md:justify-start gap-3 mb-4" role="navigation" aria-label="Social media">
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-lg"
                aria-label="Vizitează-ne pe TikTok"
              >
                <div className="absolute inset-0 bg-[#D4AF37] rounded-lg blur opacity-0 group-hover:opacity-50 group-focus:opacity-50 transition-opacity"></div>
                <div className="relative w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all group-hover:scale-110 group-focus:scale-110">
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-[#D4AF37] group-focus:text-[#D4AF37] transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </div>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-lg"
                aria-label="Vizitează-ne pe Instagram"
              >
                <div className="absolute inset-0 bg-[#D4AF37] rounded-lg blur opacity-0 group-hover:opacity-50 group-focus:opacity-50 transition-opacity"></div>
                <div className="relative w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all group-hover:scale-110 group-focus:scale-110">
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-[#D4AF37] group-focus:text-[#D4AF37] transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
              </a>
            </div>

            {/* Legal Links */}
            <div className="space-y-1.5">
              <Link
                to="/termeni"
                className="block text-xs text-gray-400 hover:text-[#D4AF37] transition-colors"
              >
                Termeni și Condiții
              </Link>
              <Link
                to="/confidentialitate"
                className="block text-xs text-gray-400 hover:text-[#D4AF37] transition-colors"
              >
                Politica de Confidențialitate
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            © 2025 <span className="font-bold text-[#D4AF37]">Registrul Oficial al Barosanilor</span>. Toate drepturile de șmecherie rezervate.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Made with 💛 and lots of șmecherie
          </p>
        </div>
      </div>
    </footer>
  );
}
