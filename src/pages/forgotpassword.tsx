import { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      Swal.fire('Please enter your email', '', 'warning');
      return;
    }

    setLoading(true);

    try {
      // ✅ Step 1: check if email exists in your MySQL DB first
      const check = await fetch('/api/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!check.ok) {
        const errData = await check.json();
        Swal.fire(errData.message || 'Email not found', '', 'error');
        setLoading(false);
        return;
      }

      // ✅ Step 2: if email exists, proceed to Firebase
      await sendPasswordResetEmail(auth, email);
      Swal.fire('Password reset email sent!', 'Check your inbox.', 'success');
    } catch (err: any) {
      Swal.fire('Error', err.message || 'Failed to send reset email.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md border border-gray-300">
        <h1 className="text-3xl font-extrabold text-center">Forgot Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <button
            type="submit"
            className={`w-full py-3 px-4 border rounded-lg bg-black text-white ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-900'}`}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Back to <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
