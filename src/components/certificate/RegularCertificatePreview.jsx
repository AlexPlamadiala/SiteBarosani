/**
 * Regular tier certificate HTML preview component
 * Classic parchment design for Basic, Gold, Platinum tiers
 */
import { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  tierSymbols,
  tierLabels,
  formatDateRomanian,
  getTierBadgeClasses,
  getTierTextColor,
  getTierBorderColor,
  getTierGlowClasses,
  getTierPhotoBorderClasses
} from './certificateUtils';

// SVG Crown component for HTML preview
const CrownSVG = ({ size = 50, className = '' }) => (
  <svg width={size} height={size * 0.9} viewBox="-30 -30 60 54" className={className}>
    {/* Crown base */}
    <path d="M-25,20 L-25,5 L-20,-15 L-10,5 L0,-25 L10,5 L20,-15 L25,5 L25,20 Z" fill="#FFD700" />
    {/* Crown jewels */}
    <circle cx="-20" cy="-8" r="4" fill="#FF0000" />
    <circle cx="0" cy="-18" r="5" fill="#FF0000" />
    <circle cx="20" cy="-8" r="4" fill="#FF0000" />
    {/* Crown band */}
    <rect x="-25" y="15" width="50" height="8" fill="#B8860B" />
  </svg>
);

