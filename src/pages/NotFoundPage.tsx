import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { PageContainer, SecondaryButton } from '@/components/common';

export function NotFoundPage() {
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 -z-10 rounded-full bg-primary/5 blur-3xl" />
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card shadow-card">
            <Compass className="h-9 w-9 text-primary/70" strokeWidth={1.5} />
          </div>
        </div>
        <p className="text-5xl font-semibold tracking-tight text-foreground">404</p>
        <h1 className="mt-3 text-xl font-semibold text-foreground">Page not found</h1>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div className="mt-6">
          <Link to="/overview">
            <SecondaryButton>
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Overview
            </SecondaryButton>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
