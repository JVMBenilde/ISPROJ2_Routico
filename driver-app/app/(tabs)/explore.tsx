import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../../firebase/firebase';

interface Order {
  order_id: number;
  order_status: string;
  pickup_location: string;
  drop_off_location: string;
  scheduled_delivery_time: string;
}

export default function AvailableOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!auth.currentUser) {
          console.log('[AUTH] No user logged in');
          return;
        }
        const token = await auth.currentUser.getIdToken();
        console.log('[FETCH] Using token:', token.slice(0, 10), '...');

        const response = await fetch('http://192.168.1.26:3001/api/driver/assigned-orders', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('[FETCH] Status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('[FETCHED] Orders:', data);
          if (Array.isArray(data)) {
            setOrders(data);
          } else {
            console.warn('[ERROR] Data is not an array:', data);
          }
        } else {
          const errorText = await response.text();
          console.log('[ERROR] Fetching orders failed:', errorText);
        }
      } catch (error) {
        console.error('[ERROR] Exception during fetch:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Routico Driver</Text>
      <View style={styles.tabs}>
        <Text style={styles.activeTab}>Active Orders</Text>
        <Text style={styles.inactiveTab}>Completed</Text>
      </View>

      <ScrollView style={styles.orderList}>
        {orders.length === 0 && (
          <Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>
            No active orders assigned.
          </Text>
        )}

        {orders.map((order) => (
          <View key={order.order_id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderId}>ORDER - {order.order_id.toString().padStart(4, '0')}</Text>
              <Pressable
                style={styles.detailsButton}
                onPress={() => {
                  console.log('[NAVIGATE] order_id:', order.order_id);
                  router.push(`/order/${order.order_id}`);
                }}>
                <Text style={styles.detailsText}>Details</Text>
              </Pressable>
            </View>

            <Text style={styles.statusBadge}>{order.order_status}</Text>
            <View style={styles.progressBar}></View>
            <Text style={styles.location}>📍 {order.pickup_location}</Text>
            <Text style={styles.eta}>⏰ ETA: {new Date(order.scheduled_delivery_time).toLocaleTimeString()}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60, padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  tabs: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  activeTab: { fontWeight: '600', borderBottomWidth: 2, borderColor: '#000' },
  inactiveTab: { color: '#888' },
  orderList: { flex: 1 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 12, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontWeight: 'bold' },
  detailsButton: { backgroundColor: '#333', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  detailsText: { color: '#fff' },
  statusBadge: { backgroundColor: '#eee', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginTop: 8 },
  progressBar: { height: 4, backgroundColor: '#ccc', borderRadius: 10, marginBottom: 8, marginTop: 4 },
  location: { color: '#444', marginBottom: 4 },
  eta: { color: '#444' },
});