const RegularCertificatePreview = forwardRef(function RegularCertificatePreview({ barosan }, ref) {
  return (
    <div
      ref={ref}
      className="relative shadow-2xl overflow-hidden"
      style={{
        width: '1200px',
        height: '850px',
        background: 'radial-gradient(ellipse at center, #FFF8E7 0%, #F5E6D3 50%, #E8D5B7 100%)'
      }}
    >
      {/* Corner decorations */}
      <div className="absolute top-16 left-16 text-3xl text-yellow-500 opacity-30 transform rotate-45">★</div>
      <div className="absolute top-16 right-16 text-3xl text-yellow-500 opacity-30 transform -rotate-45">★</div>
      <div className="absolute bottom-16 left-16 text-3xl text-yellow-500 opacity-30 transform -rotate-45">★</div>
      <div className="absolute bottom-16 right-16 text-3xl text-yellow-500 opacity-30 transform rotate-45">★</div>

      {/* Outer golden border with shadow */}
      <div className="absolute inset-[25px] border-[20px] border-[#8B4513] shadow-lg"></div>

      {/* Inner golden gradient border */}
      <div
        className="absolute inset-[45px] border-8"
        style={{ borderImage: 'linear-gradient(135deg, #FFD700, #FFA500, #FFD700) 1' }}
      ></div>

      {/* Decorative dashed border */}
      <div
        className="absolute inset-[60px] border-2 border-dashed"
        style={{ borderColor: getTierBorderColor(barosan.tier) }}
      ></div>

      {/* Watermarks */}
      <div className="absolute inset-0 flex items-center justify-around opacity-[0.05] pointer-events-none">
        <CrownSVG size={100} />
        <CrownSVG size={100} />
        <CrownSVG size={100} />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center pt-12 pb-6 px-16">
        {/* Header with crown and stars */}
        <div className="text-center mb-2">
          <div className="flex items-center justify-center gap-4 mb-2">
            <span className="text-2xl text-yellow-500">★</span>
            <span className="text-xl text-yellow-400">✦</span>
            <div className="drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))' }}>
              <CrownSVG size={55} />
            </div>
            <span className="text-xl text-yellow-400">✦</span>
            <span className="text-2xl text-yellow-500">★</span>
          </div>
          <h1 className="text-2xl font-bold text-[#8B0000] tracking-wide drop-shadow" style={{ fontFamily: 'Georgia, serif' }}>
            REPUBLICA BAROSANILOR
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-32 h-[3px] bg-gradient-to-r from-transparent via-[#DAA520] to-[#FFD700]"></div>
            <div className="w-24 h-[2px] bg-[#FFD700]"></div>
            <div className="w-32 h-[3px] bg-gradient-to-l from-transparent via-[#DAA520] to-[#FFD700]"></div>
          </div>
        </div>

        {/* Title with glow */}
        <div className="text-center mb-2">
          <h2
            className="text-4xl font-bold text-[#1a365d] drop-shadow-lg"
            style={{
              fontFamily: 'Georgia, serif',
              textShadow: barosan.tier === 'gold' ? '0 0 20px rgba(255, 215, 0, 0.3)' : 'none'
            }}
          >
            CERTIFICAT DE BAROSAN
          </h2>
        </div>

        {/* Tier Badge */}
        <div className="mb-3">
          <div className={`px-6 py-2 rounded-lg ${getTierBadgeClasses(barosan.tier)} bg-opacity-30`}>
            <span
              className="text-2xl font-bold"
              style={{ fontFamily: 'Georgia, serif', color: getTierTextColor(barosan.tier) }}
            >
              {tierSymbols[barosan.tier]} {tierLabels[barosan.tier]} {tierSymbols[barosan.tier]}
            </span>
          </div>
        </div>

        {/* Separator */}
        <div className="w-64 h-[2px] bg-[#DAA520] mb-3"></div>

        {/* Photo and Body Text */}
        <div className="max-w-3xl text-center space-y-2 flex-grow flex flex-col justify-center relative">
          {/* Photo (if exists) */}
          {barosan.poza && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-32">
              <div className="relative">
                <div className={`absolute inset-0 rounded-full blur-md opacity-50 ${getTierGlowClasses(barosan.tier)}`}></div>
                <img
                  src={barosan.poza}
                  alt={barosan.nume}
                  className={`relative w-28 h-28 rounded-full object-cover border-4 ${getTierPhotoBorderClasses(barosan.tier)}`}
                />
              </div>
            </div>
          )}
          <p className="text-lg text-gray-700" style={{ fontFamily: 'Georgia, serif' }}>
            Se certifică prin prezenta că distinsul/a
          </p>
          <p
            className="text-3xl font-bold text-[#1a365d] py-2"
            style={{ fontFamily: 'Georgia, serif', textShadow: '0 0 15px rgba(255, 215, 0, 0.2)' }}
          >
            {barosan.nume}
          </p>
          <p className="text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
            a fost verificat(ă) și confirmat(ă) ca <strong className="text-[#1a365d]">BAROSAN AUTENTIC</strong>
          </p>
          <p className="text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
            conform standardelor internaționale de șmecherie și bășcălie
          </p>
          <p className="text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
            și a fost admis(ă) în registrul oficial al Zidului Barosanilor.
          </p>
          <p className="text-lg italic text-gray-600 pt-2" style={{ fontFamily: 'Georgia, serif' }}>
            &quot;{barosan.motto}&quot;
          </p>
          <p className="text-xs italic text-gray-400 pt-1">
            * Acest certificat conferă drepturi nelimitate de lăudăroșenie și flexare pe social media
          </p>
        </div>

        {/* Footer section */}
        <div className="w-full bg-[#8B4513] bg-opacity-5 rounded-lg p-4 mt-2">
          <div className="flex justify-between items-end">
            {/* Left: Certificate Number and Date + QR */}
            <div className="flex items-end space-x-4">
              <div className="text-left">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Număr certificat:</p>
                <p className="text-lg font-bold text-[#8B0000]">{barosan.certificatId}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide mt-2">Data emiterii:</p>
                <p className="font-semibold text-sm text-gray-700">{formatDateRomanian(barosan.dataInregistrare)}</p>
              </div>
              <div
                className="bg-white p-2 rounded-lg border-2"
                style={{ borderColor: getTierBorderColor(barosan.tier) }}
              >
                <QRCodeSVG value={`https://zidulbarosanilor.ro/barosan/${barosan.id}`} size={60} fgColor="#1a365d" />
                <p className="text-[8px] text-center mt-1 text-gray-500">Scanează pentru</p>
                <p className="text-[8px] text-center text-gray-500">verificare online</p>
              </div>
            </div>

            {/* Center: Stamp */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-28 h-28 transform -rotate-12">
                <div
                  className="absolute inset-0 rounded-full border-[5px] border-[#DC143C] opacity-80"
                  style={{ boxShadow: '0 0 10px rgba(220, 20, 60, 0.3)' }}
                ></div>
                <div className="absolute inset-[6px] rounded-full border-[2px] border-[#DC143C] opacity-80"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 112 112">
                    <defs>
                      <path id="circlePathPreview" d="M 56,56 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                    </defs>
                    <text className="text-[7px] font-bold fill-[#DC143C]" textAnchor="middle">
                      <textPath href="#circlePathPreview" startOffset="50%">
                        REPUBLICA BAROSANILOR
                      </textPath>
                    </text>
                  </svg>
                  <div className="text-3xl text-[#DC143C] font-bold mt-1">✓</div>
                  <div className="text-center -mt-1">
                    <div className="text-[10px] font-bold text-[#DC143C]">VERIFICAT</div>
                    <div className="text-[7px] text-[#DC143C] font-semibold">OFICIAL</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Signatures */}
            <div className="text-right">
              <div className="mb-3">
                <p className="text-xl text-[#1a365d] italic" style={{ fontFamily: 'Georgia, serif' }}>
                  Ion Barosan
                </p>
                <div className="border-t border-gray-400 mt-1 pt-1">
                  <p className="text-[10px] text-gray-600">Mare Barosan Șef</p>
                  <p className="text-[8px] text-gray-400">& Expert în Bășcălie</p>
                </div>
              </div>
              <div>
                <p className="text-xl text-[#1a365d] italic" style={{ fontFamily: 'Georgia, serif' }}>
                  Maria Șmechera
                </p>
                <div className="border-t border-gray-400 mt-1 pt-1">
                  <p className="text-[10px] text-gray-600">Director Dept. Bășcălie</p>
                  <p className="text-[8px] text-gray-400">& Ministru al Flexării</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decorative line and footer */}
        <div className="w-full mt-2">
          <div className="w-full h-[2px] bg-[#DAA520] mb-2"></div>
          <p className="text-center text-[9px] font-bold text-[#8B4513]">
            ★ CERTIFICAT OFICIAL • VALABIL PE TOATĂ PLANETA • NU SE ACCEPTĂ CONTESTAȚII ★
          </p>
        </div>
      </div>
    </div>
  );
});

export default RegularCertificatePreview;
