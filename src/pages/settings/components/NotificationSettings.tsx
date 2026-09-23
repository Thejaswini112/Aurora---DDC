import { Bell, ShieldAlert, Radar, ScrollText, Settings2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useNotifications, type NotificationCategory } from '@/contexts/NotificationsContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface NotificationOption {
  category: NotificationCategory;
  title: string;
  description: string;
  icon: typeof Bell;
}

const notificationOptions: NotificationOption[] = [
  {
    category: 'detection',
    title: 'Security alerts',
    description: 'Get notified about critical and high-risk security findings.',
    icon: ShieldAlert,
  },
  {
    category: 'scan',
    title: 'Scan activity',
    description: 'Get updates when scans start, complete, or encounter issues.',
    icon: Radar,
  },
  {
    category: 'policy',
    title: 'Policy changes',
    description: 'Get notified when policies are created or updated.',
    icon: ScrollText,
  },
  {
    category: 'system',
    title: 'System updates',
    description: 'Get important workspace and system activity updates.',
    icon: Settings2,
  },
];

export default function NotificationSettings() {
  const { workspace } = useAuth();
  const { preferences, updatePreference } = useNotifications();

  const handleChange = (
    category: NotificationCategory,
    enabled: boolean,
  ) => {
    updatePreference(category, enabled);

    const option = notificationOptions.find(
      (item) => item.category === category,
    );

    toast.success(
      `${option?.title ?? 'Notification preference'} ${enabled ? 'enabled' : 'disabled'}`,
      {
        description: `Updated for ${workspace.name}.`,
      },
    );
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background-subtle">
          <Bell className="h-4 w-4 text-muted-foreground" />
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">
            Notification Settings
          </h2>
          <p className="text-sm text-muted-foreground">
            Choose which notifications you want to receive for this workspace.
          </p>
        </div>
      </div>

      <div className="divide-y divide-border rounded-xl border border-border bg-card">
        {notificationOptions.map((option) => {
          const Icon = option.icon;

          return (
            <div
              key={option.category}
              className="flex items-center justify-between gap-6 p-4"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background-subtle">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {option.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>

              <Switch
                checked={preferences[option.category]}
                onCheckedChange={(enabled) =>
                  handleChange(option.category, enabled)
                }
                aria-label={`Toggle ${option.title}`}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}