export type ScanStatus = "Running" | "Completed" | "Failed" | "Queued";

export interface Scan {
  id: string;
  name: string;
  repository: string;
  type: "Full Scan" | "Incremental" | "Scheduled";
  status: ScanStatus;
  progress: number;
  findings: number;
  assetsScanned: number;
  startedAt: string;
  lastRun: string;
  estimatedCompletion: string;
  initiatedBy: string;
}

export const scans: Scan[] = [
  {
    id: "SCAN-1001",
    name: "Production Discovery Scan",
    repository: "Payments API",
    type: "Full Scan",
    status: "Running",
    progress: 82,
    findings: 18,
    assetsScanned: 24118,
    startedAt: "Today, 10:18 AM",
    lastRun: "Today",
    estimatedCompletion: "5 mins",
    initiatedBy: "System Scheduler",
  },
  {
    id: "SCAN-1002",
    name: "HR Documents Scan",
    repository: "HR SharePoint",
    type: "Scheduled",
    status: "Completed",
    progress: 100,
    findings: 9,
    assetsScanned: 15682,
    startedAt: "Today, 8:30 AM",
    lastRun: "Today",
    estimatedCompletion: "-",
    initiatedBy: "System Scheduler",
  },
  {
    id: "SCAN-1003",
    name: "Customer Database Audit",
    repository: "Customer DB",
    type: "Incremental",
    status: "Running",
    progress: 47,
    findings: 6,
    assetsScanned: 8432,
    startedAt: "Today, 11:05 AM",
    lastRun: "Today",
    estimatedCompletion: "12 mins",
    initiatedBy: "Security Team",
  },
  {
    id: "SCAN-1004",
    name: "S3 Bucket Classification",
    repository: "AWS S3",
    type: "Scheduled",
    status: "Failed",
    progress: 63,
    findings: 3,
    assetsScanned: 5298,
    startedAt: "Yesterday",
    lastRun: "Yesterday",
    estimatedCompletion: "-",
    initiatedBy: "Platform Team",
  },
  {
    id: "SCAN-1005",
    name: "Source Code Secrets Scan",
    repository: "GitHub Enterprise",
    type: "Full Scan",
    status: "Queued",
    progress: 0,
    findings: 0,
    assetsScanned: 0,
    startedAt: "-",
    lastRun: "2 days ago",
    estimatedCompletion: "-",
    initiatedBy: "Manual",
  },
  {
    id: "SCAN-1006",
    name: "PII Discovery",
    repository: "Customer Portal",
    type: "Incremental",
    status: "Completed",
    progress: 100,
    findings: 14,
    assetsScanned: 19451,
    startedAt: "Yesterday",
    lastRun: "Yesterday",
    estimatedCompletion: "-",
    initiatedBy: "Compliance Team",
  },
];