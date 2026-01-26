export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1.5">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-2.5 py-1.5 rounded-md font-semibold text-xs transition-all ${
          currentPage === 1
            ? 'bg-white/5 text-white/30 cursor-not-allowed'
            : 'bg-white/10 text-white hover:bg-white/20'
        }`}
      >
        ← Înapoi
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-0.5">
        {/* First page */}
        {currentPage > 3 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="w-7 h-7 rounded-md font-semibold text-xs bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              1
            </button>
            {currentPage > 4 && <span className="text-white/50 px-1 text-xs">...</span>}
          </>
        )}

        {/* Page numbers around current */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(page => page >= currentPage - 2 && page <= currentPage + 2)
          .map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-7 h-7 rounded-md font-semibold text-xs transition-all ${
                page === currentPage
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {page}
            </button>
          ))
        }

        {/* Last page */}
        {currentPage < totalPages - 2 && (
          <>
            {currentPage < totalPages - 3 && <span className="text-white/50 px-1 text-xs">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-7 h-7 rounded-md font-semibold text-xs bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-2.5 py-1.5 rounded-md font-semibold text-xs transition-all ${
          currentPage === totalPages
            ? 'bg-white/5 text-white/30 cursor-not-allowed'
            : 'bg-white/10 text-white hover:bg-white/20'
        }`}
      >
        Înainte →
      </button>
    </div>
  );
}
