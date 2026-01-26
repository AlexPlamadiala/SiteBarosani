/**
 * SUPREM tier certificate HTML preview component
 * Premium dark design matching the canvas output
 */
import { forwardRef, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { formatDateRomanian } from './certificateUtils';

// Pre-generated star positions for consistent rendering
const STAR_POSITIONS = Array.from({ length: 50 }, (_, i) => ({
  left: `${(i * 17 + 7) % 100}%`,
  top: `${(i * 23 + 11) % 100}%`,
  opacity: 0.2 + ((i * 13) % 50) / 100
}));

const SupremCertificatePreview = forwardRef(function SupremCertificatePreview({ barosan }, ref) {
  // Memoize stars to prevent unnecessary re-renders
  const stars = useMemo(
    () =>
      STAR_POSITIONS.map((pos, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: pos.left,
            top: pos.top,
            opacity: pos.opacity
          }}
        />
      )),
    []
  );

  return (
    <div
      ref={ref}
      className="relative shadow-2xl overflow-hidden"
      style={{
        width: '1200px',
        height: '850px',
        background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #16082a 40%, #0f0518 70%, #0a0012 100%)'
      }}
    >
      {/* Starfield effect */}
      <div className="absolute inset-0 opacity-30">{stars}</div>

      {/* Glowing aura */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-pink-900/10 to-transparent"></div>

      {/* Gold border with glow */}
      <div
        className="absolute inset-[25px] border-4 border-[#FFD700]"
        style={{ boxShadow: '0 0 20px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(255, 215, 0, 0.1)' }}
      ></div>

      {/* Corner crowns */}
      <div className="absolute top-16 left-16 text-3xl text-yellow-500 opacity-30">👑</div>
      <div className="absolute top-16 right-16 text-3xl text-yellow-500 opacity-30">👑</div>
      <div className="absolute left-16 text-3xl text-yellow-500 opacity-30" style={{ top: '560px' }}>👑</div>
      <div className="absolute right-16 text-3xl text-yellow-500 opacity-30" style={{ top: '560px' }}>👑</div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center pt-12 pb-6 px-16">
        {/* Header with crown */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-4 mb-3">
            <span className="text-2xl text-yellow-500">✦</span>
            <span className="text-xl text-yellow-400">★</span>
            <div className="text-6xl" style={{ filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))' }}>
              👑
            </div>
            <span className="text-xl text-yellow-400">★</span>
            <span className="text-2xl text-yellow-500">✦</span>
          </div>

          {/* BAROSANUL SUPREM title */}
          <h1
            className="text-5xl font-bold text-[#FFD700] tracking-wide"
            style={{ fontFamily: 'Georgia, serif', textShadow: '0 0 30px rgba(255, 215, 0, 0.5)' }}
          >
            BAROSANUL SUPREM
          </h1>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-[#FFD700]"></div>
            <span className="text-pink-400 text-sm">✦</span>
            <div className="w-32 h-[2px] bg-gradient-to-l from-transparent via-purple-500 to-[#FFD700]"></div>
          </div>

          <p className="text-pink-400 italic mt-2" style={{ fontFamily: 'Georgia, serif' }}>
            Cel mai prestigios titlu din Republica Barosanilor
          </p>
        </div>

        {/* Photo and Body */}
        <div className="max-w-3xl text-center space-y-3 flex-grow flex flex-col justify-center relative">
          {/* Photo */}
          {barosan.poza && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-36">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-lg opacity-60 bg-purple-500"></div>
                <div
                  className="absolute -inset-2 rounded-full border-2 border-purple-500"
                  style={{ boxShadow: '0 0 15px rgba(147, 51, 234, 0.5)' }}
                ></div>
                <img
                  src={barosan.poza}
                  alt={barosan.nume}
                  className="relative w-32 h-32 rounded-full object-cover border-4 border-[#FFD700]"
                />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl">👑</div>
              </div>
            </div>
          )}

          <p className="text-xl text-gray-300" style={{ fontFamily: 'Georgia, serif' }}>
            Se certifică prin prezenta că legendarul/a
          </p>

          <p
            className="text-4xl font-bold text-[#FFD700] py-2"
            style={{ fontFamily: 'Georgia, serif', textShadow: '0 0 20px rgba(255, 215, 0, 0.4)' }}
          >
            {barosan.nume}
          </p>

          <p className="text-lg text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
            a atins cel mai înalt nivel de șmecherie și bășcălie
          </p>
          <p className="text-lg text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
            și a fost încoronat ca <span className="text-[#FFD700] font-bold">BAROSANUL SUPREM</span>
          </p>
          <p className="text-base text-gray-500 italic" style={{ fontFamily: 'Georgia, serif' }}>
            domnind glorios pe Zidul Barosanilor
          </p>

          {/* Hours badge */}
          {barosan.supremHours && (
            <p className="text-pink-400 font-bold mt-2">
              ⏱ {barosan.supremHours} {barosan.supremHours === 1 ? 'oră' : 'ore'} de supremație
            </p>
          )}

          {/* Motto */}
          <p className="text-xl italic text-purple-300 pt-2" style={{ fontFamily: 'Georgia, serif' }}>
            &quot;{barosan.motto}&quot;
          </p>

          <p className="text-xs italic text-gray-600 pt-1">
            * Certificat de putere absolută. Toate închinările sunt obligatorii.
          </p>
        </div>

        {/* Footer */}
        <div
          className="w-full rounded-lg p-4 mt-2"
          style={{ background: 'rgba(255, 215, 0, 0.05)', border: '1px solid rgba(255, 215, 0, 0.2)' }}
        >
          <div className="flex justify-between items-end">
            {/* Left: Certificate info + QR */}
            <div className="flex items-end space-x-4">
              <div className="text-left">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Număr certificat:</p>
                <p className="text-xl font-bold text-[#FFD700]">{barosan.certificatId}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide mt-2">Data încoronării:</p>
                <p className="font-semibold text-sm text-gray-300">{formatDateRomanian(barosan.dataInregistrare)}</p>
              </div>
              <div className="bg-white p-2 rounded-lg border-2 border-[#FFD700]">
                <QRCodeSVG value={`https://zidulbarosanilor.ro/barosan/${barosan.id}`} size={60} fgColor="#1a0a2e" />
                <p className="text-[8px] text-center mt-1 text-gray-500">Verificare regală</p>
              </div>
            </div>

            {/* Center: Royal Stamp */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-28 h-28 transform -rotate-12">
                <div
                  className="absolute inset-0 rounded-full border-4 border-purple-500"
                  style={{ boxShadow: '0 0 15px rgba(147, 51, 234, 0.5)' }}
                ></div>
                <div className="absolute inset-[8px] rounded-full border-2 border-[#FFD700]"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl text-[#FFD700]">♛</div>
                  <div className="text-[10px] font-bold text-pink-400">SUPREM</div>
                </div>
              </div>
            </div>

            {/* Right: Signatures */}
            <div className="text-right">
              <div className="mb-3">
                <p className="text-xl text-[#FFD700] italic" style={{ fontFamily: 'Georgia, serif' }}>
                  Împăratul Barosan
                </p>
                <div className="border-t border-purple-500 mt-1 pt-1">
                  <p className="text-[10px] text-gray-400">Suveran Suprem</p>
                </div>
              </div>
              <div>
                <p className="text-xl text-[#FFD700] italic" style={{ fontFamily: 'Georgia, serif' }}>
                  Regina Șmecheriei
                </p>
                <div className="border-t border-purple-500 mt-1 pt-1">
                  <p className="text-[10px] text-gray-400">Consilier Regal</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom line and footer text */}
        <div className="w-full mt-2">
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-2"></div>
          <p className="text-center text-[9px] font-bold text-purple-400">
            👑 CERTIFICAT DE SUPREMAȚIE • PUTERE NELIMITATĂ • TOȚI SE ÎNCHINĂ 👑
          </p>
        </div>
      </div>
    </div>
  );
});

export default SupremCertificatePreview;
