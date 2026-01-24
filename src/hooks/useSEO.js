import { useEffect } from 'react';

const DEFAULT_TITLE = 'Registrul Oficial al Barosanilor';
const DEFAULT_DESCRIPTION = 'Bun venit în Registrul Oficial al Barosanilor! Alătură-te comunității și obține certificatul tău de barosan.';
const DEFAULT_IMAGE = '/og-image.png';
const SITE_URL = 'https://barosani.ro';

/**
 * Custom hook for managing SEO meta tags
 * @param {Object} options - SEO options
 * @param {string} options.title - Page title
 * @param {string} options.description - Meta description
 * @param {string} options.image - Open Graph image URL
 * @param {string} options.url - Canonical URL
 * @param {string} options.type - Open Graph type (default: website)
 */
export function useSEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url = '',
  type = 'website'
} = {}) {
  useEffect(() => {
    // Update document title
    const fullTitle = title === DEFAULT_TITLE ? title : `${title} | ${DEFAULT_TITLE}`;
    document.title = fullTitle;

    // Helper to update or create meta tag
    const setMeta = (name, content, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    // Basic meta tags
    setMeta('description', description);

    // Open Graph tags
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:image', image.startsWith('http') ? image : `${SITE_URL}${image}`, true);
    setMeta('og:url', url ? `${SITE_URL}${url}` : SITE_URL, true);
    setMeta('og:type', type, true);
    setMeta('og:site_name', DEFAULT_TITLE, true);
    setMeta('og:locale', 'ro_RO', true);

    // Twitter Card tags
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image.startsWith('http') ? image : `${SITE_URL}${image}`);

    // Cleanup: Reset to defaults when unmounting
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title, description, image, url, type]);
}

export default useSEO;
