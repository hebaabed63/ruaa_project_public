import React, { Suspense } from 'react';
import { BrowserRouter as Router, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { useTheme } from './hooks/useTheme';
import { AuthContext } from './contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ErrorFallback from './components/ui/ErrorFallback';

// Lazy load pages
const Login = React.lazy(() => import('./pages/auth/Login'));
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

// Public route wrapper
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = React.useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/admin';
    return <Navigate to={from} replace />;
  }

  return children;
};

function App() {
  const { theme } = useTheme();

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <div className={theme} dir="rtl">
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              className: 'font-sans',
              duration: 5000,
              style: {
                background: theme === 'dark' ? '#1f2937' : '#fff',
                color: theme === 'dark' ? '#fff' : '#111827',
                border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              },
            }}
          />
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
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;