import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Radar, Plug, ScrollText, FileDown, UserPlus, type LucideIcon } from 'lucide-react';
import { SectionTitle, SectionWrapper } from './SectionTitle';

interface ActionDef {
  id: string;
  label: string;
  icon: LucideIcon;
  route: string;
  description: string;
}

const actions: ActionDef[] = [
  { id: 'scan', label: 'Run Scan', icon: Radar, route: '/scan-management', description: 'Launch a discovery scan' },
  { id: 'connect', label: 'Connect Repository', icon: Plug, route: '/data-sources', description: 'Add a data source' },
  { id: 'policy', label: 'Create Policy', icon: ScrollText, route: '/policies', description: 'Define a governance rule' },
  { id: 'export', label: 'Export Report', icon: FileDown, route: '/insights', description: 'Download posture report' },
  { id: 'invite', label: 'Invite User', icon: UserPlus, route: '/settings', description: 'Add a team member' },
];

export function QuickActionsSection() {
  const navigate = useNavigate();

  return (
    <SectionWrapper className="mt-10" delay={0.05}>
      <SectionTitle eyebrow="Shortcuts" title="Quick Actions" subtitle="Jump straight into common workflows." />

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {actions.map((action, i) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08 + i * 0.05 }}
            onClick={() => navigate(action.route)}
            className="group flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-4 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
              <action.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{action.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{action.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </SectionWrapper>
  );
}
