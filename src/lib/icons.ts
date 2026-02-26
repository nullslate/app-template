import type { FaviconDrawFn } from '@thesandybridge/ui/components';

export interface IconPreset {
  id: string;
  name: string;
  draw: FaviconDrawFn;
  svgPaths: string[];
  faviconCode: string;
  logoCode: string;
}

const bridge: IconPreset = {
  id: 'bridge',
  name: 'Bridge',
  draw: (ctx, size, accent) => {
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const s = size / 24;
    ctx.beginPath();
    ctx.moveTo(4 * s, 20 * s);
    ctx.lineTo(4 * s, 12 * s);
    ctx.quadraticCurveTo(4 * s, 4 * s, 12 * s, 4 * s);
    ctx.quadraticCurveTo(20 * s, 4 * s, 20 * s, 12 * s);
    ctx.lineTo(20 * s, 20 * s);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(9 * s, 20 * s);
    ctx.lineTo(9 * s, 14 * s);
    ctx.quadraticCurveTo(9 * s, 10 * s, 12 * s, 10 * s);
    ctx.quadraticCurveTo(15 * s, 10 * s, 15 * s, 14 * s);
    ctx.lineTo(15 * s, 20 * s);
    ctx.stroke();
  },
  svgPaths: [
    'M4 20 L4 12 Q4 4 12 4 Q20 4 20 12 L20 20',
    'M9 20 L9 14 Q9 10 12 10 Q15 10 15 14 L15 20',
  ],
  faviconCode: `const drawLogo: FaviconDrawFn = (ctx, size, accent) => {
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const s = size / 24;
  ctx.beginPath();
  ctx.moveTo(4 * s, 20 * s);
  ctx.lineTo(4 * s, 12 * s);
  ctx.quadraticCurveTo(4 * s, 4 * s, 12 * s, 4 * s);
  ctx.quadraticCurveTo(20 * s, 4 * s, 20 * s, 12 * s);
  ctx.lineTo(20 * s, 20 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(9 * s, 20 * s);
  ctx.lineTo(9 * s, 14 * s);
  ctx.quadraticCurveTo(9 * s, 10 * s, 12 * s, 10 * s);
  ctx.quadraticCurveTo(15 * s, 10 * s, 15 * s, 14 * s);
  ctx.lineTo(15 * s, 20 * s);
  ctx.stroke();
};`,
  logoCode: `<path d="M4 20 L4 12 Q4 4 12 4 Q20 4 20 12 L20 20" />
<path d="M9 20 L9 14 Q9 10 12 10 Q15 10 15 14 L15 20" />`,
};

