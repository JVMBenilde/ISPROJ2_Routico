import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { auth } from '../../firebase';
import { Search, Filter, Upload } from 'lucide-react';

interface Account {
  user_id: number;
  full_name: string;
  role: string;
  email: string;
  phone: string;
  status: string;
}

const AccountManagementPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    status: 'active',
  });
  const [firebaseUid, setFirebaseUid] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const getToken = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    const token = await user.getIdToken();
    setFirebaseUid(user.uid);
    return token;
  };

  const fetchAccounts = async () => {
    try {
      const token = await getToken();
      const res = await fetch('/api/accounts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAccounts(data);
    } catch {
      Swal.fire('Failed to fetch accounts.', '', 'error');
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const filteredAccounts = accounts.filter((acc) => {
    const matchName = acc.full_name.toLowerCase().includes(search.toLowerCase());
    const matchRole = filter === 'all' || acc.role.toLowerCase() === filter;
    return matchName && matchRole;
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, email, phone, password, confirmPassword, status } = form;

    if (!fullName || !email || !phone || (!editMode && (!password || !confirmPassword || !firebaseUid))) {
      Swal.fire('All required fields must be filled.', '', 'warning');
      return;
    }

    if (!editMode && password !== confirmPassword) {
      Swal.fire('Passwords do not match.', '', 'warning');
      return;
    }

    if (!/^\d{11}$/.test(phone)) {
        Swal.fire('Phone number must be exactly 11 digits.', '', 'warning');
        return false;
    }

    setLoading(true);

    try {
      const token = await getToken();
      const url = editMode ? `/api/accounts/${editingId}` : '/api/accounts/add-admin';
      const method = editMode ? 'PUT' : 'POST';
      const payload = editMode
        ? { fullName, email, phone, status }
        : { fullName, email, phone, password, firebaseUid };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        Swal.fire(`Account ${editMode ? 'updated' : 'added'}!`, '', 'success');
        setShowForm(false);
        setForm({
          fullName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          status: 'active',
        });
        setEditMode(false);
        setEditingId(null);
        fetchAccounts();
      } else {
        const err = await res.json();
        Swal.fire(err.message || 'Operation failed.', '', 'error');
      }
    } catch {
      Swal.fire('Server error.', '', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: Account) => {
    setEditMode(true);
    setEditingId(user.user_id);
    setForm({
      fullName: user.full_name,
      email: user.email,
      phone: user.phone,
      password: '',
      confirmPassword: '',
      status: user.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the user.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = await getToken();
          const res = await fetch(`/api/accounts/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            Swal.fire('Deleted!', '', 'success');
            fetchAccounts();
          } else {
            Swal.fire('Failed to delete.', '', 'error');
          }
        } catch {
          Swal.fire('Server error.', '', 'error');
        }
      }
    });
  };

  return (
    <main className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Account Management</h1>
        </div>
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded"
          onClick={() => {
            setEditMode(false);
            setShowForm(true);
            setForm({
              fullName: '',
              email: '',
              phone: '',
              password: '',
              confirmPassword: '',
              status: 'active',
            });
          }}
        >
          + Add Admin
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {['all', 'admin', 'business_owner', 'driver'].map((role) => (
          <button
            key={role}
            onClick={() => setFilter(role)}
            className={`px-4 py-1 rounded-full border ${filter === role ? 'bg-black text-white' : ''}`}
          >
            {role === 'all' ? 'All Users' : role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) + 's'}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute top-2 left-2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search account"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-2 py-1 border rounded"
            />
          </div>
          <Filter className="w-5 h-5 text-gray-700" />
          <Upload className="w-5 h-5 text-gray-700" />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-center font-medium">Name</th>
              <th className="p-3 text-center font-medium">Role</th>
              <th className="p-3 text-center font-medium">Email</th>
              <th className="p-3 text-center font-medium">Phone</th>
              <th className="p-3 text-center font-medium">Status</th>
              <th className="p-3 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((user) => (
              <tr key={user.user_id} className="hover:bg-gray-50 text-center">
                <td className="p-3">{user.full_name}</td>
                <td className="p-3">{user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phone}</td>
                <td className="p-3 capitalize">{user.status}</td>
                <td className="p-3 flex justify-center gap-2">
                  <button onClick={() => handleEdit(user)} className="px-2 py-1 bg-blue-500 text-white rounded text-xs">Edit</button>
                  <button onClick={() => handleDelete(user.user_id)} className="px-2 py-1 bg-red-500 text-white rounded text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="w-full max-w-md mt-6 mx-auto">
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow border space-y-4">
            <div>
              <label className="block font-medium mb-1">Full Name</label>
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block font-medium mb-1">Phone</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            {!editMode && (
              <>
                <div>
                  <label className="block font-medium mb-1">Password</label>
                  <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block font-medium mb-1">Confirm Password</label>
                  <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
              </>
            )}
            {editMode && (
              <div>
                <label className="block font-medium mb-1">Account Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full p-2 border rounded">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
              disabled={loading}
            >
              {editMode ? 'Update User' : 'Add Admin'}
            </button>
          </form>
        </div>
      )}
    </main>
  );
};

export default AccountManagementPage;