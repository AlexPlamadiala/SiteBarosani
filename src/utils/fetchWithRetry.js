/**
 * Fetch with automatic retry on network errors
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} retryDelay - Initial delay between retries in ms (default: 1000)
 * @param {Function} onRetry - Callback function called before each retry attempt
 * @returns {Promise<Response>} - The fetch response
 */
export async function fetchWithRetry(
  url,
  options = {},
  maxRetries = 3,
  retryDelay = 1000,
  onRetry = null
) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // If response is ok or it's a client error (4xx), don't retry
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }

      // Server error (5xx) - retry
      lastError = new Error(`Server error: ${response.status} ${response.statusText}`);

    } catch (error) {
      // Network error or other fetch error
      lastError = error;
    }

    // If this wasn't the last attempt, wait and retry
    if (attempt < maxRetries) {
      // Call onRetry callback if provided
      if (onRetry) {
        onRetry(attempt + 1, maxRetries, lastError);
      }

      // Exponential backoff: delay * 2^attempt
      const delay = retryDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // All retries exhausted, throw the last error
  throw lastError;
}

/**
 * Fetch JSON with automatic retry and error handling
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} maxRetries - Maximum retries
 * @param {Function} onRetry - Retry callback
 * @returns {Promise<Object>} - Parsed JSON response
 */
export async function fetchJSONWithRetry(
  url,
  options = {},
  maxRetries = 3,
  onRetry = null
) {
  const response = await fetchWithRetry(url, options, maxRetries, 1000, onRetry);

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  try {
    return await response.json();
  } catch (error) {
    throw new Error(`Invalid JSON response: ${error.message}`);
  }
}

/**
 * Check if error is a network error (no connection)
 * @param {Error} error - The error to check
 * @returns {boolean} - True if network error
 */
export function isNetworkError(error) {
  return (
    error.message === 'Failed to fetch' ||
    error.message === 'Network request failed' ||
    error.message === 'NetworkError when attempting to fetch resource.' ||
    error.name === 'TypeError' && error.message.includes('fetch')
  );
}

/**
 * Get user-friendly error message
 * @param {Error} error - The error
 * @returns {string} - User-friendly message
 */
export function getErrorMessage(error) {
  if (isNetworkError(error)) {
    return 'Nu se poate conecta la server. Verifică conexiunea la internet și încearcă din nou.';
  }

  if (error.message.startsWith('HTTP 500')) {
    return 'Eroare de server. Te rugăm să încerci din nou.';
  }

  if (error.message.startsWith('HTTP 503')) {
    return 'Serverul este temporar indisponibil. Te rugăm să încerci mai târziu.';
  }

  if (error.message.includes('timeout')) {
    return 'Cererea a durat prea mult. Te rugăm să încerci din nou.';
  }

  return error.message || 'A apărut o eroare. Te rugăm să încerci din nou.';
}