const layers: IconPreset = {
  id: 'layers',
  name: 'Layers',
  draw: (ctx, size, accent) => {
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const s = size / 24;
    ctx.beginPath();
    ctx.moveTo(2 * s, 17.65 * s);
    ctx.lineTo(11.17 * s, 21.81 * s);
    ctx.lineTo(12.83 * s, 21.81 * s);
    ctx.lineTo(22 * s, 17.65 * s);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(2 * s, 12.65 * s);
    ctx.lineTo(11.17 * s, 16.81 * s);
    ctx.lineTo(12.83 * s, 16.81 * s);
    ctx.lineTo(22 * s, 12.65 * s);
    ctx.stroke();
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.moveTo(12.83 * s, 2.18 * s);
    ctx.lineTo(2.6 * s, 6.08 * s);
    ctx.lineTo(2.6 * s, 7.91 * s);
    ctx.lineTo(11.18 * s, 11.82 * s);
    ctx.lineTo(12.83 * s, 11.82 * s);
    ctx.lineTo(21.4 * s, 7.91 * s);
    ctx.lineTo(21.4 * s, 6.08 * s);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.moveTo(12.83 * s, 2.18 * s);
    ctx.lineTo(2.6 * s, 6.08 * s);
    ctx.lineTo(2.6 * s, 7.91 * s);
    ctx.lineTo(11.18 * s, 11.82 * s);
    ctx.lineTo(12.83 * s, 11.82 * s);
    ctx.lineTo(21.4 * s, 7.91 * s);
    ctx.lineTo(21.4 * s, 6.08 * s);
    ctx.closePath();
    ctx.stroke();
  },
  svgPaths: [
    'M2 17.65 L11.17 21.81 L12.83 21.81 L22 17.65',
    'M2 12.65 L11.17 16.81 L12.83 16.81 L22 12.65',
    'M12.83 2.18 L2.6 6.08 L2.6 7.91 L11.18 11.82 L12.83 11.82 L21.4 7.91 L21.4 6.08 Z',
  ],
  faviconCode: `const drawLogo: FaviconDrawFn = (ctx, size, accent) => {
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const s = size / 24;
  // Bottom layer
  ctx.beginPath();
  ctx.moveTo(2 * s, 17.65 * s);
  ctx.lineTo(11.17 * s, 21.81 * s);
  ctx.lineTo(12.83 * s, 21.81 * s);
  ctx.lineTo(22 * s, 17.65 * s);
  ctx.stroke();
  // Middle layer
  ctx.beginPath();
  ctx.moveTo(2 * s, 12.65 * s);
  ctx.lineTo(11.17 * s, 16.81 * s);
  ctx.lineTo(12.83 * s, 16.81 * s);
  ctx.lineTo(22 * s, 12.65 * s);
  ctx.stroke();
  // Top layer
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.2;
  ctx.beginPath();
  ctx.moveTo(12.83 * s, 2.18 * s);
  ctx.lineTo(2.6 * s, 6.08 * s);
  ctx.lineTo(2.6 * s, 7.91 * s);
  ctx.lineTo(11.18 * s, 11.82 * s);
  ctx.lineTo(12.83 * s, 11.82 * s);
  ctx.lineTo(21.4 * s, 7.91 * s);
  ctx.lineTo(21.4 * s, 6.08 * s);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.moveTo(12.83 * s, 2.18 * s);
  ctx.lineTo(2.6 * s, 6.08 * s);
  ctx.lineTo(2.6 * s, 7.91 * s);
  ctx.lineTo(11.18 * s, 11.82 * s);
  ctx.lineTo(12.83 * s, 11.82 * s);
  ctx.lineTo(21.4 * s, 7.91 * s);
  ctx.lineTo(21.4 * s, 6.08 * s);
  ctx.closePath();
  ctx.stroke();
};`,
  logoCode: `<path d="M2 17.65 L11.17 21.81 L12.83 21.81 L22 17.65" />
<path d="M2 12.65 L11.17 16.81 L12.83 16.81 L22 12.65" />
<path d="M12.83 2.18 L2.6 6.08 L2.6 7.91 L11.18 11.82 L12.83 11.82 L21.4 7.91 L21.4 6.08 Z" fill="currentColor" fillOpacity="0.2" />`,
};

const diamond: IconPreset = {
  id: 'diamond',
  name: 'Diamond',
  draw: (ctx, size, accent) => {
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const s = size / 24;
    ctx.beginPath();
    ctx.moveTo(12 * s, 2 * s);
    ctx.lineTo(22 * s, 12 * s);
    ctx.lineTo(12 * s, 22 * s);
    ctx.lineTo(2 * s, 12 * s);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(12 * s, 7 * s);
    ctx.lineTo(17 * s, 12 * s);
    ctx.lineTo(12 * s, 17 * s);
    ctx.lineTo(7 * s, 12 * s);
    ctx.closePath();
    ctx.stroke();
  },
  svgPaths: [
    'M12 2 L22 12 L12 22 L2 12 Z',
    'M12 7 L17 12 L12 17 L7 12 Z',
  ],
  faviconCode: `const drawLogo: FaviconDrawFn = (ctx, size, accent) => {
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const s = size / 24;
  ctx.beginPath();
  ctx.moveTo(12 * s, 2 * s);
  ctx.lineTo(22 * s, 12 * s);
  ctx.lineTo(12 * s, 22 * s);
  ctx.lineTo(2 * s, 12 * s);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(12 * s, 7 * s);
  ctx.lineTo(17 * s, 12 * s);
  ctx.lineTo(12 * s, 17 * s);
  ctx.lineTo(7 * s, 12 * s);
  ctx.closePath();
  ctx.stroke();
};`,
  logoCode: `<path d="M12 2 L22 12 L12 22 L2 12 Z" />
<path d="M12 7 L17 12 L12 17 L7 12 Z" />`,
};

