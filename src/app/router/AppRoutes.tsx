import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/features/auth';

// Pages
import {
  Home,
  Reservation,
  Confirmation,
  Completion,
  Cancel,
  Return,
} from '@/features/reservation/pages';
import Admin from '@/features/admin/pages/Admin';
import NotFound from '@/features/common/pages/NotFound';
import { PageLayout } from '../layout/PageLayout';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          <PageLayout>
            <Home />
          </PageLayout>
        }
      />
      <Route
        path="/reserve"
        element={
          <PageLayout>
            <Reservation />
          </PageLayout>
        }
      />
      <Route
        path="/reserve/confirmation"
        element={
          <PageLayout>
            <Confirmation />
          </PageLayout>
        }
      />
      <Route
        path="complete/:token"
        element={
          <PageLayout>
            <Completion />
          </PageLayout>
        }
      />
      <Route
        path="cancel/:token"
        element={
          <PageLayout>
            <Cancel />
          </PageLayout>
        }
      />
      <Route
        path="return/:token"
        element={
          <PageLayout>
            <Return />
          </PageLayout>
        }
      />

      {/* Protected route */}
      <Route
        path="admin"
        element={
          <ProtectedRoute>
            <PageLayout>
              <Admin />
            </PageLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 Not Found - Catch all other routes */}
      <Route
        path="*"
        element={
          <PageLayout>
            <NotFound />
          </PageLayout>
        }
      />
    </Routes>
  );
}
