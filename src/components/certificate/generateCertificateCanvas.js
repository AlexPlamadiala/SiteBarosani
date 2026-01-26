/**
 * Main certificate canvas generator
 * Routes to the appropriate tier-specific generator
 */
import { generateSupremCanvas } from './generateSupremCanvas';
import { generateRegularCanvas } from './generateRegularCanvas';

/**
 * Generate certificate canvas based on tier
 * @param {Object} barosan - Barosan data object
 * @returns {Promise<HTMLCanvasElement>} Generated canvas
 */
export async function generateCertificateCanvas(barosan) {
  if (barosan.tier === 'suprem') {
    return generateSupremCanvas(barosan);
  }
  return generateRegularCanvas(barosan);
}

/**
 * Generate story format canvas (1080x1920 for Instagram/TikTok)
 * @param {Object} barosan - Barosan data object
 * @returns {Promise<HTMLCanvasElement>} Generated story canvas
 */
export async function generateStoryCanvas(barosan) {
  const certificateCanvas = await generateCertificateCanvas(barosan);

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
  const scale = Math.min(1080 / certificateCanvas.width, 1200 / certificateCanvas.height);
  const x = (1080 - certificateCanvas.width * scale) / 2;
  const y = (1920 - certificateCanvas.height * scale) / 2;
  ctx.drawImage(certificateCanvas, x, y, certificateCanvas.width * scale, certificateCanvas.height * scale);

  return storyCanvas;
}
