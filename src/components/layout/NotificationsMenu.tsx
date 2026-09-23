import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  CheckCheck,
  ShieldAlert,
  Radar,
  ScrollText,
  Settings2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/contexts/NotificationsContext";
import { formatRelativeTime } from "@/utils/format";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types";

const severityDot: Record<Notification["severity"], string> = {
  critical: "bg-danger",
  high: "bg-warning",
  medium: "bg-primary",
  low: "bg-success",
  info: "bg-muted-foreground",
};

const categoryIcon = {
  detection: ShieldAlert,
  scan: Radar,
  policy: ScrollText,
  system: Settings2,
} as const;

const categoryRoute: Record<Notification["category"], string> = {
  detection: "/detections",
  scan: "/scan-management",
  policy: "/policies",
  system: "/settings",
};

export function NotificationsMenu() {
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    markAllRead,
    markRead,
  } = useNotifications();

  const handleNotificationClick = (notification: Notification) => {
    markRead(notification.id);
    navigate(categoryRoute[notification.category]);
  };

  const handleNotificationSettings = () => {
    navigate("/settings");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <DropdownMenuLabel className="p-0 text-sm font-semibold text-foreground">
            Notifications
          </DropdownMenuLabel>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary-hover"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-[360px] overflow-y-auto scrollbar-thin">
          {notifications.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              No notifications match your current settings.
            </p>
          ) : (
            notifications.map((notification) => {
              const Icon = categoryIcon[notification.category];

              return (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex items-start gap-3 px-4 py-3 focus:bg-background-subtle"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="relative mt-0.5 shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background-subtle">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>

                    {!notification.read && (
                      <span
                        className={cn(
                          "absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ring-2 ring-card",
                          severityDot[notification.severity],
                        )}
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-[13px] font-medium",
                        notification.read
                          ? "text-muted-foreground"
                          : "text-foreground",
                      )}
                    >
                      {notification.title}
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {notification.body}
                    </p>

                    <p className="mt-1 text-[11px] text-muted-foreground/70">
                      {formatRelativeTime(notification.timestamp)}
                    </p>
                  </div>
                </DropdownMenuItem>
              );
            })
          )}
        </div>

        <DropdownMenuSeparator className="m-0" />

        <DropdownMenuItem
          onClick={handleNotificationSettings}
          className="justify-center py-2.5 text-xs font-medium text-primary"
        >
          Notification settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}