import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';

const VerifyOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      initializeTimer();
    } else {
      Swal.fire('Email not found. Please register again.', '', 'error');
      navigate('/register');
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [location.state, navigate]);

  const initializeTimer = () => {
    const expiry = localStorage.getItem('otpExpiry');
    if (expiry) {
      const remaining = Math.floor((new Date(expiry).getTime() - Date.now()) / 1000);
      if (remaining > 0) {
        setTimeLeft(remaining);
        startTimer(remaining);
        return;
      }
    }
    // If no expiry found, set default 10 minutes
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    localStorage.setItem('otpExpiry', expiryTime);
    setTimeLeft(600);
    startTimer(600);
  };

  const startTimer = (startSeconds: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      Swal.fire('OTP is required', '', 'warning');
      return;
    }

    if (timeLeft === 0) {
      Swal.fire('OTP expired. Please resend.', '', 'error');
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
        Swal.fire('Email verified and account created successfully!', '', 'success');
        localStorage.removeItem('otpExpiry');  // ✅ clear timer on success
        localStorage.setItem('role', data.role);
        await new Promise(resolve => setTimeout(resolve, 10));

        if (data.role === 'business_owner') {
          navigate('/businessdashboard');
        } else if (data.role === 'driver') {
          navigate('/driverdashboard');
        } else {
          navigate('/');
        }
      } else {
        Swal.fire(data.message || 'OTP verification failed.', '', 'error');
      }
    } catch {
      Swal.fire('Server error. Try again.', '', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resend: true }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire('OTP resent successfully!', '', 'success');
        const expiryTime = new Date(Date.now() + 10 * 60 * 1000).toISOString();
        localStorage.setItem('otpExpiry', expiryTime);
        setTimeLeft(600);
        startTimer(600);
      } else {
        Swal.fire(data.message || 'Failed to resend OTP.', '', 'error');
      }
    } catch {
      Swal.fire('Server error. Try again.', '', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-300">
        <h2 className="text-2xl font-bold mb-4 text-center">Verify Your Email</h2>
        <p className="text-center mb-4">
          OTP expires in: <span className="font-semibold">{formatTime(timeLeft)}</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
              disabled={loading || timeLeft === 0}
              maxLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading || timeLeft === 0}
            className={`w-full mt-4 py-2 rounded-md transition duration-200 ${
              loading || timeLeft === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-900'
            }`}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <button
          onClick={handleResendOtp}
          disabled={loading || timeLeft > 0}
          className={`w-full mt-4 py-2 border rounded-md transition duration-200 ${
            loading || timeLeft > 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-white shadow-sm hover:bg-gray-50'
          }`}
        >
          Resend OTP
        </button>
      </div>
    </main>
  );
};

export default VerifyOtpPage;
