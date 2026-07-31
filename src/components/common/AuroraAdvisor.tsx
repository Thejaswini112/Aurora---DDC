import { AlertTriangle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const actions = [
  {
    title: 'Rotate exposed AWS credentials',
    priority: 'Critical',
    impact: '12 secrets',
  },
  {
    title: 'Restrict public S3 bucket access',
    priority: 'High',
    impact: '6 repositories',
  },
  {
    title: 'Notify repository owners',
    priority: 'Medium',
    impact: '18 contributors',
  },
];

export function AuroraAdvisor() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-background to-background p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Aurora Advisor
            </div>

            <h2 className="mt-4 text-2xl font-bold text-foreground">
              Investigate exposed AWS credentials
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Aurora detected multiple production AWS credentials committed to GitHub
              repositories. Rotating these secrets immediately can reduce your
              organization's critical exposure by approximately <b>34%</b>.
            </p>
          </div>

          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center">
            <p className="text-xs text-muted-foreground">Risk</p>
            <p className="mt-1 text-lg font-bold text-red-500">Critical</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Confidence
            </p>
            <p className="mt-2 text-3xl font-bold">96%</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Estimated Risk Reduction
            </p>
            <p className="mt-2 text-3xl font-bold text-emerald-500">34%</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Time to Resolve
            </p>
            <p className="mt-2 text-3xl font-bold">18 min</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="rounded-xl border border-border bg-background-subtle">
        <div className="border-b border-border px-5 py-4">
          <h3 className="font-semibold">Recommended Actions</h3>
          <p className="text-sm text-muted-foreground">
            Prioritized by Aurora based on security impact.
          </p>
        </div>

        <div className="divide-y divide-border">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex items-center justify-between px-5 py-4"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  {index === 0 ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : (
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  )}
                </div>

                <div>
                  <p className="font-medium">{action.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {action.impact}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    action.priority === 'Critical'
                      ? 'bg-red-500/10 text-red-500'
                      : action.priority === 'High'
                      ? 'bg-orange-500/10 text-orange-500'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {action.priority}
                </span>

                <button className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover">
                  Investigate
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}