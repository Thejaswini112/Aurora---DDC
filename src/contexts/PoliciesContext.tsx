import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
  } from "react";
  
  export type ComplianceFramework =
    | "GDPR"
    | "PCI-DSS"
    | "HIPAA"
    | "SOC 2"
    | "ISO 27001";
  
  export type PolicySeverity =
    | "Critical"
    | "High"
    | "Medium"
    | "Low";
  
  export type PolicyStatus =
    | "Active"
    | "Draft"
    | "Disabled";
  
  export interface Policy {
    id: string;
    name: string;
    framework: ComplianceFramework;
    category: string;
    severity: PolicySeverity;
    repositories: number;
    violations: number;
    status: PolicyStatus;
    lastModified: string;
  }
  
  interface PoliciesContextType {
    policies: Policy[];
    addPolicy: (
      policy: Pick<
        Policy,
        "name" | "framework" | "category" | "severity" | "repositories"
      >
    ) => void;
  }
  
  const PoliciesContext = createContext<PoliciesContextType | undefined>(
    undefined
  );
  
  const initialPolicies: Policy[] = [
    {
      id: "POL-001",
      name: "PCI Cardholder Protection",
      framework: "PCI-DSS",
      category: "Payment Data",
      severity: "Critical",
      repositories: 6,
      violations: 38,
      status: "Active",
      lastModified: "2 hours ago",
    },
    {
      id: "POL-002",
      name: "GDPR Personal Data",
      framework: "GDPR",
      category: "PII",
      severity: "High",
      repositories: 9,
      violations: 14,
      status: "Active",
      lastModified: "Yesterday",
    },
    {
      id: "POL-003",
      name: "HIPAA Health Records",
      framework: "HIPAA",
      category: "PHI",
      severity: "High",
      repositories: 4,
      violations: 6,
      status: "Draft",
      lastModified: "3 days ago",
    },
    {
      id: "POL-004",
      name: "SOC 2 Secrets Detection",
      framework: "SOC 2",
      category: "Credentials",
      severity: "Medium",
      repositories: 8,
      violations: 3,
      status: "Disabled",
      lastModified: "1 week ago",
    },
  ];
  
  export function PoliciesProvider({
    children,
  }: {
    children: ReactNode;
  }) {
    const [policies, setPolicies] =
      useState<Policy[]>(initialPolicies);
  
    const addPolicy: PoliciesContextType["addPolicy"] = (
      policy
    ) => {
      setPolicies((previous) => [
        {
          id: `POL-${String(previous.length + 1).padStart(3, "0")}`,
          ...policy,
          violations: 0,
          status: "Active",
          lastModified: "Just now",
        },
        ...previous,
      ]);
    };
  
    const value = useMemo(
      () => ({
        policies,
        addPolicy,
      }),
      [policies]
    );
  
    return (
      <PoliciesContext.Provider value={value}>
        {children}
      </PoliciesContext.Provider>
    );
  }
  
  export function usePolicies() {
    const context = useContext(PoliciesContext);
  
    if (!context) {
      throw new Error(
        "usePolicies must be used inside PoliciesProvider"
      );
    }
  
    return context;
  }