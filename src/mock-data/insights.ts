import { AlertTriangle, ShieldCheck, Database, Clock } from "lucide-react";

export const executiveMetrics = [
  {
    id: 1,
    label: "Critical Findings",
    value: 12,
    change: 18,
    icon: AlertTriangle,
    trend: [6, 7, 7, 8, 10, 11, 12],
    color: "critical",
  },
  {
    id: 2,
    label: "High Risk Repositories",
    value: 5,
    change: -12,
    icon: Database,
    trend: [9, 8, 8, 7, 6, 5, 5],
    color: "warning",
  },
  {
    id: 3,
    label: "Compliance Score",
    value: "94%",
    change: 6,
    icon: ShieldCheck,
    trend: [81, 84, 86, 89, 91, 93, 94],
    color: "success",
  },
  {
    id: 4,
    label: "Estimated Remediation",
    value: "5.2h",
    change: -14,
    icon: Clock,
    trend: [8, 7.5, 7, 6.8, 6.2, 5.8, 5.2],
    color: "primary",
  },
];

export const aiInsights = [
  {
    id: 1,
    severity: "Critical",
    confidence: 96,
    title: "Credential Exposure Spike",
    description:
      "GitHub repositories created during the last 48 hours contain a 42% increase in exposed API keys.",
    recommendation:
      "Rotate exposed credentials immediately and enable continuous secret scanning.",
    action: "Investigate",
  },
  {
    id: 2,
    severity: "High",
    confidence: 91,
    title: "Public S3 Bucket Detected",
    description:
      "Sensitive financial reports are accessible from an internet-facing storage bucket.",
    recommendation:
      "Restrict bucket permissions and trigger a full repository scan.",
    action: "Review",
  },
  {
    id: 3,
    severity: "Medium",
    confidence: 88,
    title: "Inactive Security Policies",
    description:
      "Five detection policies have not generated findings during the last 90 days.",
    recommendation:
      "Archive unused policies or review their matching conditions.",
    action: "Optimize",
  },
];

export const securityScoreTrend = [
  { month: "Jan", score: 72 },
  { month: "Feb", score: 75 },
  { month: "Mar", score: 79 },
  { month: "Apr", score: 83 },
  { month: "May", score: 87 },
  { month: "Jun", score: 91 },
  { month: "Jul", score: 94 },
];

export const repositoryIntelligence = [
  {
    id: 1,
    name: "GitHub",
    findings: 412,
    trend: "+22%",
    risk: "Critical",
    summary: "Highest concentration of exposed secrets.",
  },
  {
    id: 2,
    name: "Amazon S3",
    findings: 118,
    trend: "-46%",
    risk: "Medium",
    summary: "Most improved repository after remediation.",
  },
  {
    id: 3,
    name: "SharePoint",
    findings: 89,
    trend: "+8%",
    risk: "High",
    summary: "Personally identifiable information continues to grow.",
  },
  {
    id: 4,
    name: "Slack",
    findings: 27,
    trend: "-12%",
    risk: "Low",
    summary: "No critical findings detected this week.",
  },
];

export const businessImpact = {
  estimatedLoss: "$480K",
  affectedRecords: "43,000",
  impactedTeams: 18,
  remediationTime: "5.2 Hours",
};

export const dataClassification = [
  {
    name: "Secrets",
    value: 42,
  },
  {
    name: "PII",
    value: 31,
  },
  {
    name: "Financial",
    value: 15,
  },
  {
    name: "Source Code",
    value: 12,
  },
];