import { useState, useMemo } from 'react';
import BarosanCard from './BarosanCard';
import CertificateGenerator from './CertificateGenerator';

export default function BarosanGrid({ barosani }) {
  const [selectedBarosan, setSelectedBarosan] = useState(null);

  // Sort barosani: Supreme > Elite > Premium > Standard
  const sortedBarosani = useMemo(() => {
    const tierOrder = { supreme: 1, elite: 2, premium: 3, standard: 4 };
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
