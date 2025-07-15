import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { auth } from '../../firebase';

interface Order {
  order_id: number;
  pickup_location: string;
  drop_off_location: string;
  order_status: string;
  scheduled_delivery_time: string;
  order_created_at: string;
  phone?: string;
  company_name?: string;
}

const AssignedOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getToken = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    return await user.getIdToken();
  };

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const res = await fetch('/api/driver/assigned-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch assigned deliveries');
      }

      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      Swal.fire('Error', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleView = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl text-left font-bold mb-2">Assigned Deliveries</h1>
      <p className="text-sm text-gray-600 mb-6"></p>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No deliveries assigned to you.</p>
      ) : (
        <div className="overflow-x-auto bg-white border rounded shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Pickup location</th>
                <th className="p-3">Drop-off location</th>
                <th className="p-3">Status</th>
                <th className="p-3">Scheduled Time</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id} className="hover:bg-gray-50">
                  <td className="p-3 text-center">ORD-{order.order_id.toString().padStart(4, '0')}</td>
                  <td className="p-3 text-center">{order.pickup_location}</td>
                  <td className="p-3 text-center">{order.drop_off_location}</td>
                  <td className="p-3 text-center capitalize">{order.order_status}</td>
                  <td className="p-3 text-center">{new Date(order.scheduled_delivery_time).toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                      onClick={() => handleView(order)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Order ID:</strong> ORD-{selectedOrder.order_id.toString().padStart(4, '0')}</p>
              <p><strong>Pickup Location:</strong> {selectedOrder.pickup_location}</p>
              <p><strong>Drop-off Location:</strong> {selectedOrder.drop_off_location}</p>
              <p><strong>Status:</strong> {selectedOrder.order_status}</p>
              <p><strong>Scheduled Time:</strong> {new Date(selectedOrder.scheduled_delivery_time).toLocaleString()}</p>
              <p><strong>Customer Contact:</strong> {selectedOrder.phone ?? 'N/A'}</p>
              <p><strong>Company:</strong> {selectedOrder.company_name ?? 'N/A'}</p>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={handleCloseModal}
                className="px-4 py-1 bg-gray-700 text-white rounded hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AssignedOrdersPage;