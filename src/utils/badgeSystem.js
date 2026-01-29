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
  SUPREME_MEMBER: {
    id: 'supreme_member',
    name: 'Supreme',
    emoji: '👑',
    description: 'Membru Supreme',
    color: 'from-[#2A0A4A] to-[#D4AF37]'
  },
  ELITE_MEMBER: {
    id: 'elite_member',
    name: 'Elite',
    emoji: '💎',
    description: 'Membru Elite',
    color: 'from-[#8F98A3] to-[#E5E7EB]'
  },
  CHAMPION: {
    id: 'champion',
    name: 'Champion',
    emoji: '🥉',
    description: 'Membru Premium',
    color: 'from-[#7A3E12] to-[#CD7F32]'
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
 * @param {Number} totalBarosani - Total număr de barosani (pentru Early Adopter)
 * @returns {Array} - Array de badges câștigate
 */
export function calculateBadges(barosan, totalBarosani = 0) {
  const badges = [];

  // Early Adopter - primii 100
  const barosanNumber = parseInt(barosan.certificat_id?.match(/\d+$/)?.[0] || 9999);
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

  // Supreme Member
  if (barosan.tier === 'supreme') {
    badges.push(BADGES.SUPREME_MEMBER);
  }

  // Elite Member
  if (barosan.tier === 'elite') {
    badges.push(BADGES.ELITE_MEMBER);
  }

  // Champion - Premium tier
  if (barosan.tier === 'premium') {
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
