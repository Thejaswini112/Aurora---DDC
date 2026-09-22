import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
  } from '@/components/ui/sheet';
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import type { Policy } from '@/types';
  
  interface PolicyDetailsDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    policy: Policy | null;
    onStatusChange: (policyId: string, status: Policy["status"]) => void;
  }
  
  export function PolicyDetailsDrawer({
    open,
    onOpenChange,
    policy,
    onStatusChange,
  }: PolicyDetailsDrawerProps) {
    if (!policy) {
      return null;
    }
  
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{policy.name}</SheetTitle>
            <SheetDescription>{policy.id}</SheetDescription>
          </SheetHeader>
  
          <div className="mt-6 space-y-6">
            <div>
              <p className="text-sm font-medium">Description</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {policy.description}
              </p>
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Framework</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {policy.framework}
                </p>
              </div>
  
              <div>
                <p className="text-sm font-medium">Type</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {policy.type}
                </p>
              </div>
  
              <div>
                <p className="text-sm font-medium">Severity</p>
                <Badge variant="outline" className="mt-1">
                  {policy.severity}
                </Badge>
              </div>
  
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge variant="outline" className="mt-1">
                  {policy.status}
                </Badge>
              </div>
  
              <div>
                <p className="text-sm font-medium">Repository Scope</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {policy.repositories} repositories
                </p>
              </div>
  
              <div>
                <p className="text-sm font-medium">Violations</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {policy.violations}
                </p>
              </div>
            </div>
  
            <div>
              <p className="text-sm font-medium">Owner</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {policy.owner}
              </p>
            </div>
  
            <div>
              <p className="text-sm font-medium">Last Updated</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {new Date(policy.lastUpdated).toLocaleString()}
              </p>
            </div>
            <div className="border-t pt-6">
  {policy.status === "enforced" && (
    <Button
      variant="outline"
      onClick={() => onStatusChange(policy.id, "paused")}
    >
      Pause Policy
    </Button>
  )}

  {policy.status === "paused" && (
    <Button
      onClick={() => onStatusChange(policy.id, "enforced")}
    >
      Enforce Policy
    </Button>
  )}

  {policy.status === "draft" && (
    <Button
      onClick={() => onStatusChange(policy.id, "enforced")}
    >
      Enforce Policy
    </Button>
  )}
</div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }