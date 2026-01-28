import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Luxury Countdown Component - Cosmic Penthouse Design System
 *
 * Props:
 * - endTime: Date or timestamp when countdown ends
 * - variant: 'default' | 'compact' | 'large' | 'critical'
 * - onComplete: callback when countdown reaches zero
 * - showLabels: boolean, whether to show ORE/MIN/SEC labels
 * - className: additional CSS classes
 */
export default function CountdownLuxury({
  endTime,
  variant = 'default',
  onComplete,
  showLabels = true,
  className = ''
}) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isComplete, setIsComplete] = useState(false);

  function calculateTimeLeft() {
    const end = endTime instanceof Date ? endTime : new Date(endTime);
    const difference = end.getTime() - Date.now();

    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    return {
      hours: Math.floor(difference / (1000 * 60 * 60)),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.total <= 0 && !isComplete) {
        setIsComplete(true);
        clearInterval(timer);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onComplete, isComplete]);

  const padNumber = (num) => String(num).padStart(2, '0');
  const isCritical = timeLeft.total > 0 && timeLeft.hours < 1;
  const effectiveVariant = isCritical && variant !== 'compact' ? 'critical' : variant;

  // Compact variant - inline display
  if (effectiveVariant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <span className="text-[var(--gold-300)] font-semibold text-sm font-mono tabular-nums">
          {padNumber(timeLeft.hours)}:{padNumber(timeLeft.minutes)}:{padNumber(timeLeft.seconds)}
        </span>
        {showLabels && (
          <span className="text-[var(--color-text-tertiary)] text-xs">rămase</span>
        )}
      </div>
    );
  }

  // Large variant - prominent display for Hero
  if (effectiveVariant === 'large') {
    return (
      <div className={`countdown-container-large ${className}`}>
        <div className="flex items-center justify-center gap-4 md:gap-6">
          <DigitBlock value={padNumber(timeLeft.hours)} label="ORE" size="large" />
          <Separator size="large" />
          <DigitBlock value={padNumber(timeLeft.minutes)} label="MIN" size="large" />
          <Separator size="large" />
          <DigitBlock value={padNumber(timeLeft.seconds)} label="SEC" size="large" animate />
        </div>
        <div className="text-center mt-4 text-[var(--color-text-tertiary)] text-sm">
          Până la expirare
        </div>
      </div>
    );
  }

  // Critical variant - urgent styling
  if (effectiveVariant === 'critical') {
    return (
      <motion.div
        className={`p-4 md:p-5 rounded-xl bg-[var(--color-bg-elevated)] border-2 border-[var(--color-error)]/50 ${className}`}
        animate={{
          boxShadow: [
            '0 0 20px rgba(248, 113, 113, 0.2)',
            '0 0 40px rgba(248, 113, 113, 0.4)',
            '0 0 20px rgba(248, 113, 113, 0.2)'
          ]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="flex items-center justify-center gap-3 md:gap-4">
          <DigitBlock value={padNumber(timeLeft.hours)} label="ORE" critical />
          <Separator critical />
          <DigitBlock value={padNumber(timeLeft.minutes)} label="MIN" critical />
          <Separator critical />
          <DigitBlock value={padNumber(timeLeft.seconds)} label="SEC" critical animate />
        </div>
        <div className="text-center mt-3 text-[var(--color-error)] text-sm font-semibold flex items-center justify-center gap-2">
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            ⚡
          </motion.span>
          Grăbește-te!
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <div className={`countdown-container ${className}`}>
      <div className="flex items-center justify-center gap-2 md:gap-3">
        <DigitBlock value={padNumber(timeLeft.hours)} label={showLabels ? "ORE" : null} />
        <Separator />
        <DigitBlock value={padNumber(timeLeft.minutes)} label={showLabels ? "MIN" : null} />
        <Separator />
        <DigitBlock value={padNumber(timeLeft.seconds)} label={showLabels ? "SEC" : null} animate />
      </div>
      {showLabels && (
        <div className="text-center mt-3 text-[var(--color-text-tertiary)] text-xs">
          Până la expirare
        </div>
      )}
    </div>
  );
}

// Digit Block Component
function DigitBlock({ value, label, size = 'default', critical = false, animate = false }) {
  const sizeClasses = {
    default: 'min-w-[50px] md:min-w-[60px] px-2 md:px-3 py-2',
    large: 'min-w-[70px] md:min-w-[80px] px-3 md:px-4 py-3'
  };

  const digitSizes = {
    default: 'text-xl md:text-2xl',
    large: 'text-3xl md:text-4xl'
  };

  const labelSizes = {
    default: 'text-[9px] md:text-[10px]',
    large: 'text-[10px] md:text-xs'
  };

  const bgClass = critical
    ? 'bg-[var(--color-error)]/10 border-[var(--color-error)]/30'
    : 'bg-[var(--color-bg-surface)] border-[var(--border-subtle)]';

  const textClass = critical
    ? 'text-[var(--color-error)]'
    : 'text-[var(--gold-300)]';

  return (
    <div className={`flex flex-col items-center ${sizeClasses[size]} ${bgClass} border rounded-lg`}>
      <motion.span
        className={`countdown-digit font-bold ${digitSizes[size]} ${textClass} tabular-nums leading-none`}
        key={animate ? value : undefined}
        initial={animate ? { y: -10, opacity: 0 } : false}
        animate={animate ? { y: 0, opacity: 1 } : false}
        transition={{ duration: 0.2 }}
        style={{ fontFeatureSettings: "'tnum'" }}
      >
        {value}
      </motion.span>
      {label && (
        <span className={`countdown-label ${labelSizes[size]} font-semibold tracking-[0.15em] text-[var(--color-text-tertiary)] mt-1 uppercase`}>
          {label}
        </span>
      )}
    </div>
  );
}

// Separator Component
function Separator({ size = 'default', critical = false }) {
  const sizeClasses = {
    default: 'text-lg md:text-xl',
    large: 'text-2xl md:text-3xl'
  };

  const colorClass = critical
    ? 'text-[var(--color-error)]'
    : 'text-[var(--gold-primary)]';

  return (
    <motion.span
      className={`countdown-separator font-light ${sizeClasses[size]} ${colorClass}`}
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
    >
      :
    </motion.span>
  );
}

// Inline Countdown for cards
export function CountdownInline({ endTime, className = '' }) {
  return (
    <CountdownLuxury
      endTime={endTime}
      variant="compact"
      showLabels={false}
      className={className}
    />
  );
}
