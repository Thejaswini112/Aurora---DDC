import { formatDistanceToNow, format } from 'date-fns';

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return value.toLocaleString();
}

export function formatFull(value: number): string {
  return value.toLocaleString();
}

export function formatRelativeTime(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return iso;
  }
}

export function formatDateTime(iso: string): string {
  try {
    return format(new Date(iso), 'MMM d, yyyy · HH:mm');
  } catch {
    return iso;
  }
}

export function formatDate(iso: string): string {
  try {
    return format(new Date(iso), 'MMM d, yyyy');
  } catch {
    return iso;
  }
}

export function riskScoreColor(score: number): string {
  if (score >= 80) return 'text-danger';
  if (score >= 60) return 'text-warning';
  if (score >= 40) return 'text-primary';
  return 'text-success';
}

export function riskScoreBg(score: number): string {
  if (score >= 80) return 'bg-danger';
  if (score >= 60) return 'bg-warning';
  if (score >= 40) return 'bg-primary';
  return 'bg-success';
}
