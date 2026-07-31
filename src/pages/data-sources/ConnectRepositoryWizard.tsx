import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Database,
  Cloud,
  HardDrive,
  Mail,
  FolderOpen,
  GitBranch,
  Server,
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  Link2,
  type LucideIcon,
} from 'lucide-react';
import { connectorSources } from '@/mock-data';
import { cn } from '@/lib/utils';
import { categoryLabels } from './repositoryHelpers';
import type { ConnectorSource, Repository } from '@/types';

const sourceIcon: Record<string, LucideIcon> = {
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

const steps = ['Choose Source', 'Connection Details', 'Validation', 'Discovery Settings'] as const;

const validationSteps = [
  { label: 'Authenticating…', icon: ShieldCheck },
  { label: 'Fetching metadata…', icon: Database },
  { label: 'Validating permissions…', icon: KeyRoundIcon },
  { label: 'Connection Successful', icon: CheckCircle2 },
];

function KeyRoundIcon(props: { className?: string }) {
  return <ShieldCheck {...props} />;
}

const discoveryProfiles = [
  { id: 'full', label: 'Full Scan', description: 'Classify every asset on first connect', icon: Database },
  { id: 'incremental', label: 'Incremental Scan', description: 'Scan only new & changed assets', icon: Zap },
  { id: 'scheduled', label: 'Scheduled Scan', description: 'Run on a recurring schedule', icon: Clock },
];

const sensitivityProfiles = [
  { id: 'default', label: 'Default Classification', description: 'PII, PCI, PHI, Credentials, Confidential' },
  { id: 'strict', label: 'Strict', description: 'Default + internal identifiers & metadata' },
  { id: 'financial', label: 'Financial Services', description: 'PCI, account numbers, transaction data' },
];

interface ConnectRepositoryWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (repo: Repository) => void;
}

