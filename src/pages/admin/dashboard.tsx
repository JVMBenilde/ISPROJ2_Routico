import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { auth } from '../../firebase';
import { fetchAllUsers } from '../../api/users';

interface User {
  user_id: number;
  full_name: string;
  role: string;
  created_at: string;
  account_status: string;
  role_id: number;
}

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);

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
      const data = await res.json();
      const filtered = data.filter((user: User) => user.role_id === 2);
      setUsers(filtered);
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

      <div className="w-full max-w-5xl">
        <table className="w-full border-collapse border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">User ID</th>
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
                  <td className="p-2 border">{user.user_id}</td>
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