const hexagon: IconPreset = {
  id: 'hexagon',
  name: 'Hexagon',
  draw: (ctx, size, accent) => {
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const s = size / 24;
    ctx.beginPath();
    ctx.moveTo(12 * s, 2 * s);
    ctx.lineTo(21 * s, 7 * s);
    ctx.lineTo(21 * s, 17 * s);
    ctx.lineTo(12 * s, 22 * s);
    ctx.lineTo(3 * s, 17 * s);
    ctx.lineTo(3 * s, 7 * s);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(12 * s, 8 * s);
    ctx.lineTo(16 * s, 10.5 * s);
    ctx.lineTo(16 * s, 15.5 * s);
    ctx.lineTo(12 * s, 18 * s);
    ctx.stroke();
  },
  svgPaths: [
    'M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z',
    'M12 8 L16 10.5 L16 15.5 L12 18',
  ],
  faviconCode: `const drawLogo: FaviconDrawFn = (ctx, size, accent) => {
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const s = size / 24;
  ctx.beginPath();
  ctx.moveTo(12 * s, 2 * s);
  ctx.lineTo(21 * s, 7 * s);
  ctx.lineTo(21 * s, 17 * s);
  ctx.lineTo(12 * s, 22 * s);
  ctx.lineTo(3 * s, 17 * s);
  ctx.lineTo(3 * s, 7 * s);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(12 * s, 8 * s);
  ctx.lineTo(16 * s, 10.5 * s);
  ctx.lineTo(16 * s, 15.5 * s);
  ctx.lineTo(12 * s, 18 * s);
  ctx.stroke();
};`,
  logoCode: `<path d="M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z" />
<path d="M12 8 L16 10.5 L16 15.5 L12 18" />`,
};

const terminal: IconPreset = {
  id: 'terminal',
  name: 'Terminal',
  draw: (ctx, size, accent) => {
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const s = size / 24;
    ctx.beginPath();
    ctx.moveTo(4 * s, 17 * s);
    ctx.lineTo(10 * s, 12 * s);
    ctx.lineTo(4 * s, 7 * s);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(12 * s, 17 * s);
    ctx.lineTo(20 * s, 17 * s);
    ctx.stroke();
  },
  svgPaths: [
    'M4 17 L10 12 L4 7',
    'M12 17 L20 17',
  ],
  faviconCode: `const drawLogo: FaviconDrawFn = (ctx, size, accent) => {
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const s = size / 24;
  ctx.beginPath();
  ctx.moveTo(4 * s, 17 * s);
  ctx.lineTo(10 * s, 12 * s);
  ctx.lineTo(4 * s, 7 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(12 * s, 17 * s);
  ctx.lineTo(20 * s, 17 * s);
  ctx.stroke();
};`,
  logoCode: `<path d="M4 17 L10 12 L4 7" />
<path d="M12 17 L20 17" />`,
};

const bolt: IconPreset = {
  id: 'bolt',
  name: 'Bolt',
  draw: (ctx, size, accent) => {
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const s = size / 24;
    ctx.beginPath();
    ctx.moveTo(13 * s, 2 * s);
    ctx.lineTo(3 * s, 14 * s);
    ctx.lineTo(12 * s, 14 * s);
    ctx.lineTo(11 * s, 22 * s);
    ctx.lineTo(21 * s, 10 * s);
    ctx.lineTo(12 * s, 10 * s);
    ctx.closePath();
    ctx.stroke();
  },
  svgPaths: [
    'M13 2 L3 14 L12 14 L11 22 L21 10 L12 10 Z',
  ],
  faviconCode: `const drawLogo: FaviconDrawFn = (ctx, size, accent) => {
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const s = size / 24;
  ctx.beginPath();
  ctx.moveTo(13 * s, 2 * s);
  ctx.lineTo(3 * s, 14 * s);
  ctx.lineTo(12 * s, 14 * s);
  ctx.lineTo(11 * s, 22 * s);
  ctx.lineTo(21 * s, 10 * s);
  ctx.lineTo(12 * s, 10 * s);
  ctx.closePath();
  ctx.stroke();
};`,
  logoCode: `<path d="M13 2 L3 14 L12 14 L11 22 L21 10 L12 10 Z" />`,
};

