import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';

export default function CertificateGenerator({ barosan, onClose }) {
  const certificateRef = useRef(null);

  const tierLabels = {
    platinum: 'PLATINUM',
    gold: 'GOLD',
    basic: 'BASIC'
  };

  const handleDownload = async () => {
    if (certificateRef.current) {
      try {
        const canvas = await html2canvas(certificateRef.current, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false
        });

        const link = document.createElement('a');
        link.download = `certificat-barosan-${barosan.certificatId}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Error generating certificate:', error);
        alert('A apărut o eroare la generarea certificatului. Te rugăm să încerci din nou.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-5xl w-full">
        {/* Controls */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-[#1a365d]">Certificatul tău de Barosan</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleDownload}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              📥 Descarcă PNG
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              ✕ Închide
            </button>
          </div>
        </div>

        {/* Certificate */}
        <div className="p-8 overflow-x-auto">
          <div
            ref={certificateRef}
            className="bg-gradient-to-br from-[#F5E6D3] to-[#E8D5B7] p-12 relative"
            style={{ width: '1200px', height: '800px' }}
          >
            {/* Decorative Border */}
            <div className="absolute inset-4 border-8 border-[#8B0000] border-double"></div>
            <div className="absolute inset-6 border-2 border-[#D4AF37]"></div>

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <div className="text-9xl">👑</div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-between py-8">
              {/* Header */}
              <div className="text-center">
                <div className="text-6xl mb-4">👑</div>
                <h1 className="text-3xl font-bold text-[#8B0000] mb-2" style={{ fontFamily: 'serif' }}>
                  REPUBLICA BAROSANILOR
                </h1>
                <div className="w-48 h-1 bg-[#D4AF37] mx-auto"></div>
              </div>

              {/* Title */}
              <div className="text-center">
                <h2 className="text-5xl font-bold text-[#1a365d] mb-4" style={{ fontFamily: 'serif' }}>
                  CERTIFICAT DE BAROSAN
                </h2>
                <h3 className="text-3xl font-bold text-[#D4AF37]">
                  {tierLabels[barosan.tier]}
                </h3>
              </div>

              {/* Body Text */}
              <div className="max-w-3xl text-center space-y-4">
                <p className="text-lg leading-relaxed">
                  Se certifică prin prezenta că
                </p>
                <p className="text-4xl font-bold text-[#1a365d]" style={{ fontFamily: 'serif' }}>
                  {barosan.nume}
                </p>
                <p className="text-base leading-relaxed px-8">
                  a fost verificat și confirmat ca <strong>BAROSAN AUTENTIC</strong> conform standardelor
                  internaționale de șmecherie și a fost admis în registrul oficial al Zidului Barosanilor.
                </p>
                <p className="text-lg italic text-gray-700">
                  "{barosan.motto}"
                </p>
              </div>

              {/* Footer Info */}
              <div className="w-full flex justify-between items-end px-12">
                {/* Left: Certificate Number and Date */}
                <div className="text-left">
                  <p className="text-sm font-semibold">Număr certificat:</p>
                  <p className="text-lg font-bold text-[#8B0000]">{barosan.certificatId}</p>
                  <p className="text-sm mt-2">Emis la data de:</p>
                  <p className="font-semibold">
                    {new Date(barosan.dataInregistrare).toLocaleDateString('ro-RO', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                {/* Center: Stamp */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-[#8B0000] flex items-center justify-center bg-red-50 transform -rotate-12">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#8B0000]">VERIFICAT</div>
                      <div className="text-3xl">✓</div>
                    </div>
                  </div>
                </div>

                {/* Right: Signatures */}
                <div className="text-right">
                  <div className="mb-6">
                    <p className="text-2xl mb-1" style={{ fontFamily: 'cursive' }}>Ion Barosan</p>
                    <p className="text-xs border-t border-gray-400 pt-1">Mare Barosan Șef</p>
                  </div>
                  <div>
                    <p className="text-2xl mb-1" style={{ fontFamily: 'cursive' }}>Maria Șmechera</p>
                    <p className="text-xs border-t border-gray-400 pt-1">Director Dept. Bășcălie</p>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="absolute bottom-4 left-4 bg-white p-2 rounded">
                <QRCodeSVG
                  value={`https://zidulbarosanilor.ro/barosan/${barosan.id}`}
                  size={80}
                />
                <p className="text-xs text-center mt-1">Verifică online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-gray-50 border-t text-center text-sm text-gray-600">
          <p>Apasă butonul "Descarcă PNG" pentru a salva certificatul tău oficial de barosan.</p>
          <p className="mt-1">Distribuie-l pe social media și arată-le tuturor că ești barosan verificat! 🏆</p>
        </div>
      </div>
    </div>
  );
}
