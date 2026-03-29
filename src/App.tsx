import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { LoadingState } from './components/common/LoadingState';
import { IdleWarningDialog } from './components/common/IdleWarningDialog';

function lazyRetry<T extends React.ComponentType>(
  factory: () => Promise<{ default: T }>,
): React.LazyExoticComponent<T> {
  return lazy(() =>
    factory().catch(
      () => new Promise<{ default: T }>((resolve) => {
        setTimeout(() => resolve(factory()), 1000);
      }),
    ),
  );
}

// Auth pages
const LoginPage = lazyRetry(() => import('./pages/LoginPage'));
const SignupPage = lazyRetry(() => import('./pages/SignupPage'));

// App pages
const DashboardPage = lazyRetry(() => import('./pages/DashboardPage'));
const OnboardingPage = lazyRetry(() => import('./pages/OnboardingPage'));
const KnowledgePage = lazyRetry(() => import('./pages/KnowledgePage'));
const PhonePage = lazyRetry(() => import('./pages/PhonePage'));
const CallHistoryPage = lazyRetry(() => import('./pages/CallHistoryPage'));
const SettingsPage = lazyRetry(() => import('./pages/SettingsPage'));
const NotFoundPage = lazyRetry(() => import('./pages/NotFoundPage'));

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) { console.error('[ErrorBoundary]', error.message); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p>Please refresh the page or <a href="/login">return to login</a>.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <IdleWarningDialog />
          <ErrorBoundary>
            <Suspense fallback={<LoadingState />}>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/knowledge" element={<KnowledgePage />} />
                  <Route path="/phone" element={<PhonePage />} />
                  <Route path="/calls" element={<CallHistoryPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
