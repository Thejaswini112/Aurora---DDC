import {
  Database,
  Cloud,
  HardDrive,
  Mail,
  FolderOpen,
  GitBranch,
  Server,
  type LucideIcon,
} from 'lucide-react';
import type { RepositoryType, RepositoryHealthStatus, ConnectorHealth, ConnectorSource } from '@/types';

export const repoTypeIcon: Record<RepositoryType, LucideIcon> = {
  sharepoint: FolderOpen,
  'google-drive': HardDrive,
  onedrive: HardDrive,
  s3: Cloud,
  'azure-blob': Cloud,
  snowflake: Database,
  postgresql: Server,
  mysql: Server,
  oracle: Server,
  exchange: Mail,
  github: GitBranch,
  box: HardDrive,
  dropbox: HardDrive,
};

export const repoTypeLabel: Record<RepositoryType, string> = {
  sharepoint: 'SharePoint',
  'google-drive': 'Google Drive',
  onedrive: 'OneDrive',
  s3: 'AWS S3',
  'azure-blob': 'Azure Blob',
  snowflake: 'Snowflake',
  postgresql: 'PostgreSQL',
  mysql: 'MySQL',
  oracle: 'Oracle',
  exchange: 'Exchange',
  github: 'GitHub',
  box: 'Box',
  dropbox: 'Dropbox',
};

export const healthStatusConfig: Record<
  RepositoryHealthStatus,
  { label: string; classes: string; dot: string }
> = {
  healthy: { label: 'Healthy', classes: 'text-success', dot: 'bg-success' },
  'needs-attention': { label: 'Needs Attention', classes: 'text-warning', dot: 'bg-warning' },
  scanning: { label: 'Scanning', classes: 'text-primary', dot: 'bg-primary' },
  'needs-scan': { label: 'Needs Scan', classes: 'text-warning', dot: 'bg-warning' },
  disconnected: { label: 'Disconnected', classes: 'text-danger', dot: 'bg-danger' },
};

export const connectorHealthConfig: Record<
  ConnectorHealth,
  { label: string; classes: string; dot: string }
> = {
  excellent: { label: 'Excellent', classes: 'text-success', dot: 'bg-success' },
  good: { label: 'Good', classes: 'text-success', dot: 'bg-success' },
  fair: { label: 'Fair', classes: 'text-warning', dot: 'bg-warning' },
  poor: { label: 'Poor', classes: 'text-danger', dot: 'bg-danger' },
};

export const categoryLabels: Record<ConnectorSource['category'], string> = {
  'cloud-storage': 'Cloud Storage',
  saas: 'SaaS',
  database: 'Database',
  collaboration: 'Collaboration',
  dev: 'Developer',
};
