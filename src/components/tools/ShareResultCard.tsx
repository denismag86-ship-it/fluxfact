/**
 * ShareResultCard — captures tool result as image for sharing.
 * Uses html2canvas to screenshot the result → downloads or shares.
 * This is the viral mechanic: personalized result → share → friends come.
 */
import { useRef, useCallback, useState } from 'react';

interface ShareResultCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  /** Gradient from color */
  colorFrom?: string;
  /** Gradient to color */
  colorTo?: string;
}

export default function ShareResultCard({
  children,
  title,
  subtitle,
  colorFrom = '#3B82F6',
  colorTo = '#8B5CF6',
}: ShareResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

  const captureAndShare = useCallback(async () => {
    if (!cardRef.current || sharing) return;
    setSharing(true);

    try {
      // Dynamic import — only load html2canvas when user clicks share
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0f172a',
        scale: 2,
        useCORS: true,
      });

      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), 'image/png')
      );

      // Try native share first (mobile)
      if (navigator.share && navigator.canShare?.({ files: [new File([blob], 'result.png', { type: 'image/png' })] })) {
        await navigator.share({
          title,
          text: subtitle ?? title,
          files: [new File([blob], 'result.png', { type: 'image/png' })],
        });
      } else {
        // Fallback: download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fluxfact-${title.toLowerCase().replace(/\s+/g, '-')}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // User cancelled or error
    } finally {
      setSharing(false);
    }
  }, [title, subtitle, sharing]);

  return (
    <div className="space-y-4">
      {/* The card that gets captured */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl p-8"
        style={{
          background: `linear-gradient(135deg, ${colorFrom}15, ${colorTo}15)`,
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* Decorative blur */}
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20"
          style={{ background: colorFrom }}
        />
        <div
          className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-20"
          style={{ background: colorTo }}
        />

        {/* Content */}
        <div className="relative z-10">{children}</div>

        {/* Brand watermark */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-sm font-bold text-white/60">
            Flux<span style={{ color: colorFrom }}>Fact</span>
          </span>
          <span className="text-xs text-white/40">fluxfact.tech</span>
        </div>
      </div>

      {/* Share button */}
      <button
        onClick={captureAndShare}
        disabled={sharing}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r text-white font-medium text-sm transition-all hover:shadow-lg disabled:opacity-50"
        style={{
          backgroundImage: `linear-gradient(to right, ${colorFrom}, ${colorTo})`,
          boxShadow: `0 4px 15px ${colorFrom}30`,
        }}
      >
        {sharing ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
        {sharing ? 'Creating...' : 'Save & Share Result'}
      </button>
    </div>
  );
}
