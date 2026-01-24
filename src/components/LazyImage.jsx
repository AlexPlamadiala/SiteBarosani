import { useState, useEffect, useRef } from 'react';

/**
 * LazyImage component with Intersection Observer for optimal lazy loading
 * Features:
 * - Uses native lazy loading as fallback
 * - Intersection Observer for precise control
 * - Fade-in animation on load
 * - Error handling with fallback
 * - Blur placeholder while loading
 */
export default function LazyImage({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  fallback = null,
  placeholderColor = 'bg-gray-200',
  threshold = 0.1,
  rootMargin = '50px',
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  if (hasError && fallback) {
    return fallback;
  }

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${wrapperClassName}`}>
      {/* Placeholder */}
      {!isLoaded && (
        <div className={`absolute inset-0 ${placeholderColor} animate-pulse`} />
      )}

      {/* Image - only load src when in view */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
          {...props}
        />
      )}
    </div>
  );
}
