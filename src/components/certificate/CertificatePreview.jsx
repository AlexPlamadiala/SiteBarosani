/**
 * Certificate preview component
 * Routes to the appropriate tier-specific preview component
 */
import { forwardRef } from 'react';
import SupremCertificatePreview from './SupremCertificatePreview';
import RegularCertificatePreview from './RegularCertificatePreview';

const CertificatePreview = forwardRef(function CertificatePreview({ barosan }, ref) {
  if (barosan.tier === 'suprem') {
    return <SupremCertificatePreview ref={ref} barosan={barosan} />;
  }
  return <RegularCertificatePreview ref={ref} barosan={barosan} />;
});

export default CertificatePreview;
