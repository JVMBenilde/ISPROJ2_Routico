import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { auth } from '../../firebase';

interface Order {
  order_id: number;
  company_name: string;
  phone: string;
  pickup_location: string;
  drop_off_location: string;
  scheduled_delivery_time: string;
  assigned_driver_id: number | null;
  order_status: string;
}

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');

  const getToken = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    return await user.getIdToken();
  };

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const res = await fetch('/api/orders/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch {
      Swal.fire('Failed to load orders.', '', 'error');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order =>
    order.company_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen p-6 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Order History</h1>
        </div>
        <input
          type="text"
          placeholder="Search by company"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-1"
        />
      </div>

      <div className="overflow-x-auto bg-white border rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Company Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Pickup</th>
              <th className="p-3">Delivery</th>
              <th className="p-3">Driver ID</th>
              <th className="p-3">Status</th>
              <th className="p-3">Scheduled Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={12} className="text-center py-4 text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.order_id} className="hover:bg-gray-50">
                  <td className="p-3 text-center">ORD-{order.order_id.toString().padStart(4, '0')}</td>
                  <td className="p-3 text-center">{order.company_name}</td>
                  <td className="p-3 text-center">{order.phone}</td>
                  <td className="p-3 text-center">{order.pickup_location}</td>
                  <td className="p-3 text-center">{order.drop_off_location}</td>
                  <td className="p-3 text-center">{order.assigned_driver_id ?? '-'}</td>
                  <td className="p-3 text-center capitalize">{order.order_status}</td>
                  <td className="p-3 text-center">{new Date(order.scheduled_delivery_time).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default OrderHistoryPage;
