/**
 * Canvas generation for SUPREM tier certificates
 * Premium dark design with gold accents
 */
import QRCode from 'qrcode';
import { truncateText, formatDateRomanian } from './certificateUtils';

/**
 * Generate SUPREM certificate canvas
 * @param {Object} barosan - Barosan data object
 * @returns {Promise<HTMLCanvasElement>} Generated canvas
 */
export async function generateSupremCanvas(barosan) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 850;
  const ctx = canvas.getContext('2d');

  // SUPREM: Dark premium background with gradient
  const bgGradient = ctx.createRadialGradient(600, 425, 0, 600, 425, 800);
  bgGradient.addColorStop(0, '#1a0a2e');
  bgGradient.addColorStop(0.4, '#16082a');
  bgGradient.addColorStop(0.7, '#0f0518');
  bgGradient.addColorStop(1, '#0a0012');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, 1200, 850);

  // Starfield effect
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 50; i++) {
    ctx.globalAlpha = Math.random() * 0.15 + 0.06;
    ctx.beginPath();
    ctx.arc(Math.random() * 1200, Math.random() * 850, Math.random() * 2 + 1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Glowing aura effect in center
  const auraGradient = ctx.createRadialGradient(600, 350, 0, 600, 350, 400);
  auraGradient.addColorStop(0, 'rgba(147, 51, 234, 0.15)');
  auraGradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.08)');
  auraGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = auraGradient;
  ctx.fillRect(0, 0, 1200, 850);

  // Outer border - gold with glow
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 20;
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 4;
  ctx.strokeRect(25, 25, 1150, 800);
  ctx.shadowBlur = 0;

  // Corner crowns
  ctx.globalAlpha = 0.3;
  ctx.font = '48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('👑', 64, 64);
  ctx.fillText('👑', 1136, 64);
  ctx.fillText('👑', 64, 560);
  ctx.fillText('👑', 1136, 560);
  ctx.globalAlpha = 1;

  // Header section - stars and crown
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Stars around crown
  ctx.fillStyle = '#EAB308';
  ctx.font = '32px Arial';
  ctx.fillText('✦', 490, 75);
  ctx.fillStyle = '#FACC15';
  ctx.font = '28px Arial';
  ctx.fillText('★', 530, 75);

  // Main crown emoji with glow
  ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
  ctx.shadowBlur = 20;
  ctx.font = '80px Arial';
  ctx.fillText('👑', 600, 75);
  ctx.shadowBlur = 0;

  // Stars on right side
  ctx.fillStyle = '#FACC15';
  ctx.font = '28px Arial';
  ctx.fillText('★', 670, 75);
  ctx.fillStyle = '#EAB308';
  ctx.font = '32px Arial';
  ctx.fillText('✦', 710, 75);

  // BAROSANUL SUPREM title with glow
  ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
  ctx.shadowBlur = 30;
  ctx.font = 'bold 60px Georgia, serif';
  ctx.fillStyle = '#FFD700';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('BAROSANUL SUPREM', 600, 160);
  ctx.shadowBlur = 0;

  // Decorative line under title
  const lineGradient = ctx.createLinearGradient(300, 0, 900, 0);
  lineGradient.addColorStop(0, 'transparent');
  lineGradient.addColorStop(0.3, '#9333EA');
  lineGradient.addColorStop(0.5, '#FFD700');
  lineGradient.addColorStop(0.7, '#9333EA');
  lineGradient.addColorStop(1, 'transparent');
  ctx.strokeStyle = lineGradient;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(300, 180);
  ctx.lineTo(900, 180);
  ctx.stroke();

  // Small star in center of line
  ctx.fillStyle = '#F472B6';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('✦', 600, 182);

  // Subtitle
  ctx.font = 'italic 20px Georgia, serif';
  ctx.fillStyle = '#F472B6';
  ctx.fillText('Cel mai prestigios titlu din Republica Barosanilor', 600, 215);

  // Main content section
  ctx.font = '22px Georgia, serif';
  ctx.fillStyle = '#D1D5DB';
  ctx.fillText('Se certifică prin prezenta că legendarul/a', 600, 290);

  // Name with golden glow
  ctx.shadowColor = 'rgba(255, 215, 0, 0.4)';
  ctx.shadowBlur = 20;
  ctx.font = 'bold 48px Georgia, serif';
  ctx.fillStyle = '#FFD700';
  const displayName = truncateText(ctx, barosan.nume, 800);
  ctx.fillText(displayName, 600, 355);
  ctx.shadowBlur = 0;

  // Description text
  ctx.font = '20px Georgia, serif';
  ctx.fillStyle = '#9CA3AF';
  ctx.fillText('a atins cel mai înalt nivel de șmecherie și bășcălie', 600, 410);

  // "și a fost încoronat ca BAROSANUL SUPREM" with highlight
  ctx.fillText('și a fost încoronat ca ', 480, 445);
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 20px Georgia, serif';
  ctx.fillText('BAROSANUL SUPREM', 720, 445);

  ctx.font = 'italic 18px Georgia, serif';
  ctx.fillStyle = '#6B7280';
  ctx.fillText('domnind glorios pe Zidul Barosanilor', 600, 480);

  // Motto with decorative quotes
  ctx.font = 'italic 24px Georgia, serif';
  ctx.fillStyle = '#C4B5FD';
  const motto = truncateText(ctx, `"${barosan.motto}"`, 700);
  ctx.fillText(motto, 600, 535);

  // Disclaimer
  ctx.font = 'italic 12px Georgia, serif';
  ctx.fillStyle = '#4B5563';
  ctx.fillText('* Certificat de putere absolută. Toate închinările sunt obligatorii.', 600, 575);

  // Footer section with dark glass effect
  ctx.fillStyle = 'rgba(255, 215, 0, 0.05)';
  ctx.beginPath();
  ctx.roundRect(70, 600, 1060, 180, 8);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Certificate ID and Date (left side)
  ctx.textAlign = 'left';
  ctx.font = 'bold 12px Arial, sans-serif';
  ctx.fillStyle = '#6B7280';
  ctx.fillText('NUMĂR CERTIFICAT:', 100, 640);
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.fillStyle = '#FFD700';
  ctx.fillText(barosan.certificatId, 100, 670);

  ctx.font = 'bold 12px Arial, sans-serif';
  ctx.fillStyle = '#6B7280';
  ctx.fillText('DATA ÎNCORONĂRII:', 100, 710);
  ctx.font = '16px Arial, sans-serif';
  ctx.fillStyle = '#D1D5DB';
  ctx.fillText(formatDateRomanian(barosan.dataInregistrare), 100, 735);

  // QR Code with gold border
  try {
    const qrDataUrl = await QRCode.toDataURL(`https://zidulbarosanilor.ro/barosan/${barosan.id}`, {
      width: 80,
      margin: 1,
      color: { dark: '#1a0a2e', light: '#ffffff' }
    });
    const qrImage = new Image();
    await new Promise((resolve, reject) => {
      qrImage.onload = resolve;
      qrImage.onerror = reject;
      qrImage.src = qrDataUrl;
    });

    // QR background
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(280, 625, 90, 90, 8);
    ctx.fill();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.drawImage(qrImage, 285, 630, 80, 80);

    // QR label
    ctx.textAlign = 'center';
    ctx.font = '10px Arial, sans-serif';
    ctx.fillStyle = '#6B7280';
    ctx.fillText('Scanează pentru', 325, 730);
    ctx.fillText('verificare regală', 325, 745);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  // Royal stamp in center
  ctx.save();
  ctx.translate(600, 690);
  ctx.rotate(-0.2);

  // Outer purple ring with glow
  ctx.shadowColor = 'rgba(147, 51, 234, 0.5)';
  ctx.shadowBlur = 15;
  ctx.strokeStyle = '#9333EA';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 56, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Inner gold ring
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 48, 0, Math.PI * 2);
  ctx.stroke();

  // Crown in center
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '36px Arial';
  ctx.fillStyle = '#FFD700';
  ctx.fillText('♛', 0, -8);

  // SUPREM text
  ctx.font = 'bold 12px Arial, sans-serif';
  ctx.fillStyle = '#F472B6';
  ctx.fillText('SUPREM', 0, 20);

  ctx.restore();

  // Signatures - right side
  ctx.textAlign = 'right';
  ctx.font = 'italic 24px Georgia, serif';
  ctx.fillStyle = '#FFD700';
  ctx.fillText('Împăratul Barosan', 1100, 650);

  // Signature line
  ctx.strokeStyle = '#9333EA';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(940, 658);
  ctx.lineTo(1100, 658);
  ctx.stroke();

  ctx.font = '12px Arial, sans-serif';
  ctx.fillStyle = '#9CA3AF';
  ctx.fillText('Suveran Suprem', 1100, 678);

  ctx.font = 'italic 24px Georgia, serif';
  ctx.fillStyle = '#FFD700';
  ctx.fillText('Regina Șmecheriei', 1100, 720);

  ctx.beginPath();
  ctx.moveTo(940, 728);
  ctx.lineTo(1100, 728);
  ctx.stroke();

  ctx.font = '12px Arial, sans-serif';
  ctx.fillStyle = '#9CA3AF';
  ctx.fillText('Consilier Regal', 1100, 748);

  // Bottom decorative line
  const bottomLineGradient = ctx.createLinearGradient(100, 0, 1100, 0);
  bottomLineGradient.addColorStop(0, 'transparent');
  bottomLineGradient.addColorStop(0.3, '#9333EA');
  bottomLineGradient.addColorStop(0.5, 'transparent');
  bottomLineGradient.addColorStop(0.7, '#9333EA');
  bottomLineGradient.addColorStop(1, 'transparent');
  ctx.strokeStyle = bottomLineGradient;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, 795);
  ctx.lineTo(1100, 795);
  ctx.stroke();

  // Footer text
  ctx.textAlign = 'center';
  ctx.font = 'bold 11px Arial, sans-serif';
  ctx.fillStyle = '#C084FC';
  ctx.fillText('👑 CERTIFICAT DE SUPREMAȚIE • PUTERE NELIMITATĂ • TOȚI SE ÎNCHINĂ 👑', 600, 820);

  return canvas;
}
