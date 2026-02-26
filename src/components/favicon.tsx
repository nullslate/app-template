import { DynamicFavicon, type FaviconDrawFn } from '@thesandybridge/ui/components';

const drawLogo: FaviconDrawFn = (ctx, size, accent) => {
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const s = size / 24;

  // Outer arch
  ctx.beginPath();
  ctx.moveTo(4 * s, 20 * s);
  ctx.lineTo(4 * s, 12 * s);
  ctx.quadraticCurveTo(4 * s, 4 * s, 12 * s, 4 * s);
  ctx.quadraticCurveTo(20 * s, 4 * s, 20 * s, 12 * s);
  ctx.lineTo(20 * s, 20 * s);
  ctx.stroke();

  // Inner arch
  ctx.beginPath();
  ctx.moveTo(9 * s, 20 * s);
  ctx.lineTo(9 * s, 14 * s);
  ctx.quadraticCurveTo(9 * s, 10 * s, 12 * s, 10 * s);
  ctx.quadraticCurveTo(15 * s, 10 * s, 15 * s, 14 * s);
  ctx.lineTo(15 * s, 20 * s);
  ctx.stroke();
};

export function Favicon() {
  return <DynamicFavicon draw={drawLogo} />;
}
