import {
  LayoutDashboard,
  ShieldAlert,
  Database,
  Radar,
  ScrollText,
  Sparkles,
  Settings,
  LifeBuoy,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  description: string;
}

export const navItems: NavItem[] = [
  { label: 'Overview', to: '/overview', icon: LayoutDashboard, description: 'Security posture at a glance' },
  { label: 'Detections', to: '/detections', icon: ShieldAlert, description: 'Investigate sensitive data exposure' },
  { label: 'Data Sources', to: '/data-sources', icon: Database, description: 'Connected repositories & assets' },
  { label: 'Scan Management', to: '/scan-management', icon: Radar, description: 'Configure and monitor scans' },
  { label: 'Policies', to: '/policies', icon: ScrollText, description: 'Governance rules & compliance' },
  { label: 'Insights', to: '/insights', icon: Sparkles, description: 'AI-generated intelligence' },
  { label: 'Settings', to: '/settings', icon: Settings, description: 'Workspace & integration settings' },
];

export const bottomNavItems: NavItem[] = [
  { label: 'Help', to: '/help', icon: LifeBuoy, description: 'Documentation & support' },
];
