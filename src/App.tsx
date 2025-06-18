// src/App.tsx
import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route, useLocation } from 'react-router-dom';
import RegisterPage from './pages/register';
import LoginPage from './pages/login';
import Footer from './components/Footer';
import ContactUs from './pages/contact-us';
import VerifyOtpPage from './pages/verifyotp';
import ForgotPasswordPage from './pages/forgotpassword';
import DriverDashboard from './pages/driverdashboard';
import BusinessOwnerDashboard from './pages/businessdashboard';
import ManageDriversPage from './pages/managedrivers';
import AdminDashboard from './pages/admindashboard';
import { useEffect, useState } from 'react';
import RegisterBusinessPage from './pages/businessregistration';

function App() {
  const location = useLocation();
  const [storedRole, setStoredRole] = useState<'business_owner' | 'driver' | null>(null);

  useEffect(() => {
    const rawRole = localStorage.getItem('role');
    if (rawRole === 'business_owner' || rawRole === 'driver') {
      setStoredRole(rawRole);
    } else {
      setStoredRole(null);
    }
  }, [location.pathname]);

  const hideNavbarRoutes = ['/driverdashboard', '/businessdashboard', '/manage-drivers', '/business-registration'];
  const showSidebarRoutes = ['/driverdashboard', '/businessdashboard', '/manage-drivers', '/business-registration'];

  const showNavbar = !hideNavbarRoutes.some(route => location.pathname.startsWith(route));
  const showSidebar = showSidebarRoutes.some(route => location.pathname.startsWith(route)) && storedRole !== null;
  const showFooter = !hideNavbarRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {showNavbar && <Navbar />}

      <div className="flex flex-1 pt-20">
        {showSidebar && storedRole && <Sidebar role={storedRole} />}

        <main className={`flex-1 px-4 py-6 transition-all duration-300 ${showSidebar ? 'ml-0 md:ml-64' : ''}`}>
          <Routes>
            <Route
              path="/"
              element={
                <div className="flex items-center justify-center">
                  <img
                    src="/images/Delivery.png"
                    alt="Banner"
                    className="w-full h-auto object-contain max-w-5xl"
                  />
                </div>
              }
            />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<VerifyOtpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/driverdashboard" element={<DriverDashboard />} />
            <Route path="/businessdashboard" element={<BusinessOwnerDashboard />} />
            <Route path="/manage-drivers" element={<ManageDriversPage />} />
            <Route path="/business-registration" element={<RegisterBusinessPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>

      {showFooter && <Footer />}
    </div>
  );
}

export default App;
