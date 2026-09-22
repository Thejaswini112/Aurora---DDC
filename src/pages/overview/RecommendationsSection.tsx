import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ShieldCheck, Radar, ScrollText, ArrowRight, Gauge } from 'lucide-react';
import { aiRecommendations } from '@/mock-data';
import { SectionTitle, SectionWrapper } from './SectionTitle';
import { cn } from '@/lib/utils';
import type { AiRecommendation } from '@/types';

const categoryConfig = {
  access: { icon: ShieldCheck, color: 'text-danger', bg: 'bg-danger/10' },
  scan: { icon: Radar, color: 'text-primary', bg: 'bg-primary/10' },
  policy: { icon: ScrollText, color: 'text-warning', bg: 'bg-warning/10' },
  remediation: { icon: Gauge, color: 'text-success', bg: 'bg-success/10' },
} as const;

const impactStyles = {
  High: 'text-danger bg-danger/10 border-danger/20',
  Medium: 'text-warning bg-warning/10 border-warning/20',
  Low: 'text-success bg-success/10 border-success/20',
} as const;

export function RecommendationsSection() {
  return (
    <SectionWrapper className="mt-10" delay={0.05}>
      <SectionTitle
        eyebrow="Proactive Guidance"
        title="AI Recommendations"
        subtitle="Aurora proactively recommends the highest-leverage next actions. AI explains — you decide."
        action={
          <span className="hidden items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary sm:inline-flex">
            <Sparkles className="h-3.5 w-3.5" />
            {aiRecommendations.length} suggestions
          </span>
        }
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {aiRecommendations.map((rec, i) => (
          <RecommendationCard key={rec.id} rec={rec} delay={0.08 + i * 0.08} />
        ))}
      </div>
    </SectionWrapper>
  );
}

function RecommendationCard({ rec, delay }: { rec: AiRecommendation; delay: number }) {
  const navigate = useNavigate();
  const cat = categoryConfig[rec.category];
  const Icon = cat.icon;
  const route =
  rec.category === 'scan'
    ? '/scan-management'
    : rec.category === 'policy'
      ? '/policies'
      : rec.category === 'access' || rec.category === 'remediation'
        ? '/detections'
        : '/overview';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
    >
      <div className="flex items-center gap-2.5">
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', cat.bg)}>
          <Icon className={cn('h-4 w-4', cat.color)} />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {rec.category === 'access' ? 'Access Risk' : rec.category === 'scan' ? 'Scan Gap' : rec.category === 'policy' ? 'Policy' : 'Remediation'}
        </span>
      </div>

      <h3 className="mt-3.5 text-[15px] font-semibold leading-snug text-foreground">{rec.title}</h3>
      <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted-foreground">{rec.reason}</p>

      {/* confidence bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-medium text-muted-foreground">Confidence</span>
          <span className="font-semibold tabular-nums text-foreground">{rec.confidence}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${rec.confidence}%` }}
            transition={{ duration: 1, delay: delay + 0.2, ease: 'easeOut' }}
            className="h-full rounded-full bg-primary"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold',
            impactStyles[rec.impact],
          )}
        >
          {rec.impact} impact
        </span>
        <button
  onClick={() => navigate(route)}
  className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary-hover"
>
          {rec.ctaLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </motion.div>
  );
}
