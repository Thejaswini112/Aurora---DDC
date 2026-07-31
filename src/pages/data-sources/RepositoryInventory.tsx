import { useState, useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';
import { healthStatusForRepository } from '@/mock-data';
import { formatRelativeTime, formatFull, riskScoreColor, riskScoreBg } from '@/utils/format';
import { SearchInput } from '@/components/common';
import { cn } from '@/lib/utils';
import {
  repoTypeIcon,
  repoTypeLabel,
  healthStatusConfig,
} from './repositoryHelpers';
import type { Repository, RepositoryHealthStatus } from '@/types';

interface RepositoryInventoryProps {
  repositories: Repository[];
  onRowClick: (repo: Repository) => void;
}

type HealthFilter = 'all' | RepositoryHealthStatus;

const filterOptions: { label: string; value: HealthFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Healthy', value: 'healthy' },
  { label: 'Needs Attention', value: 'needs-attention' },
  { label: 'Scanning', value: 'scanning' },
  { label: 'Needs Scan', value: 'needs-scan' },
];

export function RepositoryInventory({ repositories, onRowClick }: RepositoryInventoryProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'riskScore', desc: true }]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [healthFilter, setHealthFilter] = useState<HealthFilter>('all');

  const data = useMemo(() => {
    return repositories.filter((repo) => {
      const health = healthStatusForRepository(repo);
      const matchesHealth = healthFilter === 'all' || health === healthFilter;
      const matchesSearch =
        !globalFilter ||
        repo.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        repo.owner.toLowerCase().includes(globalFilter.toLowerCase()) ||
        repoTypeLabel[repo.type].toLowerCase().includes(globalFilter.toLowerCase());
      return matchesHealth && matchesSearch;
    });
  }, [repositories, healthFilter, globalFilter]);

  const columns = useMemo<ColumnDef<Repository>[]>(
    () => [
      {
        id: 'name',
        header: 'Repository',
        size: 240,
        cell: ({ row }) => {
          const repo = row.original;
          const Icon = repoTypeIcon[repo.type];
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background-subtle">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{repo.name}</p>
                <p className="truncate text-xs text-muted-foreground">{repo.environment}</p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'type',
        header: 'Type',
        size: 130,
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">{repoTypeLabel[row.original.type]}</span>
        ),
      },
      {
        accessorKey: 'owner',
        header: 'Owner',
        size: 130,
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">{row.original.owner}</span>
        ),
      },
      {
        id: 'lastScanned',
        header: 'Last Scan',
        size: 120,
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">{formatRelativeTime(row.original.lastScanned)}</span>
        ),
      },
      {
        accessorKey: 'sensitiveAssets',
        header: 'Sensitive Files',
        size: 130,
        cell: ({ row }) => (
          <span className="text-sm font-medium tabular-nums text-foreground">
            {formatFull(row.original.sensitiveAssets)}
          </span>
        ),
      },
      {
        accessorKey: 'riskScore',
        header: 'Risk',
        size: 120,
        cell: ({ row }) => {
          const score = row.original.riskScore;
          return (
            <div className="flex items-center gap-2.5">
              <div className="h-1.5 w-14 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn('h-full rounded-full', riskScoreBg(score))}
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className={cn('text-sm font-semibold tabular-nums', riskScoreColor(score))}>
                {score}
              </span>
            </div>
          );
        },
      },
      {
        id: 'health',
        header: 'Health',
        size: 140,
        cell: ({ row }) => {
          const status = healthStatusForRepository(row.original);
          const config = healthStatusConfig[status];
          return (
            <span className={cn('inline-flex items-center gap-1.5 text-sm font-medium', config.classes)}>
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  config.dot,
                  status === 'scanning' && 'animate-pulse',
                )}
              />
              {config.label}
            </span>
          );
        },
      },
      {
        id: 'status',
        header: 'Status',
        size: 110,
        cell: ({ row }) => {
          const repo = row.original;
          const statusMap: Record<string, string> = {
            active: 'Active',
            scanning: 'Scanning',
            paused: 'Paused',
            completed: 'Active',
          };
          const status = statusMap[repo.status] ?? repo.status;
          const tone =
            repo.status === 'scanning'
              ? 'text-primary'
              : repo.status === 'paused'
                ? 'text-muted-foreground'
                : 'text-success';
          return (
            <span className={cn('text-sm font-medium capitalize', tone)}>{status}</span>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 6 } },
  });

  const rows = table.getRowModel().rows;
  const pageCount = table.getPageCount();

  return (
    <div className="space-y-3">
      {/* toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={globalFilter}
          onSearch={setGlobalFilter}
          placeholder="Search repositories, owners, types…"
          containerClassName="sm:max-w-xs"
        />
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin">
          {filterOptions.map((opt) => {
            const active = healthFilter === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setHealthFilter(opt.value)}
                className={cn(
                  'inline-flex shrink-0 items-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border">
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    return (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                        style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                      >
                        {header.isPlaceholder ? null : canSort ? (
                          <button
                            onClick={header.column.getToggleSortingHandler()}
                            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            <ArrowUpDown className="h-3 w-3 opacity-50" />
                          </button>
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {rows.length > 0 ? (
                  rows.map((row) => (
                    <motion.tr
                      key={row.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => onRowClick(row.original)}
                      className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-background-subtle"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3.5 text-sm text-foreground">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="px-4 py-14">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background-subtle">
                          <Inbox className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground">No repositories found</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Try adjusting your search or filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* pagination */}
        {rows.length > 0 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
            <p className="text-xs text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of {Math.max(pageCount, 1)} ·{' '}
              {rows.length} of {data.length} repositories
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
