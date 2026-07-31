import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { securityHealth } from '@/mock-data';
import { ProgressRing } from './ProgressRing';
import { AnimatedNumber } from './AnimatedNumber';
import { SectionTitle, SectionWrapper } from './SectionTitle';
import { cn } from '@/lib/utils';

export function SecurityHealthSection() {
  const { score, trend, riskLevel, explanation, metrics } = securityHealth;
  const trendPositive = trend >= 0;

  return (
    <SectionWrapper className="mt-6">
      <SectionTitle
        eyebrow="Posture"
        title="Security Health"
        subtitle="A composite score across exposure, governance, and detection coverage."
      />

      <div className="mt-4 grid gap-5 lg:grid-cols-5">
        {/* Score card — larger, asymmetric */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-card lg:col-span-3 lg:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/5 blur-3xl" />
          <div className="relative flex flex-col items-center gap-7 sm:flex-row sm:items-center">
            <ProgressRing
              value={score}
              max={100}
              label="/ 100"
              sublabel={riskLevel}
              riskLevel={riskLevel}
              size={184}
            />
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Overall Security Health Score
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-4xl font-semibold tabular-nums tracking-tight text-foreground">
                    <AnimatedNumber value={score} decimals={1} />
                  </span>
                  <span className="text-lg text-muted-foreground">/ 100</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background-subtle px-3 py-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground">Trend</span>
                  <span
                    className={cn(
                      'inline-flex items-center gap-0.5 text-sm font-semibold',
                      trendPositive ? 'text-success' : 'text-danger',
                    )}
                  >
                    {trendPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                    {trend}%
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background-subtle px-3 py-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground">Risk Level</span>
                  <span className="text-sm font-semibold text-primary">{riskLevel}</span>
                </span>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-border bg-background-subtle/60 p-3.5">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-muted-foreground">{explanation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Compact metrics — right side, stacked */}
        <div className="grid grid-cols-2 gap-3 lg:col-span-2 lg:grid-cols-1 lg:gap-4">
          {metrics.map((m, i) => {
            const positive = m.invertChangeColor ? m.change < 0 : m.change >= 0;
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
                className="group rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <p className="text-[12px] font-medium text-muted-foreground">{m.label}</p>
                <div className="mt-1.5 flex items-baseline justify-between">
                  <span className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">
                    <AnimatedNumber value={m.value} />
                    {m.suffix && <span className="ml-0.5 text-base font-normal text-muted-foreground">{m.suffix}</span>}
                  </span>
                  {m.change !== 0 ? (
                    <span
                      className={cn(
                        'inline-flex items-center gap-0.5 text-xs font-semibold',
                        positive ? 'text-success' : 'text-danger',
                      )}
                    >
                      {m.change > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(m.change)}%
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground">—</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
