import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Database, ChevronRight } from 'lucide-react';
import { repositories } from '@/mock-data';
import { formatRelativeTime, formatFull, riskScoreColor, riskScoreBg } from '@/utils/format';
import { SectionTitle, SectionWrapper } from './SectionTitle';
import { cn } from '@/lib/utils';

const statusLabel: Record<string, string> = {
  active: 'Healthy',
  scanning: 'Scanning',
  paused: 'Paused',
  completed: 'Healthy',
  failed: 'Failed',
  pending: 'Needs Scan',
};

const statusTone: Record<string, string> = {
  Healthy: 'text-success',
  Scanning: 'text-primary',
  Paused: 'text-muted-foreground',
  Failed: 'text-danger',
  'Needs Scan': 'text-warning',
};

export function RepositoryHealthSection() {
  const navigate = useNavigate();

  const repos = [...repositories]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 6);

  return (
    <SectionWrapper className="mt-10" delay={0.05}>
      <SectionTitle
        eyebrow="Coverage"
        title="Repository Health"
        subtitle="Risk score and scan status across connected repositories."
      />

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        {/* header */}
        <div className="hidden grid-cols-[1.6fr_0.8fr_1fr_1fr_0.9fr_24px] gap-4 border-b border-border bg-background-subtle/50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground md:grid">
          <span>Repository</span>
          <span>Risk Score</span>
          <span>Last Scan</span>
          <span>Sensitive Files</span>
          <span>Status</span>
          <span />
        </div>

        <div className="divide-y divide-border">
          {repos.map((repo, i) => {
            const status = statusLabel[repo.status] ?? repo.status;
            return (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.08 + i * 0.05 }}
                onClick={() => navigate('/data-sources')}
                className="group grid cursor-pointer grid-cols-2 gap-x-4 gap-y-2 px-5 py-4 transition-colors hover:bg-background-subtle md:grid-cols-[1.6fr_0.8fr_1fr_1fr_0.9fr_24px] md:items-center"
              >
                {/* repository */}
                <div className="col-span-2 flex items-center gap-3 md:col-span-1">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background-subtle">
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{repo.name}</p>
                    <p className="truncate text-xs text-muted-foreground capitalize">{repo.type.replace('-', ' ')}</p>
                  </div>
                </div>

                {/* risk score */}
                <div className="flex items-center gap-2.5">
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn('h-full rounded-full', riskScoreBg(repo.riskScore))}
                      style={{ width: `${repo.riskScore}%` }}
                    />
                  </div>
                  <span className={cn('text-sm font-semibold tabular-nums', riskScoreColor(repo.riskScore))}>
                    {repo.riskScore}
                  </span>
                </div>

                {/* last scan */}
                <span className="text-sm text-muted-foreground">{formatRelativeTime(repo.lastScanned)}</span>

                {/* sensitive files */}
                <span className="text-sm font-medium tabular-nums text-foreground">
                  {formatFull(repo.sensitiveAssets)}
                </span>

                {/* status */}
                <span className={cn('inline-flex items-center gap-1.5 text-sm font-medium', statusTone[status])}>
                  {repo.status === 'scanning' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />}
                  {status}
                </span>

                <ChevronRight className="hidden h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 md:block" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
