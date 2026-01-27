import { describe, it, expect, beforeEach, vi } from 'vitest'
import { BADGES, calculateBadges, hasBadge, getBadgeCount } from './badgeSystem'

describe('badgeSystem', () => {
  describe('BADGES', () => {
    it('should have all expected badges defined', () => {
      expect(BADGES.EARLY_ADOPTER).toBeDefined()
      expect(BADGES.VETERAN).toBeDefined()
      expect(BADGES.ELITE).toBeDefined()
      expect(BADGES.CHAMPION).toBeDefined()
      expect(BADGES.INFLUENCER).toBeDefined()
      expect(BADGES.CREATIVE).toBeDefined()
      expect(BADGES.VERIFIED).toBeDefined()
      expect(BADGES.LEGEND).toBeDefined()
    })

    it('each badge should have required properties', () => {
      Object.values(BADGES).forEach(badge => {
        expect(badge).toHaveProperty('id')
        expect(badge).toHaveProperty('name')
        expect(badge).toHaveProperty('emoji')
        expect(badge).toHaveProperty('description')
        expect(badge).toHaveProperty('color')
      })
    })
  })

  describe('calculateBadges', () => {
    let baseBarosan

    beforeEach(() => {
      // Reset to a base barosan with no badges
      baseBarosan = {
        certificatId: 'BAROS-500',
        dataInregistrare: new Date().toISOString(),
        tier: 'basic',
        link: '',
        motto: '',
        poza: null
      }
    })

    describe('EARLY_ADOPTER badge', () => {
      it('should award EARLY_ADOPTER for barosani with ID <= 100', () => {
        const barosan = { ...baseBarosan, certificatId: 'BAROS-50' }
        const badges = calculateBadges(barosan)
        expect(badges).toContainEqual(BADGES.EARLY_ADOPTER)
      })

      it('should award EARLY_ADOPTER for barosan #100', () => {
        const barosan = { ...baseBarosan, certificatId: 'BAROS-100' }
        const badges = calculateBadges(barosan)
        expect(badges).toContainEqual(BADGES.EARLY_ADOPTER)
      })

      it('should NOT award EARLY_ADOPTER for barosan #101', () => {
        const barosan = { ...baseBarosan, certificatId: 'BAROS-101' }
        const badges = calculateBadges(barosan)
        expect(badges).not.toContainEqual(BADGES.EARLY_ADOPTER)
      })

      it('should handle certificat_id format (snake_case)', () => {
        const barosan = { ...baseBarosan, certificat_id: 'BAROS-25', certificatId: undefined }
        const badges = calculateBadges(barosan)
        expect(badges).toContainEqual(BADGES.EARLY_ADOPTER)
      })
    })

    describe('VETERAN badge', () => {
      it('should award VETERAN for barosani registered 30+ days ago', () => {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const barosan = { ...baseBarosan, dataInregistrare: thirtyDaysAgo.toISOString() }
        const badges = calculateBadges(barosan)
        expect(badges).toContainEqual(BADGES.VETERAN)
      })

      it('should award VETERAN for barosani registered 60 days ago', () => {
        const sixtyDaysAgo = new Date()
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)
        const barosan = { ...baseBarosan, dataInregistrare: sixtyDaysAgo.toISOString() }
        const badges = calculateBadges(barosan)
        expect(badges).toContainEqual(BADGES.VETERAN)
      })

      it('should NOT award VETERAN for barosani registered 29 days ago', () => {
        const twentyNineDaysAgo = new Date()
        twentyNineDaysAgo.setDate(twentyNineDaysAgo.getDate() - 29)
        const barosan = { ...baseBarosan, dataInregistrare: twentyNineDaysAgo.toISOString() }
        const badges = calculateBadges(barosan)
        expect(badges).not.toContainEqual(BADGES.VETERAN)
      })

      it('should NOT award VETERAN for newly registered barosani', () => {
        const badges = calculateBadges(baseBarosan)
        expect(badges).not.toContainEqual(BADGES.VETERAN)
      })
    })

    describe('ELITE badge', () => {
      it('should award ELITE for platinum tier barosani', () => {
        const barosan = { ...baseBarosan, tier: 'platinum' }
        const badges = calculateBadges(barosan)
        expect(badges).toContainEqual(BADGES.ELITE)
      })

      it('should NOT award ELITE for gold tier barosani', () => {
        const barosan = { ...baseBarosan, tier: 'gold' }
        const badges = calculateBadges(barosan)
        expect(badges).not.toContainEqual(BADGES.ELITE)
      })

      it('should NOT award ELITE for basic tier barosani', () => {
        const badges = calculateBadges(baseBarosan)
        expect(badges).not.toContainEqual(BADGES.ELITE)
      })
    })

    describe('CHAMPION badge', () => {
      it('should award CHAMPION for gold tier barosani', () => {
        const barosan = { ...baseBarosan, tier: 'gold' }
        const badges = calculateBadges(barosan)
        expect(badges).toContainEqual(BADGES.CHAMPION)
      })

      it('should NOT award CHAMPION for platinum tier barosani', () => {
        const barosan = { ...baseBarosan, tier: 'platinum' }
        const badges = calculateBadges(barosan)
        expect(badges).not.toContainEqual(BADGES.CHAMPION)
      })

      it('should NOT award CHAMPION for basic tier barosani', () => {
        const badges = calculateBadges(baseBarosan)
        expect(badges).not.toContainEqual(BADGES.CHAMPION)
      })
    })

    describe('INFLUENCER badge', () => {
      it('should award INFLUENCER for barosani with a link', () => {
        const barosan = { ...baseBarosan, link: 'https://instagram.com/user' }
        const badges = calculateBadges(barosan)
        expect(badges).toContainEqual(BADGES.INFLUENCER)
      })

      it('should NOT award INFLUENCER for barosani with empty link', () => {
        const badges = calculateBadges(baseBarosan)
        expect(badges).not.toContainEqual(BADGES.INFLUENCER)
      })

      it('should NOT award INFLUENCER for barosani with whitespace-only link', () => {
        const barosan = { ...baseBarosan, link: '   ' }
        const badges = calculateBadges(barosan)
        expect(badges).not.toContainEqual(BADGES.INFLUENCER)
      })
    })

    describe('CREATIVE badge', () => {
      it('should award CREATIVE for motto with 50+ characters', () => {
        const barosan = {
          ...baseBarosan,
          motto: 'Acest motto are exact cincizeci de caractere aici!' // 50 chars
        }
        const badges = calculateBadges(barosan)
        expect(badges).toContainEqual(BADGES.CREATIVE)
      })

      it('should award CREATIVE for motto with more than 50 characters', () => {
        const barosan = {
          ...baseBarosan,
          motto: 'Acesta este un motto foarte lung care are cu siguranta mai mult de cincizeci de caractere'
        }
        const badges = calculateBadges(barosan)
        expect(badges).toContainEqual(BADGES.CREATIVE)
      })

      it('should NOT award CREATIVE for motto with 49 characters', () => {
        const barosan = {
          ...baseBarosan,
          motto: 'Acest motto are doar 49 de caractere in total!' // 49 chars
        }
        const badges = calculateBadges(barosan)
        expect(badges).not.toContainEqual(BADGES.CREATIVE)
      })

      it('should NOT award CREATIVE for empty motto', () => {
        const badges = calculateBadges(baseBarosan)
        expect(badges).not.toContainEqual(BADGES.CREATIVE)
      })
    })

    describe('VERIFIED badge', () => {
      it('should award VERIFIED for barosani with a photo', () => {
        const barosan = { ...baseBarosan, poza: 'photo.jpg' }
        const badges = calculateBadges(barosan)
        expect(badges).toContainEqual(BADGES.VERIFIED)
      })

      it('should NOT award VERIFIED for barosani without a photo', () => {
        const badges = calculateBadges(baseBarosan)
        expect(badges).not.toContainEqual(BADGES.VERIFIED)
      })

      it('should NOT award VERIFIED for barosani with null photo', () => {
        const barosan = { ...baseBarosan, poza: null }
        const badges = calculateBadges(barosan)
        expect(badges).not.toContainEqual(BADGES.VERIFIED)
      })
    })

    describe('LEGEND badge', () => {
      it('should award LEGEND when barosan has all other badges', () => {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const legendBarosan = {
          certificatId: 'BAROS-50', // EARLY_ADOPTER
          dataInregistrare: thirtyDaysAgo.toISOString(), // VETERAN
          tier: 'platinum', // ELITE
          link: 'https://instagram.com/legend', // INFLUENCER
          motto: 'Acest motto este foarte lung si creativ, avand peste cincizeci de caractere!', // CREATIVE
          poza: 'legend.jpg' // VERIFIED
        }

        const badges = calculateBadges(legendBarosan)
        expect(badges).toContainEqual(BADGES.LEGEND)
      })

      it('should NOT award LEGEND when barosan is missing badges', () => {
        const badges = calculateBadges(baseBarosan)
        expect(badges).not.toContainEqual(BADGES.LEGEND)
      })
    })

    describe('combined badges', () => {
      it('should return empty array for barosan with no achievements', () => {
        const badges = calculateBadges(baseBarosan)
        expect(badges).toEqual([])
      })

      it('should return multiple badges when barosan qualifies for several', () => {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const barosan = {
          ...baseBarosan,
          certificatId: 'BAROS-50',
          dataInregistrare: thirtyDaysAgo.toISOString(),
          tier: 'gold',
          poza: 'photo.jpg'
        }

        const badges = calculateBadges(barosan)
        expect(badges).toContainEqual(BADGES.EARLY_ADOPTER)
        expect(badges).toContainEqual(BADGES.VETERAN)
        expect(badges).toContainEqual(BADGES.CHAMPION)
        expect(badges).toContainEqual(BADGES.VERIFIED)
      })
    })
  })

  describe('hasBadge', () => {
    it('should return true when barosan has the badge', () => {
      const barosan = {
        certificatId: 'BAROS-50',
        dataInregistrare: new Date().toISOString(),
        tier: 'basic',
        link: '',
        motto: '',
        poza: null
      }
      expect(hasBadge(barosan, 'early_adopter')).toBe(true)
    })

    it('should return false when barosan does not have the badge', () => {
      const barosan = {
        certificatId: 'BAROS-500',
        dataInregistrare: new Date().toISOString(),
        tier: 'basic',
        link: '',
        motto: '',
        poza: null
      }
      expect(hasBadge(barosan, 'early_adopter')).toBe(false)
    })
  })

  describe('getBadgeCount', () => {
    it('should return 0 for barosan with no badges', () => {
      const barosan = {
        certificatId: 'BAROS-500',
        dataInregistrare: new Date().toISOString(),
        tier: 'basic',
        link: '',
        motto: '',
        poza: null
      }
      expect(getBadgeCount(barosan)).toBe(0)
    })

    it('should return correct count for barosan with multiple badges', () => {
      const barosan = {
        certificatId: 'BAROS-50',
        dataInregistrare: new Date().toISOString(),
        tier: 'gold',
        link: 'https://test.com',
        motto: '',
        poza: 'photo.jpg'
      }
      // Should have: EARLY_ADOPTER, CHAMPION, INFLUENCER, VERIFIED = 4 badges
      expect(getBadgeCount(barosan)).toBe(4)
    })
  })
})
