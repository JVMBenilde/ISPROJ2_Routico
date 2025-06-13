import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = form;

    if (!email || !password) {
      Swal.fire('Email and Password are required!', '', 'warning');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      const res = await fetch('/api/auth-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire('Login successful!', '', 'success');
        localStorage.setItem('role', data.role);

        if (data.role === 'business_owner') {
          navigate('/businessdashboard');
        } else if (data.role === 'driver') {
          navigate('/driverdashboard');
        } else {
          navigate('/');
        }
      } else {
        Swal.fire(data.message || 'Role fetch failed', '', 'error');
      }
    } catch (err: any) {
      Swal.fire('Authentication failed', err.message || '', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      const res = await fetch('/api/auth-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire('Google login successful!', '', 'success');
        localStorage.setItem('role', data.role);

        if (data.role === 'business_owner') {
          navigate('/businessdashboard');
        } else if (data.role === 'driver') {
          navigate('/driverdashboard');
        } else {
          navigate('/');
        }
      } else {
        Swal.fire(data.message || 'Role fetch failed', '', 'error');
      }
    } catch (error: any) {
      Swal.fire('Google login failed', error.message || '', 'error');
    }
  };

  return (
    <main className="min-h-screen flex items-start justify-center bg-white px-4 pt-30 pb-10">
      <div className="bg-white p-10 md:p-20 rounded-2xl shadow-lg w-full max-w-md text-left border border-gray-300">
        <h1 className="text-4xl font-extrabold text-center text-black">Routico</h1>
        <h2 className="text-xl font-semibold text-center mt-2 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="juandelacruz@email.com" className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md" disabled={loading} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md" disabled={loading} />
          </div>

          <button type="submit" className={`w-full py-3 px-4 border border-gray-500 rounded-lg flex items-center justify-center shadow-sm transition-all ${loading ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}`} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <button type="button" onClick={handleGoogleLogin} className="w-full py-3 px-4 border border-gray-500 rounded-lg flex items-center justify-center bg-white shadow-sm hover:bg-gray-50 transition-all" disabled={loading}>
            Login with Google
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
