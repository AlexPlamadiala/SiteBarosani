/**
 * Certificate action UI components
 * Renders download and share buttons
 */

/**
 * Header actions (PDF/PNG download buttons)
 */
export function CertificateHeaderActions({ downloading, onDownloadPDF, onDownloadPNG }) {
  return (
    <div className="flex items-center gap-1 md:gap-2">
      <button
        onClick={onDownloadPDF}
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
        onClick={onDownloadPNG}
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
  );
}

/**
 * Footer share/download section
 */
export function CertificateFooterActions({ downloading, onDownloadForStory, onShareWhatsApp, onCopyLink }) {
  return (
    <div className="bg-white border-t">
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
        {/* Share Buttons */}
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-700 text-center mb-3">📱 Distribuie pe Social Media</h3>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={onDownloadForStory}
              disabled={downloading}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              📸 Story Format
            </button>
            <button
              onClick={onShareWhatsApp}
              className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform text-sm"
            >
              💬 WhatsApp
            </button>
            <button
              onClick={onCopyLink}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform text-sm"
            >
              🔗 Copiază Link
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center border-t pt-4">
          <p className="text-sm text-gray-700 mb-2">
            Descarcă certificatul în format <span className="font-semibold text-green-600">PNG</span> sau{' '}
            <span className="font-semibold text-red-600">PDF</span>
          </p>
          <p className="text-xs text-gray-500">Distribuie-l și arată-le tuturor că ești barosan verificat! 🏆</p>
        </div>
      </div>
    </div>
  );
}
