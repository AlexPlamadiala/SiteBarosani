/**
 * Custom hook for certificate confetti effects
 */
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { tierColors } from './certificateUtils';

/**
 * Hook that handles confetti animation when certificate modal opens
 * @param {string} tier - The barosan tier (suprem, platinum, gold, basic)
 */
export function useCertificateConfetti(tier) {
  useEffect(() => {
    const colors = tierColors[tier]?.confetti || tierColors.basic.confetti;

    // Fire confetti burst from both sides
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Big burst on mount
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors
    });
  }, [tier]);
}

/**
 * Trigger success confetti (for download success)
 * @param {Object} options - Confetti options
 */
export function triggerSuccessConfetti(options = {}) {
  confetti({
    particleCount: options.particleCount || 50,
    spread: options.spread || 60,
    origin: { y: options.originY || 0.7 }
  });
}

/**
 * Trigger smaller confetti burst (for copy link, etc.)
 */
export function triggerSmallConfetti() {
  confetti({
    particleCount: 30,
    spread: 50,
    origin: { y: 0.6 }
  });
}
