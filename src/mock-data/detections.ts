import type { Detection } from "@/types";

export const detections: Detection[] = [
  {
    id: "DET-1042",
    title: "AWS Production Credentials",
    severity: "critical",
    status: "open",
    repositoryId: "repo-001",
    repositoryName: "GitHub - Payments API",
    classification: "Credentials",
    detectedAt: "2 mins ago",
    affectedAssets: 3,
    assignedTo: "Alex Johnson",
    description:
      "Hardcoded AWS access keys detected inside configuration files.",
  },
  {
    id: "DET-1041",
    title: "Database Password Exposure",
    severity: "high",
    status: "in_review",
    repositoryId: "repo-002",
    repositoryName: "Amazon S3",
    classification: "Credentials",
    detectedAt: "15 mins ago",
    affectedAssets: 7,
    assignedTo: "Emily Carter",
    description:
      "Database credentials discovered inside backup archives.",
  },
  {
    id: "DET-1038",
    title: "PII Leakage",
    severity: "medium",
    status: "open",
    repositoryId: "repo-003",
    repositoryName: "SharePoint",
    classification: "PII",
    detectedAt: "1 hour ago",
    affectedAssets: 28,
    assignedTo: null,
    description:
      "Personally identifiable information detected in uploaded spreadsheets.",
  },
  {
    id: "DET-1033",
    title: "PCI Data Exposure",
    severity: "critical",
    status: "closed",
    repositoryId: "repo-004",
    repositoryName: "PostgreSQL",
    classification: "PCI",
    detectedAt: "Yesterday",
    affectedAssets: 12,
    assignedTo: "Michael Scott",
    description:
      "Cardholder data discovered in archived transaction records.",
  },
];