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
import DriverDashboard from './pages/driver/driverdashboard';
import BusinessOwnerDashboard from './pages/business-owner/businessdashboard';
import ManageDriversPage from './pages/business-owner/managedrivers';
import { useEffect, useState } from 'react';
import RegisterBusinessPage from './pages/business-owner/businessregistration';
import Dashboard from './pages/admin/dashboard';
import ViewRegistrationsPage from './pages/admin/viewregistrations';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/termsandconditions';
import AboutUs from './pages/AboutUs';
import Partner from './pages/Partner';
import ManageVehiclesPage from './pages/business-owner/fleetmanagement';
import AccountManagementPage from './pages/admin/accountmanagement';
import BusinessIssueReportPage from './pages/business-owner/issuereport';
import IssueResolutionPage from './pages/admin/issueresolution';
import CreateOrderPage from './pages/business-owner/createorder';

function App() {
  const location = useLocation();
  const [storedRole, setStoredRole] = useState<'business_owner' | 'driver' | 'admin' | 'super_admin' | null>(null);

  useEffect(() => {
    const rawRole = localStorage.getItem('role');
    if (rawRole === 'business_owner' || rawRole === 'driver'|| rawRole === 'admin'|| rawRole === 'super_admin') {
      setStoredRole(rawRole);
    } else {
      setStoredRole(null);
    }
  }, [location.pathname]);

  const hideNavbarRoutes = ['/driverdashboard', '/businessdashboard', '/manage-drivers', '/business-registration', '/dashboard', '/view-registrations', '/fleet-management', '/accounts', '/issue-resolution', '/issue-report', '/create-order'];
  const showSidebarRoutes = ['/driverdashboard', '/businessdashboard', '/manage-drivers', '/business-registration', '/dashboard', '/view-registrations', '/fleet-management', '/accounts', '/issue-resolution', '/issue-report', '/create-order'];

  const showNavbar = !hideNavbarRoutes.some(route => location.pathname.startsWith(route));
  const showSidebar = showSidebarRoutes.some(route => location.pathname.startsWith(route)) && storedRole !== null;
  const showFooter = !hideNavbarRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {showNavbar && <Navbar />}

      <div className={`flex flex-1 ${location.pathname === '/' ? 'p-0 m-0' : 'pt-20'}`}>
        {showSidebar && storedRole && <Sidebar role={storedRole} />}

        {location.pathname === '/' ? (
          <div className="w-full h-screen">
            <img
              src="/images/Delivery.png"
              alt="Banner"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <main
            className={`flex-1 px-4 py-6 transition-all duration-300 ${
              showSidebar ? 'ml-0 md:ml-64' : ''
            }`}
          >
            <Routes>
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-otp" element={<VerifyOtpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/driverdashboard" element={<DriverDashboard />} />
              <Route path="/businessdashboard" element={<BusinessOwnerDashboard />} />
              <Route path="/manage-drivers" element={<ManageDriversPage />} />
              <Route path="/business-registration" element={<RegisterBusinessPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/view-registrations" element={<ViewRegistrationsPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />More actions
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/partner" element={<Partner />} />
              <Route path="/fleet-management" element={<ManageVehiclesPage />} />
              <Route path="/accounts" element={<AccountManagementPage />} />
              <Route path="/issue-report" element={<BusinessIssueReportPage />} />
              <Route path="/issue-resolution" element={<IssueResolutionPage />} />
              <Route path="/create-order" element={<CreateOrderPage />} />
            </Routes>
          </main>
        )}
      </div>

      {showFooter && <Footer />}
    </div>
  );
}

export default App;
