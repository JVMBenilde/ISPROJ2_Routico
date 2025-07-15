import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Pressable } from 'react-native';
import { auth } from '../../firebase/firebase';

interface OrderDetail {
  order_id: number;
  order_status: string;
  pickup_location: string;
  drop_off_location: string;
  scheduled_delivery_time: string;
  weight?: number;
  size?: string;
  truck_id?: number;
  company_name?: string;
  phone?: string;
}

export default function OrderDetails() {
  const { order_id } = useLocalSearchParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!auth.currentUser || !order_id) return;
        const token = await auth.currentUser.getIdToken();

        const response = await fetch(`http://192.168.1.26:3001/api/driver/orders/${order_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else {
          const msg = await response.text();
          setError(msg || 'Failed to fetch order');
        }
      } catch (err) {
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [order_id]);

  const handleUpdateStatus = async () => {
    if (!auth.currentUser || !order_id || !order) return;

    const statusFlow = ['pending', 'picked_up', 'in_transit', 'delivered'];
    const currentIndex = statusFlow.indexOf(order.order_status);
    const nextStatus = statusFlow[currentIndex + 1];

    if (!nextStatus) {
      setUpdateMsg('Order already delivered.');
      return;
    }

    setUpdating(true);
    setUpdateMsg('');
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`http://192.168.1.26:3001/api/driver/orders/${order_id}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (response.ok) {
        setOrder({ ...order, order_status: nextStatus });
        setUpdateMsg(`Status updated to "${nextStatus}"`);
      } else {
        const msg = await response.text();
        setUpdateMsg(msg || 'Failed to update status');
      }
    } catch (err) {
      setUpdateMsg('Something went wrong');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 100 }} size="large" color="#333" />;
  }

  if (error) {
    return (
      <View style={styles.scrollContainer}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  if (!order) return null;

  const isDelivered = order.order_status === 'delivered';

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>Delivery Details</Text>

        <Text style={styles.label}>Order ID:</Text>
        <Text style={styles.value}>ORD-{order.order_id.toString().padStart(4, '0')}</Text>

        <Text style={styles.label}>Pickup Location:</Text>
        <Text style={styles.value}>{order.pickup_location}</Text>

        <Text style={styles.label}>Drop-off Location:</Text>
        <Text style={styles.value}>{order.drop_off_location}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{order.order_status}</Text>

        <Text style={styles.label}>Scheduled Time:</Text>
        <Text style={styles.value}>{new Date(order.scheduled_delivery_time).toLocaleString()}</Text>

        <Text style={styles.label}>Customer Contact:</Text>
        <Text style={styles.value}>{order.phone ?? 'N/A'}</Text>

        <Text style={styles.label}>Company:</Text>
        <Text style={styles.value}>{order.company_name ?? 'N/A'}</Text>

        <Pressable
          onPress={handleUpdateStatus}
          style={[styles.updateButton, updating && { opacity: 0.6 }]}
          disabled={updating || isDelivered}
        >
          <Text style={styles.updateText}>
            {isDelivered ? 'Delivered' : updating ? 'Updating...' : 'Update Status'}
          </Text>
        </Pressable>
        {updateMsg ? <Text style={styles.updateMsg}>{updateMsg}</Text> : null}

        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 60,
  },
  closeButton: {
    marginTop: 24,
    backgroundColor: '#333',
    paddingVertical: 10,
    borderRadius: 6,
  },
  updateButton: {
    marginTop: 16,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 6,
  },
  updateText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  updateMsg: {
    marginTop: 8,
    textAlign: 'center',
    color: '#007bff',
    fontSize: 15,
  },
  closeText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
});
