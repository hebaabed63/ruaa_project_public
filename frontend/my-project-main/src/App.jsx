import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useTheme } from './hooks/useTheme';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from 'react-error-boundary';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ErrorFallback from './components/ui/ErrorFallback';
import ToastProvider from './components/ui/ToastProvider';
import AppRoutes from './routes/AppRoutes';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const { theme } = useTheme();

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <div className={theme} dir="rtl">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense
                fallback={
                  <div className="flex items-center justify-center min-h-screen">
                    <LoadingSpinner size="xl" />
                  </div>
                }
              >
                <Router>
                  <AppRoutes />
                </Router>
              </Suspense>
            </ErrorBoundary>
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
          </div>
        </ToastProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
