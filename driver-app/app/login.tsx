import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { auth } from '../firebase/firebase';
import { useEffect } from 'react';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    auth.signOut();
  }, []);

  const login = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      // First, authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get the Firebase ID token
      const token = await user.getIdToken();
      
      // Check user role in your backend database
      const response = await fetch('http://10.0.2.2:3001/api/auth-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('Failed to verify user role');
      }

      const { role } = await response.json();
      
      // Only allow drivers to login
      if (role !== 'driver') {
        Alert.alert(
          'Access Denied', 
          'This app is only for drivers. Please use the appropriate application for your role.'
        );
        // Sign out from Firebase since access is denied
        await auth.signOut();
        return;
      }

      // If role is driver, proceed to the app
      router.replace('/(tabs)/explore');
      
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle specific error cases
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        Alert.alert('Login Failed', 'Invalid email or password');
      } else if (err.code === 'auth/invalid-email') {
        Alert.alert('Login Failed', 'Invalid email format');
      } else if (err.message === 'Failed to verify user role') {
        Alert.alert('Login Failed', 'Unable to verify user permissions. Please try again.');
      } else {
        Alert.alert('Login Failed', err.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.replace('/login'); // or your login route
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 24,
      }}
    >
      <View
        style={{
          width: '100%',
          maxWidth: 360,
          backgroundColor: 'white',
          padding: 24,
          borderRadius: 12,
          elevation: 2,
          alignSelf: 'center',
        }}
      >
        <Text style={{ fontSize: 32, fontWeight: '900', textAlign: 'center', marginBottom: 8 }}>Routico</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 24 }}>Driver Login</Text>

        <View style={{ gap: 16 }}>
          <View>
            <Text style={{ marginBottom: 4 }}>Email</Text>
            <TextInput
              placeholder="juandelacruz@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8 }}
            />
          </View>

          <View>
            <Text style={{ marginBottom: 4 }}>Password</Text>
            <TextInput
              placeholder="********"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8 }}
            />
          </View>

          <Pressable
            onPress={login}
            disabled={loading}
            style={{ 
              backgroundColor: loading ? '#ccc' : 'black', 
              paddingVertical: 12, 
              borderRadius: 6,
              opacity: loading ? 0.7 : 1
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: '500' }}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </Pressable>
        </View>

        <Text style={{ textAlign: 'center', color: '#3b82f6', marginVertical: 16 }}>Forgot password</Text>

        <Pressable style={{ borderWidth: 1, paddingVertical: 12, borderRadius: 6, marginBottom: 16 }}>
          <Text style={{ textAlign: 'center' }}>Login with Google</Text>
        </Pressable>

        <Text style={{ textAlign: 'center', fontSize: 14 }}>
          Don't have an account?{' '}
          <Text style={{ color: '#3b82f6' }} onPress={() => router.push('/register')}>
            Register
          </Text>
        </Text>
      </View>
    </View>
  );
}