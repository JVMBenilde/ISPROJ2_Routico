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

function App() {
  const location = useLocation();

  const storedRole = localStorage.getItem('role') as 'business_owner' | 'driver' | null;
  const hideNavbarRoutes = ['/driver', '/business-owner'];
  const showSidebarRoutes = ['/driver', '/business-owner'];

  const showNavbar = !hideNavbarRoutes.includes(location.pathname);
  const showSidebar = showSidebarRoutes.includes(location.pathname) && (storedRole === 'driver' || storedRole === 'business_owner');
  const showFooter = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      {showSidebar && storedRole && <Sidebar role={storedRole} />}

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
          <Route path="/driver" element={<DriverDashboard />} />
          <Route path="/business-owner" element={<BusinessOwnerDashboard />} />
        </Routes>
      </main>

      {showFooter && <Footer />}
    </div>
  );
}

export default App;