import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { auth } from '../../firebase';
import { Search, Filter, Upload } from 'lucide-react';

interface Driver {
  driver_id: number;
  full_name: string;
  phone: string;
  license_number: string;
}

const ManageDriversPage = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: '', phone: '', licenseNumber: '' });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editingDriverId, setEditingDriverId] = useState<number | null>(null);

  const getToken = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    return await user.getIdToken();
  };

  const fetchDrivers = async () => {
    try {
      const token = await getToken();
      const res = await fetch('/api/drivers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDrivers(data);
    } catch {
      Swal.fire('Failed to load drivers.', '', 'error');
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, phone, licenseNumber } = form;
    if (!fullName || !phone || !licenseNumber) {
      Swal.fire('All fields are required.', '', 'warning');
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();
      const url = editMode ? `/api/drivers/${editingDriverId}` : '/api/drivers';
      const method = editMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName, phone, licenseNumber }),
      });

      if (res.ok) {
        Swal.fire(`Driver ${editMode ? 'updated' : 'added'}!`, '', 'success');
        setShowForm(false);
        setForm({ fullName: '', phone: '', licenseNumber: '' });
        setEditMode(false);
        setEditingDriverId(null);
        fetchDrivers();
      } else {
        const error = await res.json();
        Swal.fire(error.message || 'Failed to save driver.', '', 'error');
      }
    } catch {
      Swal.fire('Server error.', '', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (driverId: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the driver.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = await getToken();
          const res = await fetch(`/api/drivers/${driverId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            Swal.fire('Deleted!', '', 'success');
            fetchDrivers();
          } else {
            Swal.fire('Failed to delete.', '', 'error');
          }
        } catch {
          Swal.fire('Server error.', '', 'error');
        }
      }
    });
  };

  const handleEdit = (driver: Driver) => {
    setForm({
      fullName: driver.full_name,
      phone: driver.phone,
      licenseNumber: driver.license_number,
    });
    setEditMode(true);
    setEditingDriverId(driver.driver_id);
    setShowForm(true);
  };

  const filteredDrivers = drivers.filter((d) =>
    d.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen p-6 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Driver Management</h1>
          <p className="text-sm text-gray-600">Manage your driver assignments</p>
        </div>
        <button
          className="bg-black text-white px-4 py-2 rounded shadow"
          onClick={() => {
            setShowForm(true);
            setEditMode(false);
            setForm({ fullName: '', phone: '', licenseNumber: '' });
          }}
        >
          + Add Driver
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute top-2 left-2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search driver"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-2 py-1 border rounded"
          />
        </div>
        <Filter className="w-5 h-5 text-gray-700" />
        <Upload className="w-5 h-5 text-gray-700" />
      </div>

      <div className="overflow-x-auto bg-white border rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-center font-medium">Full Name</th>
              <th className="p-3 text-center font-medium">Phone</th>
              <th className="p-3 text-center font-medium">License Number</th>
              <th className="p-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">No drivers found.</td>
              </tr>
            ) : (
              filteredDrivers.map((driver) => (
                <tr key={driver.driver_id} className="hover:bg-gray-50">
                  <td className="p-3">{driver.full_name}</td>
                  <td className="p-3">{driver.phone}</td>
                  <td className="p-3">{driver.license_number}</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                        onClick={() => handleEdit(driver)}
                        >
                         Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        onClick={() => handleDelete(driver.driver_id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="w-full max-w-md mt-6 mx-auto">
          <form onSubmit={handleSubmit} className="bg-white p-4 border rounded shadow space-y-4">
            <div>
              <label className="block font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">License Number</label>
              <input
                type="text"
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
              disabled={loading}
            >
              {editMode ? 'Update Driver' : 'Add Driver'}
            </button>
          </form>
        </div>
      )}
    </main>
  );
};

export default ManageDriversPage;
