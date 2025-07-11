import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { auth } from '../../firebase';

interface User {
  user_id: number;
  full_name: string;
  role: string;
  created_at: string;
  account_status: string;
  role_id: number;
}

interface UserCounts {
  admin: number;
  businessOwner: number;
  driver: number;
  total: number;
}

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userCounts, setUserCounts] = useState<UserCounts>({
    admin: 0,
    businessOwner: 0,
    driver: 0,
    total: 0
  });

  const getToken = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    return await user.getIdToken();
  };

  const fetchUsers = async () => {
    try {
      const token = await getToken();
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: User[] = await res.json();
      
      const filtered = data.filter((user: User) => user.role_id === 2);
      setUsers(filtered);
      
      const counts = {
        admin: data.filter((user: User) => user.role === 'admin').length,
        businessOwner: data.filter((user: User) => user.role === 'business_owner').length,
        driver: data.filter((user: User) => user.role === 'driver').length,
        total: data.filter((user: User) => user.role !== 'super_admin').length
      };
      setUserCounts(counts);

    } catch {
      Swal.fire('Failed to load users.', '', 'error');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white p-6">
      <div className="bg-white p-6 rounded-2xl shadow-xl text-center w-full max-w-md mb-8">
        <h1 className="text-3xl font-bold mb-4">Super Admin Dashboard</h1>
        <p className="text-gray-600">Manage your shipments, track drivers, and view analytics here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-5xl mb-8">
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <h3 className="font-bold text-blue-800">Total Users</h3>
          <p className="text-2xl font-bold">{userCounts.total}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <h3 className="font-bold text-green-800">Admins</h3>
          <p className="text-2xl font-bold">{userCounts.admin}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg shadow">
          <h3 className="font-bold text-purple-800">Business Owners</h3>
          <p className="text-2xl font-bold">{userCounts.businessOwner}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow">
          <h3 className="font-bold text-yellow-800">Drivers</h3>
          <p className="text-2xl font-bold">{userCounts.driver}</p>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        <table className="w-full border-collapse border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">User Type</th>
              <th className="p-2 border">Date Registered</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4">No users found.</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.user_id}>
                  <td className="p-2 border">{user.full_name}</td>
                  <td className="p-2 border capitalize">{user.role}</td>
                  <td className="p-2 border">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="p-2 border capitalize">{user.account_status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;


