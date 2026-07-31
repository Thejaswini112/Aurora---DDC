import { AuroraAdvisor } from './AuroraAdvisor';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { PageContainer, PageHeader, EmptyState, SectionHeader, SecondaryButton } from '@/components/common';
import { activityFeed } from '@/mock-data';
import { Timeline } from '@/components/common';

interface ComingSoonProps {
  title: string;
  description: string;
  icon: LucideIcon;
  highlights: { icon: LucideIcon; title: string; description: string }[];
  roadmap?: { label: string; status: 'planned' | 'in_progress' | 'next' }[];
}

const statusStyles: Record<string, string> = {
  in_progress: 'bg-primary/10 text-primary border-primary/20',
  next: 'bg-muted text-muted-foreground border-border',
  planned: 'bg-transparent text-muted-foreground border-border border-dashed',
};

const statusLabels: Record<string, string> = {
  in_progress: 'In Progress',
  next: 'Up Next',
  planned: 'Planned',
};

export function ComingSoon({ title, description, icon: Icon, highlights, roadmap }: ComingSoonProps) {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <PageHeader
        title={title}
        description={description}
        icon={Icon}
        actions={<SecondaryButton onClick={() => navigate('/overview')}>Back to Overview</SecondaryButton>}
      />

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {highlights.map((h, i) => (
          <motion.div
            key={h.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="rounded-xl border border-border bg-card p-5 shadow-card"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background-subtle">
              <h.icon className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">{h.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{h.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.18 }}
          className="lg:col-span-3"
        >
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <SectionHeader
  title="Aurora Advisor"
  description="AI-generated recommendations based on your current security posture."
/>

<div className="mt-6">
  <AuroraAdvisor />
</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.24 }}
          className="lg:col-span-2 space-y-5"
        >
          {roadmap && roadmap.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <SectionHeader title="Delivery roadmap" description="Sequenced for the current sprint." />
              <div className="mt-4 space-y-2.5">
                {roadmap.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-lg border border-border bg-background-subtle px-3 py-2.5"
                  >
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusStyles[item.status]}`}
                    >
                      {statusLabels[item.status]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <SectionHeader title="Recent activity" description="Latest events across the workspace." />
            <div className="mt-4 max-h-[280px] overflow-y-auto scrollbar-thin pr-1">
              <Timeline events={activityFeed.slice(0, 4)} />
            </div>
            <button
              onClick={() => navigate('/overview')}
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary-hover"
            >
              View all activity
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
}
