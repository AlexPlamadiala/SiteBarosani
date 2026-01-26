/**
 * Certificate utility functions and constants
 * Extracted from CertificateGenerator.jsx for better maintainability
 */

// Tier color configurations
export const tierColors = {
  suprem: {
    primary: '#9333EA',
    secondary: '#EC4899',
    accent: '#A855F7',
    glow: '#F3E8FF',
    confetti: ['#9333EA', '#EC4899', '#FFD700', '#A855F7']
  },
  platinum: {
    primary: '#E5E4E2',
    secondary: '#BCC6CC',
    accent: '#C0C0C0',
    glow: '#FFFFFF',
    confetti: ['#E5E4E2', '#BCC6CC', '#D4AF37', '#FFD700']
  },
  gold: {
    primary: '#FFD700',
    secondary: '#DAA520',
    accent: '#B8860B',
    glow: '#FFF8DC',
    confetti: ['#D4AF37', '#FFD700', '#FFA500']
  },
  basic: {
    primary: '#4169E1',
    secondary: '#1E90FF',
    accent: '#00CED1',
    glow: '#E6F3FF',
    confetti: ['#4169E1', '#FFD700', '#00CED1']
  }
};

// Tier display symbols (for HTML preview)
export const tierSymbols = {
  suprem: '👑',
  platinum: '◆',
  gold: '★',
  basic: '●'
};

// Tier display labels
export const tierLabels = {
  suprem: 'SUPREM',
  platinum: 'PLATINUM',
  gold: 'GOLD',
  basic: 'BASIC'
};

// Tier symbols for canvas/PDF (font-compatible)
export const tierCanvasSymbols = {
  suprem: '♛',
  platinum: '◆',
  gold: '★',
  basic: '●'
};

/**
 * Draw a crown shape on canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} size - Crown size
 * @param {string} color - Fill color
 * @param {string|null} glowColor - Optional glow color
 */
export const drawCrown = (ctx, x, y, size, color, glowColor = null) => {
  ctx.save();
  ctx.translate(x, y);

  if (glowColor) {
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 15;
  }

  const scale = size / 50;
  ctx.scale(scale, scale);

  // Crown base
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-25, 20);
  ctx.lineTo(-25, 5);
  ctx.lineTo(-20, -15);
  ctx.lineTo(-10, 5);
  ctx.lineTo(0, -25);
  ctx.lineTo(10, 5);
  ctx.lineTo(20, -15);
  ctx.lineTo(25, 5);
  ctx.lineTo(25, 20);
  ctx.closePath();
  ctx.fill();

  // Crown jewels
  ctx.fillStyle = '#FF0000';
  ctx.beginPath();
  ctx.arc(-20, -8, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, -18, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(20, -8, 4, 0, Math.PI * 2);
  ctx.fill();

  // Crown band
  ctx.fillStyle = '#B8860B';
  ctx.fillRect(-25, 15, 50, 8);

  ctx.restore();
};

/**
 * Truncate text to fit within a specified width
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} text - Text to truncate
 * @param {number} maxWidth - Maximum width in pixels
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (ctx, text, maxWidth) => {
  if (ctx.measureText(text).width <= maxWidth) {
    return text;
  }

  let truncated = text;
  while (ctx.measureText(truncated + '...').width > maxWidth && truncated.length > 0) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + '...';
};

/**
 * Format date in Romanian locale
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateRomanian = (date) => {
  return new Date(date).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Get tier badge CSS classes for HTML preview
 * @param {string} tier - Tier name
 * @returns {string} CSS classes
 */
export const getTierBadgeClasses = (tier) => {
  const classes = {
    suprem: 'bg-gradient-to-r from-purple-500 via-pink-400 to-purple-500',
    platinum: 'bg-gradient-to-r from-gray-300 via-white to-gray-300',
    gold: 'bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400',
    basic: 'bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400'
  };
  return classes[tier] || classes.basic;
};

/**
 * Get tier text color for HTML preview
 * @param {string} tier - Tier name
 * @returns {string} CSS color value
 */
export const getTierTextColor = (tier) => {
  const colors = {
    suprem: '#9333EA',
    platinum: '#666',
    gold: '#B8860B',
    basic: '#1E90FF'
  };
  return colors[tier] || colors.basic;
};

/**
 * Get tier border color for HTML preview
 * @param {string} tier - Tier name
 * @returns {string} CSS color value
 */
export const getTierBorderColor = (tier) => {
  const colors = {
    suprem: '#9333EA',
    platinum: '#C0C0C0',
    gold: '#FFD700',
    basic: '#4169E1'
  };
  return colors[tier] || colors.basic;
};

/**
 * Get tier glow classes for photo
 * @param {string} tier - Tier name
 * @returns {string} Tailwind classes
 */
export const getTierGlowClasses = (tier) => {
  const classes = {
    suprem: 'bg-purple-500',
    platinum: 'bg-gray-400',
    gold: 'bg-yellow-500',
    basic: 'bg-blue-500'
  };
  return classes[tier] || classes.basic;
};

/**
 * Get tier border classes for photo
 * @param {string} tier - Tier name
 * @returns {string} Tailwind classes
 */
export const getTierPhotoBorderClasses = (tier) => {
  const classes = {
    suprem: 'border-purple-500',
    platinum: 'border-gray-400',
    gold: 'border-yellow-500',
    basic: 'border-blue-500'
  };
  return classes[tier] || classes.basic;
};
