/**
 * Certificate module exports
 */

// Main preview component
export { default as CertificatePreview } from './CertificatePreview';
export { default as SupremCertificatePreview } from './SupremCertificatePreview';
export { default as RegularCertificatePreview } from './RegularCertificatePreview';

// Canvas generation
export { generateCertificateCanvas, generateStoryCanvas } from './generateCertificateCanvas';
export { generateSupremCanvas } from './generateSupremCanvas';
export { generateRegularCanvas } from './generateRegularCanvas';

// Actions and hooks
export { useCertificateActions } from './useCertificateDownload';
export { CertificateHeaderActions, CertificateFooterActions } from './CertificateActions';
export { useCertificateConfetti, triggerSuccessConfetti, triggerSmallConfetti } from './useCertificateConfetti';

// Utilities
export * from './certificateUtils';
