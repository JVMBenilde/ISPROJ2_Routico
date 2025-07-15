import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { auth } from '../firebase/firebase';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Account created successfully');
      router.replace('/login');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
      <View style={{ width: '100%', maxWidth: 360, backgroundColor: 'white', padding: 24, borderRadius: 12, elevation: 2 }}>
        <Text style={{ fontSize: 32, fontWeight: '900', textAlign: 'center', marginBottom: 8 }}>Routico</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 24 }}>Register</Text>

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
            onPress={register}
            style={{ backgroundColor: 'black', paddingVertical: 12, borderRadius: 6 }}>
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: '500' }}>Register</Text>
          </Pressable>
        </View>

        <Text style={{ textAlign: 'center', fontSize: 14, marginTop: 16 }}>
          Already have an account?{' '}
          <Text style={{ color: '#3b82f6' }} onPress={() => router.push('/login')}>
            Login
          </Text>
        </Text>
      </View>
    </View>
  );
}
