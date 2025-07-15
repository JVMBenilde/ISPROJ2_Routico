import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../firebase/firebase';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null;

  return <Redirect href={user ? '/(tabs)/explore' : '/login'} />;
}
