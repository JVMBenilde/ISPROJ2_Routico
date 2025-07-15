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
  superAdmin: number;
  total: number;
}

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userCounts, setUserCounts] = useState<UserCounts>({
    admin: 0,
    businessOwner: 0,
    driver: 0,
    superAdmin: 0,
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
      
      console.log('All users from API:', data);
      console.log('Users with role admin:', data.filter(user => user.role === 'admin'));
      console.log('All user roles:', data.map(user => ({ name: user.full_name, role: user.role, role_id: user.role_id })));
      console.log('Users with role super_admin:', data.filter(user => user.role === 'super_admin'));
      console.log('Users with role_id 0:', data.filter(user => user.role_id === 0));
      console.log('Users with role_id 1:', data.filter(user => user.role_id === 1));
      
      const filtered = data.filter((user: User) => user.role === 'business_owner' || user.role === 'admin');
      setUsers(filtered);
      
      const counts = {
        admin: data.filter((user: User) => user.role === 'admin').length,
        businessOwner: data.filter((user: User) => user.role === 'business_owner').length,
        driver: data.filter((user: User) => user.role === 'driver').length,
        superAdmin: data.filter((user: User) => user.role === 'super_admin').length,
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
        <div className="bg-red-100 p-4 rounded-lg shadow">
          <h3 className="font-bold text-red-800">Super Admins</h3>
          <p className="text-2xl font-bold">{userCounts.superAdmin}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

