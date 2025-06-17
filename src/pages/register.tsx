import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const { fullName, email, phone, role, password, confirmPassword } = form;

    if (!fullName || !email || !phone || !role) {
      Swal.fire('All fields are required!', '', 'warning');
      return false;
    }

    if (!/^\d{11}$/.test(phone)) {
      Swal.fire('Phone number must be exactly 11 digits.', '', 'warning');
      return false;
    }

    if (!password || !confirmPassword) {
      Swal.fire('Password and Confirm Password are required!', '', 'warning');
      return false;
    }

    if (password !== confirmPassword) {
      Swal.fire('Passwords do not match!', '', 'warning');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const { fullName, email, phone, role, password } = form;
    setLoading(true);

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          role,
          password,
          googleUser: false,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire('OTP sent! Please verify your email.', '', 'success');
        navigate('/verify-otp', { state: { email } });
      } else {
        Swal.fire(data.message || 'Failed to send OTP', '', 'error');
      }
    } catch (err: any) {
      Swal.fire('Server error: ' + err.message, '', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    const { fullName, email, phone, role } = form;

    if (!fullName || !email || !phone || !role) {
      Swal.fire('Full Name, Email, Phone, and Role are required before signing up with Google!', '', 'warning');
      return;
    }

    if (!/^\d{11}$/.test(phone)) {
      Swal.fire('Phone number must be exactly 11 digits.', '', 'warning');
      return;
    }

    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          role,
          password: '',  
          googleUser: true,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire('OTP sent! Please verify your email.', '', 'success');
        navigate('/verify-otp', { state: { email } });
      } else {
        Swal.fire(data.message || 'Failed to send OTP', '', 'error');
      }
    } catch (err: any) {
      Swal.fire('Google signup failed: ' + err.message, '', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md border border-gray-300">
        <h1 className="text-4xl font-extrabold text-center">Routico</h1>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <input name="fullName" type="text" placeholder="Juan Dela Cruz" value={form.fullName} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" disabled={loading} />
          <input name="email" type="email" placeholder="juandelacruz@email.com" value={form.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" disabled={loading} />
          <input name="phone" type="text" placeholder="09XXXXXXXXX" value={form.phone} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" disabled={loading} />

          <select name="role" value={form.role} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" disabled={loading}>
            <option value="">Select Role</option>
            <option value="business_owner">Business Owner</option>
            <option value="driver">Driver</option>
          </select>

          <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" disabled={loading} />
          <input name="confirmPassword" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" disabled={loading} />

          <button type="submit" className={`w-full py-3 px-4 border rounded-lg bg-white shadow-sm text-black ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}>
            {loading ? 'Registering...' : 'Register'}
          </button>

          <button type="button" onClick={handleGoogleSignup} className="w-full py-3 px-4 border rounded-lg bg-white shadow-sm hover:bg-gray-200">
            Sign up with Google
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;
