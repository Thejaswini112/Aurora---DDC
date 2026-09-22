import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Policy, Repository } from "@/types";

export interface CreatePolicyPayload {
  name: string;
  description: string;
  framework: string;
  type: string;
  severity: string;
  owner: string;
  repositoryIds: string[];
}

interface CreatePolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repositories: Repository[];
  onCreate: (payload: CreatePolicyPayload) => void;
  editingPolicy?: Policy | null;
  onUpdate?: (policyId: string, payload: CreatePolicyPayload) => void;
}

export function CreatePolicyDialog({
  open,
  onOpenChange,
  repositories,
  onCreate,
  editingPolicy,
  onUpdate,
}: CreatePolicyDialogProps) {
  const isEditing = Boolean(editingPolicy);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [framework, setFramework] = useState("");
  const [type, setType] = useState("");
  const [severity, setSeverity] = useState("");
  const [owner, setOwner] = useState("");
  const [selectedRepositoryIds, setSelectedRepositoryIds] = useState<string[]>(
    []
  );
  const [repositorySearch, setRepositorySearch] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryLabels: Record<string, string> = {
    "data-classification": "Data Classification",
    "access-governance": "Access Governance",
    retention: "Retention",
    encryption: "Encryption",
    dlp: "DLP",
    residency: "Data Residency",
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    if (editingPolicy) {
      setName(editingPolicy.name);
      setDescription(editingPolicy.description);
      setFramework(editingPolicy.framework);
      setType(editingPolicy.type);
      setSeverity(editingPolicy.severity);
      setOwner(editingPolicy.owner);
      setSelectedRepositoryIds(editingPolicy.repositoryIds ?? []);
    } else {
      setName("");
      setDescription("");
      setFramework("");
      setType("");
      setSeverity("");
      setOwner("");
      setSelectedRepositoryIds([]);
    }

    setRepositorySearch("");
    setErrors({});
  }, [open, editingPolicy]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setFramework("");
    setType("");
    setSeverity("");
    setOwner("");
    setSelectedRepositoryIds([]);
    setRepositorySearch("");
    setErrors({});
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) {
      nextErrors.name = "Policy name is required.";
    }

    if (!description.trim()) {
      nextErrors.description = "Description is required.";
    }

    if (!framework) {
      nextErrors.framework = "Select a compliance framework.";
    }

    if (!type) {
      nextErrors.type = "Select a policy type.";
    }

    if (!severity) {
      nextErrors.severity = "Select a severity.";
    }

    if (!owner.trim()) {
      nextErrors.owner = "Owner is required.";
    }

    if (!isEditing && selectedRepositoryIds.length === 0) {
      nextErrors.repositories = "Select at least one repository.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    const payload: CreatePolicyPayload = {
      name: name.trim(),
      description: description.trim(),
      framework,
      type,
      severity,
      owner: owner.trim(),
      repositoryIds: selectedRepositoryIds,
    };

    if (editingPolicy && onUpdate) {
      onUpdate(editingPolicy.id, payload);
    } else {
      onCreate(payload);
    }

    resetForm();
    onOpenChange(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
    }

    onOpenChange(nextOpen);
  };

  const filteredRepositories = useMemo(() => {
    const query = repositorySearch.trim().toLowerCase();

    return repositories.filter((repository) =>
      repository.name.toLowerCase().includes(query)
    );
  }, [repositories, repositorySearch]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Policy" : "Create Policy"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Update the policy configuration and repository scope."
              : "Define a governance policy that can be reviewed, enforced, and monitored across your repositories."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="policy-name">Policy name</Label>

            <Input
              id="policy-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Customer PII Encryption"
            />

            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="policy-description">Description</Label>

            <Textarea
              id="policy-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what this policy requires and what it is intended to protect."
              rows={4}
            />

            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Framework</Label>

              <Select value={framework} onValueChange={setFramework}>
                <SelectTrigger>
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="PCI-DSS">PCI-DSS</SelectItem>
                  <SelectItem value="GDPR">GDPR</SelectItem>
                  <SelectItem value="SOC 2">SOC 2</SelectItem>
                  <SelectItem value="ISO 27001">ISO 27001</SelectItem>
                </SelectContent>
              </Select>

              {errors.framework && (
                <p className="text-sm text-destructive">
                  {errors.framework}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Policy type</Label>

              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select policy type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="data-classification">
                    Data Classification
                  </SelectItem>

                  <SelectItem value="access-governance">
                    Access Governance
                  </SelectItem>

                  <SelectItem value="retention">Retention</SelectItem>

                  <SelectItem value="encryption">Encryption</SelectItem>

                  <SelectItem value="dlp">DLP</SelectItem>

                  <SelectItem value="residency">
                    Data Residency
                  </SelectItem>
                </SelectContent>
              </Select>

              {errors.type && (
                <p className="text-sm text-destructive">{errors.type}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Severity</Label>

              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              {errors.severity && (
                <p className="text-sm text-destructive">
                  {errors.severity}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="policy-owner">Owner</Label>

              <Input
                id="policy-owner"
                value={owner}
                onChange={(event) => setOwner(event.target.value)}
                placeholder="e.g. Sarah Johnson"
              />

              {errors.owner && (
                <p className="text-sm text-destructive">{errors.owner}</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label>Repository scope</Label>

              <p className="mt-1 text-xs text-muted-foreground">
                {isEditing
                  ? "Update the repositories this policy should apply to."
                  : "Select the repositories this policy should apply to."}
              </p>
            </div>

            <div className="space-y-3 rounded-md border p-3">
              <Input
                placeholder="Search repositories..."
                value={repositorySearch}
                onChange={(event) =>
                  setRepositorySearch(event.target.value)
                }
              />

              <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
                {filteredRepositories.map((repository) => {
                  const selected = selectedRepositoryIds.includes(
                    repository.id
                  );

                  return (
                    <label
                      key={repository.id}
                      className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-muted/50"
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={(event) => {
                          setSelectedRepositoryIds((currentIds) =>
                            event.target.checked
                              ? [...currentIds, repository.id]
                              : currentIds.filter(
                                  (id) => id !== repository.id
                                )
                          );
                        }}
                        className="h-4 w-4"
                      />

                      <div className="min-w-0">
                        <p className="text-sm font-medium">
                          {repository.name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {repository.type} · {repository.environment}
                        </p>
                      </div>
                    </label>
                  );
                })}

                {filteredRepositories.length === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No repositories found.
                  </p>
                )}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              {selectedRepositoryIds.length}{" "}
              {selectedRepositoryIds.length === 1
                ? "repository"
                : "repositories"}{" "}
              selected
            </p>

            {errors.repositories && (
              <p className="text-sm text-destructive">
                {errors.repositories}
              </p>
            )}

            {isEditing &&
              selectedRepositoryIds.length === 0 &&
              editingPolicy && (
                <p className="text-xs text-muted-foreground">
                  This policy uses an existing repository count without stored
                  repository IDs. Save without selecting repositories to keep
                  the existing scope count.
                </p>
              )}
          </div>

          {isEditing && (
            <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
              Policy ID: {editingPolicy?.id}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>

          <Button type="button" onClick={handleSubmit}>
            {isEditing ? "Save Changes" : "Create Policy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}