const circle: IconPreset = {
  id: 'circle',
  name: 'Circle',
  draw: (ctx, size, accent) => {
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    const s = size / 24;
    ctx.beginPath();
    ctx.arc(12 * s, 12 * s, 9 * s, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(12 * s, 12 * s, 4 * s, 0, Math.PI * 2);
    ctx.stroke();
  },
  svgPaths: [
    'M12 3 A9 9 0 1 0 12 21 A9 9 0 1 0 12 3',
    'M12 8 A4 4 0 1 0 12 16 A4 4 0 1 0 12 8',
  ],
  faviconCode: `const drawLogo: FaviconDrawFn = (ctx, size, accent) => {
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  const s = size / 24;
  ctx.beginPath();
  ctx.arc(12 * s, 12 * s, 9 * s, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(12 * s, 12 * s, 4 * s, 0, Math.PI * 2);
  ctx.stroke();
};`,
  logoCode: `<circle cx="12" cy="12" r="9" />
<circle cx="12" cy="12" r="4" />`,
};

const brackets: IconPreset = {
  id: 'brackets',
  name: 'Brackets',
  draw: (ctx, size, accent) => {
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const s = size / 24;
    ctx.beginPath();
    ctx.moveTo(8 * s, 3 * s);
    ctx.lineTo(5 * s, 3 * s);
    ctx.lineTo(5 * s, 12 * s);
    ctx.lineTo(3 * s, 12 * s);
    ctx.moveTo(5 * s, 12 * s);
    ctx.lineTo(5 * s, 21 * s);
    ctx.lineTo(8 * s, 21 * s);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(16 * s, 3 * s);
    ctx.lineTo(19 * s, 3 * s);
    ctx.lineTo(19 * s, 12 * s);
    ctx.lineTo(21 * s, 12 * s);
    ctx.moveTo(19 * s, 12 * s);
    ctx.lineTo(19 * s, 21 * s);
    ctx.lineTo(16 * s, 21 * s);
    ctx.stroke();
  },
  svgPaths: [
    'M8 3 L5 3 L5 12 L3 12 M5 12 L5 21 L8 21',
    'M16 3 L19 3 L19 12 L21 12 M19 12 L19 21 L16 21',
  ],
  faviconCode: `const drawLogo: FaviconDrawFn = (ctx, size, accent) => {
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const s = size / 24;
  ctx.beginPath();
  ctx.moveTo(8 * s, 3 * s);
  ctx.lineTo(5 * s, 3 * s);
  ctx.lineTo(5 * s, 12 * s);
  ctx.lineTo(3 * s, 12 * s);
  ctx.moveTo(5 * s, 12 * s);
  ctx.lineTo(5 * s, 21 * s);
  ctx.lineTo(8 * s, 21 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(16 * s, 3 * s);
  ctx.lineTo(19 * s, 3 * s);
  ctx.lineTo(19 * s, 12 * s);
  ctx.lineTo(21 * s, 12 * s);
  ctx.moveTo(19 * s, 12 * s);
  ctx.lineTo(19 * s, 21 * s);
  ctx.lineTo(16 * s, 21 * s);
  ctx.stroke();
};`,
  logoCode: `<path d="M8 3 L5 3 L5 12 L3 12 M5 12 L5 21 L8 21" />
<path d="M16 3 L19 3 L19 12 L21 12 M19 12 L19 21 L16 21" />`,
};

const grid: IconPreset = {
  id: 'grid',
  name: 'Grid',
  draw: (ctx, size, accent) => {
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const s = size / 24;
    // Outer square
    ctx.strokeRect(3 * s, 3 * s, 18 * s, 18 * s);
    // Vertical line
    ctx.beginPath();
    ctx.moveTo(12 * s, 3 * s);
    ctx.lineTo(12 * s, 21 * s);
    ctx.stroke();
    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(3 * s, 12 * s);
    ctx.lineTo(21 * s, 12 * s);
    ctx.stroke();
  },
  svgPaths: [
    'M3 3 H21 V21 H3 Z',
    'M12 3 V21',
    'M3 12 H21',
  ],
  faviconCode: `const drawLogo: FaviconDrawFn = (ctx, size, accent) => {
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const s = size / 24;
  ctx.strokeRect(3 * s, 3 * s, 18 * s, 18 * s);
  ctx.beginPath();
  ctx.moveTo(12 * s, 3 * s);
  ctx.lineTo(12 * s, 21 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(3 * s, 12 * s);
  ctx.lineTo(21 * s, 12 * s);
  ctx.stroke();
};`,
  logoCode: `<rect x="3" y="3" width="18" height="18" rx="0" />
<line x1="12" y1="3" x2="12" y2="21" />
<line x1="3" y1="12" x2="21" y2="12" />`,
};

const wave: IconPreset = {
  id: 'wave',
  name: 'Wave',
  draw: (ctx, size, accent) => {
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const s = size / 24;
    ctx.beginPath();
    ctx.moveTo(2 * s, 12 * s);
    ctx.bezierCurveTo(5 * s, 4 * s, 9 * s, 4 * s, 12 * s, 12 * s);
    ctx.bezierCurveTo(15 * s, 20 * s, 19 * s, 20 * s, 22 * s, 12 * s);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(2 * s, 8 * s);
    ctx.bezierCurveTo(5 * s, 2 * s, 9 * s, 2 * s, 12 * s, 8 * s);
    ctx.bezierCurveTo(15 * s, 14 * s, 19 * s, 14 * s, 22 * s, 8 * s);
    ctx.stroke();
  },
  svgPaths: [
    'M2 12 C5 4 9 4 12 12 C15 20 19 20 22 12',
    'M2 8 C5 2 9 2 12 8 C15 14 19 14 22 8',
  ],
  faviconCode: `const drawLogo: FaviconDrawFn = (ctx, size, accent) => {
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const s = size / 24;
  ctx.beginPath();
  ctx.moveTo(2 * s, 12 * s);
  ctx.bezierCurveTo(5 * s, 4 * s, 9 * s, 4 * s, 12 * s, 12 * s);
  ctx.bezierCurveTo(15 * s, 20 * s, 19 * s, 20 * s, 22 * s, 12 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(2 * s, 8 * s);
  ctx.bezierCurveTo(5 * s, 2 * s, 9 * s, 2 * s, 12 * s, 8 * s);
  ctx.bezierCurveTo(15 * s, 14 * s, 19 * s, 14 * s, 22 * s, 8 * s);
  ctx.stroke();
};`,
  logoCode: `<path d="M2 12 C5 4 9 4 12 12 C15 20 19 20 22 12" />
<path d="M2 8 C5 2 9 2 12 8 C15 14 19 14 22 8" />`,
};

export const ICONS: IconPreset[] = [
  bridge,
  layers,
  diamond,
  hexagon,
  terminal,
  bolt,
  circle,
  brackets,
  grid,
  wave,
];

export function getIcon(id: string): IconPreset | undefined {
  return ICONS.find((icon) => icon.id === id);
}

export function getFaviconFileCode(icon: IconPreset): string {
  return `'use client';

import { DynamicFavicon, type FaviconDrawFn } from '@thesandybridge/ui/components';

${icon.faviconCode}

export function Favicon() {
  return <DynamicFavicon draw={drawLogo} />;
}
`;
}

export function getLogoFileCode(icon: IconPreset): string {
  return `export function Logo({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      ${icon.logoCode}
    </svg>
  );
}
`;
}
