import { securityScoreTrend } from "@/mock-data/insights";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";

export default function SecurityScoreChart() {
  const current =
    securityScoreTrend[securityScoreTrend.length - 1]?.score ?? 0;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Security Posture Trend
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Overall security score over the last seven months.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-card">
          <p className="text-xs text-muted-foreground">Current Score</p>

          <div className="mt-1 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />

            <span className="text-2xl font-bold">
              {current}
            </span>

            <span className="text-sm text-muted-foreground">/100</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={securityScoreTrend}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                opacity={0.2}
              />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                domain={[60, 100]}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="score"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}