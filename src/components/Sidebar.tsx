import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Swal from 'sweetalert2';

const Sidebar = ({ role }: { role: 'business_owner' | 'driver' | 'admin' | 'super_admin' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);

  const linkStyle = (path: string) =>
    `block px-4 py-2 rounded-md text-sm font-medium ${
      location.pathname === path ? 'bg-gray-300 text-black' : 'text-black hover:text-gray-600'
    }`;

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Logout',
    });

    if (result.isConfirmed) {
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 bg-gray-200 text-black p-2 rounded-md md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle Sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={
              menuOpen
                ? 'M6 18L18 6M6 6l12 12'
                : 'M4 6h16M4 12h16M4 18h16'
            }
          />
        </svg>
      </button>

      <aside className={`bg-gray-200 text-black fixed top-0 left-0 h-screen border-r border-gray-300 p-4 transition-transform duration-300 transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:w-64 w-64 z-40 flex flex-col justify-between`}>
        <div>
          <h2 className="text-xl font-bold mb-6">
            {role === 'business_owner' ? 'Business Owner' : role === 'driver' ? 'Driver' : role === 'admin' ? 'Admin' : 'Super Admin'} Panel
          </h2>
          <nav className="space-y-2">
            {role === 'business_owner' && (
              <>
                <Link to="/businessdashboard" className={linkStyle('/businessdashboard')}>Dashboard</Link>
                <Link to="/business-registration" className={linkStyle('/business-registration')}>Business Registration</Link>
                <button
                  className="w-full text-center px-4 py-2  text-sm font-medium text-black hover:text-gray-600"
                  onClick={() => setOrderOpen((prev) => !prev)}
                >
                  Order
                </button>
                {orderOpen && (
                  <div className="ml-4 space-y-1">
                    <Link to="/create-order" className={linkStyle('/create-order')}>Create Order</Link>
                    <Link to="/order-history" className={linkStyle('/order-history')}>Order History</Link>
                  </div>
                )}
                <Link to="/manage-drivers" className={linkStyle('/manage-drivers')}>Manage Drivers</Link>
                <Link to="/truck-utilization" className={linkStyle('/truck-utilization')}>Truck Utilization</Link>
                <Link to="/route-optimization" className={linkStyle('/route-optimization')}>Route Optimization</Link>
                <Link to="/business-overview" className={linkStyle('/business-overview')}>Business Overview</Link>
                <Link to="/fleet-management" className={linkStyle('/fleet-management')}>Fleet Management</Link>
                <Link to="/issue-report" className={linkStyle('/issue-report')}>Issue Report</Link>
              </>
            )}
            {role === 'driver' && (
              <>
                <Link to="/driverdashboard" className={linkStyle('/driverdashboard')}>Driver Dashboard</Link>
                <Link to="/assigned-orders" className={linkStyle('/assigned-orders')}>Assigned Orders</Link>
                <Link to="/delivery-status" className={linkStyle('/delivery-status')}>Delivery Status</Link>
              </>
            )}
            {role === 'admin' && (
              <>
                <Link to="/dashboard" className={linkStyle('/dashboard')}>Dashboard</Link>
                <Link to="/admindashboard" className={linkStyle('/admindashboard')}>Dashboard</Link>
                <Link to="/activity-logs" className={linkStyle('/activity-logs')}>Activity Logs</Link>
              </>
            )}
            {role === 'super_admin' && (
              <>
                <Link to="/dashboard" className={linkStyle('/dashboard')}>Dashboard</Link>
                <Link to="/view-registrations" className={linkStyle('/view-registrations')}>Business Registrations</Link>
                <Link to="/issue-resolution" className={linkStyle('/issue-resolution')}>Issue Resolution</Link>
                <Link to="/accounts" className={linkStyle('/accounts')}>Account Management</Link>
              </>
            )}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-white text-black py-2 rounded-md text-sm"
        >
          Logout
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
