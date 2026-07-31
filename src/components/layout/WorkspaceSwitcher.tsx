import { Check, ChevronsUpDown, Building2, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { workspaces } from '@/mock-data';
import { cn } from '@/lib/utils';

export function WorkspaceSwitcher() {
  const { workspace, switchWorkspace } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group flex w-full items-center gap-2.5 rounded-lg border border-sidebar-border bg-sidebar-muted/50 p-2.5 text-left transition-colors hover:bg-sidebar-muted">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/15">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-sidebar-foreground">{workspace.name}</p>
            <p className="truncate text-[11px] text-sidebar-muted-foreground">
              {workspace.plan} · {workspace.region}
            </p>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-sidebar-muted-foreground transition-colors group-hover:text-sidebar-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" className="w-[260px]">
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Workspaces
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces.map((ws) => (
          <DropdownMenuItem
            key={ws.id}
            onClick={() => switchWorkspace(ws)}
            className="flex items-start gap-2.5 py-2"
          >
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <Building2 className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-foreground">{ws.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                {ws.plan} · {ws.region}
              </p>
            </div>
            {ws.id === workspace.id && <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className={cn('text-muted-foreground')}>
          <Plus className="mr-2 h-4 w-4" />
          Connect a workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
