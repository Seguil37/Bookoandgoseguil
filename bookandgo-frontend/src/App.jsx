// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import './App.css';

// Utils
import ScrollToTop from './shared/components/ScrollToTop';

// Layouts
import MainLayout from './shared/components/Layout/MainLayout';

// Pages
import HomePage from './features/tours/pages/HomePage';
import ToursPage from './features/tours/pages/ToursPage';
import TourDetailPage from './features/tours/pages/TourDetailPage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import CartPage from './features/booking/pages/CartPage';
import BookingPage from './features/booking/pages/BookingPage';
import CheckoutPage from './features/booking/pages/CheckoutPage';
import BookingSuccessPage from './features/booking/pages/BookingSuccessPage';
import MyBookingsPage from './features/customer/pages/MyBookingsPage';
import FavoritesPage from './features/customer/pages/FavoritesPage';
import ContactPage from './features/contact/pages/ContactPage';

// Agency Pages
import AgencyDashboard from './features/agency/pages/AgencyDashboard';
import CreateTourPage from './features/agency/pages/CreateTourPage';
import EditTourPage from './features/agency/pages/EditTourPage';
import MyToursPage from './features/agency/pages/MyToursPage';
import AgencyBookingsPage from './features/agency/pages/AgencyBookingsPage';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected Route
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Public Routes */}
            <Route index element={<HomePage />} />
            <Route path="tours" element={<ToursPage />} />
            <Route path="tours/:id" element={<TourDetailPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="contacto" element={<ContactPage />} />

            {/* Customer Routes */}
            <Route
              path="profile"
              element={
                <ProtectedRoute allowedRoles={['customer', 'agency', 'admin']}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Agency Routes */}
            <Route
              path="agency/dashboard"
              element={
                <ProtectedRoute allowedRoles={['agency']}>
                  <AgencyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="agency/tours"
              element={
                <ProtectedRoute allowedRoles={['agency']}>
                  <MyToursPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="agency/tours/create"
              element={
                <ProtectedRoute allowedRoles={['agency']}>
                  <CreateTourPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="agency/tours/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['agency']}>
                  <EditTourPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="agency/bookings"
              element={
                <ProtectedRoute allowedRoles={['agency']}>
                  <AgencyBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="booking/:id"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <BookingPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="checkout"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="booking/success"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <BookingSuccessPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="profile/bookings"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <MyBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="favorites"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
