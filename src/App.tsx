import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute, PublicRoute } from '@/components/RouteGuards';
import { LoginPage } from '@/pages/LoginPage';
import { OverviewPage } from '@/pages/OverviewPage';
import { DetectionsPage } from '@/pages/DetectionsPage';
import { DataSourcesPage } from '@/pages/DataSourcesPage';
import { ScanManagementPage } from '@/pages/ScanManagementPage';
import { PoliciesPage } from '@/pages/PoliciesPage';
import { InsightsPage } from '@/pages/InsightsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { HelpPage } from '@/pages/HelpPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { Toaster } from '@/components/ui/sonner';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
  },
});

export default function App() {
  return (
    <ThemeProvider>
      <Toaster />

      <AuthProvider>
        <NotificationsProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Routes>
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  }
                />

                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/overview" element={<OverviewPage />} />
                  <Route path="/detections" element={<DetectionsPage />} />
                  <Route path="/data-sources" element={<DataSourcesPage />} />
                  <Route path="/scan-management" element={<ScanManagementPage />} />
                  <Route path="/policies" element={<PoliciesPage />} />
                  <Route path="/insights" element={<InsightsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/help" element={<HelpPage />} />
                  <Route path="/" element={<Navigate to="/overview" replace />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </QueryClientProvider>
        </NotificationsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

