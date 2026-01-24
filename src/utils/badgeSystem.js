/**
 * Badge System pentru Barosani
 * Calculează și returnează badges bazat pe achievement-uri
 */

export const BADGES = {
  EARLY_ADOPTER: {
    id: 'early_adopter',
    name: 'Early Adopter',
    emoji: '🚀',
    description: 'Între primii 100 barosani',
    color: 'from-purple-500 to-pink-500'
  },
  VETERAN: {
    id: 'veteran',
    name: 'Veteran',
    emoji: '⚔️',
    description: 'Barosan de peste 30 de zile',
    color: 'from-orange-500 to-red-500'
  },
  ELITE: {
    id: 'elite',
    name: 'Elite',
    emoji: '💎',
    description: 'Membru Platinum',
    color: 'from-[#E5E4E2] to-[#BCC6CC]'
  },
  CHAMPION: {
    id: 'champion',
    name: 'Champion',
    emoji: '👑',
    description: 'Membru Gold',
    color: 'from-[#D4AF37] to-[#FFD700]'
  },
  INFLUENCER: {
    id: 'influencer',
    name: 'Influencer',
    emoji: '📱',
    description: 'Are link personal',
    color: 'from-blue-500 to-cyan-500'
  },
  CREATIVE: {
    id: 'creative',
    name: 'Creative',
    emoji: '🎨',
    description: 'Motto creativ (50+ caractere)',
    color: 'from-green-500 to-teal-500'
  },
  VERIFIED: {
    id: 'verified',
    name: 'Verified',
    emoji: '✅',
    description: 'Profil complet cu poză',
    color: 'from-green-600 to-emerald-600'
  },
  LEGEND: {
    id: 'legend',
    name: 'Legend',
    emoji: '🌟',
    description: 'Are toate badge-urile',
    color: 'from-yellow-400 to-amber-500'
  }
};

/**
 * Calculează badge-urile pentru un barosan
 * @param {Object} barosan - Datele barosanului
 * @returns {Array} - Array de badges câștigate
 */
export function calculateBadges(barosan) {
  const badges = [];

  // Early Adopter - primii 100
  const certId = barosan.certificatId || barosan.certificat_id || '';
  const barosanNumber = parseInt(certId.match(/\d+$/)?.[0] || 9999);
  if (barosanNumber <= 100) {
    badges.push(BADGES.EARLY_ADOPTER);
  }

  // Veteran - peste 30 zile
  const daysSince = Math.floor(
    (new Date() - new Date(barosan.dataInregistrare)) / (1000 * 60 * 60 * 24)
  );
  if (daysSince >= 30) {
    badges.push(BADGES.VETERAN);
  }

  // Elite - Platinum tier
  if (barosan.tier === 'platinum') {
    badges.push(BADGES.ELITE);
  }

  // Champion - Gold tier
  if (barosan.tier === 'gold') {
    badges.push(BADGES.CHAMPION);
  }

  // Influencer - are link
  if (barosan.link && barosan.link.trim()) {
    badges.push(BADGES.INFLUENCER);
  }

  // Creative - motto lung
  if (barosan.motto && barosan.motto.length >= 50) {
    badges.push(BADGES.CREATIVE);
  }

  // Verified - are poză
  if (barosan.poza) {
    badges.push(BADGES.VERIFIED);
  }

  // Legend - are toate badge-urile (6+, excluzând Legend însuși)
  const eligibleBadges = Object.values(BADGES).filter(b => b.id !== 'legend');
  if (badges.length >= eligibleBadges.length - 1) { // -1 pentru că Legend nu contează
    badges.push(BADGES.LEGEND);
  }

  return badges;
}

/**
 * Verifică dacă barosan-ul are un badge specific
 */
export function hasBadge(barosan, badgeId, totalBarosani = 0) {
  const badges = calculateBadges(barosan, totalBarosani);
  return badges.some(badge => badge.id === badgeId);
}

/**
 * Returnează numărul total de badges
 */
export function getBadgeCount(barosan, totalBarosani = 0) {
  return calculateBadges(barosan, totalBarosani).length;
}
