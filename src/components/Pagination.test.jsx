import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Pagination from './Pagination'

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    onPageChange: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render nothing when totalPages is 1', () => {
      const { container } = render(
        <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />
      )
      expect(container.firstChild).toBeNull()
    })

    it('should render nothing when totalPages is 0', () => {
      const { container } = render(
        <Pagination currentPage={1} totalPages={0} onPageChange={vi.fn()} />
      )
      expect(container.firstChild).toBeNull()
    })

    it('should render pagination when totalPages > 1', () => {
      render(<Pagination {...defaultProps} />)
      expect(screen.getByText('← Înapoi')).toBeInTheDocument()
      expect(screen.getByText('Înainte →')).toBeInTheDocument()
    })

    it('should show current page number', () => {
      render(<Pagination {...defaultProps} currentPage={5} />)
      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })

  describe('navigation buttons', () => {
    it('should disable "Previous" button on first page', () => {
      render(<Pagination {...defaultProps} currentPage={1} />)
      const prevButton = screen.getByText('← Înapoi')
      expect(prevButton).toBeDisabled()
    })

    it('should enable "Previous" button when not on first page', () => {
      render(<Pagination {...defaultProps} currentPage={5} />)
      const prevButton = screen.getByText('← Înapoi')
      expect(prevButton).not.toBeDisabled()
    })

    it('should disable "Next" button on last page', () => {
      render(<Pagination {...defaultProps} currentPage={10} />)
      const nextButton = screen.getByText('Înainte →')
      expect(nextButton).toBeDisabled()
    })

    it('should enable "Next" button when not on last page', () => {
      render(<Pagination {...defaultProps} currentPage={5} />)
      const nextButton = screen.getByText('Înainte →')
      expect(nextButton).not.toBeDisabled()
    })
  })

  describe('page navigation', () => {
    it('should call onPageChange with previous page when clicking "Previous"', () => {
      const onPageChange = vi.fn()
      render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />)

      fireEvent.click(screen.getByText('← Înapoi'))
      expect(onPageChange).toHaveBeenCalledWith(4)
    })

    it('should call onPageChange with next page when clicking "Next"', () => {
      const onPageChange = vi.fn()
      render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />)

      fireEvent.click(screen.getByText('Înainte →'))
      expect(onPageChange).toHaveBeenCalledWith(6)
    })

    it('should call onPageChange with specific page when clicking page number', () => {
      const onPageChange = vi.fn()
      render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />)

      fireEvent.click(screen.getByText('3'))
      expect(onPageChange).toHaveBeenCalledWith(3)
    })

    it('should call onPageChange with first page when clicking first page button', () => {
      const onPageChange = vi.fn()
      render(<Pagination currentPage={8} totalPages={10} onPageChange={onPageChange} />)

      // When on page 8, page 1 should be shown with ellipsis
      fireEvent.click(screen.getByText('1'))
      expect(onPageChange).toHaveBeenCalledWith(1)
    })

    it('should call onPageChange with last page when clicking last page button', () => {
      const onPageChange = vi.fn()
      render(<Pagination currentPage={3} totalPages={10} onPageChange={onPageChange} />)

      // When on page 3, page 10 should be shown with ellipsis
      fireEvent.click(screen.getByText('10'))
      expect(onPageChange).toHaveBeenCalledWith(10)
    })
  })

  describe('page range display', () => {
    it('should show ellipsis when current page is far from start', () => {
      render(<Pagination currentPage={8} totalPages={10} onPageChange={vi.fn()} />)

      // Should show first page and ellipsis
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('...')).toBeInTheDocument()
    })

    it('should show ellipsis when current page is far from end', () => {
      render(<Pagination currentPage={3} totalPages={10} onPageChange={vi.fn()} />)

      // Should show last page and ellipsis
      expect(screen.getByText('10')).toBeInTheDocument()
      expect(screen.getByText('...')).toBeInTheDocument()
    })

    it('should not show first page button when close to start', () => {
      render(<Pagination currentPage={2} totalPages={10} onPageChange={vi.fn()} />)

      // Page 1 should be in the range, not as a separate button
      const buttons = screen.getAllByRole('button')
      const pageOneButtons = buttons.filter(btn => btn.textContent === '1')
      expect(pageOneButtons.length).toBe(1) // Only in the range, not separate
    })

    it('should show pages around current page', () => {
      render(<Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />)

      // Should show pages 3, 4, 5, 6, 7 (currentPage +/- 2)
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('4')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('6')).toBeInTheDocument()
      expect(screen.getByText('7')).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('should highlight current page with special styling', () => {
      render(<Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />)

      const currentPageButton = screen.getByText('5')
      expect(currentPageButton.className).toContain('from-purple-500')
      expect(currentPageButton.className).toContain('to-pink-500')
    })

    it('should apply disabled styling to previous button on first page', () => {
      render(<Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />)

      const prevButton = screen.getByText('← Înapoi')
      expect(prevButton.className).toContain('cursor-not-allowed')
    })

    it('should apply disabled styling to next button on last page', () => {
      render(<Pagination currentPage={10} totalPages={10} onPageChange={vi.fn()} />)

      const nextButton = screen.getByText('Înainte →')
      expect(nextButton.className).toContain('cursor-not-allowed')
    })
  })

  describe('edge cases', () => {
    it('should handle small number of pages correctly', () => {
      render(<Pagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />)

      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.queryByText('...')).not.toBeInTheDocument()
    })

    it('should handle exactly 2 pages', () => {
      render(<Pagination currentPage={1} totalPages={2} onPageChange={vi.fn()} />)

      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })
})
