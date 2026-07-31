import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Command } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { navItems } from '@/utils/navigation';
import { NotificationsMenu } from './NotificationsMenu';
import { UserProfile } from './UserProfile';
import { cn } from '@/lib/utils';

const commandPaletteRoutes = [
  ...navItems.map((n) => ({ label: n.label, to: n.to, icon: n.icon })),
];

export function TopNav() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const currentNav = navItems.find((n) => location.pathname.startsWith(n.to));
  const pageTitle = currentNav?.label ?? 'Overview';

  const filtered = query
    ? commandPaletteRoutes.filter((r) => r.label.toLowerCase().includes(query.toLowerCase()))
    : commandPaletteRoutes;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md lg:px-8">
      <div className="flex items-center gap-3">
        <nav className="flex items-center gap-1.5 text-sm">
          <span className="text-muted-foreground">Aurora</span>
          <span className="text-muted-foreground/40">/</span>
          <span className="font-medium text-foreground">{pageTitle}</span>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:flex"
        >
          <Search className="h-4 w-4" />
          <span>Search…</span>
          <kbd className="ml-6 inline-flex h-5 items-center gap-0.5 rounded border border-border bg-background-subtle px-1.5 text-[10px] font-medium text-muted-foreground">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>

        <button
          onClick={() => setSearchOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
          aria-label="Search"
        >
          <Search className="h-[18px] w-[18px]" />
        </button>

        <NotificationsMenu />

        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
        </button>

        <div className="ml-1">
          <UserProfile compact />
        </div>
      </div>

      {searchOpen && (
        <CommandPalette
          query={query}
          setQuery={setQuery}
          results={filtered}
          onClose={() => {
            setSearchOpen(false);
            setQuery('');
          }}
          onSelect={(to) => {
            navigate(to);
            setSearchOpen(false);
            setQuery('');
          }}
        />
      )}
    </header>
  );
}

function CommandPalette({
  query,
  setQuery,
  results,
  onClose,
  onSelect,
}: {
  query: string;
  setQuery: (v: string) => void;
  results: typeof commandPaletteRoutes;
  onClose: () => void;
  onSelect: (to: string) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[15vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, detections, repositories…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <kbd className="rounded border border-border bg-background-subtle px-1.5 py-0.5 text-[10px] text-muted-foreground">ESC</kbd>
        </div>
        <div className="max-h-[320px] overflow-y-auto scrollbar-thin p-2">
          <p className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Pages
          </p>
          {results.map((r) => (
            <button
              key={r.to}
              onClick={() => onSelect(r.to)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-background-subtle',
              )}
            >
              <r.icon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">{r.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">{r.to}</span>
            </button>
          ))}
          {results.length === 0 && (
            <p className="px-2.5 py-6 text-center text-sm text-muted-foreground">No results for "{query}"</p>
          )}
        </div>
      </div>
    </div>
  );
}
