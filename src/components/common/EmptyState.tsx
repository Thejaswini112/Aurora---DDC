import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('flex flex-col items-center justify-center px-6 py-16 text-center', className)}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 -z-10 rounded-full bg-primary/5 blur-2xl" />
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-gradient-to-b from-background-subtle to-card shadow-card">
          <Icon className="h-9 w-9 text-primary/70" strokeWidth={1.5} />
        </div>
        <div className="absolute -right-1 -top-1 h-5 w-5 rounded-full border-2 border-card bg-primary/10" />
        <div className="absolute -bottom-2 -left-2 h-4 w-4 rounded-full border-2 border-card bg-primary/5" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
