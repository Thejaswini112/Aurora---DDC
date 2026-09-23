import { useMemo, useState } from "react";
import { Loader2, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { repositories } from "@/mock-data";
import type { Scan } from "@/types";

interface CreateScanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (scan: Scan) => void;
}

export function CreateScanDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateScanDialogProps) {
  const [name, setName] = useState("");
  const [repositoryId, setRepositoryId] = useState("");
  const [type, setType] = useState<Scan["type"]>("full");
  const [isCreating, setIsCreating] = useState(false);

  const selectedRepository = useMemo(
    () => repositories.find((repository) => repository.id === repositoryId),
    [repositoryId],
  );

  const canCreate =
    name.trim().length > 0 && Boolean(selectedRepository);

  const resetForm = () => {
    setName("");
    setRepositoryId("");
    setType("full");
    setIsCreating(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
    }

    onOpenChange(nextOpen);
  };

  const handleCreate = () => {
    if (!canCreate || !selectedRepository) return;

    setIsCreating(true);

    const newScan: Scan = {
      id: `SCAN-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      repositoryId: selectedRepository.id,
      repositoryName: selectedRepository.name,
      type,
      status: "scheduled",
      progress: 0,
      startedAt: "Not started",
      lastRun: "Never",
      duration: "—",
      estimatedCompletion: "Pending",
      assetsScanned: 0,
      sensitiveFound: 0,
      triggeredBy: "You",
    };

    onCreate(newScan);
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Scan</DialogTitle>
          <DialogDescription>
            Configure a new discovery scan for a connected repository.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label htmlFor="scan-name">Scan name</Label>
            <Input
              id="scan-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Quarterly PII sweep"
            />
          </div>

          <div className="space-y-2">
            <Label>Repository</Label>
            <Select
              value={repositoryId}
              onValueChange={setRepositoryId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a repository" />
              </SelectTrigger>

              <SelectContent>
                {repositories.map((repository) => (
                  <SelectItem
                    key={repository.id}
                    value={repository.id}
                  >
                    {repository.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Scan type</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as Scan["type"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="full">Full discovery</SelectItem>
                <SelectItem value="incremental">
                  Incremental
                </SelectItem>
                <SelectItem value="scheduled">
                  Scheduled
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedRepository && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm font-medium">
                {selectedRepository.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {selectedRepository.type} ·{" "}
                {selectedRepository.environment}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>

          <Button
            onClick={handleCreate}
            disabled={!canCreate || isCreating}
          >
            {isCreating && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <Plus className="mr-2 h-4 w-4" />
            Create Scan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}