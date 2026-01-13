import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-[#1a365d] to-[#2d5986] text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="text-2xl">👑</div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-wide">
                ZIDUL BAROSANILOR
              </h1>
              <p className="text-xs text-gray-300 hidden md:block">
                Unde șmecheria devine oficială
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-4 md:space-x-8">
            <Link
              to="/"
              className="text-sm md:text-base hover:text-[#D4AF37] transition-colors"
            >
              Zidul
            </Link>
            <Link
              to="/cum-devin-barosan"
              className="text-sm md:text-base hover:text-[#D4AF37] transition-colors"
            >
              Cum Devin Barosan
            </Link>
          </nav>
        </div>

        {/* Badge */}
        <div className="mt-3 text-center">
          <span className="inline-block bg-[#D4AF37] text-[#1a365d] px-4 py-1 rounded-full text-xs font-semibold">
            ⭐ Instituție Acreditată de Șmecherie din 2025 ⭐
          </span>
        </div>
      </div>
    </header>
  );
}
