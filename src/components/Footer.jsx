import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative bg-[#0a0a0a] text-white overflow-hidden" role="contentinfo">
      {/* Luxury top border */}
      <div className="divider-luxury h-px" />

      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#9333EA]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-10">
          {/* Logo & Brand */}
          <div className="text-center md:text-left md:col-span-2" role="region" aria-label="Informatii despre site">
            <motion.div
              className="flex items-center justify-center md:justify-start gap-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#9333EA] rounded-full blur-lg opacity-50"></div>
                <motion.div
                  className="relative w-14 h-14 rounded-full overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <img src="/Panda.jpg" alt="Logo" className="w-full h-full object-cover" />
                </motion.div>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">
                  REGISTRUL OFICIAL
                </h3>
                <p className="text-sm font-bold text-gold-shimmer">AL BAROSANILOR</p>
              </div>
            </motion.div>

            <motion.p
              className="text-gray-400 italic mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              "Unde smecheria devine oficiala"
            </motion.p>

            {/* Disclaimer Compact */}
            <motion.div
              className="inline-flex items-center gap-3 glass-gold rounded-xl px-4 py-3"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-xl">⚠️</span>
              <p className="text-sm text-[#D4AF37]">
                <strong>PARODIE / UMOR</strong> - Certificatele nu au valoare oficiala.
              </p>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-sm font-bold text-[#D4AF37] mb-4 uppercase tracking-widest">Navigare</h4>
            <nav className="space-y-3" role="navigation" aria-label="Link-uri rapide footer">
              <motion.div whileHover={{ x: 5 }}>
                <Link
                  to="/"
                  className="block text-gray-400 hover:text-[#D4AF37] transition-colors focus:outline-none focus:text-[#D4AF37]"
                >
                  Acasa
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 5 }}>
                <Link
                  to="/zid"
                  className="block text-gray-400 hover:text-[#D4AF37] transition-colors focus:outline-none focus:text-[#D4AF37]"
                >
                  Registrul
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 5 }}>
                <Link
                  to="/cum-devin-barosan"
                  className="block text-gray-400 hover:text-[#D4AF37] transition-colors focus:outline-none focus:text-[#D4AF37]"
                >
                  Inscrie-te
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 5 }}>
                <Link
                  to="/barosanul-suprem"
                  className="block text-[#9333EA] hover:text-[#D4AF37] transition-colors focus:outline-none focus:text-[#D4AF37] font-semibold"
                >
                  Barosanul Suprem
                </Link>
              </motion.div>
            </nav>
          </motion.div>

          {/* Social & Legal */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-sm font-bold text-[#D4AF37] mb-4 uppercase tracking-widest">Urmareste-ne</h4>

            {/* Social Links */}
            <div className="flex justify-center md:justify-start gap-4 mb-6" role="navigation" aria-label="Social media">
              <motion.a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-xl"
                aria-label="Viziteaza-ne pe TikTok"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#9333EA] rounded-xl blur opacity-0 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:border-[#D4AF37]/50 transition-all">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-[#D4AF37] transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </div>
              </motion.a>
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-xl"
                aria-label="Viziteaza-ne pe Instagram"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#9333EA] rounded-xl blur opacity-0 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:border-[#D4AF37]/50 transition-all">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-[#D4AF37] transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
              </motion.a>
            </div>

            {/* Legal Links */}
            <div className="space-y-2">
              <Link
                to="/termeni"
                className="block text-sm text-gray-500 hover:text-[#D4AF37] transition-colors"
              >
                Termeni si Conditii
              </Link>
              <Link
                to="/confidentialitate"
                className="block text-sm text-gray-500 hover:text-[#D4AF37] transition-colors"
              >
                Politica de Confidentialitate
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Luxury Divider */}
        <div className="divider-luxury mb-8"></div>

        {/* Copyright */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400">
            © 2025 <span className="font-bold text-[#D4AF37]">Registrul Oficial al Barosanilor</span>. Toate drepturile de smecherie rezervate.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Made with <span className="text-[#D4AF37]">💛</span> and lots of smecherie
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
