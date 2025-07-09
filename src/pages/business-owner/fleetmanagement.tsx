import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { auth } from '../../firebase';
import { Search, Filter, Upload } from 'lucide-react';

interface Truck {
  truck_id: number;
  plate_number: string;
  model: string;
  capacity: number;
  status: string;
}

const ManageVehiclesPage = () => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ plateNumber: '', model: '', capacity: '', status: '' });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editingTruckId, setEditingTruckId] = useState<number | null>(null);

  const getToken = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    return await user.getIdToken();
  };

  const fetchTrucks = async () => {
    try {
      const token = await getToken();
      const res = await fetch('/api/vehicles', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTrucks(data);
    } catch {
      Swal.fire('Failed to load vehicles.', '', 'error');
    }
  };

  useEffect(() => {
    fetchTrucks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.plateNumber || !form.model || !form.capacity || !form.status) {
      Swal.fire('All fields are required!', '', 'warning');
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();
      const url = editMode ? `/api/vehicles/${editingTruckId}` : '/api/vehicles';
      const method = editMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plateNumber: form.plateNumber,
          model: form.model,
          capacity: parseFloat(form.capacity),
          status: form.status,
        }),
      });

      if (res.ok) {
        Swal.fire(`Vehicle ${editMode ? 'updated' : 'added'}!`, '', 'success');
        setShowForm(false);
        setEditMode(false);
        setForm({ plateNumber: '', model: '', capacity: '', status: '' });
        setEditingTruckId(null);
        fetchTrucks();
      } else {
        const errorData = await res.json();
        Swal.fire(errorData.message || 'Failed to save vehicle.', '', 'error');
      }
    } catch {
      Swal.fire('Server error.', '', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (truck: Truck) => {
    setForm({
      plateNumber: truck.plate_number,
      model: truck.model,
      capacity: truck.capacity.toString(),
      status: truck.status,
    });
    setEditMode(true);
    setEditingTruckId(truck.truck_id);
    setShowForm(true);
  };

  const handleDelete = async (truckId: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the vehicle.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
    });

    if (result.isConfirmed) {
      try {
        const token = await getToken();
        const res = await fetch(`/api/vehicles/${truckId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          Swal.fire('Deleted!', '', 'success');
          fetchTrucks();
        } else {
          Swal.fire('Failed to delete.', '', 'error');
        }
      } catch {
        Swal.fire('Server error.', '', 'error');
      }
    }
  };

  const filteredTrucks = trucks.filter((truck) =>
    truck.plate_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen p-6 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Fleet Management</h1>
          <p className="text-sm text-gray-600">Manage Trucks and Fleet Resources</p>
        </div>
        <button
          className="bg-black text-white px-4 py-2 rounded shadow"
          onClick={() => {
            setShowForm(true);
            setEditMode(false);
            setForm({ plateNumber: '', model: '', capacity: '', status: '' });
          }}
        >
          + Add Vehicle
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute top-2 left-2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search vehicle"
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
              <th className="p-3 text-center font-medium">Truck ID</th>
              <th className="p-3 text-center font-medium">Plate Number</th>
              <th className="p-3 text-center font-medium">Model</th>
              <th className="p-3 text-center font-medium">Capacity</th>
              <th className="p-3 text-center font-medium">Status</th>
              <th className="p-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrucks.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No vehicles found.
                </td>
              </tr>
            ) : (
              filteredTrucks.map((truck) => (
                <tr key={truck.truck_id} className="hover:bg-gray-50">
                  <td className="p-3 text-center">TRK-{truck.truck_id.toString().padStart(3, '0')}</td>
                  <td className="p-3 text-center">{truck.plate_number}</td>
                  <td className="p-3 text-center">{truck.model}</td>
                  <td className="p-3 text-center">{truck.capacity.toLocaleString()} lbs</td>
                  <td className="p-3 text-center capitalize">{truck.status}</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                        onClick={() => handleEdit(truck)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        onClick={() => handleDelete(truck.truck_id)}
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
              <label className="block font-medium mb-1">Plate Number</label>
              <input
                type="text"
                name="plateNumber"
                value={form.plateNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Model</label>
              <input
                type="text"
                name="model"
                value={form.model}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Capacity (lbs)</label>
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 bg-black text-white py-2 rounded hover:bg-gray-800"
                disabled={loading}
              >
                {editMode ? 'Update Vehicle' : 'Add Vehicle'}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};

export default ManageVehiclesPage;
