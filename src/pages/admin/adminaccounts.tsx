import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { auth } from '../../firebase';

interface AdminAccount {
  user_id: number;
  full_name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

const AdminAccountsPage = () => {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [editingAdminId, setEditingAdminId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const getToken = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    return await user.getIdToken();
  };

  const fetchAdmins = async () => {
    try {
      const token = await getToken();
      const res = await fetch('/api/users/admins', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAdmins(data);
    } catch {
      Swal.fire('Failed to load admin accounts.', '', 'error');
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, email, phone, password, confirmPassword } = form;

    if (!fullName || !email || !phone || (!editingAdminId && (!password || !confirmPassword))) {
      Swal.fire('All fields are required!', '', 'warning');
      return;
    }

    if (!/^\d{11}$/.test(phone)) {
      Swal.fire('Phone number must be exactly 11 digits.', '', 'warning');
      return;
    }

    if (!editingAdminId && password !== confirmPassword) {
      Swal.fire('Passwords do not match!', '', 'warning');
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const method = editingAdminId ? 'PUT' : 'POST';
      const url = editingAdminId ? `/api/users/admins/${editingAdminId}` : '/api/users/admins';

      const body: any = {
        fullName,
        email,
        phone,
        role: 'admin',
        role_id: 1
      };
      if (!editingAdminId) body.password = password;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        Swal.fire(`Admin ${editingAdminId ? 'updated' : 'created'}!`, '', 'success');
        setShowForm(false);
        fetchAdmins();
      } else {
        Swal.fire('Failed to submit.', '', 'error');
      }
    } catch {
      Swal.fire('Server error.', '', 'error');
    } finally {
      setLoading(false);
      setForm({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
      setEditingAdminId(null);
    }
  };

  const handleEdit = (admin: AdminAccount) => {
    setForm({ fullName: admin.full_name, email: admin.email, phone: admin.phone, password: '', confirmPassword: '' });
    setEditingAdminId(admin.user_id);
    setShowForm(true);
  };

  const handleDelete = async (userId: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the admin.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = await getToken();
          const res = await fetch(`/api/users/admins/${userId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            Swal.fire('Deleted!', '', 'success');
            fetchAdmins();
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
    <main className="min-h-screen flex flex-col items-center justify-start p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Accounts</h1>

      <button
        className="mb-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        onClick={() => {
          setShowForm(true);
          setForm({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
          setEditingAdminId(null);
        }}
      >
        Add Admin
      </button>

      {showForm && (
        <div className="w-full max-w-md mb-6">
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 border rounded shadow">
            <div>
              <label className="block font-medium">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            {!editingAdminId && (
              <>
                <div>
                  <label className="block font-medium">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </>
            )}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
              disabled={loading}
            >
              {editingAdminId === null ? 'Create Admin' : 'Update Admin'}
            </button>
          </form>
        </div>
      )}

      <table className="w-full max-w-4xl border-collapse border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Admin ID</th>
            <th className="p-2 border">Full Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-4">
                No admin accounts found.
              </td>
            </tr>
          ) : (
            admins.map((admin) => (
              <tr key={admin.user_id}>
                <td className="p-2 border">{admin.user_id}</td>
                <td className="p-2 border">{admin.full_name}</td>
                <td className="p-2 border">{admin.email}</td>
                <td className="p-2 border capitalize">{admin.status}</td>
                <td className="p-2 border">
                  <button
                    className="mr-2 px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={() => handleEdit(admin)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(admin.user_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
};

export default AdminAccountsPage;
