/**
 * CertificateGenerator - Main certificate modal component
 *
 * This component orchestrates the certificate viewing experience:
 * - Shows confetti animation on open
 * - Displays a preview of the certificate
 * - Provides download (PDF/PNG) and sharing options
 *
 * The heavy lifting is done by smaller, focused components:
 * - CertificatePreview: HTML preview of the certificate
 * - useCertificateActions: Download and share handlers
 * - useCertificateConfetti: Confetti animation
 */
import { useRef } from 'react';
import {
  CertificatePreview,
  useCertificateActions,
  useCertificateConfetti,
  CertificateHeaderActions,
  CertificateFooterActions
} from './certificate';

export default function CertificateGenerator({ barosan, onClose }) {
  const certificateRef = useRef(null);

  // Confetti effect when certificate opens
  useCertificateConfetti(barosan.tier);

  // Download and share actions
  const {
    downloading,
    handleDownloadPNG,
    handleDownloadPDF,
    handleDownloadForStory,
    handleShareWhatsApp,
    handleCopyLink
  } = useCertificateActions(barosan);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 overflow-y-auto">
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

              <CertificateHeaderActions
                downloading={downloading}
                onDownloadPDF={handleDownloadPDF}
                onDownloadPNG={handleDownloadPNG}
              />
            </div>
          </div>
        </div>

        {/* Certificate Container */}
        <div className="flex-grow flex items-center justify-center p-2 md:p-8">
          <div className="w-full max-w-7xl">
            {/* Certificate Wrapper - Scaled for viewing */}
            <div className="flex justify-center overflow-x-auto">
              <div
                className="certificate-wrapper"
                style={{
                  transform: 'scale(0.3)',
                  transformOrigin: 'top center',
                  marginBottom: '-450px'
                }}
              >
                <style>{`
                  @media (min-width: 640px) {
                    .certificate-wrapper {
                      transform: scale(0.5) !important;
                      margin-bottom: -300px !important;
                    }
                  }
                  @media (min-width: 1024px) {
                    .certificate-wrapper {
                      transform: scale(0.75) !important;
                      margin-bottom: -200px !important;
                    }
                  }
                `}</style>
                <CertificatePreview ref={certificateRef} barosan={barosan} />
              </div>
            </div>
          </div>
        </div>

        {/* Share & Download Footer */}
        <CertificateFooterActions
          downloading={downloading}
          onDownloadForStory={handleDownloadForStory}
          onShareWhatsApp={handleShareWhatsApp}
          onCopyLink={handleCopyLink}
        />
      </div>
    </div>
  );
}
