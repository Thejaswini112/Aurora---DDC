import { useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  riskLevel?: string;
}

const riskColor = (level?: string) => {
  switch (level) {
    case 'Low':
      return 'hsl(var(--success))';
    case 'Moderate':
      return 'hsl(var(--primary))';
    case 'Elevated':
      return 'hsl(var(--warning))';
    case 'High':
    case 'Critical':
      return 'hsl(var(--danger))';
    default:
      return 'hsl(var(--primary))';
  }
};

export function ProgressRing({
  value,
  max = 100,
  size = 168,
  strokeWidth = 12,
  label,
  sublabel,
  riskLevel,
}: ProgressRingProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [progress, setProgress] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    let raf = 0;
    const start = performance.now();
    const duration = 1200;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const fraction = value / max;
  const dashOffset = circumference * (1 - fraction * progress);
  const color = riskColor(riskLevel);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg ref={ref} width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.7" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--background-subtle))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold tabular-nums tracking-tight text-foreground">
          {(value * progress).toFixed(1)}
        </span>
        {label && <span className="mt-0.5 text-xs font-medium text-muted-foreground">{label}</span>}
        {sublabel && (
          <span
            className="mt-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: `${color}1a`, color }}
          >
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
