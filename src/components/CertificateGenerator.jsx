import { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { QRCodeCanvas } from 'qrcode.react';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';
import { useToast } from '../contexts/ToastContext';

export default function CertificateGenerator({ barosan, onClose }) {
  const certificateRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const toast = useToast();

  // Confetti effect when certificate opens
  useEffect(() => {
    // Gold confetti for platinum/gold tiers, regular for basic
    const colors = barosan.tier === 'platinum'
      ? ['#E5E4E2', '#BCC6CC', '#D4AF37', '#FFD700']
      : barosan.tier === 'gold'
      ? ['#D4AF37', '#FFD700', '#FFA500']
      : ['#4169E1', '#FFD700', '#00CED1'];

    // Fire confetti burst
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Big burst on mount
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors
    });
  }, [barosan.tier]);

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
          onclone: (clonedDoc) => {
            // Fix oklch colors that html2canvas doesn't support
            const clonedElement = clonedDoc.querySelector('.bg-gradient-to-br');
            if (clonedElement) {
              clonedElement.style.background = 'linear-gradient(to bottom right, #F5E6D3, #E8D5B7)';
            }
          }
        });

        canvas.toBlob((blob) => {
          try {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.download = `certificat-barosan-${barosan.certificatId}.png`;
              link.href = url;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);

              toast.success('Certificat PNG descărcat cu succes!');

              // Confetti on successful download
              confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 }
              });
            } else {
              toast.error('Eroare la crearea fișierului PNG');
            }
          } catch (err) {
            console.error('Error in toBlob:', err);
            toast.error('Eroare la descărcarea PNG');
          } finally {
            setDownloading(false);
          }
        }, 'image/png');
      } catch (error) {
        console.error('Error generating certificate:', error);
        toast.error('A apărut o eroare la generarea certificatului. Te rugăm să încerci din nou.');
        setDownloading(false);
      }
    }
  };

  const handleShareWhatsApp = () => {
    const text = `🏆 Tocmai am devenit Barosan ${tierLabels[barosan.tier]}! 🎉\nCertificat ID: ${barosan.certificatId}\nVerifică Registrul Oficial: ${window.location.origin}/zid`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    toast.success('Se deschide WhatsApp...');
  };

  const handleCopyLink = () => {
    // Link direct către certificatul specific (folosind certificatId pentru identificare unică)
    const link = `${window.location.origin}/zid?certificat=${barosan.certificatId}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success('Link copiat în clipboard! 🔗');
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 }
      });
    });
  };

  const handleDownloadForStory = async () => {
    if (certificateRef.current) {
      try {
        setDownloading(true);
        const canvas = await html2canvas(certificateRef.current, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true,
          allowTaint: true,
          onclone: (clonedDoc) => {
            // Fix oklch colors that html2canvas doesn't support
            const clonedElement = clonedDoc.querySelector('.bg-gradient-to-br');
            if (clonedElement) {
              clonedElement.style.background = 'linear-gradient(to bottom right, #F5E6D3, #E8D5B7)';
            }
          }
        });

        // Create story canvas (1080x1920)
        const storyCanvas = document.createElement('canvas');
        storyCanvas.width = 1080;
        storyCanvas.height = 1920;
        const ctx = storyCanvas.getContext('2d');

        // Fill background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 1920);
        gradient.addColorStop(0, '#1a365d');
        gradient.addColorStop(1, '#2d5986');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1080, 1920);

        // Center certificate
        const scale = Math.min(1080 / canvas.width, 1200 / canvas.height);
        const x = (1080 - canvas.width * scale) / 2;
        const y = (1920 - canvas.height * scale) / 2;
        ctx.drawImage(canvas, x, y, canvas.width * scale, canvas.height * scale);

        storyCanvas.toBlob((blob) => {
          try {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.download = `barosan-story-${barosan.certificatId}.png`;
              link.href = url;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);

              toast.success('Story format descărcat! Perfect pentru Instagram/TikTok! 📱');
              confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 }
              });
            } else {
              toast.error('Eroare la crearea story format');
            }
          } catch (err) {
            console.error('Error in story toBlob:', err);
            toast.error('Eroare la descărcarea story');
          } finally {
            setDownloading(false);
          }
        }, 'image/png');
      } catch (error) {
        console.error('Error:', error);
        toast.error('Eroare la generare story format');
        setDownloading(false);
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) {
      toast.error('Certificatul nu este încă încărcat');
      return;
    }

    try {
      setDownloading(true);

      // Generate canvas from certificate (QR Code is now canvas-based, no SVG issues)
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 0, // No timeout for images
        onclone: (clonedDoc) => {
          // Fix oklch colors that html2canvas doesn't support
          const clonedElement = clonedDoc.querySelector('.bg-gradient-to-br');
          if (clonedElement) {
            clonedElement.style.background = 'linear-gradient(to bottom right, #F5E6D3, #E8D5B7)';
          }
        }
      });

      if (!canvas) {
        throw new Error('Nu s-a putut genera canvas-ul certificatului');
      }

      const imgData = canvas.toDataURL('image/png');

      if (!imgData || imgData === 'data:,') {
        throw new Error('Nu s-a putut converti certificatul în imagine');
      }

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
      pdf.save(`certificat-barosan-${barosan.certificatId}.pdf`);

      toast.success('Certificat PDF descărcat cu succes!');

      // Confetti on successful PDF download
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      // More detailed error message
      const errorMsg = error.message || 'Eroare necunoscută';
      toast.error(`Eroare: ${errorMsg}. Încearcă PNG în loc de PDF.`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-[100] overflow-y-auto">
      <div className="min-h-screen flex flex-col">
        {/* Fixed Header with Navigation */}
        <div className="sticky top-0 bg-white shadow-lg z-10">
          <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
            <div className="flex justify-between items-center gap-2">
              <button
                onClick={onClose}
                className="flex items-center space-x-1 md:space-x-2 text-[#1a365d] hover:text-[#2d5986] transition-colors font-semibold text-sm md:text-base touch-manipulation min-h-[44px]"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Înapoi la Zid</span>
                <span className="sm:hidden">Înapoi</span>
              </button>

              <h2 className="text-base md:text-xl font-bold text-[#1a365d] hidden lg:block">
                Certificatul tău de Barosan
              </h2>

              <div className="flex items-center gap-1 md:gap-2">
                <button
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  className={`px-2 md:px-4 py-2 rounded-lg transition-colors font-semibold flex items-center space-x-1 md:space-x-2 text-xs md:text-base touch-manipulation min-h-[44px] ${
                    downloading
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
                  }`}
                >
                  <span>📄</span>
                  <span className="hidden sm:inline">Descarcă PDF</span>
                  <span className="sm:hidden">PDF</span>
                </button>

                <button
                  onClick={handleDownloadPNG}
                  disabled={downloading}
                  className={`px-2 md:px-4 py-2 rounded-lg transition-colors font-semibold flex items-center space-x-1 md:space-x-2 text-xs md:text-base touch-manipulation min-h-[44px] ${
                    downloading
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
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
        <div className="flex-grow flex items-center justify-center p-2 md:p-8 overflow-hidden">
          <div className="w-full max-w-7xl">
            {/* Certificate Wrapper - Scaled for viewing */}
            <div className="flex justify-center items-center">
              <div
                className="certificate-wrapper"
                style={{
                  transform: 'scale(0.3)',
                  transformOrigin: 'center center'
                }}
              >
                <style>{`
                  @media (min-width: 640px) {
                    .certificate-wrapper {
                      transform: scale(0.5) !important;
                    }
                  }
                  @media (min-width: 1024px) {
                    .certificate-wrapper {
                      transform: scale(0.7) !important;
                    }
                  }
                  @media (min-width: 1280px) {
                    .certificate-wrapper {
                      transform: scale(0.85) !important;
                    }
                  }
                `}</style>
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
                          <QRCodeCanvas
                            value={`${window.location.origin}/zid?certificat=${barosan.certificatId}`}
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

        {/* Share & Download Footer */}
        <div className="bg-white border-t">
          <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
            {/* Share Buttons */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-700 text-center mb-3">
                📱 Distribuie pe Social Media
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={handleDownloadForStory}
                  disabled={downloading}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  📸 Story Format
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform text-sm"
                >
                  💬 WhatsApp
                </button>
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform text-sm"
                >
                  🔗 Copiază Link
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center border-t pt-4">
              <p className="text-sm text-gray-700 mb-2">
                Descarcă certificatul în format <span className="font-semibold text-green-600">PNG</span> sau <span className="font-semibold text-red-600">PDF</span>
              </p>
              <p className="text-xs text-gray-500">
                Distribuie-l și arată-le tuturor că ești barosan verificat! 🏆
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
