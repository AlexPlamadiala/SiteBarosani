/**
 * Canvas generation for regular tier certificates (Basic, Gold, Platinum)
 * Classic parchment design with tier-specific colors
 */
import QRCode from 'qrcode';
import { tierColors, tierLabels, tierCanvasSymbols, drawCrown, truncateText, formatDateRomanian } from './certificateUtils';

/**
 * Draw a decorative corner star
 */
function drawCornerStar(ctx, x, y, size, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.3;
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-size / 2, -2, size, 4);
  }
  ctx.restore();
}

/**
 * Generate regular certificate canvas
 * @param {Object} barosan - Barosan data object
 * @returns {Promise<HTMLCanvasElement>} Generated canvas
 */
export async function generateRegularCanvas(barosan) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 850;
  const ctx = canvas.getContext('2d');

  const colors = tierColors[barosan.tier] || tierColors.basic;

  // Luxurious background gradient
  const bgGradient = ctx.createRadialGradient(600, 425, 0, 600, 425, 700);
  bgGradient.addColorStop(0, '#FFF8E7');
  bgGradient.addColorStop(0.5, '#F5E6D3');
  bgGradient.addColorStop(1, '#E8D5B7');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, 1200, 850);

  // Corner star decorations
  drawCornerStar(ctx, 80, 80, 40, colors.primary);
  drawCornerStar(ctx, 1120, 80, 40, colors.primary);
  drawCornerStar(ctx, 80, 770, 40, colors.primary);
  drawCornerStar(ctx, 1120, 770, 40, colors.primary);

  // Outer golden border with shadow effect
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 10;
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 20;
  ctx.strokeRect(25, 25, 1150, 800);
  ctx.shadowBlur = 0;

  // Inner golden border
  const goldGradient = ctx.createLinearGradient(0, 0, 1200, 850);
  goldGradient.addColorStop(0, '#FFD700');
  goldGradient.addColorStop(0.5, '#FFA500');
  goldGradient.addColorStop(1, '#FFD700');
  ctx.strokeStyle = goldGradient;
  ctx.lineWidth = 8;
  ctx.strokeRect(45, 45, 1110, 760);

  // Decorative inner line
  ctx.strokeStyle = colors.primary;
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 5]);
  ctx.strokeRect(60, 60, 1080, 730);
  ctx.setLineDash([]);

  // Watermark - multiple crowns pattern
  ctx.globalAlpha = 0.05;
  drawCrown(ctx, 300, 350, 80, '#DAA520');
  drawCrown(ctx, 900, 350, 80, '#DAA520');
  drawCrown(ctx, 600, 550, 80, '#DAA520');
  ctx.globalAlpha = 1;

  // Header crown with glow
  drawCrown(ctx, 600, 85, 55, '#FFD700', colors.primary);
  ctx.shadowBlur = 0;

  // Stars around crown
  ctx.font = '24px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = colors.primary;
  ctx.fillText('★', 520, 75);
  ctx.fillText('★', 680, 75);
  ctx.fillText('✦', 480, 90);
  ctx.fillText('✦', 720, 90);

  // Main title with shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 2;
  ctx.font = 'bold 28px Georgia, serif';
  ctx.fillStyle = '#8B0000';
  ctx.fillText('REPUBLICA BAROSANILOR', 600, 160);
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Decorative gold lines
  ctx.fillStyle = '#DAA520';
  ctx.fillRect(350, 175, 500, 3);
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(400, 182, 400, 2);

  // Certificate title
  ctx.shadowColor = colors.primary;
  ctx.shadowBlur = 5;
  ctx.font = 'bold 52px Georgia, serif';
  ctx.fillStyle = '#1a365d';
  ctx.fillText('CERTIFICAT DE BAROSAN', 600, 240);
  ctx.shadowBlur = 0;

  // Tier badge with special styling
  const tierBadgeText = `${tierCanvasSymbols[barosan.tier]} ${tierLabels[barosan.tier]} ${tierCanvasSymbols[barosan.tier]}`;

  // Badge background
  ctx.fillStyle = colors.primary;
  ctx.globalAlpha = 0.2;
  const badgeWidth = ctx.measureText(tierBadgeText).width + 60;
  ctx.beginPath();
  ctx.roundRect(600 - badgeWidth / 2, 258, badgeWidth, 45, 10);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.font = 'bold 32px Georgia, serif';
  ctx.fillStyle = colors.accent;
  ctx.fillText(tierBadgeText, 600, 292);

  // Decorative separator
  ctx.fillStyle = '#DAA520';
  ctx.fillRect(450, 315, 300, 2);

  // Photo (if exists) - draw on the left side
  if (barosan.poza) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = barosan.poza;
      });

      const photoX = 180;
      const photoY = 435;
      const photoRadius = 70;

      // Photo border glow
      ctx.save();
      ctx.shadowColor = colors.primary;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(photoX, photoY, photoRadius + 5, 0, Math.PI * 2);
      ctx.fillStyle = colors.primary;
      ctx.fill();
      ctx.restore();

      // White border
      ctx.beginPath();
      ctx.arc(photoX, photoY, photoRadius + 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      // Clip to circle and draw image
      ctx.save();
      ctx.beginPath();
      ctx.arc(photoX, photoY, photoRadius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, photoX - photoRadius, photoY - photoRadius, photoRadius * 2, photoRadius * 2);
      ctx.restore();

      // Decorative border
      ctx.beginPath();
      ctx.arc(photoX, photoY, photoRadius + 4, 0, Math.PI * 2);
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 3;
      ctx.stroke();
    } catch {
      // Photo loading failed - continue without photo
    }
  }

  // Body intro text
  ctx.font = '20px Georgia, serif';
  ctx.fillStyle = '#333333';
  ctx.fillText('Se certifică prin prezenta că distinsul/a', 600, 360);

  // Name with glow effect
  ctx.shadowColor = colors.primary;
  ctx.shadowBlur = 4;
  ctx.font = 'bold 44px Georgia, serif';
  ctx.fillStyle = '#1a365d';
  const displayName = truncateText(ctx, barosan.nume, 900);
  ctx.fillText(displayName, 600, 415);
  ctx.shadowBlur = 0;

  // Description
  ctx.font = '17px Georgia, serif';
  ctx.fillStyle = '#333333';
  ctx.fillText('a fost verificat(ă) și confirmat(ă) ca BAROSAN AUTENTIC', 600, 460);
  ctx.fillText('conform standardelor internaționale de șmecherie și bășcălie', 600, 485);
  ctx.fillText('și a fost admis(ă) în registrul oficial al Zidului Barosanilor.', 600, 510);

  // Motto with decorative quotes
  ctx.font = 'italic 20px Georgia, serif';
  ctx.fillStyle = '#555555';
  const motto = truncateText(ctx, `"${barosan.motto}"`, 800);
  ctx.fillText(motto, 600, 560);

  // Funny disclaimer
  ctx.font = 'italic 11px Georgia, serif';
  ctx.fillStyle = '#888888';
  ctx.fillText('* Acest certificat conferă drepturi nelimitate de lăudăroșenie și flexare pe social media', 600, 590);

  // Footer section background
  ctx.fillStyle = 'rgba(139, 69, 19, 0.05)';
  ctx.fillRect(70, 615, 1060, 155);

  // Footer - Certificate ID
  ctx.textAlign = 'left';
  ctx.font = 'bold 16px Arial, sans-serif';
  ctx.fillStyle = '#444444';
  ctx.fillText('NUMĂR CERTIFICAT:', 100, 652);
  ctx.font = 'bold 26px Arial, sans-serif';
  ctx.fillStyle = '#8B0000';
  ctx.fillText(barosan.certificatId, 100, 683);

  ctx.font = 'bold 16px Arial, sans-serif';
  ctx.fillStyle = '#444444';
  ctx.fillText('DATA EMITERII:', 100, 718);
  ctx.font = 'bold 20px Arial, sans-serif';
  ctx.fillStyle = '#1a365d';
  ctx.fillText(formatDateRomanian(barosan.dataInregistrare), 100, 747);

  // QR Code
  try {
    const qrDataUrl = await QRCode.toDataURL(`https://zidulbarosanilor.ro/barosan/${barosan.id}`, {
      width: 80,
      margin: 1,
      color: { dark: '#1a365d', light: '#ffffff' }
    });
    const qrImage = new Image();
    await new Promise((resolve, reject) => {
      qrImage.onload = resolve;
      qrImage.onerror = reject;
      qrImage.src = qrDataUrl;
    });

    // QR background with border
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(290, 645, 90, 90, 5);
    ctx.fill();
    ctx.stroke();

    ctx.drawImage(qrImage, 295, 650, 80, 80);
    ctx.font = 'bold 10px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#555555';
    ctx.fillText('Scanează pentru', 335, 745);
    ctx.fillText('verificare online', 335, 757);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  // Official stamp
  ctx.save();
  ctx.translate(600, 695);
  ctx.rotate(-0.1);

  // Stamp background
  ctx.globalAlpha = 0.95;

  // Outer decorative ring
  ctx.strokeStyle = '#1a365d';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, 78, 0, Math.PI * 2);
  ctx.stroke();

  // Second ring
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 70, 0, Math.PI * 2);
  ctx.stroke();

  // Inner ring
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 45, 0, Math.PI * 2);
  ctx.stroke();

  // Stars between rings
  ctx.font = 'bold 12px Arial, sans-serif';
  ctx.fillStyle = '#1a365d';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < 8; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI * 2) / 8);
    ctx.fillText('★', 0, -58);
    ctx.restore();
  }

  // Center emblem - Crown
  ctx.font = 'bold 36px Georgia, serif';
  ctx.fillStyle = '#D4AF37';
  ctx.shadowColor = '#B8860B';
  ctx.shadowBlur = 3;
  ctx.fillText('♛', 0, -6);
  ctx.shadowBlur = 0;

  // VERIFICAT text
  ctx.font = 'bold 16px Arial, sans-serif';
  ctx.fillStyle = '#1a365d';
  ctx.fillText('VERIFICAT', 0, 22);

  // OFICIAL text
  ctx.font = 'bold 12px Arial, sans-serif';
  ctx.fillStyle = '#8B0000';
  ctx.fillText('OFICIAL', 0, 38);

  // Top arc text
  ctx.font = 'bold 9px Arial, sans-serif';
  ctx.fillStyle = '#1a365d';
  const topText = '★ REPUBLICA BAROSANILOR ★';
  const topRadius = 60;
  const topAngleStep = (Math.PI * 0.8) / topText.length;
  const topStartAngle = -Math.PI / 2 - (topAngleStep * topText.length) / 2;

  for (let i = 0; i < topText.length; i++) {
    ctx.save();
    const angle = topStartAngle + i * topAngleStep;
    ctx.rotate(angle);
    ctx.translate(0, -topRadius);
    ctx.rotate(Math.PI / 2);
    ctx.fillText(topText[i], 0, 0);
    ctx.restore();
  }

  // Bottom arc text
  ctx.font = 'bold 9px Arial, sans-serif';
  const bottomText = '★ OFICIUL DE CERTIFICARE ★';
  const bottomRadius = 60;
  const bottomAngleStep = (Math.PI * 0.8) / bottomText.length;
  const bottomStartAngle = Math.PI / 2 + (bottomAngleStep * bottomText.length) / 2;

  for (let i = 0; i < bottomText.length; i++) {
    ctx.save();
    const angle = bottomStartAngle - i * bottomAngleStep;
    ctx.rotate(angle);
    ctx.translate(0, bottomRadius);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(bottomText[i], 0, 0);
    ctx.restore();
  }

  ctx.globalAlpha = 1;
  ctx.restore();

  // Signatures (right side)
  ctx.textAlign = 'right';

  // First signature
  ctx.font = 'italic 26px Georgia, serif';
  ctx.fillStyle = '#1a365d';
  ctx.fillText('Ion Barosan', 1100, 658);
  ctx.strokeStyle = '#888888';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(940, 666);
  ctx.lineTo(1100, 666);
  ctx.stroke();
  ctx.font = 'bold 14px Arial, sans-serif';
  ctx.fillStyle = '#444444';
  ctx.fillText('Mare Barosan Șef', 1100, 684);
  ctx.font = 'italic 12px Arial, sans-serif';
  ctx.fillStyle = '#666666';
  ctx.fillText('& Expert în Bășcălie', 1100, 700);

  // Second signature
  ctx.font = 'italic 26px Georgia, serif';
  ctx.fillStyle = '#1a365d';
  ctx.fillText('Maria Șmechera', 1100, 726);
  ctx.beginPath();
  ctx.moveTo(940, 734);
  ctx.lineTo(1100, 734);
  ctx.stroke();
  ctx.font = 'bold 14px Arial, sans-serif';
  ctx.fillStyle = '#444444';
  ctx.fillText('Director Dept. Bășcălie', 1100, 752);
  ctx.font = 'italic 12px Arial, sans-serif';
  ctx.fillStyle = '#666666';
  ctx.fillText('& Ministru al Flexării', 1100, 768);

  // Bottom decorative line
  ctx.fillStyle = '#DAA520';
  ctx.fillRect(100, 785, 1000, 2);

  // Final funny footer
  ctx.textAlign = 'center';
  ctx.font = 'bold 11px Arial, sans-serif';
  ctx.fillStyle = '#8B4513';
  ctx.fillText('★ CERTIFICAT OFICIAL • VALABIL PE TOATĂ PLANETA • NU SE ACCEPTĂ CONTESTAȚII ★', 600, 805);

  return canvas;
}
