import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import BadgeDisplay from './BadgeDisplay'
import { BADGES } from '../utils/badgeSystem'

describe('BadgeDisplay', () => {
  const createBarosanWithBadges = (overrides = {}) => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    return {
      certificatId: 'BAROS-50', // EARLY_ADOPTER
      dataInregistrare: thirtyDaysAgo.toISOString(), // VETERAN
      tier: 'gold', // CHAMPION
      link: 'https://instagram.com/test', // INFLUENCER
      motto: 'Acest motto este foarte lung si are cu siguranta mai mult de cincizeci de caractere', // CREATIVE
      poza: 'photo.jpg', // VERIFIED
      ...overrides
    }
  }

  const createBarosanWithNoBadges = () => ({
    certificatId: 'BAROS-500',
    dataInregistrare: new Date().toISOString(),
    tier: 'basic',
    link: '',
    motto: '',
    poza: null
  })

  describe('rendering', () => {
    it('should return null when barosan has no badges', () => {
      const barosan = createBarosanWithNoBadges()
      const { container } = render(<BadgeDisplay barosan={barosan} />)
      expect(container.firstChild).toBeNull()
    })

    it('should render badges when barosan has achievements', () => {
      const barosan = createBarosanWithBadges()
      render(<BadgeDisplay barosan={barosan} />)

      // Should have badge elements
      const badges = document.querySelectorAll('[title]')
      expect(badges.length).toBeGreaterThan(0)
    })

    it('should display badge emojis', () => {
      const barosan = {
        ...createBarosanWithNoBadges(),
        certificatId: 'BAROS-50' // Only EARLY_ADOPTER
      }
      render(<BadgeDisplay barosan={barosan} maxDisplay={10} />)

      expect(screen.getByText(BADGES.EARLY_ADOPTER.emoji)).toBeInTheDocument()
    })
  })

  describe('maxDisplay prop', () => {
    it('should respect maxDisplay limit', () => {
      const barosan = createBarosanWithBadges()
      render(<BadgeDisplay barosan={barosan} maxDisplay={2} />)

      // Should show "+X" indicator for remaining badges
      const badges = document.querySelectorAll('[title]')
      // 2 displayed badges + 1 for the +X indicator
      expect(badges.length).toBeLessThanOrEqual(3)
    })

    it('should show remaining count when badges exceed maxDisplay', () => {
      const barosan = createBarosanWithBadges()
      render(<BadgeDisplay barosan={barosan} maxDisplay={2} />)

      // Should show +X for remaining badges
      const remainingIndicator = screen.queryByText(/\+\d+/)
      expect(remainingIndicator).toBeInTheDocument()
    })

    it('should not show remaining count when badges fit within maxDisplay', () => {
      const barosan = {
        ...createBarosanWithNoBadges(),
        certificatId: 'BAROS-50' // Only 1 badge
      }
      render(<BadgeDisplay barosan={barosan} maxDisplay={3} />)

      const remainingIndicator = screen.queryByText(/\+\d+/)
      expect(remainingIndicator).not.toBeInTheDocument()
    })

    it('should use default maxDisplay of 3', () => {
      const barosan = createBarosanWithBadges()
      // 7 badges but default should show only 3
      const { container } = render(<BadgeDisplay barosan={barosan} />)

      const badgeElements = container.querySelectorAll('.rounded-full')
      // 3 displayed + 1 for "+X" = 4
      expect(badgeElements.length).toBeLessThanOrEqual(4)
    })
  })

  describe('size prop', () => {
    it('should apply xs size class', () => {
      const barosan = { ...createBarosanWithNoBadges(), certificatId: 'BAROS-50' }
      const { container } = render(<BadgeDisplay barosan={barosan} size="xs" />)

      const badge = container.querySelector('.w-5.h-5')
      expect(badge).toBeInTheDocument()
    })

    it('should apply sm size class (default)', () => {
      const barosan = { ...createBarosanWithNoBadges(), certificatId: 'BAROS-50' }
      const { container } = render(<BadgeDisplay barosan={barosan} size="sm" />)

      const badge = container.querySelector('.w-6.h-6')
      expect(badge).toBeInTheDocument()
    })

    it('should apply md size class', () => {
      const barosan = { ...createBarosanWithNoBadges(), certificatId: 'BAROS-50' }
      const { container } = render(<BadgeDisplay barosan={barosan} size="md" />)

      const badge = container.querySelector('.w-8.h-8')
      expect(badge).toBeInTheDocument()
    })

    it('should apply lg size class', () => {
      const barosan = { ...createBarosanWithNoBadges(), certificatId: 'BAROS-50' }
      const { container } = render(<BadgeDisplay barosan={barosan} size="lg" />)

      const badge = container.querySelector('.w-10.h-10')
      expect(badge).toBeInTheDocument()
    })

    it('should default to sm size for unknown size values', () => {
      const barosan = { ...createBarosanWithNoBadges(), certificatId: 'BAROS-50' }
      const { container } = render(<BadgeDisplay barosan={barosan} size="invalid" />)

      const badge = container.querySelector('.w-6.h-6')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('tooltips', () => {
    it('should have title attribute with badge name and description', () => {
      const barosan = { ...createBarosanWithNoBadges(), certificatId: 'BAROS-50' }
      render(<BadgeDisplay barosan={barosan} />)

      const badge = screen.getByTitle(`${BADGES.EARLY_ADOPTER.name}: ${BADGES.EARLY_ADOPTER.description}`)
      expect(badge).toBeInTheDocument()
    })

    it('should have tooltip content with badge info', () => {
      const barosan = { ...createBarosanWithNoBadges(), certificatId: 'BAROS-50' }
      render(<BadgeDisplay barosan={barosan} />)

      // The tooltip div contains the badge description
      expect(screen.getByText(BADGES.EARLY_ADOPTER.description)).toBeInTheDocument()
    })
  })

  describe('badge colors', () => {
    it('should apply gradient colors from badge definition', () => {
      const barosan = { ...createBarosanWithNoBadges(), certificatId: 'BAROS-50' }
      const { container } = render(<BadgeDisplay barosan={barosan} />)

      // EARLY_ADOPTER has 'from-purple-500 to-pink-500'
      const badge = container.querySelector('.from-purple-500')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have cursor-help class for hover hint', () => {
      const barosan = { ...createBarosanWithNoBadges(), certificatId: 'BAROS-50' }
      const { container } = render(<BadgeDisplay barosan={barosan} />)

      const badge = container.querySelector('.cursor-help')
      expect(badge).toBeInTheDocument()
    })

    it('should have title attribute for screen readers', () => {
      const barosan = { ...createBarosanWithNoBadges(), certificatId: 'BAROS-50' }
      render(<BadgeDisplay barosan={barosan} />)

      const badge = document.querySelector('[title]')
      expect(badge).toBeInTheDocument()
      expect(badge.getAttribute('title')).toContain('Early Adopter')
    })
  })

  describe('specific badges', () => {
    it('should display EARLY_ADOPTER badge for first 100 barosani', () => {
      const barosan = { ...createBarosanWithNoBadges(), certificatId: 'BAROS-50' }
      render(<BadgeDisplay barosan={barosan} maxDisplay={10} />)

      expect(screen.getByText(BADGES.EARLY_ADOPTER.emoji)).toBeInTheDocument()
    })

    it('should display VETERAN badge for 30+ day members', () => {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const barosan = {
        ...createBarosanWithNoBadges(),
        dataInregistrare: thirtyDaysAgo.toISOString()
      }
      render(<BadgeDisplay barosan={barosan} maxDisplay={10} />)

      expect(screen.getByText(BADGES.VETERAN.emoji)).toBeInTheDocument()
    })

    it('should display CHAMPION badge for gold tier', () => {
      const barosan = { ...createBarosanWithNoBadges(), tier: 'gold' }
      render(<BadgeDisplay barosan={barosan} maxDisplay={10} />)

      expect(screen.getByText(BADGES.CHAMPION.emoji)).toBeInTheDocument()
    })

    it('should display ELITE badge for platinum tier', () => {
      const barosan = { ...createBarosanWithNoBadges(), tier: 'platinum' }
      render(<BadgeDisplay barosan={barosan} maxDisplay={10} />)

      expect(screen.getByText(BADGES.ELITE.emoji)).toBeInTheDocument()
    })

    it('should display VERIFIED badge when photo exists', () => {
      const barosan = { ...createBarosanWithNoBadges(), poza: 'photo.jpg' }
      render(<BadgeDisplay barosan={barosan} maxDisplay={10} />)

      expect(screen.getByText(BADGES.VERIFIED.emoji)).toBeInTheDocument()
    })

    it('should display INFLUENCER badge when link exists', () => {
      const barosan = { ...createBarosanWithNoBadges(), link: 'https://test.com' }
      render(<BadgeDisplay barosan={barosan} maxDisplay={10} />)

      expect(screen.getByText(BADGES.INFLUENCER.emoji)).toBeInTheDocument()
    })

    it('should display CREATIVE badge for long mottos', () => {
      const barosan = {
        ...createBarosanWithNoBadges(),
        motto: 'Acest motto este foarte lung si are cu siguranta mai mult de cincizeci de caractere'
      }
      render(<BadgeDisplay barosan={barosan} maxDisplay={10} />)

      expect(screen.getByText(BADGES.CREATIVE.emoji)).toBeInTheDocument()
    })
  })
})
