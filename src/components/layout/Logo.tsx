import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  variant?: 'light' | 'dark';
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={cn('h-8 w-8', className)} aria-hidden>
      <rect width="32" height="32" rx="7" className="fill-primary" />
      <path
        d="M16 6L24 10.5V19.5L16 24L8 19.5V10.5L16 6Z"
        stroke="white"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="15" r="3.2" fill="white" />
      <path d="M16 24V18.2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className, showWordmark = true }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LogoMark />
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight text-sidebar-foreground">Aurora DSI</span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-sidebar-muted-foreground">
            Data Security Intelligence
          </span>
        </div>
      )}
    </div>
  );
}
