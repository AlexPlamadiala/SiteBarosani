import { useEffect, useState } from 'react';

/**
 * Hook pentru animare counter (count up effect)
 * @param {number} end - Numărul final
 * @param {number} duration - Durata animației în ms (default: 2000)
 * @param {number} start - Numărul inițial (default: 0)
 */
export function useCountUp(end, duration = 2000, start = 0) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (start === end) return;

    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function pentru animație smooth
      const easeOutQuad = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOutQuad * (end - start) + start));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [end, duration, start]);

  return count;
}
