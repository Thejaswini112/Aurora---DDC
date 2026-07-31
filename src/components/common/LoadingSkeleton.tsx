import { cn } from '@/lib/utils';

export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} />;
}

export function MetricSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <LoadingSkeleton className="h-3.5 w-28" />
          <LoadingSkeleton className="h-7 w-20" />
        </div>
        <LoadingSkeleton className="h-9 w-9 rounded-lg" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <LoadingSkeleton className="h-3.5 w-24" />
        <LoadingSkeleton className="h-7 w-20" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <LoadingSkeleton key={i} className="h-4" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {Array.from({ length: cols }).map((_, c) => (
            <LoadingSkeleton key={c} className="h-4" />
          ))}
        </div>
      ))}
    </div>
  );
}
