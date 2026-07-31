import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import { riskDistribution, trendAnnotations } from '@/mock-data';
import { SectionTitle, SectionWrapper } from './SectionTitle';

const sevColors = {
  critical: 'hsl(var(--danger))',
  high: 'hsl(var(--warning))',
  medium: 'hsl(var(--primary))',
  low: 'hsl(var(--success))',
};

const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  fontSize: '12px',
  color: 'hsl(var(--foreground))',
  boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.12)',
};

export function RiskTrendSection() {
  const maxValue = Math.max(
    ...riskDistribution.map((d) => d.critical + d.high + d.medium + d.low),
  );

  return (
    <SectionWrapper className="mt-10" delay={0.05}>
      <SectionTitle
        eyebrow="Exposure Trend"
        title="Risk Trend"
        subtitle="Detection volume by severity over the last 7 days."
        action={
          <div className="hidden items-center gap-3 sm:flex">
            {trendAnnotations.map((a) => (
              <span key={a.label} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="h-2 w-2 rounded-full border border-dashed border-muted-foreground/50" />
                {a.label}
              </span>
            ))}
          </div>
        }
      />

      <div className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-card lg:p-6">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={riskDistribution} margin={{ top: 8, right: 12, left: -16, bottom: 8 }}>
              <defs>
                {Object.entries(sevColors).map(([key, color]) => (
                  <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.22} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                domain={[0, Math.ceil(maxValue / 5) * 5]}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }} />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                iconType="circle"
                iconSize={8}
              />
              {trendAnnotations.map((ann) => (
                <ReferenceLine
                  key={ann.label}
                  x={ann.day}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="4 4"
                  strokeOpacity={0.4}
                  label={{
                    value: ann.label,
                    position: 'top',
                    fill: 'hsl(var(--muted-foreground))',
                    fontSize: 10,
                  }}
                />
              ))}
              <Area type="monotone" dataKey="low" stackId="1" stroke={sevColors.low} strokeWidth={1.5} fill={`url(#grad-low)`} name="Low" />
              <Area type="monotone" dataKey="medium" stackId="1" stroke={sevColors.medium} strokeWidth={1.5} fill={`url(#grad-medium)`} name="Medium" />
              <Area type="monotone" dataKey="high" stackId="1" stroke={sevColors.high} strokeWidth={1.5} fill={`url(#grad-high)`} name="High" />
              <Area type="monotone" dataKey="critical" stackId="1" stroke={sevColors.critical} strokeWidth={2} fill={`url(#grad-critical)`} name="Critical" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </SectionWrapper>
  );
}
