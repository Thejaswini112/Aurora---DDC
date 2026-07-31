import { NavLink, useLocation } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { navItems } from '@/utils/navigation';
import { Logo } from './Logo';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { UserProfile } from './UserProfile';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-sidebar-border bg-sidebar shadow-sidebar">
      <div className="flex h-16 shrink-0 items-center px-4">
        <Logo />
      </div>

      <div className="px-3">
        <WorkspaceSwitcher />
      </div>

      <nav className="mt-5 flex-1 space-y-0.5 overflow-y-auto px-3 scrollbar-thin">
        <p className="px-2.5 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted-foreground">
          Navigation
        </p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive: navActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors',
                  navActive || isActive
                    ? 'bg-primary/15 text-sidebar-foreground'
                    : 'text-sidebar-muted-foreground hover:bg-sidebar-muted/60 hover:text-sidebar-foreground',
                )
              }
            >
              {({ isActive: navActive }) => (
                <>
                  <item.icon
                    className={cn(
                      'h-4 w-4 shrink-0 transition-colors',
                      navActive || isActive ? 'text-primary' : 'text-sidebar-muted-foreground group-hover:text-sidebar-foreground',
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                  {(navActive || isActive) && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-3 py-3">
        <NavLink
          to="/help"
          className={({ isActive }) =>
            cn(
              'group flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors',
              isActive
                ? 'bg-primary/15 text-sidebar-foreground'
                : 'text-sidebar-muted-foreground hover:bg-sidebar-muted/60 hover:text-sidebar-foreground',
            )
          }
        >
          <HelpCircle className="h-4 w-4 text-sidebar-muted-foreground group-hover:text-sidebar-foreground" />
          Help & Documentation
        </NavLink>
        <div className="mt-2">
          <UserProfile />
        </div>
      </div>
    </aside>
  );
}
