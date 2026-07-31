import {
    Building2,
    ScanSearch,
    BrainCircuit,
    Github,
    Database,
    Cloud,
    MessageSquare,
  } from "lucide-react";
  
  export const workspaceSettings = {
    organization: "Aurora Security",
    region: "US East (N. Virginia)",
    timezone: "UTC",
    retention: "180 Days",
    defaultClassification: "Sensitive",
  };
  
  export const scanSettings = {
    frequency: "Every 6 Hours",
    incrementalScan: true,
    deepScan: true,
    autoRemediation: false,
    maxThreads: 12,
  };
  
  export const aiSettings = {
    recommendations: true,
    weeklyReports: true,
    rootCauseAnalysis: true,
    explainFindings: true,
    confidenceThreshold: 90,
  };
  
  export const integrations = [
    {
      id: 1,
      name: "GitHub",
      icon: Github,
      status: "Connected",
      health: "Healthy",
      lastSync: "2 mins ago",
      repositories: 18,
    },
    {
      id: 2,
      name: "Amazon S3",
      icon: Database,
      status: "Connected",
      health: "Healthy",
      lastSync: "5 mins ago",
      repositories: 42,
    },
    {
      id: 3,
      name: "Azure Blob",
      icon: Cloud,
      status: "Disconnected",
      health: "Attention",
      lastSync: "Yesterday",
      repositories: 11,
    },
    {
      id: 4,
      name: "Slack",
      icon: MessageSquare,
      status: "Connected",
      health: "Healthy",
      lastSync: "1 min ago",
      repositories: 7,
    },
  ];
  
  export const settingsCards = [
    {
      title: "Workspace",
      value: "Configured",
      icon: Building2,
      description: "Organization preferences and workspace defaults.",
    },
    {
      title: "Scanning",
      value: "Active",
      icon: ScanSearch,
      description: "Continuous discovery and classification settings.",
    },
    {
      title: "Aurora AI",
      value: "Enabled",
      icon: BrainCircuit,
      description: "AI-powered recommendations and explanations.",
    },
  ];