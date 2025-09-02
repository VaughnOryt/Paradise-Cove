

import React from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AppDataProvider, useAppData } from './contexts/AppDataContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import UserView from './components/UserView';
import AccommodationsPage from './components/AccommodationsPage';
import DiningPage from './components/DiningPage';
import GalleryPage from './components/GalleryPage';
import OffersPage from './components/OffersPage';
import EventsPage from './components/EventsPage';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageBookings from './components/admin/ManageBookings';
import ManageHomePage from './components/admin/ManageHomePage';
import ManageAccommodations from './components/admin/ManageAccommodations';
import ManageDining from './components/admin/ManageDining';
import ManageOffers from './components/admin/ManageOffers';
import ManageGallery from './components/admin/ManageGallery';
import ManageEvents from './components/admin/ManageEvents';
import ManageAmenities from './components/admin/ManageAmenities';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <main key={location.pathname} className="flex-grow page-transition">
      <Routes>
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        >
          <Route index element={<Navigate to="bookings" replace />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="home" element={<ManageHomePage />} />
          <Route path="amenities" element={<ManageAmenities />} />
          <Route path="accommodations" element={<ManageAccommodations />} />
          <Route path="dining" element={<ManageDining />} />
          <Route path="offers" element={<ManageOffers />} />
          <Route path="gallery" element={<ManageGallery />} />
          <Route path="events" element={<ManageEvents />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/accommodations" element={<AccommodationsPage />} />
        <Route path="/dining" element={<DiningPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/" element={<UserView />} />
      </Routes>
    </main>
  );
};

const AppContent: React.FC = () => {
  const { isLoading } = useAppData();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <AnimatedRoutes />
        <Footer />
      </div>
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppDataProvider>
            <AppContent />
        </AppDataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;