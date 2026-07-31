export type PolicyStatus = "Active" | "Draft" | "Disabled";

export type ComplianceFramework =
  | "GDPR"
  | "PCI-DSS"
  | "SOC 2"
  | "HIPAA"
  | "ISO 27001";

export type PolicySeverity = "Critical" | "High" | "Medium" | "Low";

export interface Policy {
  id: string;
  name: string;
  framework: ComplianceFramework;
  category: string;
  status: PolicyStatus;
  severity: PolicySeverity;
  repositories: number;
  violations: number;
  lastModified: string;
  owner: string;
}

export const policies: Policy[] = [
  {
    id: "POL-001",
    name: "PCI Cardholder Data Encryption",
    framework: "PCI-DSS",
    category: "Encryption",
    status: "Active",
    severity: "Critical",
    repositories: 24,
    violations: 6,
    lastModified: "2 hours ago",
    owner: "Security Team",
  },
  {
    id: "POL-002",
    name: "GDPR Personal Data Protection",
    framework: "GDPR",
    category: "Data Privacy",
    status: "Active",
    severity: "High",
    repositories: 18,
    violations: 4,
    lastModified: "Yesterday",
    owner: "Compliance Team",
  },
  {
    id: "POL-003",
    name: "SOC 2 Access Governance",
    framework: "SOC 2",
    category: "Access Control",
    status: "Draft",
    severity: "Medium",
    repositories: 12,
    violations: 0,
    lastModified: "3 days ago",
    owner: "Platform Team",
  },
  {
    id: "POL-004",
    name: "HIPAA Health Record Protection",
    framework: "HIPAA",
    category: "Healthcare",
    status: "Active",
    severity: "Critical",
    repositories: 9,
    violations: 2,
    lastModified: "5 days ago",
    owner: "Security Team",
  },
  {
    id: "POL-005",
    name: "ISO 27001 Data Retention",
    framework: "ISO 27001",
    category: "Retention",
    status: "Active",
    severity: "Medium",
    repositories: 30,
    violations: 1,
    lastModified: "1 week ago",
    owner: "Governance Team",
  },
  {
    id: "POL-006",
    name: "Public Bucket Detection",
    framework: "SOC 2",
    category: "Storage Security",
    status: "Disabled",
    severity: "High",
    repositories: 14,
    violations: 0,
    lastModified: "2 weeks ago",
    owner: "Cloud Team",
  },
  {
    id: "POL-007",
    name: "Secrets & API Keys Detection",
    framework: "ISO 27001",
    category: "Secrets Management",
    status: "Active",
    severity: "Critical",
    repositories: 28,
    violations: 8,
    lastModified: "Today",
    owner: "DevSecOps",
  },
  {
    id: "POL-008",
    name: "PII Exposure Monitoring",
    framework: "GDPR",
    category: "Data Classification",
    status: "Draft",
    severity: "High",
    repositories: 21,
    violations: 0,
    lastModified: "Today",
    owner: "Compliance Team",
  },
];