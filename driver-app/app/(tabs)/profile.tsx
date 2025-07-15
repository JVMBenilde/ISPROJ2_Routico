import { View, Text, Pressable } from 'react-native';
import { auth } from '../../firebase/firebase';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.replace('/login');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <MaterialIcons name="account-circle" size={80} color="#888" style={{ marginBottom: 16 }} />
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>Profile</Text>
      <Pressable
        onPress={handleLogout}
        style={{ backgroundColor: 'black', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8 }}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>Logout</Text>
      </Pressable>
    </View>
  );
} 