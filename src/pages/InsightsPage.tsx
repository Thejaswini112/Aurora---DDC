import { useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronDown,
  ShieldAlert,
  Database,
  Layers3,
} from 'lucide-react';
import {
  classificationBreakdown,
  riskDistribution,
  trendAnnotations,
} from '@/mock-data';
import { securityScoreTrend } from '@/mock-data/insights';
import { PageContainer, MetricCard } from '@/components/common';
import ExecutiveSummary from './insights/components/ExecutiveSummary';
import SecurityScoreChart from './insights/components/SecurityScoreChart';
import AIInsightsFeed from './insights/components/AIInsightsFeed';

type DateRange = '7d' | '30d' | '90d' | '6m' | 'all';

const dateRangeLabels: Record<DateRange, string> = {
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
  '6m': 'Last 6 months',
  all: 'All time',
};

export function InsightsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('6m');

  const currentScore =
    securityScoreTrend[securityScoreTrend.length - 1]?.score ?? 0;

  const averageRisk =
    riskDistribution.length > 0
      ? Math.round(
          riskDistribution.reduce(
            (sum, point) =>
              sum + point.critical + point.high + point.medium + point.low,
            0,
          ) / riskDistribution.length,
        )
      : 0;

  const totalClassified = useMemo(
    () => classificationBreakdown.reduce((sum, item) => sum + item.value, 0),
    [],
  );

  const topClassification = useMemo(
    () =>
      [...classificationBreakdown].sort((a, b) => b.value - a.value)[0],
    [],
  );

  return (
    <PageContainer className="py-8">
      <div className="space-y-10">
        {/* Header */}
        <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Security Intelligence</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Insights
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Understand how your security posture is changing, where exposure
              is concentrated, and which areas need attention.
            </p>
          </div>

          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={dateRange}
              onChange={(event) =>
                setDateRange(event.target.value as DateRange)
              }
              className="h-10 appearance-none rounded-lg border border-border bg-card pl-9 pr-10 text-sm font-medium shadow-sm outline-none transition focus:ring-2 focus:ring-primary/20"
              aria-label="Insights date range"
            >
              {Object.entries(dateRangeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </section>

        {/* Executive summary */}
        <ExecutiveSummary />

        {/* Intelligence snapshot */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Exposure Intelligence
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A high-level view of risk concentration and sensitive-data exposure.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <MetricCard
              label="Security Score"
              value={`${currentScore}/100`}
              change={currentScore - (securityScoreTrend[0]?.score ?? currentScore)}
              icon={ShieldAlert}
              trend={securityScoreTrend.map((point) => point.score)}
            />

            <MetricCard
              label="Avg. Risk Exposure"
              value={averageRisk}
              change={0}
              icon={Database}
              trend={riskDistribution.map(
                (point) =>
                  point.critical +
                  point.high +
                  point.medium +
                  point.low,
              )}
            />

            <MetricCard
              label="Classified Exposure"
              value={`${totalClassified}%`}
              change={0}
              icon={Layers3}
              trend={classificationBreakdown.map((item) => item.value)}
            />
          </div>

          {topClassification && (
            <div className="rounded-xl border border-border bg-card p-5 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Largest classification
              </p>
              <div className="mt-2 flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold">
                    {topClassification.label}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Represents {topClassification.value}% of classified exposure.
                  </p>
                </div>
                <span className="text-2xl font-bold">
                  {topClassification.value}%
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Security trend */}
        <SecurityScoreChart />

        {/* Trend annotations */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Trend Intelligence
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Important changes detected across the selected reporting period.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {trendAnnotations.map((annotation) => (
              <div
                key={`${annotation.label}-${annotation.day}`}
                className="rounded-xl border border-border bg-card p-5 shadow-card"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {annotation.day}
                </p>
                <p className="mt-2 text-sm font-medium">
                  {annotation.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* AI insights */}
        <AIInsightsFeed />

        <p className="text-xs text-muted-foreground">
          Showing {dateRangeLabels[dateRange].toLowerCase()} of available
          intelligence. AI recommendations are advisory and require human
          review before action.
        </p>
      </div>
    </PageContainer>
  );
}