export function ConnectRepositoryWizard({ open, onOpenChange, onComplete }: ConnectRepositoryWizardProps) {
  const [step, setStep] = useState(0);
  const [selectedSource, setSelectedSource] = useState<ConnectorSource | null>(null);
  const [repoName, setRepoName] = useState('');
  const [credentials, setCredentials] = useState('');
  const [authMethod, setAuthMethod] = useState('OAuth 2.0');
  const [connectionUrl, setConnectionUrl] = useState('');
  const [validationProgress, setValidationProgress] = useState(0);
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);
  const [discoveryProfile, setDiscoveryProfile] = useState('full');
  const [sensitivityProfile, setSensitivityProfile] = useState('default');

  const reset = () => {
    setStep(0);
    setSelectedSource(null);
    setRepoName('');
    setCredentials('');
    setAuthMethod('OAuth 2.0');
    setConnectionUrl('');
    setValidationProgress(0);
    setValidating(false);
    setValidated(false);
    setDiscoveryProfile('full');
    setSensitivityProfile('default');
  };

  const close = () => {
    onOpenChange(false);
    setTimeout(reset, 300);
  };

  const runValidation = () => {
    setValidating(true);
    setValidationProgress(0);
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setValidationProgress(current);
      if (current >= validationSteps.length) {
        clearInterval(interval);
        setValidating(false);
        setValidated(true);
      }
    }, 750);
  };

  const handleFinish = () => {
    if (!selectedSource) return;
    const newRepo: Repository = {
      id: `repo_custom_${Date.now()}`,
      name: repoName || `${selectedSource.name} Repository`,
      type: selectedSource.type,
      environment: 'production',
      status: 'active',
      riskScore: 0,
      totalAssets: 0,
      sensitiveAssets: 0,
      lastScanned: new Date().toISOString(),
      owner: 'Sarah Johnson',
      region: 'eu-west-1',
    };
    onComplete(newRepo);
    close();
  };

  const canProceed =
    (step === 0 && selectedSource) ||
    (step === 1 && repoName.trim() && credentials.trim()) ||
    (step === 2 && validated) ||
    step === 3;

  const groupedSources = connectorSources.reduce<Record<string, ConnectorSource[]>>((acc, src) => {
    (acc[src.category] ??= []).push(src);
    return acc;
  }, {});

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(true) : close())}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="text-base font-semibold tracking-tight">
            Connect Repository
          </DialogTitle>
          <DialogDescription>Connect a new data source to Aurora's discovery engine.</DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center gap-1 border-b border-border bg-background-subtle/40 px-6 py-3">
          {steps.map((label, i) => (
            <div key={label} className="flex flex-1 items-center">
              <button
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className="flex items-center gap-2"
              >
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors',
                    i < step && 'bg-success text-success-foreground',
                    i === step && 'bg-primary text-primary-foreground',
                    i > step && 'bg-muted text-muted-foreground',
                  )}
                >
                  {i < step ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span
                  className={cn(
                    'hidden text-xs font-medium sm:inline',
                    i === step ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div className={cn('mx-2 h-px flex-1', i < step ? 'bg-success' : 'bg-border')} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="max-h-[52vh] overflow-y-auto scrollbar-thin px-6 py-5">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">Choose a data source</h3>
                  <p className="text-xs text-muted-foreground">Select the platform you want to connect.</p>
                </div>
                {Object.entries(groupedSources).map(([category, sources]) => (
                  <div key={category}>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {categoryLabels[category as ConnectorSource['category']]}
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {sources.map((source) => {
                        const Icon = sourceIcon[source.type] ?? Database;
                        const selected = selectedSource?.id === source.id;
                        return (
                          <button
                            key={source.id}
                            onClick={() => {
                              setSelectedSource(source);
                              setRepoName(`${source.name} Repository`);
                            }}
                            className={cn(
                              'group flex items-center gap-2.5 rounded-lg border p-3 text-left transition-all',
                              selected
                                ? 'border-primary bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary))]'
                                : 'border-border bg-card hover:border-primary/40 hover:bg-background-subtle',
                            )}
                          >
                            <div
                              className={cn(
                                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                                selected ? 'bg-primary/10' : 'bg-background-subtle',
                              )}
                            >
                              <Icon className={cn('h-4 w-4', selected ? 'text-primary' : 'text-muted-foreground')} />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-foreground">{source.name}</p>
                              <p className="truncate text-[10px] text-muted-foreground">{categoryLabels[source.category]}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">Connection details</h3>
                  <p className="text-xs text-muted-foreground">Enter credentials for your {selectedSource?.name} connection.</p>
                </div>

                <div className="flex items-center gap-2.5 rounded-lg border border-border bg-background-subtle/50 px-3.5 py-2.5">
                  {selectedSource && (() => {
                    const Icon = sourceIcon[selectedSource.type] ?? Database;
                    return <Icon className="h-4 w-4 text-primary" />;
                  })()}
                  <span className="text-xs font-medium text-foreground">{selectedSource?.name}</span>
                  <span className="text-xs text-muted-foreground">· {selectedSource?.description}</span>
                </div>

                <FormField label="Repository Name">
                  <input
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    placeholder="e.g. SharePoint Finance"
                    className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </FormField>

                <FormField label="Authentication Method">
                  <select
                    value={authMethod}
                    onChange={(e) => setAuthMethod(e.target.value)}
                    className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option>OAuth 2.0</option>
                    <option>Service Account</option>
                    <option>IAM Role</option>
                    <option>Access Key</option>
                    <option>Connection String</option>
                    <option>SAS Token</option>
                  </select>
                </FormField>

                <FormField label="Connection URL">
                  <input
                    value={connectionUrl}
                    onChange={(e) => setConnectionUrl(e.target.value)}
                    placeholder="https://acme.sharepoint.com/sites/finance"
                    className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </FormField>

                <FormField label="Credentials / Secret">
                  <input
                    type="password"
                    value={credentials}
                    onChange={(e) => setCredentials(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <ShieldCheck className="h-3 w-3" />
                    Credentials are encrypted with AES-256 and never stored in plaintext.
                  </p>
                </FormField>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">Validation</h3>
                  <p className="text-xs text-muted-foreground">Aurora is testing the connection to your {selectedSource?.name} repository.</p>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                  {!validating && !validated && (
                    <div className="flex flex-col items-center py-6 text-center">
                      <Link2 className="mb-3 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground">Ready to validate</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Click "Test Connection" to verify access.</p>
                      <button
                        onClick={runValidation}
                        className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
                      >
                        <Zap className="h-3.5 w-3.5" />
                        Test Connection
                      </button>
                    </div>
                  )}

                  {(validating || validated) && (
                    <div className="space-y-3">
                      {validationSteps.map((vStep, i) => {
                        const done = i < validationProgress;
                        const active = i === validationProgress && validating;
                        const isFinal = i === validationSteps.length - 1 && done;
                        const Icon = vStep.icon;
                        return (
                          <div
                            key={vStep.label}
                            className={cn(
                              'flex items-center gap-3 rounded-lg border px-3.5 py-2.5 transition-colors',
                              done && !isFinal && 'border-success/20 bg-success/5',
                              isFinal && 'border-success/30 bg-success/10',
                              active && 'border-primary/20 bg-primary/5',
                              !done && !active && 'border-border bg-background-subtle/40',
                            )}
                          >
                            <div
                              className={cn(
                                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                                done && !isFinal && 'bg-success/10',
                                isFinal && 'bg-success/15',
                                active && 'bg-primary/10',
                                !done && !active && 'bg-muted',
                              )}
                            >
                              {active ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                              ) : done ? (
                                <Check className={cn('h-3.5 w-3.5', isFinal ? 'text-success' : 'text-success')} />
                              ) : (
                                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                            </div>
                            <span
                              className={cn(
                                'text-xs font-medium',
                                done ? 'text-foreground' : active ? 'text-primary' : 'text-muted-foreground',
                              )}
                            >
                              {vStep.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">Discovery settings</h3>
                  <p className="text-xs text-muted-foreground">Choose how Aurora should scan this repository.</p>
                </div>

                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Scan Mode</p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {discoveryProfiles.map((profile) => {
                      const selected = discoveryProfile === profile.id;
                      return (
                        <button
                          key={profile.id}
                          onClick={() => setDiscoveryProfile(profile.id)}
                          className={cn(
                            'rounded-lg border p-3 text-left transition-all',
                            selected
                              ? 'border-primary bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary))]'
                              : 'border-border bg-card hover:bg-background-subtle',
                          )}
                        >
                          <profile.icon className={cn('mb-2 h-4 w-4', selected ? 'text-primary' : 'text-muted-foreground')} />
                          <p className="text-xs font-semibold text-foreground">{profile.label}</p>
                          <p className="mt-0.5 text-[10px] text-muted-foreground">{profile.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Sensitivity Profile</p>
                  <div className="space-y-2">
                    {sensitivityProfiles.map((profile) => {
                      const selected = sensitivityProfile === profile.id;
                      return (
                        <button
                          key={profile.id}
                          onClick={() => setSensitivityProfile(profile.id)}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all',
                            selected
                              ? 'border-primary bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary))]'
                              : 'border-border bg-card hover:bg-background-subtle',
                          )}
                        >
                          <div
                            className={cn(
                              'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                              selected ? 'border-primary bg-primary' : 'border-border',
                            )}
                          >
                            {selected && <Check className="h-3 w-3 text-primary-foreground" />}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-foreground">{profile.label}</p>
                            <p className="text-[10px] text-muted-foreground">{profile.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer nav */}
        <div className="flex items-center justify-between border-t border-border bg-card px-6 py-3">
          <button
            onClick={() => (step === 0 ? close() : setStep(step - 1))}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {step === 0 ? 'Cancel' : 'Back'}
          </button>
          <div className="flex items-center gap-2">
            {step < 3 && (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover disabled:opacity-50"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
            {step === 3 && (
              <button
                onClick={handleFinish}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-success px-4 text-sm font-semibold text-success-foreground shadow-sm transition-colors hover:bg-success/90"
              >
                <Check className="h-4 w-4" />
                Finish & Connect
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}
