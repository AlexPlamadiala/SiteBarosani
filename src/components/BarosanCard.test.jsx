import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import BarosanCard from './BarosanCard'

// Wrap component with Router for Link component
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('BarosanCard', () => {
  const mockBarosan = {
    certificatId: 'BAROS-123',
    nume: 'Ion Popescu',
    motto: 'Viața e frumoasă!',
    tier: 'gold',
    poza: 'https://example.com/photo.jpg',
    link: 'https://instagram.com/ionpopescu',
    dataInregistrare: '2024-06-15T10:00:00Z'
  }

  const mockOnViewCertificate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render barosan name', () => {
      renderWithRouter(
        <BarosanCard barosan={mockBarosan} onViewCertificate={mockOnViewCertificate} />
      )

      expect(screen.getByText('Ion Popescu')).toBeInTheDocument()
    })

    it('should render barosan motto with quotes', () => {
      renderWithRouter(
        <BarosanCard barosan={mockBarosan} onViewCertificate={mockOnViewCertificate} />
      )

      expect(screen.getByText('"Viața e frumoasă!"')).toBeInTheDocument()
    })

    it('should render certificate button', () => {
      renderWithRouter(
        <BarosanCard barosan={mockBarosan} onViewCertificate={mockOnViewCertificate} />
      )

      expect(screen.getByText('📜 Vezi Certificat')).toBeInTheDocument()
    })

    it('should have proper aria-label', () => {
      renderWithRouter(
        <BarosanCard barosan={mockBarosan} onViewCertificate={mockOnViewCertificate} />
      )

      expect(screen.getByLabelText('Card barosan: Ion Popescu, tier gold')).toBeInTheDocument()
    })

    it('should have data-certificat-id attribute', () => {
      renderWithRouter(
        <BarosanCard barosan={mockBarosan} onViewCertificate={mockOnViewCertificate} />
      )

      const card = screen.getByLabelText('Card barosan: Ion Popescu, tier gold')
      expect(card).toHaveAttribute('data-certificat-id', 'BAROS-123')
    })
  })

  describe('tier badges', () => {
    it('should display GOLD tier label for gold tier', () => {
      renderWithRouter(
        <BarosanCard barosan={mockBarosan} onViewCertificate={mockOnViewCertificate} />
      )

      expect(screen.getByText('🏆 GOLD')).toBeInTheDocument()
    })

    it('should display PLATINUM tier label for platinum tier', () => {
      const platinumBarosan = { ...mockBarosan, tier: 'platinum' }
      renderWithRouter(
        <BarosanCard barosan={platinumBarosan} onViewCertificate={mockOnViewCertificate} />
      )

      expect(screen.getByText('💎 PLATINUM')).toBeInTheDocument()
    })

    it('should display SUPREM tier label for suprem tier', () => {
      const supremBarosan = { ...mockBarosan, tier: 'suprem' }
      renderWithRouter(
        <BarosanCard barosan={supremBarosan} onViewCertificate={mockOnViewCertificate} />
      )

      expect(screen.getByText('👑 SUPREM')).toBeInTheDocument()
    })

    it('should display BASIC tier label for basic tier', () => {
      const basicBarosan = { ...mockBarosan, tier: 'basic' }
      renderWithRouter(
        <BarosanCard barosan={basicBarosan} onViewCertificate={mockOnViewCertificate} />
      )

      expect(screen.getByText('⭐ BASIC')).toBeInTheDocument()
    })

    it('should default to BASIC for unknown tier', () => {
      const unknownTierBarosan = { ...mockBarosan, tier: 'unknown' }
      renderWithRouter(
        <BarosanCard barosan={unknownTierBarosan} onViewCertificate={mockOnViewCertificate} />
      )

      expect(screen.getByText('⭐ BASIC')).toBeInTheDocument()
    })
  })

  describe('image handling', () => {
    it('should render image when poza is provided', () => {
      renderWithRouter(
        <BarosanCard barosan={mockBarosan} onViewCertificate={mockOnViewCertificate} />
      )

      const img = screen.getByAltText('Fotografie Ion Popescu')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', mockBarosan.poza)
    })

    it('should render placeholder when no poza', () => {
      const barosanNoPhoto = { ...mockBarosan, poza: null }
      renderWithRouter(
        <BarosanCard barosan={barosanNoPhoto} onViewCertificate={mockOnViewCertificate} />
      )

      expect(screen.getByText('👤')).toBeInTheDocument()
    })

    it('should have lazy loading attribute on image', () => {
      renderWithRouter(
        <BarosanCard barosan={mockBarosan} onViewCertificate={mockOnViewCertificate} />
      )

      const img = screen.getByAltText('Fotografie Ion Popescu')
      expect(img).toHaveAttribute('loading', 'lazy')
    })
  })

  describe('personal link', () => {
    it('should show personal link for suprem tier with link', () => {
      const supremBarosan = { ...mockBarosan, tier: 'suprem' }
      renderWithRouter(
        <BarosanCard barosan={supremBarosan} onViewCertificate={mockOnViewCertificate} />
      )

      expect(screen.getByText('Link Personal')).toBeInTheDocument()
    })

    it('should show personal link for platinum tier with link', () => {
      const platinumBarosan = { ...mockBarosan, tier: 'platinum' }
      renderWithRouter(
        <BarosanCard barosan={platinumBarosan} onViewCertificate={mockOnViewCertificate} />
      )

      expect(screen.getByText('Link Personal')).toBeInTheDocument()
    })

    it('should NOT show personal link for gold tier', () => {
      renderWithRouter(
        <BarosanCard barosan={mockBarosan} onViewCertificate={mockOnViewCertificate} />
      )

      expect(screen.queryByText('Link Personal')).not.toBeInTheDocument()
    })

    it('should NOT show personal link when link is empty', () => {
      const supremNoLink = { ...mockBarosan, tier: 'suprem', link: '' }
      renderWithRouter(
        <BarosanCard barosan={supremNoLink} onViewCertificate={mockOnViewCertificate} />
      )

      expect(screen.queryByText('Link Personal')).not.toBeInTheDocument()
    })

    it('should open link in new tab', () => {
      const supremBarosan = { ...mockBarosan, tier: 'suprem' }
      renderWithRouter(
        <BarosanCard barosan={supremBarosan} onViewCertificate={mockOnViewCertificate} />
      )

      const link = screen.getByText('Link Personal').closest('a')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  describe('certificate button', () => {
    it('should call onViewCertificate when clicked', () => {
      renderWithRouter(
        <BarosanCard barosan={mockBarosan} onViewCertificate={mockOnViewCertificate} />
      )

      const button = screen.getByText('📜 Vezi Certificat')
      fireEvent.click(button)

      expect(mockOnViewCertificate).toHaveBeenCalledTimes(1)
      expect(mockOnViewCertificate).toHaveBeenCalledWith(mockBarosan)
    })

    it('should have proper aria-label', () => {
      renderWithRouter(
        <BarosanCard barosan={mockBarosan} onViewCertificate={mockOnViewCertificate} />
      )

      const button = screen.getByLabelText('Vezi certificatul pentru Ion Popescu')
      expect(button).toBeInTheDocument()
    })
  })

  describe('date formatting', () => {
    it('should format date in Romanian locale', () => {
      renderWithRouter(
        <BarosanCard barosan={mockBarosan} onViewCertificate={mockOnViewCertificate} />
      )

      // The date is formatted as "iun. 2024" in Romanian
      expect(screen.getByText(/Barosan din.*2024/)).toBeInTheDocument()
    })
  })

  describe('profile link', () => {
    it('should link to barosan profile page', () => {
      renderWithRouter(
        <BarosanCard barosan={mockBarosan} onViewCertificate={mockOnViewCertificate} />
      )

      const link = screen.getByRole('link', { name: /Ion Popescu/i })
      expect(link).toHaveAttribute('href', '/barosan/BAROS-123')
    })
  })

  describe('edge cases', () => {
    it('should handle barosan with certificat_id (snake_case)', () => {
      const barosanSnakeCase = {
        ...mockBarosan,
        certificatId: undefined,
        certificat_id: 'BAROS-456'
      }
      renderWithRouter(
        <BarosanCard barosan={barosanSnakeCase} onViewCertificate={mockOnViewCertificate} />
      )

      const card = screen.getByLabelText(/Card barosan: Ion Popescu/)
      expect(card).toHaveAttribute('data-certificat-id', 'BAROS-456')
    })

    it('should handle missing tier gracefully', () => {
      const barosanNoTier = { ...mockBarosan, tier: undefined }
      renderWithRouter(
        <BarosanCard barosan={barosanNoTier} onViewCertificate={mockOnViewCertificate} />
      )

      expect(screen.getByText('⭐ BASIC')).toBeInTheDocument()
    })

    it('should handle empty motto', () => {
      const barosanEmptyMotto = { ...mockBarosan, motto: '' }
      renderWithRouter(
        <BarosanCard barosan={barosanEmptyMotto} onViewCertificate={mockOnViewCertificate} />
      )

      expect(screen.getByText('""')).toBeInTheDocument()
    })
  })
})
