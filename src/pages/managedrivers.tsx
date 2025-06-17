import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { auth } from '../firebase'; 

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
  const [editingDriverId, setEditingDriverId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch token dynamically from Firebase
  const getToken = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    return await user.getIdToken();
  };

  const fetchDrivers = async () => {
    try {
      const token = await getToken();
      const res = await fetch('/api/drivers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setDrivers(data);
    } catch (err) {
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

    if (!form.fullName || !form.phone || !form.licenseNumber) {
      Swal.fire('All fields are required!', '', 'warning');
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();
      if (editingDriverId === null) {
        const res = await fetch('/api/drivers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: form.fullName,
            phone: form.phone,
            licenseNumber: form.licenseNumber,
          }),
        });

        if (res.ok) {
          Swal.fire('Driver added!', '', 'success');
          setShowForm(false);
          fetchDrivers();
        } else {
          Swal.fire('Failed to add driver.', '', 'error');
        }
      } else {
        const res = await fetch(`/api/drivers/${editingDriverId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: form.fullName,
            phone: form.phone,
            licenseNumber: form.licenseNumber,
          }),
        });

        if (res.ok) {
          Swal.fire('Driver updated!', '', 'success');
          setShowForm(false);
          fetchDrivers();
        } else {
          Swal.fire('Failed to update driver.', '', 'error');
        }
      }
    } catch {
      Swal.fire('Server error.', '', 'error');
    } finally {
      setLoading(false);
      setForm({ fullName: '', phone: '', licenseNumber: '' });
      setEditingDriverId(null);
    }
  };

  const handleEdit = (driver: Driver) => {
    setForm({
      fullName: driver.full_name,
      phone: driver.phone,
      licenseNumber: driver.license_number,
    });
    setEditingDriverId(driver.driver_id);
    setShowForm(true);
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
            headers: {
              Authorization: `Bearer ${token}`,
            },
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

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Drivers</h1>

      <button
        className="mb-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        onClick={() => {
          setShowForm(true);
          setForm({ fullName: '', phone: '', licenseNumber: '' });
          setEditingDriverId(null);
        }}
      >
        Add Driver
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
              <label className="block font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium">License Number</label>
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
              {editingDriverId === null ? 'Add Driver' : 'Update Driver'}
            </button>
          </form>
        </div>
      )}

      <table className="w-full max-w-4xl border-collapse border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Full Name</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">License Number</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-4">
                No drivers added yet.
              </td>
            </tr>
          ) : (
            drivers.map((driver) => (
              <tr key={driver.driver_id}>
                <td className="p-2 border">{driver.full_name}</td>
                <td className="p-2 border">{driver.phone}</td>
                <td className="p-2 border">{driver.license_number}</td>
                <td className="p-2 border">
                  <button
                    className="mr-2 px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={() => handleEdit(driver)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(driver.driver_id)}
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

export default ManageDriversPage;
