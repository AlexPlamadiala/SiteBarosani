import { useState, useMemo } from 'react';
import BarosanCard from './BarosanCard';
import CertificateGenerator from './CertificateGenerator';

export default function BarosanGrid({ barosani }) {
  const [selectedBarosan, setSelectedBarosan] = useState(null);

  // Sort barosani: Platinum > Gold > Basic
  const sortedBarosani = useMemo(() => {
    const tierOrder = { platinum: 1, gold: 2, basic: 3 };
    return [...barosani].sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);
  }, [barosani]);

  const handleViewCertificate = (barosan) => {
    setSelectedBarosan(barosan);
  };

  const handleCloseCertificate = () => {
    setSelectedBarosan(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {sortedBarosani.map((barosan) => (
          <BarosanCard
            key={barosan.id}
            barosan={barosan}
            onViewCertificate={handleViewCertificate}
          />
        ))}
      </div>

      {/* Certificate Modal */}
      {selectedBarosan && (
        <CertificateGenerator
          barosan={selectedBarosan}
          onClose={handleCloseCertificate}
        />
      )}
    </>
  );
}
