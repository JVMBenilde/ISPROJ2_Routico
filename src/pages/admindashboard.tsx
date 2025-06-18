import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">👑 Admin Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Welcome, Admin! From here, you can manage users, oversee operations, and monitor activity within the Routico system.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-blue-700">User Management</h2>
            <p className="text-sm text-blue-600 mt-2">View, verify, and disable user accounts.</p>
          </div>

          <div className="p-6 bg-green-50 border border-green-200 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-green-700">System Logs</h2>
            <p className="text-sm text-green-600 mt-2">Access logs of activity and updates across the system.</p>
          </div>

          <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-yellow-700">Reports</h2>
            <p className="text-sm text-yellow-600 mt-2">Generate and download operational reports.</p>
          </div>

          <div className="p-6 bg-red-50 border border-red-200 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-red-700">Account Settings</h2>
            <p className="text-sm text-red-600 mt-2">Change admin credentials and app settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;