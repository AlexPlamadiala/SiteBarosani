import { useRef, useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';
import { useToast } from '../contexts/ToastContext';
import QRCode from 'qrcode';

export default function CertificateGenerator({ barosan, onClose }) {
  const certificateRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const toast = useToast();

  // Confetti effect when certificate opens
  useEffect(() => {
    // Gold confetti for platinum/gold tiers, regular for basic
    const colors = barosan.tier === 'suprem'
      ? ['#9333EA', '#EC4899', '#FFD700', '#A855F7']
      : barosan.tier === 'platinum'
      ? ['#E5E4E2', '#BCC6CC', '#D4AF37', '#FFD700']
      : barosan.tier === 'gold'
      ? ['#D4AF37', '#FFD700', '#FFA500']
      : ['#4169E1', '#FFD700', '#00CED1'];

    // Fire confetti burst
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
  }, [barosan.tier]);

  // SVG Crown component for HTML preview (matches drawn crown in canvas)
  const CrownSVG = ({ size = 50, className = "" }) => (
    <svg width={size} height={size * 0.9} viewBox="-30 -30 60 54" className={className}>
      {/* Crown base */}
      <path
        d="M-25,20 L-25,5 L-20,-15 L-10,5 L0,-25 L10,5 L20,-15 L25,5 L25,20 Z"
        fill="#FFD700"
      />
      {/* Crown jewels */}
      <circle cx="-20" cy="-8" r="4" fill="#FF0000" />
      <circle cx="0" cy="-18" r="5" fill="#FF0000" />
      <circle cx="20" cy="-8" r="4" fill="#FF0000" />
      {/* Crown band */}
      <rect x="-25" y="15" width="50" height="8" fill="#B8860B" />
    </svg>
  );

  // Tier symbols for HTML preview (matching PDF)
  const tierSymbols = {
    suprem: '👑',
    platinum: '◆',
    gold: '★',
    basic: '●'
  };

  const tierLabels = {
    suprem: 'SUPREM',
    platinum: 'PLATINUM',
    gold: 'GOLD',
    basic: 'BASIC'
  };

  // Draw a crown shape (replaces emoji for PDF compatibility)
  const drawCrown = (ctx, x, y, size, color, glowColor = null) => {
    ctx.save();
    ctx.translate(x, y);

    if (glowColor) {
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 15;
    }

    const scale = size / 50;
    ctx.scale(scale, scale);

    // Crown base
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-25, 20);
    ctx.lineTo(-25, 5);
    ctx.lineTo(-20, -15);
    ctx.lineTo(-10, 5);
    ctx.lineTo(0, -25);
    ctx.lineTo(10, 5);
    ctx.lineTo(20, -15);
    ctx.lineTo(25, 5);
    ctx.lineTo(25, 20);
    ctx.closePath();
    ctx.fill();

    // Crown jewels
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(-20, -8, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, -18, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(20, -8, 4, 0, Math.PI * 2);
    ctx.fill();

    // Crown band
    ctx.fillStyle = '#B8860B';
    ctx.fillRect(-25, 15, 50, 8);

    ctx.restore();
  };

  // Generate SUPREM certificate - completely different premium design
  // This should match the HTML preview exactly
  const generateSupremCertificateCanvas = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');

    // SUPREM: Dark premium background with gradient (matching HTML)
    const bgGradient = ctx.createRadialGradient(600, 425, 0, 600, 425, 800);
    bgGradient.addColorStop(0, '#1a0a2e');
    bgGradient.addColorStop(0.4, '#16082a');
    bgGradient.addColorStop(0.7, '#0f0518');
    bgGradient.addColorStop(1, '#0a0012');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 850);

    // Starfield effect (matching HTML opacity-30)
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 50; i++) {
      ctx.globalAlpha = Math.random() * 0.15 + 0.06; // Reduced opacity to match HTML
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

    // Outer border - gold with glow (matching HTML inset-[25px] border-4)
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 20;
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.strokeRect(25, 25, 1150, 800);
    ctx.shadowBlur = 0;

    // Corner crowns using emoji (top corners at 64px, bottom corners higher to not overlap footer)
    ctx.globalAlpha = 0.3;
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👑', 64, 64);
    ctx.fillText('👑', 1136, 64);
    // Bottom crowns positioned higher (at 560px instead of 786px to avoid footer overlap)
    ctx.fillText('👑', 64, 560);
    ctx.fillText('👑', 1136, 560);
    ctx.globalAlpha = 1;

    // Header section - stars and crown (matching HTML flex layout)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Stars around crown (matching HTML gap-4 = 16px)
    ctx.fillStyle = '#EAB308'; // text-yellow-500
    ctx.font = '32px Arial';
    ctx.fillText('✦', 490, 75);  // text-2xl
    ctx.fillStyle = '#FACC15'; // text-yellow-400
    ctx.font = '28px Arial';
    ctx.fillText('★', 530, 75);  // text-xl

    // Main crown emoji with glow (matching HTML text-6xl with drop-shadow)
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

    // BAROSANUL SUPREM title with glow (matching HTML text-5xl font-bold)
    ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
    ctx.shadowBlur = 30;
    ctx.font = 'bold 60px Georgia, serif';
    ctx.fillStyle = '#FFD700';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('BAROSANUL SUPREM', 600, 160);
    ctx.shadowBlur = 0;

    // Decorative line under title (matching HTML gradient)
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
    ctx.fillStyle = '#F472B6'; // text-pink-400
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('✦', 600, 182);

    // Subtitle (matching HTML text-pink-400 italic)
    ctx.font = 'italic 20px Georgia, serif';
    ctx.fillStyle = '#F472B6';
    ctx.fillText('Cel mai prestigios titlu din Republica Barosanilor', 600, 215);

    // Main content section
    ctx.font = '22px Georgia, serif';
    ctx.fillStyle = '#D1D5DB'; // text-gray-300
    ctx.fillText('Se certifică prin prezenta că legendarul/a', 600, 290);

    // Name with golden glow (matching HTML text-4xl font-bold)
    ctx.shadowColor = 'rgba(255, 215, 0, 0.4)';
    ctx.shadowBlur = 20;
    ctx.font = 'bold 48px Georgia, serif';
    ctx.fillStyle = '#FFD700';
    let displayName = barosan.nume;
    if (ctx.measureText(displayName).width > 800) {
      while (ctx.measureText(displayName + '...').width > 800 && displayName.length > 0) {
        displayName = displayName.slice(0, -1);
      }
      displayName += '...';
    }
    ctx.fillText(displayName, 600, 355);
    ctx.shadowBlur = 0;

    // Description text (matching HTML text-lg text-gray-400)
    ctx.font = '20px Georgia, serif';
    ctx.fillStyle = '#9CA3AF';
    ctx.fillText('a atins cel mai înalt nivel de șmecherie și bășcălie', 600, 410);

    // "și a fost încoronat ca BAROSANUL SUPREM" with highlight
    ctx.fillText('și a fost încoronat ca ', 480, 445);
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 20px Georgia, serif';
    ctx.fillText('BAROSANUL SUPREM', 720, 445);

    ctx.font = 'italic 18px Georgia, serif';
    ctx.fillStyle = '#6B7280'; // text-gray-500
    ctx.fillText('domnind glorios pe Zidul Barosanilor', 600, 480);

    // Motto with decorative quotes (matching HTML text-xl italic text-purple-300)
    ctx.font = 'italic 24px Georgia, serif';
    ctx.fillStyle = '#C4B5FD'; // text-purple-300
    let motto = barosan.motto;
    if (ctx.measureText(`"${motto}"`).width > 700) {
      while (ctx.measureText(`"${motto}..."`).width > 700 && motto.length > 0) {
        motto = motto.slice(0, -1);
      }
      motto += '...';
    }
    ctx.fillText(`"${motto}"`, 600, 535);

    // Disclaimer (matching HTML text-xs italic text-gray-600)
    ctx.font = 'italic 12px Georgia, serif';
    ctx.fillStyle = '#4B5563';
    ctx.fillText('* Certificat de putere absolută. Toate închinările sunt obligatorii.', 600, 575);

    // Footer section with dark glass effect (matching HTML)
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
    const dateStr = new Date(barosan.dataInregistrare).toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    ctx.fillText(dateStr, 100, 735);

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

    // Royal stamp in center (matching HTML)
    ctx.save();
    ctx.translate(600, 690);
    ctx.rotate(-0.2); // -rotate-12 in radians

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

    // Signatures - right side (matching HTML)
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

    // Bottom decorative line (matching HTML gradient)
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

    // Footer text (matching HTML)
    ctx.textAlign = 'center';
    ctx.font = 'bold 11px Arial, sans-serif';
    ctx.fillStyle = '#C084FC'; // text-purple-400
    ctx.fillText('👑 CERTIFICAT DE SUPREMAȚIE • PUTERE NELIMITATĂ • TOȚI SE ÎNCHINĂ 👑', 600, 820);

    return canvas;
  };

  // Generate certificate as Canvas (template-based approach)
  const generateCertificateCanvas = async () => {
    // Use special design for suprem tier
    if (barosan.tier === 'suprem') {
      return generateSupremCertificateCanvas();
    }
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');

    // Tier-based colors
    const tierColors = {
      suprem: { primary: '#9333EA', secondary: '#EC4899', accent: '#A855F7', glow: '#F3E8FF' },
      platinum: { primary: '#E5E4E2', secondary: '#BCC6CC', accent: '#C0C0C0', glow: '#FFFFFF' },
      gold: { primary: '#FFD700', secondary: '#DAA520', accent: '#B8860B', glow: '#FFF8DC' },
      basic: { primary: '#4169E1', secondary: '#1E90FF', accent: '#00CED1', glow: '#E6F3FF' }
    };
    const colors = tierColors[barosan.tier] || tierColors.basic;

    // Luxurious background gradient
    const bgGradient = ctx.createRadialGradient(600, 425, 0, 600, 425, 700);
    bgGradient.addColorStop(0, '#FFF8E7');
    bgGradient.addColorStop(0.5, '#F5E6D3');
    bgGradient.addColorStop(1, '#E8D5B7');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 850);

    // Shimmering corner decorations (simplified for speed)
    const drawCornerStar = (x, y, size) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = colors.primary;
      ctx.globalAlpha = 0.3;
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-size/2, -2, size, 4);
      }
      ctx.restore();
    };
    drawCornerStar(80, 80, 40);
    drawCornerStar(1120, 80, 40);
    drawCornerStar(80, 770, 40);
    drawCornerStar(1120, 770, 40);

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

    // Watermark - multiple crowns pattern (using drawn crowns)
    ctx.globalAlpha = 0.05;
    drawCrown(ctx, 300, 350, 80, '#DAA520');
    drawCrown(ctx, 900, 350, 80, '#DAA520');
    drawCrown(ctx, 600, 550, 80, '#DAA520');
    ctx.globalAlpha = 1;

    // Header crown with glow (drawn crown instead of emoji)
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

    // Certificate title - big and bold (reduced shadow for speed)
    ctx.shadowColor = colors.primary;
    ctx.shadowBlur = 5;
    ctx.font = 'bold 52px Georgia, serif';
    ctx.fillStyle = '#1a365d';
    ctx.fillText('CERTIFICAT DE BAROSAN', 600, 240);
    ctx.shadowBlur = 0;

    // Tier badge with special styling (using text symbols for PDF compatibility)
    const tierSymbolsCanvas = {
      suprem: '♛',
      platinum: '◆',
      gold: '★',
      basic: '●'
    };
    const tierBadgeText = `${tierSymbolsCanvas[barosan.tier]} ${tierLabels[barosan.tier]} ${tierSymbolsCanvas[barosan.tier]}`;

    // Badge background
    ctx.fillStyle = colors.primary;
    ctx.globalAlpha = 0.2;
    const badgeWidth = ctx.measureText(tierBadgeText).width + 60;
    ctx.beginPath();
    ctx.roundRect(600 - badgeWidth/2, 258, badgeWidth, 45, 10);
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

        // Draw circular photo frame on the left
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

    // Name with glow effect - truncate if too long (reduced shadow for speed)
    ctx.shadowColor = colors.primary;
    ctx.shadowBlur = 4;
    ctx.font = 'bold 44px Georgia, serif';
    ctx.fillStyle = '#1a365d';
    let displayName = barosan.nume;
    if (ctx.measureText(displayName).width > 900) {
      while (ctx.measureText(displayName + '...').width > 900 && displayName.length > 0) {
        displayName = displayName.slice(0, -1);
      }
      displayName += '...';
    }
    ctx.fillText(displayName, 600, 415);
    ctx.shadowBlur = 0;

    // Description - properly spaced
    ctx.font = '17px Georgia, serif';
    ctx.fillStyle = '#333333';
    ctx.fillText('a fost verificat(ă) și confirmat(ă) ca BAROSAN AUTENTIC', 600, 460);
    ctx.fillText('conform standardelor internaționale de șmecherie și bășcălie', 600, 485);
    ctx.fillText('și a fost admis(ă) în registrul oficial al Zidului Barosanilor.', 600, 510);

    // Motto with decorative quotes - truncate if too long
    ctx.font = 'italic 20px Georgia, serif';
    ctx.fillStyle = '#555555';
    let motto = barosan.motto;
    if (ctx.measureText(`"${motto}"`).width > 800) {
      while (ctx.measureText(`"${motto}..."`).width > 800 && motto.length > 0) {
        motto = motto.slice(0, -1);
      }
      motto += '...';
    }
    ctx.fillText(`"${motto}"`, 600, 560);

    // Funny disclaimer
    ctx.font = 'italic 11px Georgia, serif';
    ctx.fillStyle = '#888888';
    ctx.fillText('* Acest certificat conferă drepturi nelimitate de lăudăroșenie și flexare pe social media', 600, 590);

    // Footer section background (adjusted to not overlap bottom elements)
    ctx.fillStyle = 'rgba(139, 69, 19, 0.05)';
    ctx.fillRect(70, 615, 1060, 155);

    // Footer - Certificate ID (left) - IMPROVED LEGIBILITY with larger fonts
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
    const dateStr = new Date(barosan.dataInregistrare).toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    ctx.fillText(dateStr, 100, 747);

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

    // PROFESSIONAL OFFICIAL STAMP - LARGER AND MORE LEGIBLE
    ctx.save();
    ctx.translate(600, 695);
    ctx.rotate(-0.1);

    // Stamp background (slight transparency for realistic look)
    ctx.globalAlpha = 0.95;

    // Outer decorative ring - LARGER
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

    // Stars between rings (decorative) - LARGER
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

    // Center emblem - Crown - LARGER
    ctx.font = 'bold 36px Georgia, serif';
    ctx.fillStyle = '#D4AF37';
    ctx.shadowColor = '#B8860B';
    ctx.shadowBlur = 3;
    ctx.fillText('♛', 0, -6);
    ctx.shadowBlur = 0;

    // VERIFICAT text - LARGER
    ctx.font = 'bold 16px Arial, sans-serif';
    ctx.fillStyle = '#1a365d';
    ctx.fillText('VERIFICAT', 0, 22);

    // OFICIAL text - LARGER
    ctx.font = 'bold 12px Arial, sans-serif';
    ctx.fillStyle = '#8B0000';
    ctx.fillText('OFICIAL', 0, 38);

    // Top arc text - REPUBLICA BAROSANILOR - LARGER FONT
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

    // Bottom arc text - OFICIUL DE CERTIFICARE - LARGER FONT
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

    // Signatures (right side) - IMPROVED LEGIBILITY with Arial
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

    // Final funny footer (adjusted position to stay within border) - LARGER
    ctx.textAlign = 'center';
    ctx.font = 'bold 11px Arial, sans-serif';
    ctx.fillStyle = '#8B4513';
    ctx.fillText('★ CERTIFICAT OFICIAL • VALABIL PE TOATĂ PLANETA • NU SE ACCEPTĂ CONTESTAȚII ★', 600, 805);

    return canvas;
  };

  const handleDownloadPNG = async () => {
    try {
      setDownloading(true);
      const canvas = await generateCertificateCanvas();

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

          // Confetti on successful download
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
          });
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('A apărut o eroare la generarea certificatului. Te rugăm să încerci din nou.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShareWhatsApp = () => {
    const tierEmoji = barosan.tier === 'suprem' ? '👑' : '🏆';
    const text = `${tierEmoji} Tocmai am devenit Barosan ${tierLabels[barosan.tier]}! 🎉\nCertificat ID: ${barosan.certificatId}\nVerifică Registrul Oficial: ${window.location.origin}/zid`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    toast.success('Se deschide WhatsApp...');
  };

  const handleCopyLink = () => {
    // Link direct către certificatul specific (folosind certificatId pentru identificare unică)
    const link = `${window.location.origin}/zid?certificat=${barosan.certificatId}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success('Link copiat în clipboard! 🔗');
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 }
      });
    });
  };

  const handleDownloadForStory = async () => {
    try {
      setDownloading(true);
      const canvas = await generateCertificateCanvas();

      // Create story canvas (1080x1920)
      const storyCanvas = document.createElement('canvas');
      storyCanvas.width = 1080;
      storyCanvas.height = 1920;
      const ctx = storyCanvas.getContext('2d');

      // Fill background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 1920);
      gradient.addColorStop(0, '#1a365d');
      gradient.addColorStop(1, '#2d5986');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1920);

      // Center certificate
      const scale = Math.min(1080 / canvas.width, 1200 / canvas.height);
      const x = (1080 - canvas.width * scale) / 2;
      const y = (1920 - canvas.height * scale) / 2;
      ctx.drawImage(canvas, x, y, canvas.width * scale, canvas.height * scale);

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

          toast.success('Story format descărcat! Perfect pentru Instagram/TikTok! 📱');
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
          });
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Eroare la generare story format');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      const canvas = await generateCertificateCanvas();
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

      // Confetti on successful PDF download
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('A apărut o eroare la generarea PDF-ului. Te rugăm să încerci din nou.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 overflow-y-auto">
      <div className="min-h-screen flex flex-col">
        {/* Fixed Header with Navigation */}
        <div className="sticky top-0 bg-white shadow-lg z-10">
          <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
            <div className="flex justify-between items-center gap-2">
              <button
                onClick={onClose}
                className="flex items-center space-x-1 md:space-x-2 text-[#1a365d] hover:text-[#2d5986] transition-colors font-semibold text-sm md:text-base touch-manipulation min-h-[44px]"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Înapoi la Zid</span>
                <span className="sm:hidden">Înapoi</span>
              </button>

              <h2 className="text-base md:text-xl font-bold text-[#1a365d] hidden lg:block">
                Certificatul tău de Barosan
              </h2>

              <div className="flex items-center gap-1 md:gap-2">
                <button
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  className={`px-2 md:px-4 py-2 rounded-lg transition-colors font-semibold flex items-center space-x-1 md:space-x-2 text-xs md:text-base touch-manipulation min-h-[44px] ${
                    downloading
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
                  }`}
                >
                  <span>📄</span>
                  <span className="hidden sm:inline">Descarcă PDF</span>
                  <span className="sm:hidden">PDF</span>
                </button>

                <button
                  onClick={handleDownloadPNG}
                  disabled={downloading}
                  className={`px-2 md:px-4 py-2 rounded-lg transition-colors font-semibold flex items-center space-x-1 md:space-x-2 text-xs md:text-base touch-manipulation min-h-[44px] ${
                    downloading
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
                  }`}
                >
                  <span>🖼️</span>
                  <span className="hidden sm:inline">Descarcă PNG</span>
                  <span className="sm:hidden">PNG</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Container */}
        <div className="flex-grow flex items-center justify-center p-2 md:p-8">
          <div className="w-full max-w-7xl">
            {/* Certificate Wrapper - Scaled for viewing */}
            <div className="flex justify-center overflow-x-auto">
              <div
                className="certificate-wrapper"
                style={{
                  transform: 'scale(0.3)',
                  transformOrigin: 'top center',
                  marginBottom: '-450px'
                }}
              >
                <style>{`
                  @media (min-width: 640px) {
                    .certificate-wrapper {
                      transform: scale(0.5) !important;
                      margin-bottom: -300px !important;
                    }
                  }
                  @media (min-width: 1024px) {
                    .certificate-wrapper {
                      transform: scale(0.75) !important;
                      margin-bottom: -200px !important;
                    }
                  }
                `}</style>
{barosan.tier === 'suprem' ? (
                  /* SUPREM CERTIFICATE PREVIEW - Completely different dark premium design */
                  <div
                    ref={certificateRef}
                    className="relative shadow-2xl overflow-hidden"
                    style={{
                      width: '1200px',
                      height: '850px',
                      background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #16082a 40%, #0f0518 70%, #0a0012 100%)'
                    }}
                  >
                    {/* Starfield effect */}
                    <div className="absolute inset-0 opacity-30">
                      {[...Array(50)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-white rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.5 + 0.2
                          }}
                        />
                      ))}
                    </div>

                    {/* Glowing aura */}
                    <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-pink-900/10 to-transparent"></div>

                    {/* Gold border with glow */}
                    <div className="absolute inset-[25px] border-4 border-[#FFD700]" style={{ boxShadow: '0 0 20px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(255, 215, 0, 0.1)' }}></div>

                    {/* Corner crowns - top corners at 64px, bottom crowns higher to avoid footer overlap */}
                    <div className="absolute top-16 left-16 text-3xl text-yellow-500 opacity-30">👑</div>
                    <div className="absolute top-16 right-16 text-3xl text-yellow-500 opacity-30">👑</div>
                    <div className="absolute left-16 text-3xl text-yellow-500 opacity-30" style={{ top: '560px' }}>👑</div>
                    <div className="absolute right-16 text-3xl text-yellow-500 opacity-30" style={{ top: '560px' }}>👑</div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col items-center pt-12 pb-6 px-16">
                      {/* Header with crown */}
                      <div className="text-center mb-4">
                        <div className="flex items-center justify-center gap-4 mb-3">
                          <span className="text-2xl text-yellow-500">✦</span>
                          <span className="text-xl text-yellow-400">★</span>
                          <div className="text-6xl" style={{ filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))' }}>
                            👑
                          </div>
                          <span className="text-xl text-yellow-400">★</span>
                          <span className="text-2xl text-yellow-500">✦</span>
                        </div>

                        {/* BAROSANUL SUPREM title */}
                        <h1 className="text-5xl font-bold text-[#FFD700] tracking-wide" style={{ fontFamily: 'Georgia, serif', textShadow: '0 0 30px rgba(255, 215, 0, 0.5)' }}>
                          BAROSANUL SUPREM
                        </h1>

                        {/* Decorative line */}
                        <div className="flex items-center justify-center gap-2 mt-3">
                          <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-[#FFD700]"></div>
                          <span className="text-pink-400 text-sm">✦</span>
                          <div className="w-32 h-[2px] bg-gradient-to-l from-transparent via-purple-500 to-[#FFD700]"></div>
                        </div>

                        <p className="text-pink-400 italic mt-2" style={{ fontFamily: 'Georgia, serif' }}>
                          Cel mai prestigios titlu din Republica Barosanilor
                        </p>
                      </div>

                      {/* Photo and Body */}
                      <div className="max-w-3xl text-center space-y-3 flex-grow flex flex-col justify-center relative">
                        {/* Photo */}
                        {barosan.poza && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-36">
                            <div className="relative">
                              <div className="absolute inset-0 rounded-full blur-lg opacity-60 bg-purple-500"></div>
                              <div className="absolute -inset-2 rounded-full border-2 border-purple-500" style={{ boxShadow: '0 0 15px rgba(147, 51, 234, 0.5)' }}></div>
                              <img
                                src={barosan.poza}
                                alt={barosan.nume}
                                className="relative w-32 h-32 rounded-full object-cover border-4 border-[#FFD700]"
                              />
                              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl">👑</div>
                            </div>
                          </div>
                        )}

                        <p className="text-xl text-gray-300" style={{ fontFamily: 'Georgia, serif' }}>
                          Se certifică prin prezenta că legendarul/a
                        </p>

                        <p className="text-4xl font-bold text-[#FFD700] py-2" style={{ fontFamily: 'Georgia, serif', textShadow: '0 0 20px rgba(255, 215, 0, 0.4)' }}>
                          {barosan.nume}
                        </p>

                        <p className="text-lg text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
                          a atins cel mai înalt nivel de șmecherie și bășcălie
                        </p>
                        <p className="text-lg text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
                          și a fost încoronat ca <span className="text-[#FFD700] font-bold">BAROSANUL SUPREM</span>
                        </p>
                        <p className="text-base text-gray-500 italic" style={{ fontFamily: 'Georgia, serif' }}>
                          domnind glorios pe Zidul Barosanilor
                        </p>

                        {/* Hours badge */}
                        {barosan.supremHours && (
                          <p className="text-pink-400 font-bold mt-2">
                            ⏱ {barosan.supremHours} {barosan.supremHours === 1 ? 'oră' : 'ore'} de supremație
                          </p>
                        )}

                        {/* Motto */}
                        <p className="text-xl italic text-purple-300 pt-2" style={{ fontFamily: 'Georgia, serif' }}>
                          "{barosan.motto}"
                        </p>

                        <p className="text-xs italic text-gray-600 pt-1">
                          * Certificat de putere absolută. Toate închinările sunt obligatorii.
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="w-full rounded-lg p-4 mt-2" style={{ background: 'rgba(255, 215, 0, 0.05)', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
                        <div className="flex justify-between items-end">
                          {/* Left: Certificate info + QR */}
                          <div className="flex items-end space-x-4">
                            <div className="text-left">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Număr certificat:</p>
                              <p className="text-xl font-bold text-[#FFD700]">{barosan.certificatId}</p>
                              <p className="text-xs text-gray-500 uppercase tracking-wide mt-2">Data încoronării:</p>
                              <p className="font-semibold text-sm text-gray-300">
                                {new Date(barosan.dataInregistrare).toLocaleDateString('ro-RO', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="bg-white p-2 rounded-lg border-2 border-[#FFD700]">
                              <QRCodeSVG
                                value={`https://zidulbarosanilor.ro/barosan/${barosan.id}`}
                                size={60}
                                fgColor="#1a0a2e"
                              />
                              <p className="text-[8px] text-center mt-1 text-gray-500">Verificare regală</p>
                            </div>
                          </div>

                          {/* Center: Royal Stamp */}
                          <div className="relative flex items-center justify-center">
                            <div className="relative w-28 h-28 transform -rotate-12">
                              <div className="absolute inset-0 rounded-full border-4 border-purple-500" style={{ boxShadow: '0 0 15px rgba(147, 51, 234, 0.5)' }}></div>
                              <div className="absolute inset-[8px] rounded-full border-2 border-[#FFD700]"></div>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="text-3xl text-[#FFD700]">♛</div>
                                <div className="text-[10px] font-bold text-pink-400">SUPREM</div>
                              </div>
                            </div>
                          </div>

                          {/* Right: Signatures */}
                          <div className="text-right">
                            <div className="mb-3">
                              <p className="text-xl text-[#FFD700] italic" style={{ fontFamily: 'Georgia, serif' }}>Împăratul Barosan</p>
                              <div className="border-t border-purple-500 mt-1 pt-1">
                                <p className="text-[10px] text-gray-400">Suveran Suprem</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-xl text-[#FFD700] italic" style={{ fontFamily: 'Georgia, serif' }}>Regina Șmecheriei</p>
                              <div className="border-t border-purple-500 mt-1 pt-1">
                                <p className="text-[10px] text-gray-400">Consilier Regal</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom line and footer text */}
                      <div className="w-full mt-2">
                        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-2"></div>
                        <p className="text-center text-[9px] font-bold text-purple-400">
                          👑 CERTIFICAT DE SUPREMAȚIE • PUTERE NELIMITATĂ • TOȚI SE ÎNCHINĂ 👑
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* REGULAR CERTIFICATE PREVIEW for non-suprem tiers */
                  <div
                    ref={certificateRef}
                    className="relative shadow-2xl overflow-hidden"
                    style={{
                      width: '1200px',
                      height: '850px',
                      background: 'radial-gradient(ellipse at center, #FFF8E7 0%, #F5E6D3 50%, #E8D5B7 100%)'
                    }}
                  >
                    {/* Corner decorations */}
                    <div className="absolute top-16 left-16 text-3xl text-yellow-500 opacity-30 transform rotate-45">★</div>
                    <div className="absolute top-16 right-16 text-3xl text-yellow-500 opacity-30 transform -rotate-45">★</div>
                    <div className="absolute bottom-16 left-16 text-3xl text-yellow-500 opacity-30 transform -rotate-45">★</div>
                    <div className="absolute bottom-16 right-16 text-3xl text-yellow-500 opacity-30 transform rotate-45">★</div>

                    {/* Outer golden border with shadow */}
                    <div className="absolute inset-[25px] border-[20px] border-[#8B4513] shadow-lg"></div>

                    {/* Inner golden gradient border */}
                    <div className="absolute inset-[45px] border-8" style={{ borderImage: 'linear-gradient(135deg, #FFD700, #FFA500, #FFD700) 1' }}></div>

                    {/* Decorative dashed border */}
                    <div className="absolute inset-[60px] border-2 border-dashed" style={{ borderColor: barosan.tier === 'platinum' ? '#C0C0C0' : barosan.tier === 'gold' ? '#FFD700' : '#4169E1' }}></div>

                  {/* Watermarks */}
                  <div className="absolute inset-0 flex items-center justify-around opacity-[0.05] pointer-events-none">
                    <CrownSVG size={100} />
                    <CrownSVG size={100} />
                    <CrownSVG size={100} />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col items-center pt-12 pb-6 px-16">
                    {/* Header with crown and stars */}
                    <div className="text-center mb-2">
                      <div className="flex items-center justify-center gap-4 mb-2">
                        <span className="text-2xl text-yellow-500">★</span>
                        <span className="text-xl text-yellow-400">✦</span>
                        <div className="drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))' }}>
                          <CrownSVG size={55} />
                        </div>
                        <span className="text-xl text-yellow-400">✦</span>
                        <span className="text-2xl text-yellow-500">★</span>
                      </div>
                      <h1 className="text-2xl font-bold text-[#8B0000] tracking-wide drop-shadow" style={{ fontFamily: 'Georgia, serif' }}>
                        REPUBLICA BAROSANILOR
                      </h1>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <div className="w-32 h-[3px] bg-gradient-to-r from-transparent via-[#DAA520] to-[#FFD700]"></div>
                        <div className="w-24 h-[2px] bg-[#FFD700]"></div>
                        <div className="w-32 h-[3px] bg-gradient-to-l from-transparent via-[#DAA520] to-[#FFD700]"></div>
                      </div>
                    </div>

                    {/* Title with glow */}
                    <div className="text-center mb-2">
                      <h2 className="text-4xl font-bold text-[#1a365d] drop-shadow-lg" style={{ fontFamily: 'Georgia, serif', textShadow: barosan.tier === 'gold' ? '0 0 20px rgba(255, 215, 0, 0.3)' : 'none' }}>
                        CERTIFICAT DE BAROSAN
                      </h2>
                    </div>

                    {/* Tier Badge */}
                    <div className="mb-3">
                      <div className={`px-6 py-2 rounded-lg ${
                        barosan.tier === 'suprem' ? 'bg-gradient-to-r from-purple-500 via-pink-400 to-purple-500' :
                        barosan.tier === 'platinum' ? 'bg-gradient-to-r from-gray-300 via-white to-gray-300' :
                        barosan.tier === 'gold' ? 'bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400' :
                        'bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400'
                      } bg-opacity-30`}>
                        <span className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif', color: barosan.tier === 'suprem' ? '#9333EA' : barosan.tier === 'platinum' ? '#666' : barosan.tier === 'gold' ? '#B8860B' : '#1E90FF' }}>
                          {tierSymbols[barosan.tier]} {tierLabels[barosan.tier]} {tierSymbols[barosan.tier]}
                        </span>
                      </div>
                    </div>

                    {/* Separator */}
                    <div className="w-64 h-[2px] bg-[#DAA520] mb-3"></div>

                    {/* Photo and Body Text */}
                    <div className="max-w-3xl text-center space-y-2 flex-grow flex flex-col justify-center relative">
                      {/* Photo (if exists) */}
                      {barosan.poza && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-32">
                          <div className="relative">
                            <div className={`absolute inset-0 rounded-full blur-md opacity-50 ${
                              barosan.tier === 'suprem' ? 'bg-purple-500' :
                              barosan.tier === 'platinum' ? 'bg-gray-400' :
                              barosan.tier === 'gold' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}></div>
                            <img
                              src={barosan.poza}
                              alt={barosan.nume}
                              className={`relative w-28 h-28 rounded-full object-cover border-4 ${
                                barosan.tier === 'suprem' ? 'border-purple-500' :
                                barosan.tier === 'platinum' ? 'border-gray-400' :
                                barosan.tier === 'gold' ? 'border-yellow-500' : 'border-blue-500'
                              }`}
                            />
                          </div>
                        </div>
                      )}
                      <p className="text-lg text-gray-700" style={{ fontFamily: 'Georgia, serif' }}>
                        Se certifică prin prezenta că distinsul/a
                      </p>
                      <p className="text-3xl font-bold text-[#1a365d] py-2" style={{ fontFamily: 'Georgia, serif', textShadow: '0 0 15px rgba(255, 215, 0, 0.2)' }}>
                        {barosan.nume}
                      </p>
                      <p className="text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                        a fost verificat(ă) și confirmat(ă) ca <strong className="text-[#1a365d]">BAROSAN AUTENTIC</strong>
                      </p>
                      <p className="text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                        conform standardelor internaționale de șmecherie și bășcălie
                      </p>
                      <p className="text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                        și a fost admis(ă) în registrul oficial al Zidului Barosanilor.
                      </p>
                      <p className="text-lg italic text-gray-600 pt-2" style={{ fontFamily: 'Georgia, serif' }}>
                        "{barosan.motto}"
                      </p>
                      <p className="text-xs italic text-gray-400 pt-1">
                        * Acest certificat conferă drepturi nelimitate de lăudăroșenie și flexare pe social media
                      </p>
                    </div>

                    {/* Footer section */}
                    <div className="w-full bg-[#8B4513] bg-opacity-5 rounded-lg p-4 mt-2">
                      <div className="flex justify-between items-end">
                        {/* Left: Certificate Number and Date + QR */}
                        <div className="flex items-end space-x-4">
                          <div className="text-left">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Număr certificat:</p>
                            <p className="text-lg font-bold text-[#8B0000]">{barosan.certificatId}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mt-2">Data emiterii:</p>
                            <p className="font-semibold text-sm text-gray-700">
                              {new Date(barosan.dataInregistrare).toLocaleDateString('ro-RO', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="bg-white p-2 rounded-lg border-2" style={{ borderColor: barosan.tier === 'suprem' ? '#9333EA' : barosan.tier === 'gold' ? '#FFD700' : barosan.tier === 'platinum' ? '#C0C0C0' : '#4169E1' }}>
                            <QRCodeSVG
                              value={`https://zidulbarosanilor.ro/barosan/${barosan.id}`}
                              size={60}
                              fgColor="#1a365d"
                            />
                            <p className="text-[8px] text-center mt-1 text-gray-500">Scanează pentru</p>
                            <p className="text-[8px] text-center text-gray-500">verificare online</p>
                          </div>
                        </div>

                        {/* Center: Stamp */}
                        <div className="relative flex items-center justify-center">
                          <div className="relative w-28 h-28 transform -rotate-12">
                            <div className="absolute inset-0 rounded-full border-[5px] border-[#DC143C] opacity-80" style={{ boxShadow: '0 0 10px rgba(220, 20, 60, 0.3)' }}></div>
                            <div className="absolute inset-[6px] rounded-full border-[2px] border-[#DC143C] opacity-80"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 112 112">
                                <defs>
                                  <path id="circlePathPreview" d="M 56,56 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                                </defs>
                                <text className="text-[7px] font-bold fill-[#DC143C]" textAnchor="middle">
                                  <textPath href="#circlePathPreview" startOffset="50%">
                                    REPUBLICA BAROSANILOR
                                  </textPath>
                                </text>
                              </svg>
                              <div className="text-3xl text-[#DC143C] font-bold mt-1">✓</div>
                              <div className="text-center -mt-1">
                                <div className="text-[10px] font-bold text-[#DC143C]">VERIFICAT</div>
                                <div className="text-[7px] text-[#DC143C] font-semibold">OFICIAL</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right: Signatures */}
                        <div className="text-right">
                          <div className="mb-3">
                            <p className="text-xl text-[#1a365d] italic" style={{ fontFamily: 'Georgia, serif' }}>Ion Barosan</p>
                            <div className="border-t border-gray-400 mt-1 pt-1">
                              <p className="text-[10px] text-gray-600">Mare Barosan Șef</p>
                              <p className="text-[8px] text-gray-400">& Expert în Bășcălie</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xl text-[#1a365d] italic" style={{ fontFamily: 'Georgia, serif' }}>Maria Șmechera</p>
                            <div className="border-t border-gray-400 mt-1 pt-1">
                              <p className="text-[10px] text-gray-600">Director Dept. Bășcălie</p>
                              <p className="text-[8px] text-gray-400">& Ministru al Flexării</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom decorative line and footer */}
                    <div className="w-full mt-2">
                      <div className="w-full h-[2px] bg-[#DAA520] mb-2"></div>
                      <p className="text-center text-[9px] font-bold text-[#8B4513]">
                        ★ CERTIFICAT OFICIAL • VALABIL PE TOATĂ PLANETA • NU SE ACCEPTĂ CONTESTAȚII ★
                      </p>
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Share & Download Footer */}
        <div className="bg-white border-t">
          <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
            {/* Share Buttons */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-700 text-center mb-3">
                📱 Distribuie pe Social Media
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={handleDownloadForStory}
                  disabled={downloading}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  📸 Story Format
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform text-sm"
                >
                  💬 WhatsApp
                </button>
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform text-sm"
                >
                  🔗 Copiază Link
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center border-t pt-4">
              <p className="text-sm text-gray-700 mb-2">
                Descarcă certificatul în format <span className="font-semibold text-green-600">PNG</span> sau <span className="font-semibold text-red-600">PDF</span>
              </p>
              <p className="text-xs text-gray-500">
                Distribuie-l și arată-le tuturor că ești barosan verificat! 🏆
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
