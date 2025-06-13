import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route, useLocation } from 'react-router-dom';
import RegisterPage from './pages/register';
import LoginPage from './pages/login';
import Footer from './components/Footer';
import ContactUs from './pages/contact-us';
import VerifyOtpPage from './pages/verifyotp';
import LandingPage from './pages/landingpage';
import DriverDashboard from './pages/driverdashboard';
import BusinessOwnerDashboard from './pages/businessdashboard';
import { useEffect, useState } from 'react';

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

  const hideNavbarRoutes = ['/driverdashboard', '/businessdashboard'];
  const showSidebarRoutes = ['/driverdashboard', '/businessdashboard'];

  const showNavbar = !hideNavbarRoutes.some(route => location.pathname.startsWith(route));
  const showSidebar = showSidebarRoutes.some(route => location.pathname.startsWith(route)) 
    && storedRole !== null;
  const showFooter = !hideNavbarRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      {showSidebar && storedRole && <Sidebar role={storedRole as 'business_owner' | 'driver'} />}

      <main className={`flex-1 p-0 m-0 ${showSidebar ? 'ml-0 md:ml-64' : ''}`}>
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex items-center justify-between gap-8">
                <div className="w-full">
                  <img
                    src="/images/Delivery.png"
                    alt="Banner"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            }
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/driverdashboard" element={<DriverDashboard />} />
          <Route path="/businessdashboard" element={<BusinessOwnerDashboard />} />
        </Routes>
      </main>

      {showFooter && <Footer />}
    </div>
  );
}

export default App;
