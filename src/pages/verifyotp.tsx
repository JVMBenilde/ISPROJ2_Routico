import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const VerifyOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      Swal.fire('Email not found. Please register again.', '', 'error');
      navigate('/register'); // fallback
    }
  }, [location.state, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      Swal.fire('OTP is required', '', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire('Email verified successfully!', '', 'success');
        navigate('/login'); // or wherever
      } else {
        Swal.fire(data.message || 'OTP verification failed.', '', 'error');
      }
    } catch (err) {
      Swal.fire('Server error. Try again.', '', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-300">
        <h2 className="text-2xl font-bold mb-4 text-center">Verify Your Email</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
              disabled={loading}
              maxLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 py-2 rounded-md transition duration-200 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-900'
            }`}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default VerifyOtpPage;
