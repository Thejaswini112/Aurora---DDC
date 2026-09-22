export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type EntityStatus =
  | 'active'
  | 'paused'
  | 'scanning'
  | 'completed'
  | 'failed'
  | 'pending'
  | 'scheduled'
  | 'draft'
  | 'enforced'
  | 'investigating'
  | 'remediated'
  | 'open'
  | 'in_review'
  | 'closed';

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export type RepositoryType =
  | 'sharepoint'
  | 's3'
  | 'snowflake'
  | 'postgresql'
  | 'exchange'
  | 'azure-blob'
  | 'google-drive'
  | 'mysql'
  | 'oracle'
  | 'onedrive'
  | 'github'
  | 'box'
  | 'dropbox';

export type ScanStatus = 'completed' | 'scanning' | 'scheduled' | 'failed' | 'paused';

export type PolicyStatus = 'enforced' | 'draft' | 'paused';

export type PolicyType =
  | 'data-classification'
  | 'access-governance'
  | 'retention'
  | 'encryption'
  | 'dlp'
  | 'residency';

export type UserRole = 'Security Analyst' | 'CISO' | 'Compliance Officer' | 'IT Administrator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarColor: string;
  initials: string;
}

export interface Workspace {
  id: string;
  name: string;
  plan: string;
  region: string;
}

export interface Repository {
  id: string;
  name: string;
  type: RepositoryType;
  environment: 'production' | 'staging' | 'development';
  status: EntityStatus;
  riskScore: number;
  totalAssets: number;
  sensitiveAssets: number;
  lastScanned: string;
  owner: string;
  region: string;
}

export interface Detection {
  id: string;
  title: string;
  severity: Severity;
  status: EntityStatus;
  repositoryId: string;
  repositoryName: string;
  classification: string;
  detectedAt: string;
  affectedAssets: number;
  assignedTo: string | null;
  description: string;
}

export interface Scan {
  id: string;
  name: string;
  repositoryId: string;
  repositoryName: string;
  type: 'full' | 'incremental' | 'scheduled';
  status: ScanStatus;
  progress: number;
  startedAt: string;
  lastRun: string;
  duration: string;
  estimatedCompletion: string;
  assetsScanned: number;
  sensitiveFound: number;
  triggeredBy: string;
}

export type ComplianceFramework = 'GDPR' | 'PCI-DSS' | 'SOC 2' | 'HIPAA' | 'ISO 27001';

export interface Policy {
  id: string;
  name: string;
  framework: ComplianceFramework;
  type: PolicyType;
  category: string;
  status: PolicyStatus;
  severity: Severity;
  repositories: number;
  violations: number;
  lastUpdated: string;
  owner: string;
  description: string;
}

export interface ActivityEvent {
  id: string;
  type: 'detection' | 'scan' | 'policy' | 'access' | 'system' | 'remediation';
  title: string;
  description: string;
  actor: string;
  timestamp: string;
  severity: Severity | 'info';
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  severity: Severity | 'info';
  category: 'detection' | 'scan' | 'policy' | 'system';
}

export interface MetricTrend {
  label: string;
  value: number;
  change: number;
  trend: number[];
}

export interface ClassificationBreakdown {
  label: string;
  value: number;
  color: string;
}

export interface RiskDistributionPoint {
  label: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface BriefSummaryPoint {
  text: string;
  tone: 'neutral' | 'positive' | 'warning' | 'critical';
}

export interface MorningBrief {
  greeting: string;
  period: string;
  summaryPoints: BriefSummaryPoint[];
  estimatedReviewMinutes: number;
  exposureDeltaPct: number;
}

export interface HealthMetric {
  label: string;
  value: number;
  suffix?: string;
  change: number;
  invertChangeColor?: boolean;
}

export interface SecurityHealth {
  score: number;
  maxScore: number;
  trend: number;
  riskLevel: 'Low' | 'Moderate' | 'Elevated' | 'High' | 'Critical';
  explanation: string;
  metrics: HealthMetric[];
}

export interface WorkQueueItem {
  id: string;
  severity: Severity;
  fileName: string;
  reason: string;
  reasonTag: string;
  repository: string;
  detectedAt: string;
  classification: string;
  affectedAssets: number;
  ctaLabel: string;
}

export interface TrendAnnotation {
  label: string;
  day: string;
}

export interface AiRecommendation {
  id: string;
  title: string;
  confidence: number;
  impact: 'High' | 'Medium' | 'Low';
  reason: string;
  ctaLabel: string;
  category: 'access' | 'scan' | 'policy' | 'remediation';
}

export interface BriefActivityItem {
  id: string;
  actor: string;
  initials: string;
  color: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'policy' | 'review' | 'dismiss' | 'scan' | 'connect';
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  route: string;
}

export type RepositoryHealthStatus = 'healthy' | 'needs-attention' | 'scanning' | 'needs-scan' | 'disconnected';

export type ConnectorHealth = 'excellent' | 'good' | 'fair' | 'poor';

export interface RepositoryDetail {
  repositoryId: string;
  connection: ConnectorHealth;
  connectionMethod: string;
  createdAt: string;
  nextScan: string;
  scanSchedule: { frequency: string; time: string };
  avgScanDuration: string;
  classificationBreakdown: ClassificationBreakdown[];
  topFindings: RepositoryFinding[];
  activity: RepositoryActivityEvent[];
}

export interface RepositoryFinding {
  id: string;
  name: string;
  classification: string;
  severity: Severity;
}

export interface RepositoryActivityEvent {
  id: string;
  action: string;
  target: string;
  actor: string;
  timestamp: string;
  type: 'permission' | 'scan' | 'sync' | 'policy' | 'connect' | 'auth';
}

export interface ConnectorSource {
  id: string;
  name: string;
  type: RepositoryType;
  category: 'cloud-storage' | 'saas' | 'database' | 'collaboration' | 'dev';
  description: string;
}

export interface ConnectorActivity {
  id: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'connect' | 'scan' | 'sync' | 'policy' | 'auth';
}

export interface DataSourcesRecommendation {
  title: string;
  reason: string;
  confidence: number;
  repositoryName: string;
  ctaLabel: string;
}

export interface HealthDistribution {
  healthy: number;
  needsAttention: number;
  scanning: number;
  disconnected: number;
}
