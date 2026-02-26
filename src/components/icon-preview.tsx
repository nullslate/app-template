import { useEffect, useRef, useCallback } from 'react';
import type { FaviconDrawFn } from '@thesandybridge/ui/components';

function getThemeColor(varName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

export function IconPreview({
  draw,
  size = 64,
  className,
}: {
  draw: FaviconDrawFn;
  size?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const accent = getThemeColor('--secondary-fg');
    const bg = getThemeColor('--primary-bg');
    if (!accent) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, size, size);
    draw(ctx, size, accent, bg);
  }, [draw, size]);

  useEffect(() => {
    render();

    const observer = new MutationObserver(() => {
      requestAnimationFrame(render);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-mode'],
    });

    return () => observer.disconnect();
  }, [render]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className={className}
    />
  );
}
