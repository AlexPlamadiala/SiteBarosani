/**
 * Custom hook for certificate download/share actions
 */
import { useState, useCallback } from 'react';
import jsPDF from 'jspdf';
import { useToast } from '../../contexts/ToastContext';
import { generateCertificateCanvas, generateStoryCanvas } from './generateCertificateCanvas';
import { triggerSuccessConfetti, triggerSmallConfetti } from './useCertificateConfetti';
import { tierLabels } from './certificateUtils';

/**
 * Hook providing certificate download and share functionality
 * @param {Object} barosan - Barosan data object
 * @returns {Object} Action handlers and downloading state
 */
export function useCertificateActions(barosan) {
  const [downloading, setDownloading] = useState(false);
  const toast = useToast();

  const handleDownloadPNG = useCallback(async () => {
    try {
      setDownloading(true);
      const canvas = await generateCertificateCanvas(barosan);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `certificat-barosan-${barosan.certificatId}.png`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          toast.success('Certificat PNG descărcat cu succes!');
          triggerSuccessConfetti();
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('A apărut o eroare la generarea certificatului. Te rugăm să încerci din nou.');
    } finally {
      setDownloading(false);
    }
  }, [barosan, toast]);

  const handleDownloadPDF = useCallback(async () => {
    try {
      setDownloading(true);
      const canvas = await generateCertificateCanvas(barosan);
      const imgData = canvas.toDataURL('image/png');

      // Create PDF in landscape mode (A4)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Calculate dimensions to fit A4 landscape
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Add image to PDF (centered)
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Download PDF
      pdf.save(`certificat-barosan-${barosan.certificatId}.pdf`);
      toast.success('Certificat PDF descărcat cu succes!');

      triggerSuccessConfetti();
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('A apărut o eroare la generarea PDF-ului. Te rugăm să încerci din nou.');
    } finally {
      setDownloading(false);
    }
  }, [barosan, toast]);

  const handleDownloadForStory = useCallback(async () => {
    try {
      setDownloading(true);
      const storyCanvas = await generateStoryCanvas(barosan);

      storyCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `barosan-story-${barosan.certificatId}.png`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          toast.success('Story format descărcat! Perfect pentru Instagram/TikTok!');
          triggerSuccessConfetti();
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Eroare la generare story format');
    } finally {
      setDownloading(false);
    }
  }, [barosan, toast]);

  const handleShareWhatsApp = useCallback(() => {
    const tierEmoji = barosan.tier === 'suprem' ? '👑' : '🏆';
    const text = `${tierEmoji} Tocmai am devenit Barosan ${tierLabels[barosan.tier]}! 🎉\nCertificat ID: ${barosan.certificatId}\nVerifică Registrul Oficial: ${window.location.origin}/zid`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    toast.success('Se deschide WhatsApp...');
  }, [barosan, toast]);

  const handleCopyLink = useCallback(() => {
    const link = `${window.location.origin}/zid?certificat=${barosan.certificatId}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success('Link copiat în clipboard!');
      triggerSmallConfetti();
    });
  }, [barosan, toast]);

  return {
    downloading,
    handleDownloadPNG,
    handleDownloadPDF,
    handleDownloadForStory,
    handleShareWhatsApp,
    handleCopyLink
  };
}
