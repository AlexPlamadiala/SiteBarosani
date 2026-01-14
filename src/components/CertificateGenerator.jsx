import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';

export default function CertificateGenerator({ barosan, onClose }) {
  const certificateRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const tierLabels = {
    platinum: 'PLATINUM',
    gold: 'GOLD',
    basic: 'BASIC'
  };

  const handleDownloadPNG = async () => {
    if (certificateRef.current) {
      try {
        setDownloading(true);
        const canvas = await html2canvas(certificateRef.current, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true,
          allowTaint: true,
          width: 1200,
          height: 800
        });

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `certificat-barosan-${barosan.certificat_id}.png`;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      } catch (error) {
        console.error('Error generating certificate:', error);
        alert('A apărut o eroare la generarea certificatului. Te rugăm să încerci din nou.');
      } finally {
        setDownloading(false);
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (certificateRef.current) {
      try {
        setDownloading(true);
        const canvas = await html2canvas(certificateRef.current, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true,
          allowTaint: true,
          width: 1200,
          height: 800
        });

        const imgData = canvas.toDataURL('image/png');

        // Create PDF in landscape mode (A4)
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });

        // Calculate dimensions to fit A4 landscape
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Add image to PDF (centered)
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Download PDF
        pdf.save(`certificat-barosan-${barosan.certificat_id}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('A apărut o eroare la generarea PDF-ului. Te rugăm să încerci din nou.');
      } finally {
        setDownloading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 overflow-y-auto">
      <div className="min-h-screen flex flex-col">
        {/* Fixed Header with Navigation */}
        <div className="sticky top-0 bg-white shadow-lg z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <button
                onClick={onClose}
                className="flex items-center space-x-2 text-[#1a365d] hover:text-[#2d5986] transition-colors font-semibold"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Înapoi la Zid</span>
              </button>

              <h2 className="text-xl font-bold text-[#1a365d] hidden md:block">
                Certificatul tău de Barosan
              </h2>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  className={`px-4 py-2 rounded-lg transition-colors font-semibold flex items-center space-x-2 ${
                    downloading
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  <span>📄</span>
                  <span className="hidden sm:inline">Descarcă PDF</span>
                  <span className="sm:hidden">PDF</span>
                </button>

                <button
                  onClick={handleDownloadPNG}
                  disabled={downloading}
                  className={`px-4 py-2 rounded-lg transition-colors font-semibold flex items-center space-x-2 ${
                    downloading
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <span>🖼️</span>
                  <span className="hidden sm:inline">Descarcă PNG</span>
                  <span className="sm:hidden">PNG</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Container */}
        <div className="flex-grow flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-7xl">
            {/* Certificate Wrapper - Scaled for viewing */}
            <div className="flex justify-center">
              <div className="certificate-wrapper" style={{ transform: 'scale(0.75)', transformOrigin: 'top center', marginBottom: '-200px' }}>
                <div
                  ref={certificateRef}
                  className="bg-gradient-to-br from-[#F5E6D3] to-[#E8D5B7] p-12 relative shadow-2xl"
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
                      {/* Left: Certificate Number and Date + QR */}
                      <div className="flex items-end space-x-6">
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
                        <div className="bg-white p-2 rounded border border-gray-300">
                          <QRCodeSVG
                            value={`https://zidulbarosanilor.ro/barosan/${barosan.id}`}
                            size={70}
                          />
                          <p className="text-xs text-center mt-1">Verifică online</p>
                        </div>
                      </div>

                      {/* Center: Stamp - Professional circular stamp */}
                      <div className="relative flex items-center justify-center">
                        <div className="relative w-40 h-40">
                          {/* Stamp circle with double border */}
                          <div className="absolute inset-0 rounded-full border-[6px] border-[#DC143C] opacity-80 transform -rotate-12"></div>
                          <div className="absolute inset-[8px] rounded-full border-[3px] border-[#DC143C] opacity-80 transform -rotate-12"></div>

                          {/* Stamp content */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center transform -rotate-12">
                            {/* Top arc text - REPUBLICA BAROSANILOR */}
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 160">
                              <defs>
                                <path id="circlePath" d="M 80,80 m -55,0 a 55,55 0 1,1 110,0 a 55,55 0 1,1 -110,0" />
                              </defs>
                              <text className="text-[10px] font-bold fill-[#DC143C]" textAnchor="middle">
                                <textPath href="#circlePath" startOffset="50%">
                                  REPUBLICA BAROSANILOR
                                </textPath>
                              </text>
                            </svg>

                            {/* Center star/checkmark */}
                            <div className="text-5xl text-[#DC143C] font-bold mt-12">✓</div>

                            {/* Bottom text */}
                            <div className="text-center mt-1">
                              <div className="text-sm font-bold text-[#DC143C]">VERIFICAT</div>
                              <div className="text-xs text-[#DC143C] font-semibold">OFICIAL</div>
                            </div>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Footer */}
        <div className="bg-white border-t">
          <div className="container mx-auto px-4 py-6 text-center">
            <p className="text-gray-700 mb-2">
              Apasă butonul <span className="font-semibold text-green-600">"Descarcă PNG"</span> pentru a salva certificatul tău oficial de barosan.
            </p>
            <p className="text-sm text-gray-500">
              Distribuie-l pe social media și arată-le tuturor că ești barosan verificat! 🏆
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
