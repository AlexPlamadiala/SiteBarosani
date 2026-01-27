import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  fetchWithRetry,
  fetchJSONWithRetry,
  isNetworkError,
  getErrorMessage
} from './fetchWithRetry'

describe('fetchWithRetry', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('fetchWithRetry', () => {
    it('should return response on successful fetch', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: 'test' })
      }
      global.fetch.mockResolvedValueOnce(mockResponse)

      const result = await fetchWithRetry('https://api.example.com/data')

      expect(result).toBe(mockResponse)
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should return 4xx errors without retrying', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found'
      }
      global.fetch.mockResolvedValueOnce(mockResponse)

      const result = await fetchWithRetry('https://api.example.com/data')

      expect(result).toBe(mockResponse)
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should retry on 5xx server errors', async () => {
      const serverErrorResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      }
      const successResponse = {
        ok: true,
        status: 200
      }

      global.fetch
        .mockResolvedValueOnce(serverErrorResponse)
        .mockResolvedValueOnce(successResponse)

      const resultPromise = fetchWithRetry('https://api.example.com/data', {}, 3, 100)

      // Advance timers to allow retry
      await vi.advanceTimersByTimeAsync(100)

      const result = await resultPromise

      expect(result).toBe(successResponse)
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })

    it('should retry on network errors', async () => {
      const networkError = new Error('Failed to fetch')
      const successResponse = {
        ok: true,
        status: 200
      }

      global.fetch
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce(successResponse)

      const resultPromise = fetchWithRetry('https://api.example.com/data', {}, 3, 100)

      await vi.advanceTimersByTimeAsync(100)

      const result = await resultPromise

      expect(result).toBe(successResponse)
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })

    it('should throw after max retries exhausted', async () => {
      const networkError = new Error('Failed to fetch')
      global.fetch.mockRejectedValue(networkError)

      let caughtError = null
      const resultPromise = fetchWithRetry('https://api.example.com/data', {}, 2, 100)
        .catch(err => { caughtError = err })

      // Advance through all retries with enough time for all
      await vi.advanceTimersByTimeAsync(500)
      await resultPromise

      expect(caughtError).toBeTruthy()
      expect(caughtError.message).toBe('Failed to fetch')
      expect(global.fetch).toHaveBeenCalledTimes(3) // Initial + 2 retries
    })

    it('should use exponential backoff', async () => {
      const networkError = new Error('Failed to fetch')
      const successResponse = { ok: true, status: 200 }

      global.fetch
        .mockRejectedValueOnce(networkError)
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce(successResponse)

      const resultPromise = fetchWithRetry('https://api.example.com/data', {}, 3, 1000)

      // First retry after 1000ms (1000 * 2^0)
      await vi.advanceTimersByTimeAsync(1000)
      expect(global.fetch).toHaveBeenCalledTimes(2)

      // Second retry after 2000ms (1000 * 2^1)
      await vi.advanceTimersByTimeAsync(2000)
      expect(global.fetch).toHaveBeenCalledTimes(3)

      await resultPromise
    })

    it('should call onRetry callback before each retry', async () => {
      const networkError = new Error('Failed to fetch')
      const successResponse = { ok: true, status: 200 }
      const onRetry = vi.fn()

      global.fetch
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce(successResponse)

      const resultPromise = fetchWithRetry(
        'https://api.example.com/data',
        {},
        3,
        100,
        onRetry
      )

      await vi.advanceTimersByTimeAsync(100)
      await resultPromise

      expect(onRetry).toHaveBeenCalledTimes(1)
      expect(onRetry).toHaveBeenCalledWith(1, 3, networkError)
    })

    it('should pass fetch options correctly', async () => {
      const mockResponse = { ok: true, status: 200 }
      global.fetch.mockResolvedValueOnce(mockResponse)

      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'data' })
      }

      await fetchWithRetry('https://api.example.com/data', options)

      expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/data', options)
    })
  })

  describe('fetchJSONWithRetry', () => {
    it('should return parsed JSON on success', async () => {
      const jsonData = { message: 'success', data: [1, 2, 3] }
      const mockResponse = {
        ok: true,
        status: 200,
        json: () => Promise.resolve(jsonData)
      }
      global.fetch.mockResolvedValueOnce(mockResponse)

      const result = await fetchJSONWithRetry('https://api.example.com/data')

      expect(result).toEqual(jsonData)
    })

    it('should throw error for non-ok response', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        text: () => Promise.resolve('Resource not found')
      }
      global.fetch.mockResolvedValueOnce(mockResponse)

      await expect(
        fetchJSONWithRetry('https://api.example.com/data')
      ).rejects.toThrow('HTTP 404: Resource not found')
    })

    it('should throw error for invalid JSON', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: () => Promise.reject(new Error('Unexpected token'))
      }
      global.fetch.mockResolvedValueOnce(mockResponse)

      await expect(
        fetchJSONWithRetry('https://api.example.com/data')
      ).rejects.toThrow('Invalid JSON response')
    })

    it('should handle error text parsing failure', async () => {
      // Use 400 status to avoid retries (4xx errors are not retried)
      const mockResponse = {
        ok: false,
        status: 400,
        text: () => Promise.reject(new Error('Text parsing failed'))
      }
      global.fetch.mockResolvedValueOnce(mockResponse)

      await expect(
        fetchJSONWithRetry('https://api.example.com/data')
      ).rejects.toThrow('HTTP 400: Unknown error')
    })
  })

  describe('isNetworkError', () => {
    it('should return true for "Failed to fetch" error', () => {
      const error = new Error('Failed to fetch')
      expect(isNetworkError(error)).toBe(true)
    })

    it('should return true for "Network request failed" error', () => {
      const error = new Error('Network request failed')
      expect(isNetworkError(error)).toBe(true)
    })

    it('should return true for Firefox network error', () => {
      const error = new Error('NetworkError when attempting to fetch resource.')
      expect(isNetworkError(error)).toBe(true)
    })

    it('should return true for TypeError with fetch message', () => {
      const error = new TypeError('fetch failed')
      expect(isNetworkError(error)).toBe(true)
    })

    it('should return false for other errors', () => {
      const error = new Error('Some other error')
      expect(isNetworkError(error)).toBe(false)
    })

    it('should return false for server errors', () => {
      const error = new Error('HTTP 500: Internal Server Error')
      expect(isNetworkError(error)).toBe(false)
    })
  })

  describe('getErrorMessage', () => {
    it('should return Romanian message for network errors', () => {
      const error = new Error('Failed to fetch')
      const message = getErrorMessage(error)
      expect(message).toBe(
        'Nu se poate conecta la server. Verifică conexiunea la internet și încearcă din nou.'
      )
    })

    it('should return Romanian message for HTTP 500 errors', () => {
      const error = new Error('HTTP 500: Internal Server Error')
      const message = getErrorMessage(error)
      expect(message).toBe('Eroare de server. Te rugăm să încerci din nou.')
    })

    it('should return Romanian message for HTTP 503 errors', () => {
      const error = new Error('HTTP 503: Service Unavailable')
      const message = getErrorMessage(error)
      expect(message).toBe('Serverul este temporar indisponibil. Te rugăm să încerci mai târziu.')
    })

    it('should return Romanian message for timeout errors', () => {
      const error = new Error('Request timeout after 30000ms')
      const message = getErrorMessage(error)
      expect(message).toBe('Cererea a durat prea mult. Te rugăm să încerci din nou.')
    })

    it('should return original error message for other errors', () => {
      const error = new Error('Custom error message')
      const message = getErrorMessage(error)
      expect(message).toBe('Custom error message')
    })

    it('should return default message when error has no message', () => {
      const error = new Error('')
      const message = getErrorMessage(error)
      expect(message).toBe('A apărut o eroare. Te rugăm să încerci din nou.')
    })
  })
})
